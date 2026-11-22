// tools/reset-password.mjs
// Quick admin password reset CLI utility for Senjuku Nihongo

import { getDb } from '../server/db.js';
import { hashPassword } from '../server/auth.js';

const identifier = process.argv[2] || 'choirul@gmail.com';
const newPassword = process.argv[3] || 'Senjuku123!';

const db = getDb();
const user = db.prepare('SELECT id, email, nickname, role FROM users WHERE email = ? OR nickname = ?').get(identifier, identifier);

if (!user) {
  console.error(`❌ User '${identifier}' tidak ditemukan di database.`);
  process.exit(1);
}

const hash = hashPassword(newPassword);
db.prepare("UPDATE users SET password_hash = ?, is_verified = 1, is_active = 1, updated_at = datetime('now') WHERE id = ?").run(hash, user.id);

console.log(`✅ Password untuk akun ${user.nickname} (${user.email}) [Role: ${user.role}] berhasil di-reset!`);
console.log(`🔑 Password Baru: ${newPassword}`);
