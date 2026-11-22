// KiraKira Nihongo - Auth, Profile, Membership, Progress Sync & Leaderboard API Router
// Zero-dependency Node.js v24 (node:crypto + node:sqlite)

import crypto from 'node:crypto';
import {
  getDb,
  getPublicLeaderboard,
  getUserPrivateProgress,
  syncUserProgress,
  getAdminOverview,
  getAdminStudentsList,
  getStudentDetailForAdmin,
  insertActivityLog
} from './db.js';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendLessonClearEmail,
  sendGradeUnlockEmail
} from './mailer.js';
import { handleTtsRequest } from './tts.js';
import {
  validateGeneratePayload,
  getAdvisorStatus,
  generateAdvisorReport
} from './advisor.js';

const SESSION_COOKIE = 'kk_session';
const SESSION_TTL_DAYS = 30;
const VERIFY_TTL_HOURS = 24;
const VERIFY_EMAIL_MAX_PER_24H = 2;
const VERIFY_EMAIL_WINDOW_MS = 24 * 60 * 60 * 1000;
const LOGIN_MAX_FAILURES = 5;
const LOGIN_FAILURE_WINDOW_MS = 5 * 60 * 1000;
const LOGIN_LOCKOUT_MS = 15 * 60 * 1000;
const ALLOWED_AVATARS = ['🌸', '🦊', '🐱', '🐼', '🗻', '⛩️', '🎎', '🍙', '🍡', '🥷', '🏯', '🎌'];
const ALLOWED_TIERS = ['free', 'pro'];

function formatWaitDuration(ms) {
  const totalMinutes = Math.max(1, Math.ceil(ms / 60000));
  if (totalMinutes < 60) return `${totalMinutes} menit`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hours} jam ${mins} menit` : `${hours} jam`;
}

function checkVerificationEmailLimit(db, email, now = Date.now()) {
  const normEmail = String(email || '').trim().toLowerCase();
  const cutoff = now - VERIFY_EMAIL_WINDOW_MS;
  db.prepare('DELETE FROM verification_email_logs WHERE sent_at <= ?').run(cutoff);
  const rows = db.prepare(`
    SELECT sent_at FROM verification_email_logs
    WHERE email = ? AND sent_at > ?
    ORDER BY sent_at ASC
  `).all(normEmail, cutoff);

  if (rows.length >= VERIFY_EMAIL_MAX_PER_24H) {
    const retryAfterMs = Math.max(1000, (rows[0].sent_at + VERIFY_EMAIL_WINDOW_MS) - now);
    return { allowed: false, count: rows.length, retryAfterMs };
  }
  return { allowed: true, count: rows.length, retryAfterMs: 0 };
}

function recordVerificationEmailSent(db, email, now = Date.now()) {
  const normEmail = String(email || '').trim().toLowerCase();
  db.prepare('INSERT INTO verification_email_logs (email, sent_at) VALUES (?, ?)').run(normEmail, now);
}

function getLoginLockout(db, accountKey, now = Date.now()) {
  const row = db.prepare('SELECT locked_until FROM login_lockouts WHERE account_key = ?').get(accountKey);
  if (!row) return null;
  if (row.locked_until <= now) {
    db.prepare('DELETE FROM login_lockouts WHERE account_key = ?').run(accountKey);
    return null;
  }
  return { lockedUntil: row.locked_until, retryAfterMs: row.locked_until - now };
}

function recordLoginFailure(db, accountKey, now = Date.now()) {
  const cutoff = now - LOGIN_FAILURE_WINDOW_MS;
  db.prepare('DELETE FROM login_failures WHERE account_key = ? AND failed_at <= ?').run(accountKey, cutoff);
  db.prepare('INSERT INTO login_failures (account_key, failed_at) VALUES (?, ?)').run(accountKey, now);

  const count = db.prepare('SELECT COUNT(*) AS cnt FROM login_failures WHERE account_key = ? AND failed_at > ?')
    .get(accountKey, cutoff).cnt;

  if (count >= LOGIN_MAX_FAILURES) {
    const lockedUntil = now + LOGIN_LOCKOUT_MS;
    db.prepare(`
      INSERT INTO login_lockouts (account_key, locked_until)
      VALUES (?, ?)
      ON CONFLICT(account_key) DO UPDATE SET locked_until = excluded.locked_until
    `).run(accountKey, lockedUntil);
    db.prepare('DELETE FROM login_failures WHERE account_key = ?').run(accountKey);
    return { locked: true, attempts: count, remainingAttempts: 0, retryAfterMs: LOGIN_LOCKOUT_MS };
  }

  return { locked: false, attempts: count, remainingAttempts: LOGIN_MAX_FAILURES - count, retryAfterMs: 0 };
}

function clearLoginFailures(db, accountKey) {
  db.prepare('DELETE FROM login_failures WHERE account_key = ?').run(accountKey);
  db.prepare('DELETE FROM login_lockouts WHERE account_key = ?').run(accountKey);
}

// Simple sliding-window rate limiter per IP + bucket
const rateBuckets = new Map();
function checkRateLimit(ip, bucket, maxRequests = 15, windowMs = 15 * 60 * 1000) {
  const key = `${bucket}:${ip || 'local'}`;
  const now = Date.now();
  const timestamps = (rateBuckets.get(key) || []).filter(ts => now - ts < windowMs);
  if (timestamps.length >= maxRequests) {
    return false;
  }
  timestamps.push(now);
  rateBuckets.set(key, timestamps);
  return true;
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, keyHex] = storedHash.split(':');
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(keyHex, 'hex');
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

function generateToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const cookies = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = decodeURIComponent(part.slice(idx + 1).trim());
    cookies[k] = v;
  }
  return cookies;
}

function buildSessionCookie(token, maxAgeSeconds) {
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`
  ];
  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure');
  }
  return parts.join('; ');
}

function sendJson(res, status, data, extraHeaders = {}) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders
  });
  res.end(body);
}

function readJsonBody(req, maxBytes = 2 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let tooLarge = false;
    const chunks = [];
    req.on('data', (chunk) => {
      if (tooLarge) return;
      size += chunk.length;
      if (size > maxBytes) {
        tooLarge = true;
        chunks.length = 0;
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (tooLarge) {
        const err = new Error('Payload terlalu besar');
        err.statusCode = 413;
        reject(err);
        return;
      }
      const raw = Buffer.concat(chunks).toString('utf8').trim();
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        const err = new Error('Format JSON tidak valid');
        err.statusCode = 400;
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function getAuthenticatedUser(req, db) {
  const cookies = parseCookies(req);
  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  const sessionToken = cookies[SESSION_COOKIE] || bearerToken;
  if (!sessionToken) return null;

  const row = db.prepare(`
    SELECT u.id, u.email, u.nickname, u.role, u.membership_tier, u.avatar_emoji, u.bio, u.is_verified, u.must_change_password, u.created_at, s.expires_at
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.session_token = ?
  `).get(sessionToken);

  if (!row) return null;
  if (new Date(row.expires_at) <= new Date()) {
    db.prepare('DELETE FROM sessions WHERE session_token = ?').run(sessionToken);
    return null;
  }

  return {
    sessionToken,
    user: {
      id: row.id,
      email: row.email,
      nickname: row.nickname,
      role: row.role,
      membershipTier: row.membership_tier,
      avatarEmoji: row.avatar_emoji || '🌸',
      bio: row.bio || '',
      isVerified: Boolean(row.is_verified),
      mustChangePassword: Boolean(row.must_change_password),
      createdAt: row.created_at
    }
  };
}

function createSession(db, userId) {
  const token = generateToken(32);
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
  db.prepare(`
    INSERT INTO sessions (session_token, user_id, expires_at)
    VALUES (?, ?, ?)
  `).run(token, userId, expiresAt);
  return { token, expiresAt, maxAgeSeconds: SESSION_TTL_DAYS * 24 * 60 * 60 };
}

function getBaseUrl(req) {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL.replace(/\/+$/, '');
  }
  const proto = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host || 'localhost:3000';
  return `${proto}://${host}`;
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function isValidNickname(nickname) {
  return typeof nickname === 'string' && /^[a-zA-Z0-9_\-\u3040-\u30ff\u4e00-\u9faf ]{2,24}$/.test(nickname.trim());
}

export async function handleApiRequest(req, res, parsedUrl, customDb = null, deps = {}) {
  const pathname = parsedUrl.pathname;
  if (!pathname.startsWith('/api/')) return false;

  const db = customDb || getDb();
  const method = req.method.toUpperCase();
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'local';

  try {
    // 1. POST /api/auth/register (Email & Nickname only -> sends verification link)
    if (method === 'POST' && pathname === '/api/auth/register') {
      if (!checkRateLimit(clientIp, 'register', 10, 15 * 60 * 1000)) {
        sendJson(res, 429, { error: 'Terlalu banyak percobaan pendaftaran. Coba lagi beberapa menit lagi.' });
        return true;
      }

      const body = await readJsonBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      const nickname = String(body.nickname || '').trim();

      if (!isValidEmail(email)) {
        sendJson(res, 400, { error: 'Alamat email tidak valid.' });
        return true;
      }
      if (!isValidNickname(nickname)) {
        sendJson(res, 400, { error: 'Nickname harus 2–24 karakter (huruf, angka, spasi, _, atau -).' });
        return true;
      }

      const existingEmail = db.prepare('SELECT id, is_verified FROM users WHERE email = ?').get(email);
      const existingNick = db.prepare('SELECT id, email, is_verified FROM users WHERE nickname = ?').get(nickname);

      if (existingEmail && existingEmail.is_verified) {
        sendJson(res, 409, { error: 'Email sudah terdaftar dan aktif. Silakan masuk (Login).' });
        return true;
      }
      if (existingNick && (!existingEmail || existingNick.id !== existingEmail.id)) {
        sendJson(res, 409, { error: 'Nickname sudah digunakan. Silakan pilih nickname lain.' });
        return true;
      }

      // Enforce max 2 verification emails per 24 hours for this email address
      const emailLimit = checkVerificationEmailLimit(db, email);
      if (!emailLimit.allowed) {
        sendJson(res, 429, {
          error: `Batas pengiriman email verifikasi tercapai (maksimal ${VERIFY_EMAIL_MAX_PER_24H}× per 24 jam). Cek inbox/spam Anda atau coba lagi dalam ${formatWaitDuration(emailLimit.retryAfterMs)}.`,
          retryAfterSeconds: Math.ceil(emailLimit.retryAfterMs / 1000)
        });
        return true;
      }

      let userId;
      if (existingEmail && !existingEmail.is_verified) {
        // Re-issue verification token for pending user
        userId = existingEmail.id;
        db.prepare(`UPDATE users SET nickname = ?, updated_at = datetime('now') WHERE id = ?`).run(nickname, userId);
        db.prepare('DELETE FROM verification_tokens WHERE user_id = ?').run(userId);
      } else {
        userId = crypto.randomUUID();
        // First ever registered user becomes admin automatically; subsequent users are regular students
        const userCount = db.prepare('SELECT COUNT(*) AS cnt FROM users').get().cnt;
        const role = userCount === 0 ? 'admin' : 'student';
        db.prepare(`
          INSERT INTO users (id, email, nickname, role, membership_tier, is_verified)
          VALUES (?, ?, ?, ?, 'free', 0)
        `).run(userId, email, nickname, role);
      }

      const token = generateToken(32);
      const expiresAt = new Date(Date.now() + VERIFY_TTL_HOURS * 60 * 60 * 1000).toISOString();
      db.prepare(`
        INSERT INTO verification_tokens (token, user_id, expires_at)
        VALUES (?, ?, ?)
      `).run(token, userId, expiresAt);

      const verifyUrl = `${getBaseUrl(req)}/verify.html?token=${token}`;

      let emailSent = false;
      let emailError = null;
      if (process.env.SKIP_SMTP !== '1') {
        try {
          await sendVerificationEmail({ to: email, nickname, verifyUrl });
          emailSent = true;
        } catch (err) {
          emailError = err.message;
          console.error('[Mailer] Gagal mengirim email verifikasi:', err.message);
        }
      }

      // Record verification email send attempt against the 2x / 24h quota
      recordVerificationEmailSent(db, email);

      const isLocal = (req.headers.host || '').startsWith('localhost') || (req.headers.host || '').startsWith('127.0.0.1');
      sendJson(res, 201, {
        ok: true,
        emailSent,
        message: emailSent
          ? 'Link verifikasi telah dikirim ke email Anda. Buka tautan tersebut untuk membuat kata sandi.'
          : 'Akun pending dibuat, namun pengiriman SMTP sedang tidak terjangkau.',
        // Provide direct activation link ONLY on localhost when SMTP fails or SKIP_SMTP=1 (for local dev/testing)
        ...((!emailSent && isLocal) ? { devVerifyUrl: verifyUrl, smtpWarning: emailError } : {})
      });
      return true;
    }

    // 2. GET /api/auth/verify?token=...
    if (method === 'GET' && pathname === '/api/auth/verify') {
      const token = parsedUrl.searchParams.get('token') || '';
      if (!token) {
        sendJson(res, 400, { valid: false, error: 'Token verifikasi tidak ditemukan.' });
        return true;
      }

      const row = db.prepare(`
        SELECT vt.token, vt.expires_at, u.nickname, u.is_verified
        FROM verification_tokens vt
        JOIN users u ON u.id = vt.user_id
        WHERE vt.token = ?
      `).get(token);

      if (!row) {
        sendJson(res, 404, { valid: false, error: 'Tautan verifikasi tidak valid atau sudah digunakan.' });
        return true;
      }

      if (new Date(row.expires_at) <= new Date()) {
        db.prepare('DELETE FROM verification_tokens WHERE token = ?').run(token);
        sendJson(res, 410, { valid: false, error: 'Tautan verifikasi sudah kedaluwarsa (lebih dari 24 jam). Silakan daftar ulang.' });
        return true;
      }

      sendJson(res, 200, {
        valid: true,
        nickname: row.nickname
      });
      return true;
    }

    // 3. POST /api/auth/set-password
    if (method === 'POST' && pathname === '/api/auth/set-password') {
      const body = await readJsonBody(req);
      const token = String(body.token || '').trim();
      const password = String(body.password || '');

      if (!token) {
        sendJson(res, 400, { error: 'Token verifikasi wajib disertakan.' });
        return true;
      }
      if (password.length < 6 || password.length > 128) {
        sendJson(res, 400, { error: 'Kata sandi minimal 6 karakter.' });
        return true;
      }

      const row = db.prepare(`
        SELECT vt.token, vt.user_id, vt.expires_at, u.id, u.email, u.nickname, u.role, u.membership_tier, u.avatar_emoji, u.bio
        FROM verification_tokens vt
        JOIN users u ON u.id = vt.user_id
        WHERE vt.token = ?
      `).get(token);

      if (!row) {
        sendJson(res, 404, { error: 'Token verifikasi tidak valid atau sudah dipakai.' });
        return true;
      }
      if (new Date(row.expires_at) <= new Date()) {
        db.prepare('DELETE FROM verification_tokens WHERE token = ?').run(token);
        sendJson(res, 410, { error: 'Token verifikasi sudah kedaluwarsa.' });
        return true;
      }

      const passwordHash = hashPassword(password);
      db.exec('BEGIN');
      try {
        db.prepare(`
          UPDATE users
          SET password_hash = ?, is_verified = 1, must_change_password = 0, updated_at = datetime('now')
          WHERE id = ?
        `).run(passwordHash, row.user_id);

        db.prepare(`
          INSERT OR IGNORE INTO user_progress (user_id, xp, level, streak_days, badges_json, history_json, weekly_minutes)
          VALUES (?, 0, 1, 0, '[]', '{}', 0)
        `).run(row.user_id);

        db.prepare('DELETE FROM verification_tokens WHERE user_id = ?').run(row.user_id);
        db.exec('COMMIT');
      } catch (err) {
        db.exec('ROLLBACK');
        throw err;
      }

      // Clear any previous login failures/lockout after setting a new password
      clearLoginFailures(db, `user:${row.user_id}`);
      const session = createSession(db, row.user_id);
      sendJson(
        res,
        200,
        {
          ok: true,
          message: 'Akun berhasil diaktifkan!',
          user: {
            id: row.id,
            email: row.email,
            nickname: row.nickname,
            role: row.role,
            membershipTier: row.membership_tier,
            avatarEmoji: row.avatar_emoji || '🌸',
            bio: row.bio || ''
          }
        },
        { 'Set-Cookie': buildSessionCookie(session.token, session.maxAgeSeconds) }
      );
      return true;
    }

    // 3b. POST /api/auth/forgot-password (Sends reset verification email, max 2x / 24h)
    if (method === 'POST' && pathname === '/api/auth/forgot-password') {
      const body = await readJsonBody(req);
      const identifier = String(body.identifier || body.email || '').trim();

      if (!identifier) {
        sendJson(res, 400, { error: 'Masukkan alamat email atau nickname akun Anda.' });
        return true;
      }

      const user = db.prepare(`
        SELECT id, email, nickname, is_verified, is_active
        FROM users
        WHERE email = ? OR nickname = ?
      `).get(identifier.toLowerCase(), identifier);

      // Privacy-safe response when account doesn't exist
      if (!user || !user.is_verified) {
        sendJson(res, 200, {
          ok: true,
          message: 'Jika akun tersebut terdaftar dan aktif, tautan reset kata sandi telah dikirim ke email Anda.'
        });
        return true;
      }

      const emailLimit = checkVerificationEmailLimit(db, user.email);
      if (!emailLimit.allowed) {
        sendJson(res, 429, {
          error: `Batas pengiriman email verifikasi/reset tercapai (maksimal ${VERIFY_EMAIL_MAX_PER_24H}× per 24 jam). Coba lagi dalam ${formatWaitDuration(emailLimit.retryAfterMs)}.`,
          retryAfterSeconds: Math.ceil(emailLimit.retryAfterMs / 1000)
        });
        return true;
      }

      const token = generateToken(32);
      const expiresAt = new Date(Date.now() + VERIFY_TTL_HOURS * 60 * 60 * 1000).toISOString();
      db.prepare('DELETE FROM verification_tokens WHERE user_id = ?').run(user.id);
      db.prepare('INSERT INTO verification_tokens (token, user_id, expires_at) VALUES (?, ?, ?)').run(token, user.id, expiresAt);

      const resetUrl = `${getBaseUrl(req)}/verify.html?token=${token}&mode=reset`;
      let emailSent = false;
      if (process.env.SKIP_SMTP !== '1') {
        try {
          await sendPasswordResetEmail({ to: user.email, nickname: user.nickname, resetUrl });
          emailSent = true;
        } catch (err) {
          console.error('[Mailer] Gagal mengirim email reset password:', err.message);
        }
      }
      recordVerificationEmailSent(db, user.email);

      const isLocal = (req.headers.host || '').startsWith('localhost') || (req.headers.host || '').startsWith('127.0.0.1');
      sendJson(res, 200, {
        ok: true,
        emailSent,
        message: 'Tautan reset kata sandi telah dikirim ke email Anda. Buka tautan tersebut untuk membuat kata sandi baru.',
        ...((!emailSent && isLocal) ? { devResetUrl: resetUrl } : {})
      });
      return true;
    }

    // 4. POST /api/auth/login (Email OR Nickname + Password)
    if (method === 'POST' && pathname === '/api/auth/login') {
      const body = await readJsonBody(req);
      const identifier = String(body.identifier || body.email || body.nickname || '').trim();
      const password = String(body.password || '');

      if (!identifier || !password) {
        sendJson(res, 400, { error: 'Masukkan email/nickname dan kata sandi.' });
        return true;
      }

      const user = db.prepare(`
        SELECT id, email, nickname, password_hash, role, membership_tier, avatar_emoji, bio, is_verified, must_change_password, created_at
        FROM users
        WHERE email = ? OR nickname = ?
      `).get(identifier.toLowerCase(), identifier);

      const accountKey = user ? `user:${user.id}` : `ident:${identifier.toLowerCase()}`;
      const activeLock = getLoginLockout(db, accountKey);
      if (activeLock) {
        sendJson(res, 429, {
          error: `Akun dikunci sementara karena terlalu banyak kata sandi salah. Silakan coba lagi dalam ${formatWaitDuration(activeLock.retryAfterMs)}.`,
          retryAfterSeconds: Math.ceil(activeLock.retryAfterMs / 1000)
        });
        return true;
      }

      if (!user || !user.is_verified || !verifyPassword(password, user.password_hash)) {
        const failInfo = recordLoginFailure(db, accountKey);
        if (failInfo.locked) {
          sendJson(res, 429, {
            error: `Kata sandi salah ${LOGIN_MAX_FAILURES}× dalam 5 menit. Silakan coba lagi setelah 15 menit.`,
            retryAfterSeconds: Math.ceil(failInfo.retryAfterMs / 1000)
          });
          return true;
        }
        sendJson(res, 401, {
          error: `Email/nickname atau kata sandi salah, atau akun belum diverifikasi. (Sisa percobaan: ${failInfo.remainingAttempts}× sebelum dikunci 15 menit)`
        });
        return true;
      }

      clearLoginFailures(db, accountKey);
      const session = createSession(db, user.id);
      try {
        insertActivityLog(db, {
          userId: user.id,
          eventType: 'login',
          localHour: body.localHour,
          localDow: body.localDow,
          timezone: body.timezone
        });
      } catch (logErr) {
        console.warn('[Activity Log login warning]', logErr.message);
      }
      const progress = getUserPrivateProgress(db, user.id);

      sendJson(
        res,
        200,
        {
          ok: true,
          user: {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            role: user.role,
            membershipTier: user.membership_tier,
            avatarEmoji: user.avatar_emoji || '🌸',
            bio: user.bio || '',
            mustChangePassword: Boolean(user.must_change_password),
            createdAt: user.created_at
          },
          progress
        },
        { 'Set-Cookie': buildSessionCookie(session.token, session.maxAgeSeconds) }
      );
      return true;
    }

    // 5. POST /api/auth/logout
    if (method === 'POST' && pathname === '/api/auth/logout') {
      const auth = getAuthenticatedUser(req, db);
      if (auth) {
        db.prepare('DELETE FROM sessions WHERE session_token = ?').run(auth.sessionToken);
      }
      sendJson(
        res,
        200,
        { ok: true },
        { 'Set-Cookie': buildSessionCookie('', 0) }
      );
      return true;
    }

    // 6. GET /api/auth/me
    if (method === 'GET' && pathname === '/api/auth/me') {
      const auth = getAuthenticatedUser(req, db);
      if (!auth) {
        sendJson(res, 200, { authenticated: false, user: null });
        return true;
      }
      sendJson(res, 200, { authenticated: true, user: auth.user });
      return true;
    }

    // 6b. POST /api/auth/change-password (Authenticated user updates own password)
    if (method === 'POST' && pathname === '/api/auth/change-password') {
      const auth = getAuthenticatedUser(req, db);
      if (!auth) {
        sendJson(res, 401, { error: 'Silakan login terlebih dahulu.' });
        return true;
      }

      const body = await readJsonBody(req);
      const currentPassword = String(body.currentPassword || '');
      const newPassword = String(body.newPassword || '');

      if (!currentPassword || !newPassword) {
        sendJson(res, 400, { error: 'Masukkan kata sandi saat ini dan kata sandi baru.' });
        return true;
      }
      if (newPassword.length < 6 || newPassword.length > 128) {
        sendJson(res, 400, { error: 'Kata sandi baru minimal 6 karakter.' });
        return true;
      }
      if (currentPassword === newPassword) {
        sendJson(res, 400, { error: 'Kata sandi baru harus berbeda dari kata sandi saat ini.' });
        return true;
      }

      const row = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(auth.user.id);
      if (!row || !verifyPassword(currentPassword, row.password_hash)) {
        sendJson(res, 401, { error: 'Kata sandi saat ini tidak cocok.' });
        return true;
      }

      const newHash = hashPassword(newPassword);
      db.prepare(`
        UPDATE users
        SET password_hash = ?, must_change_password = 0, updated_at = datetime('now')
        WHERE id = ?
      `).run(newHash, auth.user.id);

      clearLoginFailures(db, `user:${auth.user.id}`);
      sendJson(res, 200, { ok: true, message: 'Kata sandi berhasil diperbarui.' });
      return true;
    }

    // 7. PATCH /api/profile (Update nickname, avatar, bio, membership tier)
    if (method === 'PATCH' && pathname === '/api/profile') {
      const auth = getAuthenticatedUser(req, db);
      if (!auth) {
        sendJson(res, 401, { error: 'Silakan login terlebih dahulu.' });
        return true;
      }

      const body = await readJsonBody(req);
      let nickname = auth.user.nickname;
      let avatarEmoji = auth.user.avatarEmoji;
      let bio = auth.user.bio;
      let membershipTier = auth.user.membershipTier;

      if (body.nickname !== undefined) {
        const nextNick = String(body.nickname).trim();
        if (!isValidNickname(nextNick)) {
          sendJson(res, 400, { error: 'Nickname harus 2–24 karakter.' });
          return true;
        }
        const conflict = db.prepare('SELECT id FROM users WHERE nickname = ? AND id != ?').get(nextNick, auth.user.id);
        if (conflict) {
          sendJson(res, 409, { error: 'Nickname sudah dipakai pengguna lain.' });
          return true;
        }
        nickname = nextNick;
      }

      if (body.avatarEmoji !== undefined && ALLOWED_AVATARS.includes(body.avatarEmoji)) {
        avatarEmoji = body.avatarEmoji;
      }

      if (body.bio !== undefined) {
        bio = String(body.bio).trim().slice(0, 160);
      }

      if (body.membershipTier !== undefined && ALLOWED_TIERS.includes(body.membershipTier)) {
        membershipTier = body.membershipTier;
      }

      db.prepare(`
        UPDATE users
        SET nickname = ?, avatar_emoji = ?, bio = ?, membership_tier = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(nickname, avatarEmoji, bio, membershipTier, auth.user.id);

      sendJson(res, 200, {
        ok: true,
        user: {
          ...auth.user,
          nickname,
          avatarEmoji,
          bio,
          membershipTier
        }
      });
      return true;
    }

    // 8. GET /api/progress/me (Private full progress)
    if (method === 'GET' && pathname === '/api/progress/me') {
      const auth = getAuthenticatedUser(req, db);
      if (!auth) {
        sendJson(res, 401, { error: 'Autentikasi diperlukan untuk melihat progres pribadi.' });
        return true;
      }
      const progress = getUserPrivateProgress(db, auth.user.id);
      sendJson(res, 200, { ok: true, progress });
      return true;
    }

    // 9. POST /api/progress/sync
    if (method === 'POST' && pathname === '/api/progress/sync') {
      const auth = getAuthenticatedUser(req, db);
      if (!auth) {
        sendJson(res, 401, { error: 'Autentikasi diperlukan untuk sinkronisasi progres.' });
        return true;
      }

      const body = await readJsonBody(req);
      const mode = body.mode === 'merge' ? 'merge' : 'replace';
      const payload = body.progress || body;
      const synced = syncUserProgress(db, auth.user.id, payload, mode);
      sendJson(res, 200, { ok: true, progress: synced });
      return true;
    }

    // 10. GET /api/leaderboard?period=all|week (Public high-level only, zero private leakage)
    if (method === 'GET' && pathname === '/api/leaderboard') {
      const auth = getAuthenticatedUser(req, db);
      const period = parsedUrl.searchParams.get('period') === 'week' ? 'week' : 'all';
      const entries = getPublicLeaderboard(db, period, auth ? auth.user.id : null, 50);
      sendJson(res, 200, {
        ok: true,
        period,
        entries
      });
      return true;
    }

    // 10b. POST /api/achievements/notify (Lesson clear & 5-lesson Grade Unlock emails, idempotent)
    if (method === 'POST' && pathname === '/api/achievements/notify') {
      const auth = getAuthenticatedUser(req, db);
      if (!auth) {
        sendJson(res, 401, { error: 'Autentikasi diperlukan.' });
        return true;
      }

      const body = await readJsonBody(req);
      const type = String(body.type || '');
      const appUrl = getBaseUrl(req);

      if (type === 'lesson_clear') {
        const lessonNum = parseInt(body.lessonNum, 10);
        if (!Number.isInteger(lessonNum) || lessonNum < 1 || lessonNum > 14) {
          sendJson(res, 400, { error: 'Nomor bab tidak valid.' });
          return true;
        }
        const eventKey = `lesson_clear_${lessonNum}`;
        const existing = db.prepare('SELECT 1 FROM achievement_emails WHERE user_id = ? AND event_key = ?').get(auth.user.id, eventKey);
        if (existing) {
          sendJson(res, 200, { ok: true, alreadySent: true, eventKey });
          return true;
        }
        db.prepare('INSERT INTO achievement_emails (user_id, event_key, sent_at) VALUES (?, ?, ?)').run(auth.user.id, eventKey, Date.now());
        let emailSent = false;
        if (process.env.SKIP_SMTP !== '1') {
          try {
            await sendLessonClearEmail({ to: auth.user.email, nickname: auth.user.nickname, lessonNum, appUrl });
            emailSent = true;
          } catch (err) {
            console.warn('[Achievement Mailer] Lesson clear email error:', err.message);
          }
        }
        sendJson(res, 200, { ok: true, emailSent, eventKey });
        return true;
      }

      if (type === 'block_unlock') {
        const blockNum = parseInt(body.blockNum, 10);
        const blockMeta = {
          1: { clearedRange: 'Bab 1–5', unlockedRange: 'Bab 6–10', gradeTitle: 'Grade 1: Dasar (Bab 1–5)' },
          2: { clearedRange: 'Bab 6–10', unlockedRange: 'Bab 11–14', gradeTitle: 'Grade 2: Menengah (Bab 6–10)' },
          3: { clearedRange: 'Bab 11–14', unlockedRange: null, gradeTitle: 'Grade 3: Master (Bab 1–14)' }
        }[blockNum];

        if (!blockMeta) {
          sendJson(res, 400, { error: 'Nomor blok tidak valid.' });
          return true;
        }
        const eventKey = `block_unlock_${blockNum}`;
        const existing = db.prepare('SELECT 1 FROM achievement_emails WHERE user_id = ? AND event_key = ?').get(auth.user.id, eventKey);
        if (existing) {
          sendJson(res, 200, { ok: true, alreadySent: true, eventKey });
          return true;
        }
        db.prepare('INSERT INTO achievement_emails (user_id, event_key, sent_at) VALUES (?, ?, ?)').run(auth.user.id, eventKey, Date.now());
        let emailSent = false;
        if (process.env.SKIP_SMTP !== '1') {
          try {
            await sendGradeUnlockEmail({
              to: auth.user.email,
              nickname: auth.user.nickname,
              blockNum,
              ...blockMeta,
              appUrl
            });
            emailSent = true;
          } catch (err) {
            console.warn('[Achievement Mailer] Grade unlock email error:', err.message);
          }
        }
        sendJson(res, 200, { ok: true, emailSent, eventKey });
        return true;
      }

      sendJson(res, 400, { error: 'Tipe achievement tidak valid.' });
      return true;
    }

    // 11. GET /api/admin/overview (Admin only)
    if (method === 'GET' && pathname === '/api/admin/overview') {
      const auth = getAuthenticatedUser(req, db);
      if (!auth || auth.user.role !== 'admin') {
        sendJson(res, 403, { error: 'Akses ditolak. Fitur ini khusus untuk Admin / Guru.' });
        return true;
      }
      const overview = getAdminOverview(db);
      sendJson(res, 200, { ok: true, overview });
      return true;
    }

    // 12. GET /api/admin/students (Admin only)
    if (method === 'GET' && pathname === '/api/admin/students') {
      const auth = getAuthenticatedUser(req, db);
      if (!auth || auth.user.role !== 'admin') {
        sendJson(res, 403, { error: 'Akses ditolak. Fitur ini khusus untuk Admin / Guru.' });
        return true;
      }
      const search = parsedUrl.searchParams.get('search') || '';
      const limit = Math.min(100, Math.max(1, parseInt(parsedUrl.searchParams.get('limit') || '50', 10)));
      const offset = Math.max(0, parseInt(parsedUrl.searchParams.get('offset') || '0', 10));
      const students = getAdminStudentsList(db, { search, limit, offset });
      sendJson(res, 200, { ok: true, students });
      return true;
    }

    // 13. GET /api/admin/students/:id/detail (Admin only)
    if (method === 'GET' && pathname.startsWith('/api/admin/students/') && pathname.endsWith('/detail')) {
      const auth = getAuthenticatedUser(req, db);
      if (!auth || auth.user.role !== 'admin') {
        sendJson(res, 403, { error: 'Akses ditolak. Fitur ini khusus untuk Admin / Guru.' });
        return true;
      }
      const parts = pathname.split('/');
      const studentId = parts[parts.length - 2];
      const detail = getStudentDetailForAdmin(db, studentId);
      if (!detail) {
        sendJson(res, 404, { error: 'Siswa tidak ditemukan.' });
        return true;
      }
      sendJson(res, 200, { ok: true, ...detail });
      return true;
    }

    // 14. POST /api/admin/students/:id/action (Admin only)
    if (method === 'POST' && pathname.startsWith('/api/admin/students/') && pathname.endsWith('/action')) {
      const auth = getAuthenticatedUser(req, db);
      if (!auth || auth.user.role !== 'admin') {
        sendJson(res, 403, { error: 'Akses ditolak. Fitur ini khusus untuk Admin / Guru.' });
        return true;
      }
      const parts = pathname.split('/');
      const studentId = parts[parts.length - 2];
      const body = await readJsonBody(req);
      const action = body.action;

      const student = db.prepare('SELECT id, email, nickname, is_verified, is_active FROM users WHERE id = ?').get(studentId);
      if (!student) {
        sendJson(res, 404, { error: 'Siswa tidak ditemukan.' });
        return true;
      }

      if (action === 'resend_verification') {
        const emailLimit = checkVerificationEmailLimit(db, student.email);
        if (!emailLimit.allowed) {
          sendJson(res, 429, {
            error: `Batas pengiriman email verifikasi tercapai (maksimal ${VERIFY_EMAIL_MAX_PER_24H}× per 24 jam). Coba lagi dalam ${formatWaitDuration(emailLimit.retryAfterMs)}.`,
            retryAfterSeconds: Math.ceil(emailLimit.retryAfterMs / 1000)
          });
          return true;
        }
        const token = generateToken(32);
        const expiresAt = new Date(Date.now() + VERIFY_TTL_HOURS * 60 * 60 * 1000).toISOString();
        db.prepare('DELETE FROM verification_tokens WHERE user_id = ?').run(studentId);
        db.prepare('INSERT INTO verification_tokens (token, user_id, expires_at) VALUES (?, ?, ?)').run(token, studentId, expiresAt);
        const verifyUrl = `${getBaseUrl(req)}/verify.html?token=${token}`;

        let sent = false;
        try {
          await sendVerificationEmail({ to: student.email, nickname: student.nickname, verifyUrl });
          sent = true;
        } catch (e) {
          console.warn('[Admin resend error]', e.message);
        }
        recordVerificationEmailSent(db, student.email);
        sendJson(res, 200, { ok: true, sent, verifyUrl });
        return true;
      } else if (action === 'verify_manual') {
        db.prepare("UPDATE users SET is_verified = 1, updated_at = datetime('now') WHERE id = ?").run(studentId);
        db.prepare('DELETE FROM verification_tokens WHERE user_id = ?').run(studentId);
        sendJson(res, 200, { ok: true, message: 'Akun siswa berhasil diaktivasi secara manual.' });
        return true;
      } else if (action === 'toggle_active') {
        const newActive = student.is_active ? 0 : 1;
        db.prepare("UPDATE users SET is_active = ?, updated_at = datetime('now') WHERE id = ?").run(newActive, studentId);
        sendJson(res, 200, { ok: true, isActive: newActive });
        return true;
      } else if (action === 'change_role') {
        const newRole = body.role === 'admin' ? 'admin' : 'student';
        db.prepare("UPDATE users SET role = ?, updated_at = datetime('now') WHERE id = ?").run(newRole, studentId);
        sendJson(res, 200, { ok: true, role: newRole });
        return true;
      }

      sendJson(res, 400, { error: 'Aksi tidak dikenali.' });
      return true;
    }

    // ---------------------------------------------------------
    // 14. GET /api/tts/status & GET /api/tts (Authenticated Native JP Neural TTS)
    // ---------------------------------------------------------
    if (method === 'GET' && (pathname === '/api/tts/status' || pathname === '/api/tts')) {
      const user = getAuthenticatedUser(req, db);
      if (!user) {
        sendJson(res, 401, { error: 'Harap login untuk mengakses layanan audio.' });
        return true;
      }
      return await handleTtsRequest(req, res, parsedUrl);
    }

    // ---------------------------------------------------------
    // 15. POST /api/activity/log (Authenticated User Activity & Timing Log)
    // ---------------------------------------------------------
    if (method === 'POST' && pathname === '/api/activity/log') {
      const auth = getAuthenticatedUser(req, db);
      if (!auth) {
        sendJson(res, 401, { error: 'Silakan login terlebih dahulu.' });
        return true;
      }
      if (!checkRateLimit(auth.user.id, 'activity_log', 60, 15 * 60 * 1000)) {
        sendJson(res, 429, { error: 'Terlalu banyak permintaan log aktivitas.' });
        return true;
      }

      const body = await readJsonBody(req, 32 * 1024);
      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        sendJson(res, 400, { error: 'Payload JSON harus berupa objek.' });
        return true;
      }
      const eventType = String(body.eventType || '').trim();
      if (eventType !== 'app_open' && eventType !== 'drill_complete') {
        sendJson(res, 400, { error: 'eventType harus "app_open" atau "drill_complete".' });
        return true;
      }

      const log = insertActivityLog(db, {
        userId: auth.user.id,
        eventType,
        localHour: body.localHour,
        localDow: body.localDow,
        timezone: body.timezone,
        sessionType: body.sessionType,
        drillMode: body.drillMode,
        inputFormat: body.inputFormat,
        lessons: body.lessons,
        durationSec: body.durationSec,
        cardsReviewed: body.cardsReviewed,
        correctCount: body.correctCount,
        wrongCount: body.wrongCount,
        xpEarned: body.xpEarned
      });
      sendJson(res, 201, { ok: true, log });
      return true;
    }

    // ---------------------------------------------------------
    // 16. GET /api/advisor/status & POST /api/advisor/generate (AI Advisor)
    // ---------------------------------------------------------
    if (method === 'GET' && pathname === '/api/advisor/status') {
      const auth = getAuthenticatedUser(req, db);
      if (!auth) {
        sendJson(res, 401, { error: 'Silakan login untuk mengakses AI Advisor.' });
        return true;
      }
      const locale = parsedUrl.searchParams.get('locale') === 'en' ? 'en' : 'id';
      const status = getAdvisorStatus(db, auth.user.id, locale);
      sendJson(res, 200, status);
      return true;
    }

    if (method === 'POST' && pathname === '/api/advisor/generate') {
      const auth = getAuthenticatedUser(req, db);
      if (!auth) {
        sendJson(res, 401, { error: 'Silakan login untuk mengakses AI Advisor.' });
        return true;
      }
      const body = await readJsonBody(req, 16 * 1024);
      const validated = validateGeneratePayload(body);
      if (!validated.ok) {
        sendJson(res, 400, { error: validated.error });
        return true;
      }

      const result = await generateAdvisorReport(
        db,
        auth.user.id,
        { forceRefresh: validated.forceRefresh, locale: validated.locale },
        deps
      );
      sendJson(res, result.httpStatus, result.payload);
      return true;
    }

    sendJson(res, 404, { error: 'Endpoint API tidak ditemukan.' });
    return true;
  } catch (err) {
    const statusCode = Number.isInteger(err?.statusCode) ? err.statusCode : 500;
    if (statusCode >= 500) {
      console.error('[API Error]', method, pathname, err);
    }
    sendJson(res, statusCode, { error: err.message || 'Terjadi kesalahan pada server.' });
    return true;
  }
}
