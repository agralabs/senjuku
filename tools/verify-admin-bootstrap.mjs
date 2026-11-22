// tools/verify-admin-bootstrap.mjs
// Verification suite for standalone server/admin-bootstrap.js & /api/auth/change-password

import assert from 'node:assert/strict';
import http from 'node:http';
import { getDb } from '../server/db.js';
import { handleApiRequest } from '../server/auth.js';
import { bootstrapDefaultAdmin } from '../server/admin-bootstrap.js';

process.env.SKIP_SMTP = '1';

// 1. Test DISABLE_ADMIN_AUTO_SEED=1
{
  const db = getDb(':memory:');
  process.env.DISABLE_ADMIN_AUTO_SEED = '1';
  const res = bootstrapDefaultAdmin(db);
  assert.equal(res, null, 'Should skip seeding when DISABLE_ADMIN_AUTO_SEED=1');
  assert.equal(db.prepare('SELECT COUNT(*) AS cnt FROM users').get().cnt, 0);
  delete process.env.DISABLE_ADMIN_AUTO_SEED;
  console.log('✅ Test 1 Passed: DISABLE_ADMIN_AUTO_SEED=1 skips seeding.');
}

// 2. Test custom ADMIN_DEFAULT_PASSWORD -> mustChangePassword defaults to false & rawPassword redacted
{
  const db = getDb(':memory:');
  process.env.ADMIN_DEFAULT_EMAIL = 'boss@senjuku.id';
  process.env.ADMIN_DEFAULT_NICKNAME = 'MasterSensei';
  process.env.ADMIN_DEFAULT_PASSWORD = 'SuperSecretCustomPassword99!';
  const res = bootstrapDefaultAdmin(db);
  assert.ok(res && res.isNew === true);
  assert.equal(res.email, 'boss@senjuku.id');
  assert.equal(res.nickname, 'MasterSensei');
  assert.equal(res.usedFallbackPassword, false);
  assert.equal(res.rawPassword, null, 'Custom env password must not be returned for log printing');
  assert.equal(res.mustChangePassword, false, 'Custom env password should default mustChangePassword=false');
  delete process.env.ADMIN_DEFAULT_EMAIL;
  delete process.env.ADMIN_DEFAULT_NICKNAME;
  delete process.env.ADMIN_DEFAULT_PASSWORD;
  console.log('✅ Test 2 Passed: Custom env vars seed cleanly without leaking password to logs.');
}

// 3. End-to-End: Fallback Admin Auto-Seed -> Login -> mustChangePassword=true -> Change Password -> mustChangePassword=false
const db = getDb(':memory:');
db.prepare('DELETE FROM users').run();
const seeded = bootstrapDefaultAdmin(db);
assert.ok(seeded && seeded.isNew === true);
assert.equal(seeded.email, 'admin@senjuku.local');
assert.equal(seeded.nickname, 'SenseiAdmin');
assert.equal(seeded.rawPassword, 'AdminSenjuku123!');
assert.equal(seeded.mustChangePassword, true);

// Idempotency check
const secondRun = bootstrapDefaultAdmin(db);
assert.equal(secondRun, null, 'Second bootstrap call must be idempotent');
console.log('✅ Test 3 Passed: Fallback admin seeded & idempotency verified.');

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, 'http://127.0.0.1');
  const handled = await handleApiRequest(req, res, urlObj, db);
  if (!handled) {
    res.writeHead(404);
    res.end('Not Found');
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

async function api(method, urlPath, body = null, cookie = '') {
  const headers = { 'Content-Type': 'application/json' };
  if (cookie) headers.Cookie = cookie;
  const resp = await fetch(`${baseUrl}${urlPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const setCookie = resp.headers.get('set-cookie') || '';
  const json = await resp.json();
  return { status: resp.status, json, cookie: setCookie.split(';')[0] };
}

try {
  // Login with default fallback credentials
  const login = await api('POST', '/api/auth/login', {
    identifier: 'admin@senjuku.local',
    password: 'AdminSenjuku123!'
  });
  assert.equal(login.status, 200, 'Default admin login must succeed');
  assert.equal(login.json.user.role, 'admin');
  assert.equal(login.json.user.mustChangePassword, true, 'mustChangePassword should be true on first login');
  const sessionCookie = login.cookie;
  console.log('✅ Test 4 Passed: Default admin login succeeds with mustChangePassword=true.');

  // Wrong current password rejected
  const badChange = await api('POST', '/api/auth/change-password', {
    currentPassword: 'WrongPassword!',
    newPassword: 'NewStrongPassword123!'
  }, sessionCookie);
  assert.equal(badChange.status, 401);
  console.log('✅ Test 5 Passed: Change password rejects invalid current password.');

  // Valid password change clears mustChangePassword
  const goodChange = await api('POST', '/api/auth/change-password', {
    currentPassword: 'AdminSenjuku123!',
    newPassword: 'NewStrongPassword123!'
  }, sessionCookie);
  assert.equal(goodChange.status, 200);
  assert.equal(goodChange.json.ok, true);

  const me = await api('GET', '/api/auth/me', null, sessionCookie);
  assert.equal(me.status, 200);
  assert.equal(me.json.user.mustChangePassword, false, 'mustChangePassword must be false after password update');

  // Verify new password works for login
  const loginNew = await api('POST', '/api/auth/login', {
    identifier: 'SenseiAdmin',
    password: 'NewStrongPassword123!'
  });
  assert.equal(loginNew.status, 200);
  assert.equal(loginNew.json.user.mustChangePassword, false);
  console.log('✅ Test 6 Passed: Password update clears mustChangePassword & allows login with new password.');

  console.log('\n🎉 ALL DEFAULT ADMIN BOOTSTRAP & CHANGE-PASSWORD TESTS PASSED!');
} finally {
  server.close();
}
