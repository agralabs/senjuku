// Senjuku Nihongo - Zero-Dependency TLS/STARTTLS SMTP Mailer (node:tls + node:net)
// Supports both Implicit SSL/TLS (port 465) and STARTTLS (port 587 / 2525 / 25)
// Reads SMTP_* environment variables dynamically at send time so .env loaders work reliably with ESM.

import net from 'node:net';
import tls from 'node:tls';

export function getSmtpConfig() {
  const host = (process.env.SMTP_HOST || '').trim();
  const port = parseInt(process.env.SMTP_PORT || '465', 10) || 465;
  const secureEnv = (process.env.SMTP_SECURE || '').trim().toLowerCase();
  const secure = secureEnv === 'true' ? true : (secureEnv === 'false' ? false : port === 465);
  const rejectUnauthorized = (process.env.SMTP_TLS_REJECT_UNAUTHORIZED || 'true').trim().toLowerCase() !== 'false';
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();
  const fromName = (process.env.SMTP_FROM_NAME || 'Senjuku Nihongo').trim();
  const fromEmail = (process.env.SMTP_FROM || user).trim();

  return {
    host,
    port,
    secure,
    rejectUnauthorized,
    auth: { user, pass },
    fromName,
    fromEmail
  };
}

// Backwards-compatible dynamic getter object
export const SMTP_CONFIG = {
  get host() { return getSmtpConfig().host; },
  get port() { return getSmtpConfig().port; },
  get secure() { return getSmtpConfig().secure; },
  get auth() { return getSmtpConfig().auth; },
  get fromName() { return getSmtpConfig().fromName; },
  get fromEmail() { return getSmtpConfig().fromEmail; }
};

function encodeBase64(str) {
  return Buffer.from(str, 'utf8').toString('base64');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildMimeMessage({ fromName, fromEmail, to, subject, text, html }) {
  const boundary = '----=_Senjuku_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2);
  const encodedSubject = `=?UTF-8?B?${encodeBase64(subject)}?=`;
  const dateHeader = new Date().toUTCString();

  const lines = [
    `From: "${fromName}" <${fromEmail}>`,
    `To: <${to}>`,
    `Subject: ${encodedSubject}`,
    `Date: ${dateHeader}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Content-Transfer-Encoding: base64`,
    ``,
    encodeBase64(text).replace(/(.{76})/g, '$1\r\n'),
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: base64`,
    ``,
    encodeBase64(html).replace(/(.{76})/g, '$1\r\n'),
    ``,
    `--${boundary}--`,
    ``
  ];

  // Dot-stuffing per RFC 5321
  return lines.join('\r\n').replace(/^\./gm, '..');
}

export function sendSmtpEmail({ to, subject, text, html }, customConfig = null) {
  const config = customConfig || getSmtpConfig();

  if (!config.host) {
    return Promise.reject(new Error('SMTP_HOST belum dikonfigurasi di .env atau environment server.'));
  }
  if (!config.auth?.user || !config.auth?.pass) {
    return Promise.reject(new Error('SMTP_USER atau SMTP_PASS belum dikonfigurasi di .env atau environment server.'));
  }
  if (!config.fromEmail) {
    return Promise.reject(new Error('SMTP_FROM / SMTP_USER kosong sehingga alamat pengirim tidak valid.'));
  }

  return new Promise((resolve, reject) => {
    const ehloDomain = (config.fromEmail.includes('@') ? config.fromEmail.split('@')[1] : '') || config.host || 'localhost';
    const useImplicitTls = config.secure !== false;
    const rejectUnauthorized = config.rejectUnauthorized !== false;

    let socket = useImplicitTls
      ? tls.connect({
          host: config.host,
          port: config.port,
          servername: config.host,
          rejectUnauthorized
        })
      : net.connect({
          host: config.host,
          port: config.port
        });

    let buffer = '';
    let step = 0;
    let settled = false;

    const finish = (err, info) => {
      if (settled) return;
      settled = true;
      try { socket.end(); } catch {}
      if (err) reject(err);
      else resolve(info);
    };

    const sendLine = (line) => {
      socket.write(line + '\r\n');
    };

    const mimeBody = buildMimeMessage({
      fromName: config.fromName,
      fromEmail: config.fromEmail,
      to,
      subject,
      text,
      html
    });

    const upgradeToStartTls = () => {
      const rawSocket = socket;
      rawSocket.removeAllListeners('data');
      rawSocket.removeAllListeners('error');
      rawSocket.removeAllListeners('timeout');
      rawSocket.removeAllListeners('close');

      const tlsSocket = tls.connect({
        socket: rawSocket,
        servername: config.host,
        rejectUnauthorized
      });

      socket = tlsSocket;
      buffer = '';
      attachSocketHandlers(tlsSocket);

      tlsSocket.once('secureConnect', () => {
        sendLine(`EHLO ${ehloDomain}`);
      });
    };

    // Build command sequence depending on Implicit TLS (465) vs STARTTLS (587)
    const commands = useImplicitTls
      ? [
          () => sendLine(`EHLO ${ehloDomain}`),
          () => sendLine(`AUTH LOGIN`),
          () => sendLine(encodeBase64(config.auth.user)),
          () => sendLine(encodeBase64(config.auth.pass)),
          () => sendLine(`MAIL FROM:<${config.fromEmail}>`),
          () => sendLine(`RCPT TO:<${to}>`),
          () => sendLine(`DATA`),
          () => socket.write(mimeBody + '\r\n.\r\n'),
          () => sendLine(`QUIT`)
        ]
      : [
          () => sendLine(`EHLO ${ehloDomain}`),
          () => sendLine(`STARTTLS`),
          () => upgradeToStartTls(),
          () => sendLine(`AUTH LOGIN`),
          () => sendLine(encodeBase64(config.auth.user)),
          () => sendLine(encodeBase64(config.auth.pass)),
          () => sendLine(`MAIL FROM:<${config.fromEmail}>`),
          () => sendLine(`RCPT TO:<${to}>`),
          () => sendLine(`DATA`),
          () => socket.write(mimeBody + '\r\n.\r\n'),
          () => sendLine(`QUIT`)
        ];

    const expectedCodes = useImplicitTls
      ? [
          220, // Server greeting
          250, // EHLO
          334, // AUTH LOGIN prompt username
          334, // AUTH LOGIN prompt password
          235, // Auth success
          250, // MAIL FROM
          250, // RCPT TO
          354, // DATA ready
          250, // Message accepted
          221  // QUIT bye
        ]
      : [
          220, // Server greeting
          250, // Initial EHLO
          220, // Ready to start TLS
          250, // Post-STARTTLS EHLO
          334, // AUTH LOGIN prompt username
          334, // AUTH LOGIN prompt password
          235, // Auth success
          250, // MAIL FROM
          250, // RCPT TO
          354, // DATA ready
          250, // Message accepted
          221  // QUIT bye
        ];

    const attachSocketHandlers = (sock) => {
      sock.setTimeout(15000);

      sock.on('data', (chunk) => {
        buffer += chunk.toString('utf8');
        const lines = buffer.split('\r\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line) continue;
          // Multi-line SMTP response has hyphen after 3-digit code (e.g., 250-PIPELINING)
          if (/^\d{3}-/.test(line)) continue;

          const match = line.match(/^(\d{3})[\s]?/);
          if (!match) continue;
          const code = Number(match[1]);
          const expected = expectedCodes[step];

          if (code !== expected) {
            return finish(new Error(`SMTP error at step ${step} (expected ${expected}, got ${code}): ${line}`));
          }

          if (step < commands.length) {
            const cmd = commands[step];
            step++;
            cmd();
          } else {
            return finish(null, { accepted: [to], response: line });
          }
        }
      });

      sock.on('timeout', () => {
        finish(new Error(`SMTP connection timed out (${config.host}:${config.port})`));
      });

      sock.on('error', (err) => {
        finish(err);
      });

      sock.on('close', () => {
        if (!settled) {
          if (step >= commands.length) {
            finish(null, { accepted: [to], response: 'Closed cleanly after QUIT' });
          } else {
            finish(new Error(`SMTP socket closed unexpectedly at step ${step} (${config.host}:${config.port})`));
          }
        }
      });
    };

    attachSocketHandlers(socket);
  });
}

export async function sendVerificationEmail({ to, nickname, verifyUrl }) {
  const safeNick = escapeHtml(nickname);
  const safeUrl = escapeHtml(verifyUrl);
  const subject = '🌸 Verifikasi Akun Senjuku Nihongo - Atur Kata Sandi Anda';

  const text = [
    `Halo ${nickname}!`,
    ``,
    `Selamat datang di Senjuku Nihongo (せんじゅく日本語).`,
    `Klik tautan di bawah ini untuk memverifikasi email Anda dan menyetel kata sandi akun:`,
    ``,
    verifyUrl,
    ``,
    `Tautan ini berlaku selama 24 jam dan hanya dapat digunakan satu kali.`,
    `Jika Anda tidak merasa mendaftar, silakan abaikan email ini.`,
    ``,
    `Ganbatte kudasai! — Tim Senjuku Nihongo`
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:540px;background:#1e293b;border-radius:16px;border:1px solid #334155;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px;background:linear-gradient(135deg,#4f46e5,#ec4899);text-align:center;">
              <div style="font-size:32px;margin-bottom:6px;">🌸</div>
              <h1 style="margin:0;font-size:22px;color:#ffffff;letter-spacing:0.3px;">せんじゅく日本語</h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.9);">Senjuku Nihongo</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 12px;font-size:18px;color:#f8fafc;">Halo, ${safeNick}! 👋</h2>
              <p style="margin:0 0 18px;font-size:14px;line-height:1.65;color:#cbd5e1;">
                Terima kasih telah mendaftar di <strong>Senjuku Nihongo</strong>.
                Satu langkah lagi untuk mengaktifkan akun dan mulai menyinkronkan progres latihan Kana &amp; Kanji Anda!
              </p>
              <div style="text-align:center;margin:28px 0;">
                <a href="${safeUrl}" style="display:inline-block;padding:14px 28px;background:#6366f1;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;border-radius:10px;">
                  ✨ Verifikasi &amp; Buat Kata Sandi
                </a>
              </div>
              <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;line-height:1.6;">
                Atau salin dan buka tautan berikut di peramban Anda:<br />
                <a href="${safeUrl}" style="color:#818cf8;word-break:break-all;">${safeUrl}</a>
              </p>
              <div style="margin-top:24px;padding:12px 14px;background:#0f172a;border-radius:8px;border:1px solid #334155;font-size:12px;color:#94a3b8;">
                ⏳ <strong>Tautan berlaku 24 jam</strong> dan hanya dapat dipakai satu kali.<br />
                🔒 Jika Anda tidak merasa mendaftar, abaikan email ini dengan aman.
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;background:#0f172a;text-align:center;font-size:11px;color:#64748b;">
              頑張ってください！(Ganbatte kudasai!) • Senjuku Nihongo
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return sendSmtpEmail({ to, subject, text, html });
}

export async function sendPasswordResetEmail({ to, nickname, resetUrl }) {
  const safeNick = escapeHtml(nickname);
  const safeUrl = escapeHtml(resetUrl);
  const subject = '🔑 Reset Kata Sandi Akun Senjuku Nihongo';

  const text = [
    `Halo ${nickname}!`,
    ``,
    `Kami menerima permintaan untuk mengatur ulang (reset) kata sandi akun Senjuku Nihongo Anda.`,
    `Klik tautan di bawah ini untuk membuat kata sandi baru:`,
    ``,
    resetUrl,
    ``,
    `Tautan ini berlaku selama 24 jam dan hanya dapat digunakan satu kali.`,
    `Jika Anda tidak meminta reset kata sandi, silakan abaikan email ini.`,
    ``,
    `— Tim Senjuku Nihongo`
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:540px;background:#1e293b;border-radius:16px;border:1px solid #334155;overflow:hidden;">
          <tr>
            <td style="padding:26px 32px;background:linear-gradient(135deg,#6366f1,#f59e0b);text-align:center;">
              <div style="font-size:34px;margin-bottom:6px;">🔑</div>
              <h1 style="margin:0;font-size:21px;color:#ffffff;">Reset Kata Sandi</h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.92);">Senjuku Nihongo</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <h2 style="margin:0 0 10px;font-size:18px;color:#f8fafc;">Halo, ${safeNick}! 👋</h2>
              <p style="margin:0 0 18px;font-size:14px;line-height:1.65;color:#cbd5e1;">
                Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda.
                Klik tombol di bawah ini untuk menyetel kata sandi baru:
              </p>
              <div style="text-align:center;margin:24px 0;">
                <a href="${safeUrl}" style="display:inline-block;padding:13px 26px;background:#6366f1;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;border-radius:10px;">
                  🔑 Buat Kata Sandi Baru
                </a>
              </div>
              <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;line-height:1.6;">
                Atau buka tautan berikut di peramban Anda:<br />
                <a href="${safeUrl}" style="color:#818cf8;word-break:break-all;">${safeUrl}</a>
              </p>
              <div style="margin-top:20px;padding:12px 14px;background:#0f172a;border-radius:8px;border:1px solid #334155;font-size:12px;color:#94a3b8;">
                ⏳ Tautan berlaku <strong>24 jam</strong> (1× pakai).<br />
                🔒 Jika Anda tidak meminta reset kata sandi, abaikan email ini.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return sendSmtpEmail({ to, subject, text, html });
}

export async function sendLessonClearEmail({ to, nickname, lessonNum, appUrl = 'http://localhost:3000' }) {
  const safeNick = escapeHtml(nickname);
  const safeUrl = escapeHtml(appUrl);
  const subject = `⭐ Selamat ${nickname}! Bab ${lessonNum} Lulus Scorecard Penuh — Senjuku Nihongo`;

  const text = [
    `Selamat, ${nickname}! ⭐`,
    ``,
    `Anda baru saja menyelesaikan Scorecard Bab ${lessonNum} dengan nilai penuh (100%) di Senjuku Nihongo!`,
    `Teruskan kebiasaan belajar 15 menit per hari untuk membuka blok pelajaran berikutnya.`,
    ``,
    `Lanjutkan latihan di sini: ${appUrl}`,
    ``,
    `素晴らしい！(Subarashii!) — Tim Senjuku Nihongo`
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:540px;background:#1e293b;border-radius:16px;border:1px solid #334155;overflow:hidden;">
          <tr>
            <td style="padding:26px 32px;background:linear-gradient(135deg,#f59e0b,#ec4899);text-align:center;">
              <div style="font-size:36px;margin-bottom:6px;">⭐🎉</div>
              <h1 style="margin:0;font-size:21px;color:#ffffff;">Bab ${lessonNum} Lulus Penuh!</h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.92);">Senjuku Nihongo</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <h2 style="margin:0 0 10px;font-size:18px;color:#f8fafc;">Luar biasa, ${safeNick}! 👏</h2>
              <p style="margin:0 0 18px;font-size:14px;line-height:1.65;color:#cbd5e1;">
                Anda baru saja menuntaskan <strong>Scorecard Bab ${lessonNum} (100%)</strong>!
                Setiap bab yang tuntas membawa Anda lebih dekat untuk membuka blok level berikutnya dan meraih lencana baru di Papan Peringkat.
              </p>
              <div style="text-align:center;margin:24px 0;">
                <a href="${safeUrl}" style="display:inline-block;padding:13px 26px;background:#6366f1;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:10px;">
                  🚀 Lanjut ke Bab Berikutnya
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return sendSmtpEmail({ to, subject, text, html });
}

export async function sendGradeUnlockEmail({ to, nickname, blockNum, clearedRange, unlockedRange, gradeTitle, appUrl = 'http://localhost:3000' }) {
  const safeNick = escapeHtml(nickname);
  const safeUrl = escapeHtml(appUrl);
  const safeTitle = escapeHtml(gradeTitle);
  const subject = `🏆 Grade Unlock! ${gradeTitle} Tercapai — Senjuku Nihongo`;

  const nextLine = unlockedRange
    ? `Blok pelajaran baru <strong>${escapeHtml(unlockedRange)}</strong> kini resmi TERBUKA untuk Anda!`
    : `Anda telah menaklukkan <strong>SELURUH Bab Minna no Nihongo I</strong>!`;

  const text = [
    `Selamat atas kenaikan Grade, ${nickname}! 🏆`,
    ``,
    `Anda telah menyelesaikan seluruh ${clearedRange} (${gradeTitle}).`,
    unlockedRange ? `Blok baru ${unlockedRange} kini TERBUKA!` : `Semua Bab telah selesai!`,
    `Lencana pencapaian baru Anda kini tampil di Papan Peringkat (Leaderboard)!`,
    ``,
    `Buka Senjuku Nihongo: ${appUrl}`,
    ``,
    `おめでとうございます！(Omedetou gozaimasu!) — Tim Senjuku Nihongo`
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:540px;background:#1e293b;border-radius:16px;border:1px solid #334155;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px;background:linear-gradient(135deg,#6366f1,#10b981);text-align:center;">
              <div style="font-size:40px;margin-bottom:6px;">🏆✨</div>
              <h1 style="margin:0;font-size:22px;color:#ffffff;">${safeTitle} Terbuka!</h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.92);">おめでとうございます！</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <h2 style="margin:0 0 10px;font-size:18px;color:#f8fafc;">Selamat, ${safeNick}! 🎉</h2>
              <p style="margin:0 0 14px;font-size:14px;line-height:1.65;color:#cbd5e1;">
                Anda telah menyelesaikan seluruh blok <strong>${escapeHtml(clearedRange)}</strong> dengan sempurna!
                ${nextLine}
              </p>
              <p style="margin:0 0 22px;font-size:13px;color:#94a3b8;">
                🎖️ Lencana Grade baru Anda sekarang sudah tampil di <strong>Papan Peringkat (Leaderboard)</strong>.
              </p>
              <div style="text-align:center;margin:24px 0;">
                <a href="${safeUrl}" style="display:inline-block;padding:14px 28px;background:#10b981;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;border-radius:10px;">
                  🔓 Mulai Blok Pelajaran Baru
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return sendSmtpEmail({ to, subject, text, html });
}
