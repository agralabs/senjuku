// Senjuku Nihongo - Standalone Default Admin Bootstrap Module
// Automatically seeds a ready-to-use Admin (Sensei) account on fresh installations
// (Local Machine, VM, Docker, or Cloud Run) with zero SMTP dependency.

import crypto from 'node:crypto';
import { hashPassword } from './auth.js';

const DEFAULT_ADMIN_EMAIL = 'admin@senjuku.local';
const DEFAULT_ADMIN_NICKNAME = 'SenseiAdmin';
const DEFAULT_ADMIN_PASSWORD = 'AdminSenjuku123!';

/**
 * Idempotently creates a default admin account if no admin user exists yet.
 * Controlled via environment variables:
 *   - DISABLE_ADMIN_AUTO_SEED=1      : disables automatic seeding
 *   - ADMIN_DEFAULT_EMAIL            : custom admin email (default: admin@senjuku.local)
 *   - ADMIN_DEFAULT_NICKNAME         : custom admin nickname (default: SenseiAdmin)
 *   - ADMIN_DEFAULT_PASSWORD         : custom admin password (default: AdminSenjuku123!)
 *   - ADMIN_FORCE_CHANGE_PASSWORD    : '1' to force change on first login, '0' to disable
 *                                      (defaults to '1' when using fallback password, '0' when custom)
 */
export function bootstrapDefaultAdmin(db) {
  if (String(process.env.DISABLE_ADMIN_AUTO_SEED || '').trim() === '1') {
    return null;
  }

  const adminRow = db.prepare("SELECT COUNT(*) AS cnt FROM users WHERE role = 'admin'").get();
  if (adminRow && adminRow.cnt > 0) {
    return null;
  }

  const email = (process.env.ADMIN_DEFAULT_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
  const nickname = (process.env.ADMIN_DEFAULT_NICKNAME || DEFAULT_ADMIN_NICKNAME).trim();
  const customPassword = (process.env.ADMIN_DEFAULT_PASSWORD || '').trim();
  const usedFallbackPassword = !customPassword;
  const rawPassword = usedFallbackPassword ? DEFAULT_ADMIN_PASSWORD : customPassword;

  const forceEnv = String(process.env.ADMIN_FORCE_CHANGE_PASSWORD ?? '').trim();
  const mustChangePassword = forceEnv === '1'
    ? 1
    : (forceEnv === '0' ? 0 : (usedFallbackPassword ? 1 : 0));

  const existing = db.prepare('SELECT id, email, nickname FROM users WHERE email = ? OR nickname = ?').get(email, nickname);
  if (existing) {
    db.prepare(`
      UPDATE users
      SET role = 'admin',
          is_verified = 1,
          is_active = 1,
          must_change_password = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `).run(mustChangePassword, existing.id);

    return {
      email: existing.email,
      nickname: existing.nickname,
      isNew: false,
      usedFallbackPassword,
      mustChangePassword: Boolean(mustChangePassword)
    };
  }

  const userId = crypto.randomUUID();
  const passwordHash = hashPassword(rawPassword);

  db.exec('BEGIN');
  try {
    db.prepare(`
      INSERT INTO users (
        id, email, nickname, password_hash, role, membership_tier,
        is_verified, is_active, must_change_password
      )
      VALUES (?, ?, ?, ?, 'admin', 'pro', 1, 1, ?)
    `).run(userId, email, nickname, passwordHash, mustChangePassword);

    db.prepare(`
      INSERT OR IGNORE INTO user_progress (user_id, xp, level)
      VALUES (?, 0, 1)
    `).run(userId);
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  return {
    email,
    nickname,
    rawPassword: usedFallbackPassword ? rawPassword : null,
    isNew: true,
    usedFallbackPassword,
    mustChangePassword: Boolean(mustChangePassword)
  };
}

/**
 * Prints an informative startup banner when a new default admin account is created.
 * Never logs custom passwords supplied via ADMIN_DEFAULT_PASSWORD.
 */
export function printAdminBootstrapBanner(result) {
  if (!result || !result.isNew) return;

  const passwordDisplay = result.usedFallbackPassword
    ? result.rawPassword
    : '(disetel via ADMIN_DEFAULT_PASSWORD)';

  console.log('');
  console.log('==================================================================');
  console.log('🌸 Senjuku Nihongo - Instalasi Baru Terdeteksi');
  console.log('==================================================================');
  console.log('Akun Administrator Bawaan telah dibuat otomatis:');
  console.log(`  Email       : ${result.email}`);
  console.log(`  Nickname    : ${result.nickname}`);
  console.log(`  Kata Sandi  : ${passwordDisplay}`);
  console.log('  Peran       : Admin (Sensei)');
  console.log('------------------------------------------------------------------');
  if (result.mustChangePassword) {
    console.log('[KEAMANAN] Silakan login dan ubah kata sandi ini di menu Profil!');
  } else {
    console.log('[INFO] Akun admin siap digunakan.');
  }
  console.log('==================================================================');
  console.log('');
}
