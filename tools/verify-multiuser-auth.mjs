// End-to-End Verification for Multi-User Auth, Profile, Membership, Progress Sync & Privacy-Safe Leaderboard
import assert from 'node:assert/strict';
import http from 'node:http';
import { getDb } from '../server/db.js';
import { handleApiRequest } from '../server/auth.js';

process.env.SKIP_SMTP = '1';

const db = getDb(':memory:');

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
  await handleApiRequest(req, res, parsedUrl, db);
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const BASE = `http://127.0.0.1:${port}`;

async function api(method, path, body = null, cookie = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (cookie) headers['Cookie'] = cookie;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const setCookie = res.headers.get('set-cookie');
  const json = await res.json();
  return { status: res.status, json, setCookie };
}

try {
  console.log('=== 1. REGISTER USER 1 (ADMIN) & VERIFY TOKEN ===');
  const reg1 = await api('POST', '/api/auth/register', {
    email: 'kenji@example.com',
    nickname: 'KenjiMaster'
  });
  assert.equal(reg1.status, 201);
  assert.ok(reg1.json.devVerifyUrl, 'Expected devVerifyUrl on localhost when SKIP_SMTP=1');
  const token1 = new URL(reg1.json.devVerifyUrl).searchParams.get('token');
  assert.ok(token1 && token1.length === 64, 'Token should be 64-char hex');

  const ver1 = await api('GET', `/api/auth/verify?token=${token1}`);
  assert.equal(ver1.status, 200);
  assert.equal(ver1.json.valid, true);
  assert.equal(ver1.json.nickname, 'KenjiMaster');

  console.log('=== 2. SET PASSWORD & ACTIVATE ACCOUNT ===');
  const setPw1 = await api('POST', '/api/auth/set-password', {
    token: token1,
    password: 'secretPassword123'
  });
  assert.equal(setPw1.status, 200);
  assert.equal(setPw1.json.user.role, 'admin', 'First user should be admin');
  assert.equal(setPw1.json.user.membershipTier, 'free');
  assert.ok(setPw1.setCookie && setPw1.setCookie.includes('kk_session='), 'Session cookie must be set');
  const cookie1 = setPw1.setCookie.split(';')[0];

  // Token must be single-use
  const verReuse = await api('GET', `/api/auth/verify?token=${token1}`);
  assert.equal(verReuse.status, 404, 'Verification token must be invalidated after use');

  console.log('=== 3. PROFILE & MEMBERSHIP UPDATE ===');
  const profUp = await api('PATCH', '/api/profile', {
    avatarEmoji: '🦊',
    bio: 'Target JLPT N5!',
    membershipTier: 'pro'
  }, cookie1);
  assert.equal(profUp.status, 200);
  assert.equal(profUp.json.user.avatarEmoji, '🦊');
  assert.equal(profUp.json.user.membershipTier, 'pro');

  console.log('=== 4. SYNC PRIVATE PROGRESS & SRS CARDS ===');
  const todayKey = new Date().toISOString().slice(0, 10);
  const sync1 = await api('POST', '/api/progress/sync', {
    mode: 'replace',
    progress: {
      xp: 1250,
      streakDays: 5,
      lastActiveDate: todayKey,
      badges: ['first_step', 'streak_3'],
      history: {
        [todayKey]: { seconds: 900, cards: 24, correct: 22, wrong: 2, xp: 250 }
      },
      cards: {
        k_001: { stage: 4, streak: 4, correct: 5, wrong: 0, nextDue: null },
        k_002: { stage: 3, streak: 3, correct: 3, wrong: 1, nextDue: null },
        k_003: { stage: 1, streak: 0, correct: 1, wrong: 4, nextDue: null }
      }
    }
  }, cookie1);
  assert.equal(sync1.status, 200);
  assert.equal(sync1.json.progress.xp, 1250);
  assert.equal(sync1.json.progress.cards.k_003.wrong, 4);

  console.log('=== 5. REGISTER USER 2 (MEMBER) & LOGIN ===');
  const reg2 = await api('POST', '/api/auth/register', {
    email: 'sakura@example.com',
    nickname: 'SakuraChan'
  });
  assert.equal(reg2.status, 201);
  const token2 = new URL(reg2.json.devVerifyUrl).searchParams.get('token');
  const setPw2 = await api('POST', '/api/auth/set-password', {
    token: token2,
    password: 'sakuraPassword!'
  });
  assert.equal(setPw2.status, 200);
  assert.equal(setPw2.json.user.role, 'student', 'Second user should be student');

  const login2 = await api('POST', '/api/auth/login', {
    identifier: 'SakuraChan',
    password: 'sakuraPassword!'
  });
  assert.equal(login2.status, 200);
  const cookie2 = login2.setCookie.split(';')[0];

  await api('POST', '/api/progress/sync', {
    progress: {
      xp: 400,
      streakDays: 2,
      lastActiveDate: todayKey,
      history: { [todayKey]: { seconds: 600, cards: 12, correct: 11, wrong: 1, xp: 120 } },
      cards: { k_001: { stage: 3, streak: 3, correct: 3, wrong: 0 } }
    }
  }, cookie2);

  console.log('=== 6. VERIFY LEADERBOARD PRIVACY & RANKING ===');
  const lb = await api('GET', '/api/leaderboard?period=all', null, cookie2);
  assert.equal(lb.status, 200);
  assert.equal(lb.json.entries.length, 2);
  assert.equal(lb.json.entries[0].nickname, 'KenjiMaster');
  assert.equal(lb.json.entries[0].rank, 1);
  assert.equal(lb.json.entries[0].masteredCardsCount, 2);
  assert.equal(lb.json.entries[0].membershipTier, 'pro');
  assert.equal(lb.json.entries[0].isCurrentUser, false);
  assert.equal(lb.json.entries[1].nickname, 'SakuraChan');
  assert.equal(lb.json.entries[1].isCurrentUser, true);

  // Strict privacy checks: NO email, NO password_hash, NO history, NO wrong card details!
  const serialized = JSON.stringify(lb.json);
  assert.ok(!serialized.includes('kenji@example.com'), 'PRIVACY VIOLATION: email leaked in leaderboard!');
  assert.ok(!serialized.includes('sakura@example.com'), 'PRIVACY VIOLATION: email leaked in leaderboard!');
  assert.ok(!serialized.includes('password_hash'), 'PRIVACY VIOLATION: password_hash leaked!');
  assert.ok(!serialized.includes('k_003'), 'PRIVACY VIOLATION: card mistakes leaked!');

  console.log('=== 7. VERIFY EMAIL LIMIT (MAX 2x / 24H) ===');
  const v1 = await api('POST', '/api/auth/register', { email: 'limit@example.com', nickname: 'LimitUser' });
  assert.equal(v1.status, 201, '1st verification email should succeed');
  const v2 = await api('POST', '/api/auth/register', { email: 'limit@example.com', nickname: 'LimitUser' });
  assert.equal(v2.status, 201, '2nd verification email should succeed');
  const v3 = await api('POST', '/api/auth/register', { email: 'limit@example.com', nickname: 'LimitUser' });
  assert.equal(v3.status, 429, '3rd verification email within 24h must be blocked');
  assert.ok(v3.json.retryAfterSeconds > 0, 'retryAfterSeconds must be provided');

  console.log('=== 8. VERIFY WRONG PASSWORD LIMIT (MAX 5x / 5 MIN -> 15 MIN LOCKOUT) ===');
  for (let i = 1; i <= 4; i++) {
    const bad = await api('POST', '/api/auth/login', { identifier: 'SakuraChan', password: 'wrong!' });
    assert.equal(bad.status, 401, `Attempt ${i} should return 401`);
  }
  const bad5 = await api('POST', '/api/auth/login', { identifier: 'SakuraChan', password: 'wrong!' });
  assert.equal(bad5.status, 429, '5th wrong password within 5 mins must lock account (429)');
  assert.ok(bad5.json.retryAfterSeconds >= 890 && bad5.json.retryAfterSeconds <= 900, 'Lockout must be 15 mins');

  // Even correct password must be blocked while locked out!
  const blockedCorrect = await api('POST', '/api/auth/login', { identifier: 'SakuraChan', password: 'sakuraPassword!' });
  assert.equal(blockedCorrect.status, 429, 'Login must stay blocked during 15-min lockout');

  // Simulate lockout expiration -> login succeeds again
  db.prepare('UPDATE login_lockouts SET locked_until = ?').run(Date.now() - 1000);
  const unlockedLogin = await api('POST', '/api/auth/login', { identifier: 'SakuraChan', password: 'sakuraPassword!' });
  assert.equal(unlockedLogin.status, 200, 'Login should succeed after 15-min lockout expires');

  console.log('🎉 ALL MULTI-USER AUTH, PROFILE, MEMBERSHIP, SYNC, RATE-LIMIT & PRIVACY TESTS PASSED 100%!');
} finally {
  server.close();
}
