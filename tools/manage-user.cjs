#!/usr/bin/env node
// CLI utility to manage KiraKira Nihongo users and roles
const db = require('../server/db.cjs');

const [,, cmd, arg1, arg2] = process.argv;

function printUsage() {
  console.log(`
KiraKira Nihongo User Management CLI
Usage:
  node tools/manage-user.cjs list                       - List all registered users
  node tools/manage-user.cjs set-admin <email/nickname> - Promote user to Admin (Sensei)
  node tools/manage-user.cjs set-student <email/nick>  - Demote user to Student
  node tools/manage-user.cjs verify <email/nickname>   - Manually verify and activate user
  node tools/manage-user.cjs toggle <email/nickname>   - Toggle user active status
  node tools/manage-user.cjs create-admin <email> <nickname> <password> - Create active admin directly
  `);
}

if (!cmd) {
  printUsage();
  process.exit(0);
}

switch (cmd) {
  case 'list': {
    const users = db.getAdminStudentsList({ limit: 100 });
    console.table(users.map(u => ({
      ID: u.id.slice(0, 8) + '...',
      Email: u.email,
      Nickname: u.nickname,
      Role: u.role,
      Verified: u.is_verified ? 'YES' : 'NO',
      Active: u.is_active ? 'YES' : 'NO',
      Level: u.level || 1,
      XP: u.xp || 0,
      Streak: u.streak_days || 0
    })));
    break;
  }

  case 'set-admin': {
    if (!arg1) { console.error('Please specify email or nickname'); process.exit(1); }
    const u = db.getUserByIdentifier(arg1);
    if (!u) { console.error('User not found:', arg1); process.exit(1); }
    db.updateUserRole(u.id, 'admin');
    console.log(`Successfully promoted ${u.nickname} (${u.email}) to ADMIN (Sensei)!`);
    break;
  }

  case 'set-student': {
    if (!arg1) { console.error('Please specify email or nickname'); process.exit(1); }
    const u = db.getUserByIdentifier(arg1);
    if (!u) { console.error('User not found:', arg1); process.exit(1); }
    db.updateUserRole(u.id, 'student');
    console.log(`Successfully changed ${u.nickname} (${u.email}) role to STUDENT.`);
    break;
  }

  case 'verify': {
    if (!arg1) { console.error('Please specify email or nickname'); process.exit(1); }
    const u = db.getUserByIdentifier(arg1);
    if (!u) { console.error('User not found:', arg1); process.exit(1); }
    db.manualVerifyUser(u.id);
    console.log(`User ${u.nickname} (${u.email}) is now VERIFIED.`);
    break;
  }

  case 'set-password': {
    if (!arg1 || !arg2) { console.error('Usage: node tools/manage-user.cjs set-password <email/nickname> <newPassword>'); process.exit(1); }
    const u = db.getUserByIdentifier(arg1);
    if (!u) { console.error('User not found:', arg1); process.exit(1); }
    const { hash, salt } = db.hashPassword(arg2);
    const combinedHash = `${salt}:${hash}`;
    db.db.prepare('UPDATE users SET password_hash = ?, is_verified = 1 WHERE id = ?').run(combinedHash, u.id);
    console.log(`Password updated successfully for ${u.nickname} (${u.email})!`);
    break;
  }

  case 'create-admin': {
    const email = arg1;
    const nickname = arg2;
    const password = process.argv[5];
    if (!email || !nickname || !password) {
      console.error('Usage: node tools/manage-user.cjs create-admin <email> <nickname> <password>');
      process.exit(1);
    }
    const existing = db.getUserByEmail(email) || db.getUserByNickname(nickname);
    if (existing) {
      console.error('User already exists with that email or nickname.');
      process.exit(1);
    }
    const user = db.createUser({ email, nickname, role: 'admin' });
    const { hash, salt } = db.hashPassword(password);
    const combinedHash = `${salt}:${hash}`;
    db.db.prepare('UPDATE users SET password_hash = ?, is_verified = 1 WHERE id = ?').run(combinedHash, user.id);
    console.log(`Admin account created successfully for ${nickname} (${email})!`);
    break;
  }

  default:
    printUsage();
}
