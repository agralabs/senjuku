// KiraKira Nihongo - Database Layer using Node.js v24 native node:sqlite
// Zero-dependency SQLite integration with WAL mode and ACID compliance
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MASTER_DRILL_ITEMS } from '../data/kanji-vocabulary.js';
import { CLOZE_SENTENCE_ITEMS } from '../data/cloze-sentences.js';
import { SENTENCE_ROMAJI_ITEMS } from '../data/sentence-romaji.js';

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOTAL_LESSONS = 25;
const MAX_TOTAL_SCORE = TOTAL_LESSONS * 100;
const CLOZE_WEIGHT = 2.0;

// Pre-index question banks by lesson (1..25) once for fast, authoritative total score computation
const LESSON_BANKS = Array.from({ length: TOTAL_LESSONS }, (_, idx) => {
  const num = idx + 1;
  const vocabIds = (MASTER_DRILL_ITEMS || []).filter(it => it.lesson === num).map(it => it.id);
  const sentenceIds = (SENTENCE_ROMAJI_ITEMS || []).filter(it => it.lesson === num).map(it => it.id);
  const clozeIds = (CLOZE_SENTENCE_ITEMS || []).filter(it => it.lesson === num).map(it => it.id);
  const maxWeight = (vocabIds.length * 1.0) + (sentenceIds.length * 1.0) + (clozeIds.length * CLOZE_WEIGHT);
  return { lesson: num, vocabIds, sentenceIds, clozeIds, maxWeight };
});

function resolveCardCoverageCredit(card) {
  if (!card) return 0;
  if (typeof card.coverage_credit === 'number' && !Number.isNaN(card.coverage_credit)) {
    return Math.max(0, Math.min(1, card.coverage_credit));
  }
  if (typeof card.coverageCredit === 'number' && !Number.isNaN(card.coverageCredit)) {
    return Math.max(0, Math.min(1, card.coverageCredit));
  }
  if ((Number(card.correct) || 0) > 0) return 1.0;
  // Historical Learning Mode rows created before coverage_credit existed have correct=0 & wrong=0
  if ((Number(card.wrong) || 0) === 0) return 0.1;
  return 0;
}

export function computeTotalScoreFromCards(cardsById) {
  let totalScore = 0;
  let clearedLessonsCount = 0;

  for (const bank of LESSON_BANKS) {
    if (bank.maxWeight <= 0) continue;

    let earnedWeight = 0;
    let clozeQuizCovered = 0;

    for (const id of bank.vocabIds) {
      earnedWeight += resolveCardCoverageCredit(cardsById[id]) * 1.0;
    }
    for (const id of bank.sentenceIds) {
      earnedWeight += resolveCardCoverageCredit(cardsById[id]) * 1.0;
    }
    for (const id of bank.clozeIds) {
      const credit = resolveCardCoverageCredit(cardsById[id]);
      earnedWeight += credit * CLOZE_WEIGHT;
      if (credit >= 1.0) clozeQuizCovered++;
    }

    const effectiveCredit = Math.round(earnedWeight * 100) / 100;
    const coverageRatio = Math.min(1, effectiveCredit / bank.maxWeight);
    const isClozeComplete = (bank.clozeIds.length === 0) || (clozeQuizCovered >= bank.clozeIds.length);
    const rawScore = Math.min(100, Math.round((coverageRatio / 0.8) * 100));
    const isFullScore = (coverageRatio >= 0.8) && isClozeComplete;
    const score = isFullScore ? 100 : (isClozeComplete ? rawScore : Math.min(89, rawScore));

    totalScore += score;
    if (isFullScore) clearedLessonsCount++;
  }

  return { totalScore, clearedLessonsCount, maxTotalScore: MAX_TOTAL_SCORE };
}

function computeUserTotalScoreFromDb(db, userId) {
  const rows = db.prepare(`
    SELECT card_id, correct, wrong, coverage_credit
    FROM user_srs_cards
    WHERE user_id = ?
  `).all(userId) || [];

  const cardsById = {};
  for (const r of rows) {
    cardsById[r.card_id] = r;
  }
  return computeTotalScoreFromCards(cardsById);
}

let _dbInstance = null;

export function getDb(customPath = null) {
  if (_dbInstance && !customPath) return _dbInstance;

  const defaultDbFile = fs.existsSync(path.resolve(APP_ROOT, 'data', 'senjuku.db'))
    ? 'senjuku.db'
    : (fs.existsSync(path.resolve(APP_ROOT, 'data', 'kirakira.db')) ? 'kirakira.db' : 'senjuku.db');
  const rawDbPath = customPath || (process.env.DB_PATH || '').trim() || path.resolve(APP_ROOT, 'data', defaultDbFile);
  const dbPath = rawDbPath === ':memory:' ? ':memory:' : path.resolve(APP_ROOT, rawDbPath);
  if (dbPath !== ':memory:') {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    console.log(`[Senjuku Nihongo] SQLite DB: ${dbPath}`);
  }

  const db = new DatabaseSync(dbPath);

  try {
    db.exec('PRAGMA journal_mode = WAL;');
    db.exec('PRAGMA foreign_keys = ON;');
  } catch (e) {
    console.warn('PRAGMA journal_mode notice:', e.message);
  }

  // Initialize all tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      nickname TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      role TEXT NOT NULL DEFAULT 'student' CHECK(role IN ('student', 'admin', 'member')),
      membership_tier TEXT NOT NULL DEFAULT 'free',
      avatar_emoji TEXT DEFAULT '🌸',
      bio TEXT DEFAULT '',
      is_verified INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      must_change_password INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS verification_tokens (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
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
      weekly_minutes REAL NOT NULL DEFAULT 0,
      total_score INTEGER NOT NULL DEFAULT 0,
      cleared_lessons_count INTEGER NOT NULL DEFAULT 0,
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
      coverage_credit REAL,
      learning_views INTEGER NOT NULL DEFAULT 0,
      next_due DATETIME,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, card_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS verification_email_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      sent_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS login_failures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_key TEXT NOT NULL,
      failed_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS login_lockouts (
      account_key TEXT PRIMARY KEY,
      locked_until INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS achievement_emails (
      user_id TEXT NOT NULL,
      event_key TEXT NOT NULL,
      sent_at INTEGER NOT NULL,
      PRIMARY KEY (user_id, event_key),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      event_type TEXT NOT NULL CHECK(event_type IN ('app_open', 'login', 'drill_complete')),
      occurred_at TEXT NOT NULL,
      local_hour INTEGER NOT NULL,
      local_dow INTEGER NOT NULL,
      timezone TEXT DEFAULT 'UTC',
      session_type TEXT,
      drill_mode TEXT,
      input_format TEXT,
      lessons_json TEXT,
      duration_sec INTEGER DEFAULT 0,
      cards_reviewed INTEGER DEFAULT 0,
      correct_count INTEGER DEFAULT 0,
      wrong_count INTEGER DEFAULT 0,
      xp_earned INTEGER DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ai_advisor_cache (
      user_id TEXT NOT NULL,
      locale TEXT NOT NULL DEFAULT 'id',
      data_fingerprint TEXT NOT NULL,
      advice_json TEXT NOT NULL,
      model TEXT NOT NULL,
      source TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (user_id, locale),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ai_advisor_daily_usage (
      user_id TEXT NOT NULL,
      usage_date TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (user_id, usage_date),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);
    CREATE INDEX IF NOT EXISTS idx_progress_xp ON user_progress(xp DESC);
    CREATE INDEX IF NOT EXISTS idx_srs_user ON user_srs_cards(user_id);
    CREATE INDEX IF NOT EXISTS idx_verif_email_logs ON verification_email_logs(email, sent_at);
    CREATE INDEX IF NOT EXISTS idx_login_failures_key ON login_failures(account_key, failed_at);
    CREATE INDEX IF NOT EXISTS idx_activity_user_time ON user_activity_logs(user_id, occurred_at DESC);
  `);

  // Auto-migrate any missing columns if table was created in an earlier version
  function ensureColumn(table, column, typeDef) {
    try {
      const cols = db.prepare(`PRAGMA table_info(${table})`).all();
      if (!cols.some(c => c.name === column)) {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${typeDef};`);
      }
    } catch (e) {
      console.warn(`[DB Migration] Failed to add column ${table}.${column}:`, e.message);
    }
  }
  ensureColumn('users', 'membership_tier', "TEXT NOT NULL DEFAULT 'free'");
  ensureColumn('users', 'avatar_emoji', "TEXT DEFAULT '🌸'");
  ensureColumn('users', 'bio', "TEXT DEFAULT ''");
  ensureColumn('users', 'is_active', "INTEGER NOT NULL DEFAULT 1");
  ensureColumn('users', 'must_change_password', "INTEGER NOT NULL DEFAULT 0");
  ensureColumn('user_progress', 'weekly_minutes', "REAL NOT NULL DEFAULT 0");
  ensureColumn('user_progress', 'total_score', "INTEGER NOT NULL DEFAULT 0");
  ensureColumn('user_progress', 'cleared_lessons_count', "INTEGER NOT NULL DEFAULT 0");
  ensureColumn('user_srs_cards', 'coverage_credit', "REAL");
  ensureColumn('user_srs_cards', 'learning_views', "INTEGER NOT NULL DEFAULT 0");

  // Backfill total_score for existing users who already have SRS cards in the DB
  try {
    const usersWithCards = db.prepare(`
      SELECT DISTINCT c.user_id
      FROM user_srs_cards c
      JOIN user_progress p ON p.user_id = c.user_id
      WHERE COALESCE(p.total_score, 0) = 0
    `).all() || [];
    if (usersWithCards.length > 0) {
      const updateStmt = db.prepare(`
        UPDATE user_progress
        SET total_score = ?, cleared_lessons_count = ?
        WHERE user_id = ?
      `);
      for (const row of usersWithCards) {
        const { totalScore, clearedLessonsCount } = computeUserTotalScoreFromDb(db, row.user_id);
        if (totalScore > 0 || clearedLessonsCount > 0) {
          updateStmt.run(totalScore, clearedLessonsCount, row.user_id);
        }
      }
    }
  } catch (e) {
    console.warn('[DB Migration] Backfill total_score notice:', e.message);
  }

  try {
    const sessionCols = db.prepare('PRAGMA table_info(sessions)').all();
    if (sessionCols.some(c => c.name === 'token') && !sessionCols.some(c => c.name === 'session_token')) {
      db.exec('ALTER TABLE sessions RENAME COLUMN token TO session_token;');
    }
  } catch (e) {}

  if (!customPath) {
    _dbInstance = db;
  }
  return db;
}

/**
 * Public Leaderboard (High-Level Only, Privacy-Guaranteed)
 * Strictly hides emails, card mistake lists, and detailed timestamps.
 */
export function getPublicLeaderboard(db, period = 'all', currentUserId = null, limit = 50) {
  // Query top students
  const rows = db.prepare(`
    SELECT 
      u.id,
      u.nickname,
      u.avatar_emoji,
      u.role,
      u.membership_tier,
      p.xp,
      p.level,
      p.streak_days,
      p.last_active_date,
      p.weekly_minutes,
      COALESCE(p.total_score, 0) AS total_score,
      COALESCE(p.cleared_lessons_count, 0) AS cleared_lessons_count,
      COALESCE(p.badges_json, '[]') AS badges_json,
      (SELECT COUNT(*) FROM user_srs_cards c WHERE c.user_id = u.id AND c.stage >= 3) AS mastered_cards
    FROM users u
    JOIN user_progress p ON u.id = p.user_id
    WHERE u.is_verified = 1 AND (u.is_active IS NULL OR u.is_active = 1)
    ORDER BY 
      CASE WHEN ? = 'week' THEN p.weekly_minutes ELSE COALESCE(p.total_score, 0) END DESC,
      p.xp DESC,
      p.streak_days DESC,
      mastered_cards DESC
    LIMIT ?
  `).all(period, limit);

  return rows.map((r, index) => {
    let badges = [];
    try { badges = JSON.parse(r.badges_json || '[]'); } catch {}
    return {
      rank: index + 1,
      id: r.id,
      nickname: r.nickname,
      avatarEmoji: r.avatar_emoji || '🌸',
      role: r.role === 'admin' ? 'admin' : 'student',
      membershipTier: r.membership_tier || 'free',
      level: Number(r.level) || 1,
      xp: Number(r.xp) || 0,
      totalScore: Number(r.total_score) || 0,
      maxTotalScore: MAX_TOTAL_SCORE,
      clearedLessonsCount: Number(r.cleared_lessons_count) || 0,
      streakDays: Number(r.streak_days) || 0,
      weeklyMinutes: Number((Number(r.weekly_minutes) || 0).toFixed(1)),
      masteredCardsCount: Number(r.mastered_cards) || 0,
      badges: Array.isArray(badges) ? badges : [],
      isCurrentUser: Boolean(currentUserId && currentUserId === r.id)
    };
  });
}

/**
 * Get User's Private Full Progress
 */
export function getUserPrivateProgress(db, userId) {
  const prog = db.prepare(`
    SELECT xp, level, streak_days, last_active_date, weekly_minutes, total_score, cleared_lessons_count, badges_json, history_json, updated_at
    FROM user_progress
    WHERE user_id = ?
  `).get(userId);

  const cardsRows = db.prepare(`
    SELECT card_id, stage, streak, correct, wrong, coverage_credit, learning_views, next_due
    FROM user_srs_cards
    WHERE user_id = ?
  `).all(userId) || [];

  const cardsMap = {};
  for (const c of cardsRows) {
    const coverageCredit = resolveCardCoverageCredit(c);
    cardsMap[c.card_id] = {
      stage: c.stage,
      streak: c.streak,
      correct: c.correct,
      wrong: c.wrong,
      coverageCredit,
      learningViews: Number(c.learning_views) || 0,
      nextDue: c.next_due
    };
  }

  let badges = [];
  let history = {};
  try { badges = JSON.parse(prog?.badges_json || '[]'); } catch {}
  try { history = JSON.parse(prog?.history_json || '{}'); } catch {}

  return {
    xp: prog ? Number(prog.xp) : 0,
    level: prog ? Number(prog.level) : 1,
    streakDays: prog ? Number(prog.streak_days) : 0,
    lastActiveDate: prog?.last_active_date || null,
    weeklyMinutes: prog ? Number((Number(prog.weekly_minutes) || 0).toFixed(1)) : 0,
    totalScore: prog ? Number(prog.total_score || 0) : 0,
    clearedLessonsCount: prog ? Number(prog.cleared_lessons_count || 0) : 0,
    badges,
    history,
    cards: cardsMap,
    updatedAt: prog?.updated_at || null
  };
}

/**
 * Synchronize User Progress from Client to Cloud Database
 */
export function syncUserProgress(db, userId, payload = {}, mode = 'merge') {
  const current = getUserPrivateProgress(db, userId);

  let nextXp = Number(payload.xp ?? current.xp);
  let nextLevel = Number(payload.level ?? current.level);
  let nextStreak = Number(payload.streakDays ?? current.streakDays);
  let nextLastActive = payload.lastActiveDate || current.lastActiveDate;
  let nextWeeklyMinutes = Number(payload.weeklyMinutes ?? current.weeklyMinutes);

  if (mode === 'merge') {
    nextXp = Math.max(current.xp, nextXp);
    nextLevel = Math.max(current.level, nextLevel);
    nextStreak = Math.max(current.streakDays, nextStreak);
  }

  // Merge Badges
  const badgesSet = new Set([...current.badges, ...(payload.badges || [])]);
  const nextBadges = Array.from(badgesSet);

  // Merge History
  const nextHistory = { ...current.history };
  if (payload.history && typeof payload.history === 'object') {
    for (const [dateKey, entry] of Object.entries(payload.history)) {
      if (!nextHistory[dateKey]) {
        nextHistory[dateKey] = entry;
      } else {
        nextHistory[dateKey] = {
          seconds: Math.max(nextHistory[dateKey].seconds || 0, entry.seconds || 0),
          cards: Math.max(nextHistory[dateKey].cards || 0, entry.cards || 0),
          correct: Math.max(nextHistory[dateKey].correct || 0, entry.correct || 0),
          wrong: Math.max(nextHistory[dateKey].wrong || 0, entry.wrong || 0),
          xp: Math.max(nextHistory[dateKey].xp || 0, entry.xp || 0),
          learningCards: Math.max(nextHistory[dateKey].learningCards || 0, entry.learningCards || 0)
        };
      }
    }
  }

  // Calculate weekly minutes from last 7 days of history
  const today = new Date();
  let calculatedWeeklyMinutes = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (nextHistory[key]?.seconds) {
      calculatedWeeklyMinutes += nextHistory[key].seconds / 60;
    }
  }
  nextWeeklyMinutes = Math.max(nextWeeklyMinutes, Math.round(calculatedWeeklyMinutes * 10) / 10);

  // Merge SRS Cards first so we can compute authoritative total_score from persisted cards
  if (payload.cards && typeof payload.cards === 'object') {
    const cardStmt = db.prepare(`
      INSERT INTO user_srs_cards (user_id, card_id, stage, streak, correct, wrong, coverage_credit, learning_views, next_due, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(user_id, card_id) DO UPDATE SET
        stage = excluded.stage,
        streak = excluded.streak,
        correct = excluded.correct,
        wrong = excluded.wrong,
        coverage_credit = CASE
          WHEN ? = 'merge' THEN MAX(COALESCE(user_srs_cards.coverage_credit, 0), COALESCE(excluded.coverage_credit, 0))
          ELSE excluded.coverage_credit
        END,
        learning_views = CASE
          WHEN ? = 'merge' THEN MAX(COALESCE(user_srs_cards.learning_views, 0), COALESCE(excluded.learning_views, 0))
          ELSE excluded.learning_views
        END,
        next_due = excluded.next_due,
        updated_at = datetime('now')
    `);

    for (const [cardId, card] of Object.entries(payload.cards)) {
      if (!cardId || typeof card !== 'object') continue;
      const correctVal = Number(card.correct) || 0;
      const wrongVal = Number(card.wrong) || 0;
      const creditVal = typeof card.coverageCredit === 'number' && !Number.isNaN(card.coverageCredit)
        ? Math.max(0, Math.min(1, card.coverageCredit))
        : (correctVal > 0 ? 1.0 : (wrongVal === 0 ? 0.1 : 0));
      cardStmt.run(
        userId,
        cardId,
        Number(card.stage) || 0,
        Number(card.streak) || 0,
        correctVal,
        wrongVal,
        creditVal,
        Number(card.learningViews) || 0,
        card.nextDue || null,
        mode,
        mode
      );
    }
  }

  // Compute authoritative total_score and cleared_lessons_count from persisted SRS cards
  const computed = computeUserTotalScoreFromDb(db, userId);
  let nextTotalScore = computed.totalScore;
  const nextClearedLessons = computed.clearedLessonsCount;
  if (nextTotalScore === 0 && typeof payload.totalScore === 'number' && payload.totalScore > 0) {
    nextTotalScore = Math.min(MAX_TOTAL_SCORE, Math.round(payload.totalScore));
  }

  // Upsert user_progress
  db.prepare(`
    INSERT INTO user_progress (user_id, xp, level, streak_days, last_active_date, weekly_minutes, total_score, cleared_lessons_count, badges_json, history_json, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(user_id) DO UPDATE SET
      xp = excluded.xp,
      level = excluded.level,
      streak_days = excluded.streak_days,
      last_active_date = excluded.last_active_date,
      weekly_minutes = excluded.weekly_minutes,
      total_score = excluded.total_score,
      cleared_lessons_count = excluded.cleared_lessons_count,
      badges_json = excluded.badges_json,
      history_json = excluded.history_json,
      updated_at = datetime('now')
  `).run(
    userId,
    nextXp,
    nextLevel,
    nextStreak,
    nextLastActive,
    nextWeeklyMinutes,
    nextTotalScore,
    nextClearedLessons,
    JSON.stringify(nextBadges),
    JSON.stringify(nextHistory)
  );

  return getUserPrivateProgress(db, userId);
}

// --- Admin Features ---
export function getAdminOverview(db) {
  const totalStudents = db.prepare("SELECT COUNT(*) as count FROM users WHERE role IN ('student', 'member')").get()?.count || 0;
  const verifiedStudents = db.prepare("SELECT COUNT(*) as count FROM users WHERE role IN ('student', 'member') AND is_verified = 1").get()?.count || 0;
  const pendingStudents = db.prepare("SELECT COUNT(*) as count FROM users WHERE is_verified = 0").get()?.count || 0;
  const totalXp = db.prepare("SELECT SUM(xp) as total FROM user_progress").get()?.total || 0;

  const today = new Date().toISOString().slice(0, 10);
  const activeToday = db.prepare("SELECT COUNT(*) as count FROM user_progress WHERE last_active_date = ?").get(today)?.count || 0;

  const topStrugglingCards = db.prepare(`
    SELECT card_id, SUM(wrong) as total_wrong, SUM(correct) as total_correct, COUNT(DISTINCT user_id) as student_count
    FROM user_srs_cards
    WHERE wrong > 0
    GROUP BY card_id
    ORDER BY total_wrong DESC
    LIMIT 8
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

export function getAdminStudentsList(db, { search = '', limit = 50, offset = 0 } = {}) {
  let query = `
    SELECT 
      u.id, u.email, u.nickname, u.role, u.membership_tier, u.avatar_emoji, u.is_verified, u.is_active, u.created_at,
      p.xp, p.level, p.streak_days, p.last_active_date, p.weekly_minutes,
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

  return db.prepare(query).all(...params);
}

export function getStudentDetailForAdmin(db, studentId) {
  const user = db.prepare('SELECT id, email, nickname, role, membership_tier, avatar_emoji, bio, is_verified, is_active, created_at FROM users WHERE id = ?').get(studentId);
  if (!user) return null;

  const progress = getUserPrivateProgress(db, studentId);
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

// --- Activity Logging & AI Advisor Cache Helpers ---

const ALLOWED_ACTIVITY_EVENTS = new Set(['app_open', 'login', 'drill_complete']);
const ALLOWED_SESSION_TYPES = new Set(['quiz', 'learning']);
const ALLOWED_INPUT_FORMATS = new Set(['mcq', 'typing', 'booster']);

function parseStrictSmallInt(raw) {
  if (typeof raw === 'number') {
    return Number.isInteger(raw) ? raw : NaN;
  }
  if (typeof raw === 'string' && /^\d{1,2}$/.test(raw.trim())) {
    return Number(raw.trim());
  }
  return NaN;
}

export function normalizeClientTiming(input = {}, fallbackNow = new Date()) {
  const now = fallbackNow instanceof Date ? fallbackNow : new Date();
  let localHour = parseStrictSmallInt(input?.localHour);
  if (!Number.isInteger(localHour) || localHour < 0 || localHour > 23) {
    localHour = now.getUTCHours();
  }
  let localDow = parseStrictSmallInt(input?.localDow);
  if (!Number.isInteger(localDow) || localDow < 0 || localDow > 6) {
    localDow = now.getUTCDay();
  }
  let timezone = typeof input?.timezone === 'string' ? input.timezone.trim() : '';
  if (!timezone || timezone.length > 64 || !/^[A-Za-z0-9_\/+\-]+$/.test(timezone)) {
    timezone = 'UTC';
  }
  return { localHour, localDow, timezone };
}

function clampNonNegInt(val, max = 1000000) {
  const n = Math.floor(Number(val));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, max);
}

export function insertActivityLog(db, entry = {}) {
  const userId = String(entry.userId || '').trim();
  const eventType = String(entry.eventType || '').trim();
  if (!userId || !ALLOWED_ACTIVITY_EVENTS.has(eventType)) {
    throw new Error('Invalid activity log userId or eventType');
  }

  const now = entry.occurredAt ? new Date(entry.occurredAt) : new Date();
  const occurredAt = Number.isNaN(now.getTime()) ? new Date().toISOString() : now.toISOString();
  const { localHour, localDow, timezone } = normalizeClientTiming(entry, now);

  const sessionType = ALLOWED_SESSION_TYPES.has(entry.sessionType) ? entry.sessionType : null;
  const rawMode = typeof entry.drillMode === 'string' ? entry.drillMode.trim().slice(0, 48) : '';
  const drillMode = rawMode && /^[a-z0-9_\-]+$/i.test(rawMode) ? rawMode : null;
  const inputFormat = ALLOWED_INPUT_FORMATS.has(entry.inputFormat) ? entry.inputFormat : null;

  let lessonsJson = null;
  if (Array.isArray(entry.lessons)) {
    const cleaned = entry.lessons
      .slice(0, 30)
      .map(v => (v === 'all' ? 'all' : Number(v)))
      .filter(v => v === 'all' || (Number.isInteger(v) && v >= 1 && v <= 25));
    lessonsJson = JSON.stringify(cleaned);
  } else if (typeof entry.lessonsJson === 'string' && entry.lessonsJson.length <= 256) {
    lessonsJson = entry.lessonsJson;
  }

  const durationSec = clampNonNegInt(entry.durationSec, 86400);
  const cardsReviewed = clampNonNegInt(entry.cardsReviewed, 5000);
  const correctCount = clampNonNegInt(entry.correctCount, 5000);
  const wrongCount = clampNonNegInt(entry.wrongCount, 5000);
  const xpEarned = clampNonNegInt(entry.xpEarned, 100000);

  const result = db.prepare(`
    INSERT INTO user_activity_logs (
      user_id, event_type, occurred_at, local_hour, local_dow, timezone,
      session_type, drill_mode, input_format, lessons_json,
      duration_sec, cards_reviewed, correct_count, wrong_count, xp_earned
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    eventType,
    occurredAt,
    localHour,
    localDow,
    timezone,
    sessionType,
    drillMode,
    inputFormat,
    lessonsJson,
    durationSec,
    cardsReviewed,
    correctCount,
    wrongCount,
    xpEarned
  );

  return {
    id: Number(result.lastInsertRowid),
    userId,
    eventType,
    occurredAt,
    localHour,
    localDow,
    timezone
  };
}

export function getRecentActivityLogs(db, userId, days = 30, limit = 500) {
  const cutoff = new Date(Date.now() - Math.max(1, Number(days) || 30) * 24 * 60 * 60 * 1000).toISOString();
  return db.prepare(`
    SELECT
      id, event_type, occurred_at, local_hour, local_dow, timezone,
      session_type, drill_mode, input_format, lessons_json,
      duration_sec, cards_reviewed, correct_count, wrong_count, xp_earned
    FROM user_activity_logs
    WHERE user_id = ? AND occurred_at >= ?
    ORDER BY occurred_at DESC
    LIMIT ?
  `).all(userId, cutoff, limit) || [];
}

export function getUserSrsCards(db, userId) {
  return db.prepare(`
    SELECT card_id, stage, streak, correct, wrong, next_due, updated_at
    FROM user_srs_cards
    WHERE user_id = ?
  `).all(userId) || [];
}

export function getAdvisorCache(db, userId, locale = 'id') {
  const normLocale = locale === 'en' ? 'en' : 'id';
  return db.prepare(`
    SELECT user_id, locale, data_fingerprint, advice_json, model, source, created_at
    FROM ai_advisor_cache
    WHERE user_id = ? AND locale = ?
  `).get(userId, normLocale) || null;
}

export function upsertAdvisorCache(db, { userId, locale = 'id', dataFingerprint, adviceJson, model, source, createdAt }) {
  const normLocale = locale === 'en' ? 'en' : 'id';
  const ts = createdAt || new Date().toISOString();
  const payloadStr = typeof adviceJson === 'string' ? adviceJson : JSON.stringify(adviceJson);
  db.prepare(`
    INSERT INTO ai_advisor_cache (user_id, locale, data_fingerprint, advice_json, model, source, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, locale) DO UPDATE SET
      data_fingerprint = excluded.data_fingerprint,
      advice_json = excluded.advice_json,
      model = excluded.model,
      source = excluded.source,
      created_at = excluded.created_at
  `).run(userId, normLocale, dataFingerprint, payloadStr, model, source, ts);
}

export function getAdvisorDailyUsage(db, userId, usageDate) {
  const row = db.prepare(`
    SELECT count FROM ai_advisor_daily_usage
    WHERE user_id = ? AND usage_date = ?
  `).get(userId, usageDate);
  return row ? Number(row.count) || 0 : 0;
}

export function incrementAdvisorDailyUsage(db, userId, usageDate, nowIso) {
  const ts = nowIso || new Date().toISOString();
  db.prepare(`
    INSERT INTO ai_advisor_daily_usage (user_id, usage_date, count, updated_at)
    VALUES (?, ?, 1, ?)
    ON CONFLICT(user_id, usage_date) DO UPDATE SET
      count = count + 1,
      updated_at = excluded.updated_at
  `).run(userId, usageDate, ts);
  return getAdvisorDailyUsage(db, userId, usageDate);
}
