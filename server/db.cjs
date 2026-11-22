// Database Layer using Node.js v24 native node:sqlite
const { DatabaseSync } = require('node:sqlite');
const crypto = require('node:crypto');
const path = require('node:path');
const fs = require('node:fs');

const DB_PATH = process.env.DB_PATH || path.resolve(process.cwd(), 'data', 'kirakira.db');

// Ensure parent dir exists
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new DatabaseSync(DB_PATH);

// Enable WAL mode for high concurrency & performance
try {
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
} catch (e) {
  console.warn('Notice: PRAGMA journal_mode setting:', e.message);
}

// Initialize tables
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  salt TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK(role IN ('student', 'admin')),
  is_verified INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'activation',
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
  session_token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_progress (
  user_id TEXT PRIMARY KEY,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT,
  badges_json TEXT DEFAULT '[]',
  history_json TEXT DEFAULT '{}',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_srs_cards (
  user_id TEXT NOT NULL,
  card_id TEXT NOT NULL,
  stage INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  wrong INTEGER NOT NULL DEFAULT 0,
  next_due DATETIME,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, card_id),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);
CREATE INDEX IF NOT EXISTS idx_progress_xp ON user_progress(xp DESC);
CREATE INDEX IF NOT EXISTS idx_srs_user ON user_srs_cards(user_id);
`);

try {
  const sessionCols = db.prepare('PRAGMA table_info(sessions)').all();
  if (sessionCols.some(c => c.name === 'token') && !sessionCols.some(c => c.name === 'session_token')) {
    db.exec('ALTER TABLE sessions RENAME COLUMN token TO session_token;');
  }
} catch (e) {}

// Password hashing utility using scrypt
function hashPassword(password, salt = null) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return {
    hash: derivedKey.toString('hex'),
    salt: salt
  };
}

function verifyPassword(password, storedHash, salt) {
  const derivedKey = crypto.scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(derivedKey.toString('hex'), 'hex');
  const storedBuffer = Buffer.from(storedHash, 'hex');
  if (keyBuffer.length !== storedBuffer.length) return false;
  return crypto.timingSafeEqual(keyBuffer, storedBuffer);
}

// Check admin bootstrap
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .toLowerCase()
  .split(',')
  .map(e => e.trim());

// --- User Operations ---
function createUser({ email, nickname, role = 'student' }) {
  const id = crypto.randomUUID();
  const cleanEmail = email.trim().toLowerCase();
  const cleanNickname = nickname.trim();

  // If email matches ADMIN_EMAILS, grant admin automatically
  const assignedRole = ADMIN_EMAILS.includes(cleanEmail) ? 'admin' : role;

  const stmt = db.prepare(`
    INSERT INTO users (id, email, nickname, role, is_verified, is_active)
    VALUES (?, ?, ?, ?, 0, 1)
  `);
  stmt.run(id, cleanEmail, cleanNickname, assignedRole);

  // Initialize empty progress row
  const progStmt = db.prepare(`
    INSERT INTO user_progress (user_id, xp, level, streak_days, last_active_date, badges_json, history_json)
    VALUES (?, 0, 1, 0, NULL, '[]', '{}')
  `);
  progStmt.run(id);

  return getUserById(id);
}

function getUserById(id) {
  const stmt = db.prepare('SELECT id, email, nickname, role, is_verified, is_active, created_at, updated_at FROM users WHERE id = ?');
  return stmt.get(id) || null;
}

function getUserByEmail(email) {
  const cleanEmail = email.trim().toLowerCase();
  const stmt = db.prepare('SELECT id, email, nickname, role, is_verified, is_active, created_at, updated_at FROM users WHERE email = ?');
  return stmt.get(cleanEmail) || null;
}

function getUserByNickname(nickname) {
  const stmt = db.prepare('SELECT id, email, nickname, role, is_verified, is_active, created_at, updated_at FROM users WHERE LOWER(nickname) = LOWER(?)');
  return stmt.get(nickname.trim()) || null;
}

function getUserByIdentifier(identifier) {
  const clean = identifier.trim().toLowerCase();
  const stmt = db.prepare('SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(nickname) = ?');
  return stmt.get(clean, clean) || null;
}

function createVerificationToken(userId, type = 'activation', hoursValid = 24) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + hoursValid * 3600 * 1000).toISOString();

  // Invalidate previous tokens for this user and type
  const delStmt = db.prepare('DELETE FROM verification_tokens WHERE user_id = ? AND type = ?');
  delStmt.run(userId, type);

  const stmt = db.prepare(`
    INSERT INTO verification_tokens (token, user_id, type, expires_at)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(token, userId, type, expiresAt);

  return { token, expiresAt };
}

function getVerificationToken(token) {
  const stmt = db.prepare(`
    SELECT vt.*, u.email, u.nickname, u.role, u.is_verified, u.is_active
    FROM verification_tokens vt
    JOIN users u ON vt.user_id = u.id
    WHERE vt.token = ?
  `);
  const record = stmt.get(token);
  if (!record) return null;

  // Check expiration
  if (new Date(record.expires_at) < new Date()) {
    return { ...record, expired: true };
  }
  return { ...record, expired: false };
}

function setPasswordAndActivate(token, password) {
  const tokenRecord = getVerificationToken(token);
  if (!tokenRecord) {
    throw new Error('Tautan verifikasi tidak valid atau tidak ditemukan.');
  }
  if (tokenRecord.expired) {
    throw new Error('Tautan verifikasi sudah kedaluwarsa. Silakan minta tautan baru.');
  }

  const { hash, salt } = hashPassword(password);
  const now = new Date().toISOString();

  const updateStmt = db.prepare(`
    UPDATE users 
    SET password_hash = ?, salt = ?, is_verified = 1, updated_at = ?
    WHERE id = ?
  `);
  updateStmt.run(hash, salt, now, tokenRecord.user_id);

  // Remove used token
  const delStmt = db.prepare('DELETE FROM verification_tokens WHERE token = ?');
  delStmt.run(token);

  return getUserById(tokenRecord.user_id);
}

function authenticateUser(identifier, password) {
  const user = getUserByIdentifier(identifier);
  if (!user) {
    throw new Error('Email atau Nickname tidak ditemukan.');
  }
  if (!user.is_active) {
    throw new Error('Akun dinonaktifkan oleh administrator.');
  }
  if (!user.is_verified || !user.password_hash) {
    throw new Error('Akun belum diaktivasi. Silakan buka tautan verifikasi yang dikirimkan ke email Anda.');
  }

  const isValid = verifyPassword(password, user.password_hash, user.salt);
  if (!isValid) {
    throw new Error('Kata sandi yang Anda masukkan salah.');
  }

  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    role: user.role,
    is_verified: user.is_verified
  };
}

// --- Session Management ---
function createSession(userId, daysValid = 30) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + daysValid * 24 * 3600 * 1000).toISOString();

  const stmt = db.prepare('INSERT INTO sessions (session_token, user_id, expires_at) VALUES (?, ?, ?)');
  stmt.run(token, userId, expiresAt);

  return { token, expiresAt };
}

function getSessionUser(token) {
  if (!token) return null;
  const stmt = db.prepare(`
    SELECT s.session_token AS token, s.expires_at, u.id, u.email, u.nickname, u.role, u.is_verified, u.is_active
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.session_token = ?
  `);
  const record = stmt.get(token);
  if (!record) return null;

  if (new Date(record.expires_at) < new Date() || !record.is_active) {
    // Delete expired session
    db.prepare('DELETE FROM sessions WHERE session_token = ?').run(token);
    return null;
  }
  return record;
}

function deleteSession(token) {
  if (!token) return;
  const stmt = db.prepare('DELETE FROM sessions WHERE session_token = ?');
  stmt.run(token);
}

// --- User Progress Management ---
function getUserProgress(userId) {
  const pStmt = db.prepare('SELECT xp, level, streak_days, last_active_date, badges_json, history_json, updated_at FROM user_progress WHERE user_id = ?');
  const prog = pStmt.get(userId);

  const cardsStmt = db.prepare('SELECT card_id, stage, streak, correct, wrong, next_due FROM user_srs_cards WHERE user_id = ?');
  const cardsList = cardsStmt.all(userId) || [];

  const cardsMap = {};
  cardsList.forEach(c => {
    cardsMap[c.card_id] = {
      stage: c.stage,
      streak: c.streak,
      correct: c.correct,
      wrong: c.wrong,
      nextDue: c.next_due
    };
  });

  return {
    xp: prog ? prog.xp : 0,
    level: prog ? prog.level : 1,
    streakDays: prog ? prog.streak_days : 0,
    lastActiveDate: prog ? prog.last_active_date : null,
    badges: prog ? JSON.parse(prog.badges_json || '[]') : [],
    history: prog ? JSON.parse(prog.history_json || '{}') : {},
    cards: cardsMap,
    updatedAt: prog ? prog.updated_at : null
  };
}

function saveUserProgress(userId, progressData) {
  const { xp, level, streakDays, lastActiveDate, badges, history, cards } = progressData;
  const now = new Date().toISOString();

  // Upsert user_progress
  const progStmt = db.prepare(`
    INSERT INTO user_progress (user_id, xp, level, streak_days, last_active_date, badges_json, history_json, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      xp = excluded.xp,
      level = excluded.level,
      streak_days = excluded.streak_days,
      last_active_date = excluded.last_active_date,
      badges_json = excluded.badges_json,
      history_json = excluded.history_json,
      updated_at = excluded.updated_at
  `);
  progStmt.run(
    userId,
    xp || 0,
    level || 1,
    streakDays || 0,
    lastActiveDate || null,
    JSON.stringify(badges || []),
    JSON.stringify(history || {}),
    now
  );

  // Update cards if provided
  if (cards && typeof cards === 'object') {
    const cardStmt = db.prepare(`
      INSERT INTO user_srs_cards (user_id, card_id, stage, streak, correct, wrong, next_due, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, card_id) DO UPDATE SET
        stage = excluded.stage,
        streak = excluded.streak,
        correct = excluded.correct,
        wrong = excluded.wrong,
        next_due = excluded.next_due,
        updated_at = excluded.updated_at
    `);

    for (const [cardId, c] of Object.entries(cards)) {
      cardStmt.run(
        userId,
        cardId,
        c.stage ?? 0,
        c.streak ?? 0,
        c.correct ?? 0,
        c.wrong ?? 0,
        c.nextDue || null,
        now
      );
    }
  }

  return getUserProgress(userId);
}

// --- Public Leaderboard (High-Level Only, Privacy-Safe) ---
function getLeaderboard(limit = 50) {
  const stmt = db.prepare(`
    SELECT 
      u.id,
      u.nickname,
      p.xp,
      p.level,
      p.streak_days AS streakDays,
      p.last_active_date AS lastActiveDate,
      (SELECT COUNT(*) FROM user_srs_cards c WHERE c.user_id = u.id AND c.stage >= 3) AS masteredCardsCount
    FROM users u
    JOIN user_progress p ON u.id = p.user_id
    WHERE u.is_verified = 1 AND u.is_active = 1
    ORDER BY p.xp DESC, p.streak_days DESC, masteredCardsCount DESC
    LIMIT ?
  `);

  const rows = stmt.all(limit) || [];
  return rows.map((r, idx) => ({
    rank: idx + 1,
    id: r.id,
    nickname: r.nickname,
    level: r.level,
    xp: r.xp,
    streakDays: r.streakDays,
    masteredCardsCount: r.masteredCardsCount,
    lastActiveDate: r.lastActiveDate
  }));
}

// --- Admin APIs (Class Analytics & Student Inspection) ---
function getAdminOverview() {
  const totalStudents = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").get().count;
  const verifiedStudents = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student' AND is_verified = 1").get().count;
  const pendingStudents = db.prepare("SELECT COUNT(*) as count FROM users WHERE is_verified = 0").get().count;
  const totalXp = db.prepare("SELECT SUM(xp) as total FROM user_progress").get().total || 0;

  // Active today count
  const today = new Date().toISOString().slice(0, 10);
  const activeToday = db.prepare("SELECT COUNT(*) as count FROM user_progress WHERE last_active_date = ?").get(today).count;

  // Top mastered cards overall
  const topStrugglingCards = db.prepare(`
    SELECT card_id, SUM(wrong) as total_wrong, SUM(correct) as total_correct, COUNT(DISTINCT user_id) as student_count
    FROM user_srs_cards
    WHERE wrong > 0
    GROUP BY card_id
    ORDER BY total_wrong DESC
    LIMIT 10
  `).all() || [];

  return {
    totalStudents,
    verifiedStudents,
    pendingStudents,
    totalXp,
    activeToday,
    topStrugglingCards
  };
}

function getAdminStudentsList({ search = '', limit = 50, offset = 0 } = {}) {
  let query = `
    SELECT 
      u.id, u.email, u.nickname, u.role, u.is_verified, u.is_active, u.created_at,
      p.xp, p.level, p.streak_days, p.last_active_date,
      (SELECT COUNT(*) FROM user_srs_cards c WHERE c.user_id = u.id AND c.stage >= 3) as mastered_cards,
      (SELECT COUNT(*) FROM user_srs_cards c WHERE c.user_id = u.id) as total_cards_practiced
    FROM users u
    LEFT JOIN user_progress p ON u.id = p.user_id
  `;
  const params = [];

  if (search) {
    query += ` WHERE LOWER(u.email) LIKE ? OR LOWER(u.nickname) LIKE ? `;
    const term = `%${search.toLowerCase()}%`;
    params.push(term, term);
  }

  query += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ? `;
  params.push(limit, offset);

  const rows = db.prepare(query).all(...params);
  return rows;
}

function getStudentDetailForAdmin(studentId) {
  const user = getUserById(studentId);
  if (!user) return null;

  const progress = getUserProgress(studentId);
  const cardsList = db.prepare(`
    SELECT card_id, stage, streak, correct, wrong, next_due, updated_at
    FROM user_srs_cards
    WHERE user_id = ?
    ORDER BY wrong DESC, stage ASC
  `).all(studentId) || [];

  return {
    student: user,
    progress,
    cardsList
  };
}

function updateUserRole(userId, newRole) {
  if (!['student', 'admin'].includes(newRole)) throw new Error('Role tidak valid');
  db.prepare('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newRole, userId);
  return getUserById(userId);
}

function toggleUserActive(userId, isActive) {
  db.prepare('UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(isActive ? 1 : 0, userId);
  return getUserById(userId);
}

function manualVerifyUser(userId) {
  db.prepare('UPDATE users SET is_verified = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(userId);
  db.prepare('DELETE FROM verification_tokens WHERE user_id = ?').run(userId);
  return getUserById(userId);
}

module.exports = {
  db,
  createUser,
  getUserById,
  getUserByEmail,
  getUserByNickname,
  getUserByIdentifier,
  createVerificationToken,
  getVerificationToken,
  setPasswordAndActivate,
  authenticateUser,
  createSession,
  getSessionUser,
  deleteSession,
  getUserProgress,
  saveUserProgress,
  getLeaderboard,
  getAdminOverview,
  getAdminStudentsList,
  getStudentDetailForAdmin,
  updateUserRole,
  toggleUserActive,
  manualVerifyUser,
  hashPassword,
  verifyPassword
};
