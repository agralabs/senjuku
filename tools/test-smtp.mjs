// tools/test-smtp.mjs
// Diagnostic CLI to verify .env loading & SMTP delivery (supports Port 465 SSL/TLS and Port 587 STARTTLS)
// Usage: node tools/test-smtp.mjs <recipient-email>

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSmtpConfig, sendSmtpEmail } from '../server/mailer.js';

const BASE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(BASE_DIR, '.env');

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIdx = line.indexOf('=');
    if (eqIdx <= 0) continue;
    const key = line.slice(0, eqIdx).trim();
    let val = line.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key && process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
  console.log(`📄 Loaded .env from: ${envPath}`);
} else {
  console.log(`⚠️  No .env file found at ${envPath} (relying on process.env)`);
}

const cfg = getSmtpConfig();
console.log('🔧 Resolved SMTP Config:', {
  host: cfg.host || '(EMPTY!)',
  port: cfg.port,
  mode: cfg.secure ? 'Implicit SSL/TLS' : 'STARTTLS',
  rejectUnauthorized: cfg.rejectUnauthorized,
  user: cfg.auth.user || '(EMPTY!)',
  passSet: Boolean(cfg.auth.pass),
  fromEmail: cfg.fromEmail || '(EMPTY!)'
});

const recipient = process.argv[2] || cfg.fromEmail;
if (!recipient) {
  console.error('❌ Please provide a recipient email: node tools/test-smtp.mjs user@example.com');
  process.exit(1);
}

console.log(`📨 Sending test email to <${recipient}>...`);
try {
  const result = await sendSmtpEmail({
    to: recipient,
    subject: '✅ Tes SMTP Senjuku Nihongo Berhasil',
    text: `Halo! Ini adalah email tes dari Senjuku Nihongo.\n\nHost: ${cfg.host}:${cfg.port} (${cfg.secure ? 'SSL/TLS' : 'STARTTLS'})`,
    html: `<p>Halo! Ini adalah email tes dari <strong>Senjuku Nihongo</strong>.</p><p>Host: <code>${cfg.host}:${cfg.port}</code> (${cfg.secure ? 'SSL/TLS' : 'STARTTLS'})</p>`
  });
  console.log('✅ Email sent successfully!', result);
} catch (err) {
  console.error('❌ SMTP delivery failed:', err.message);
  process.exit(1);
}
