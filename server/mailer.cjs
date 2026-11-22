// Zero-dependency Native TLS SMTP Client (configured via SMTP_* environment variables)
const tls = require('node:tls');

const SMTP_CONFIG = {
  host: (process.env.SMTP_HOST || '').trim(),
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  user: (process.env.SMTP_USER || '').trim(),
  pass: (process.env.SMTP_PASS || '').trim(),
  from: (process.env.SMTP_FROM || (process.env.SMTP_USER ? `"KiraKira Nihongo" <${process.env.SMTP_USER}>` : '')).trim(),
  appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000'
};

function sendRawSmtp({ to, subject, htmlContent, textContent }) {
  return new Promise((resolve, reject) => {
    let resolved = false;
    const socket = tls.connect(SMTP_CONFIG.port, SMTP_CONFIG.host, {
      servername: SMTP_CONFIG.host,
      timeout: 10000
    });

    let step = 0;
    let buffer = '';

    const finish = (err, result) => {
      if (resolved) return;
      resolved = true;
      try { socket.end(); } catch (e) {}
      if (err) reject(err);
      else resolve(result);
    };

    socket.on('error', (err) => {
      finish(err);
    });

    socket.on('timeout', () => {
      finish(new Error('SMTP Connection timeout to ' + SMTP_CONFIG.host));
    });

    socket.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\r\n');
      buffer = lines.pop(); // keep last unfinished line

      for (const line of lines) {
        if (!line) continue;
        const code = parseInt(line.substring(0, 3), 10);
        // Multiline response check (e.g., 250-something vs 250 something)
        const isMulti = line.charAt(3) === '-';
        if (isMulti) continue;

        if (code >= 400) {
          return finish(new Error(`SMTP Error [${code}]: ${line}`));
        }

        switch (step) {
          case 0: // Banner received
            if (code === 220) {
              step = 1;
              socket.write(`EHLO ${SMTP_CONFIG.host}\r\n`);
            }
            break;

          case 1: // EHLO response
            if (code === 250) {
              step = 2;
              socket.write('AUTH LOGIN\r\n');
            }
            break;

          case 2: // Waiting for Username prompt (334)
            if (code === 334) {
              step = 3;
              socket.write(Buffer.from(SMTP_CONFIG.user).toString('base64') + '\r\n');
            }
            break;

          case 3: // Waiting for Password prompt (334)
            if (code === 334) {
              step = 4;
              socket.write(Buffer.from(SMTP_CONFIG.pass).toString('base64') + '\r\n');
            }
            break;

          case 4: // Auth Success (235)
            if (code === 235) {
              step = 5;
              socket.write(`MAIL FROM:<${SMTP_CONFIG.user}>\r\n`);
            }
            break;

          case 5: // Sender accepted (250)
            if (code === 250) {
              step = 6;
              socket.write(`RCPT TO:<${to}>\r\n`);
            }
            break;

          case 6: // Recipient accepted (250)
            if (code === 250) {
              step = 7;
              socket.write('DATA\r\n');
            }
            break;

          case 7: // Ready for Data (354)
            if (code === 354) {
              step = 8;
              const boundary = '----=_Part_' + Date.now();
              const rawMessage = [
                `From: ${SMTP_CONFIG.from}`,
                `To: <${to}>`,
                `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
                'MIME-Version: 1.0',
                `Content-Type: multipart/alternative; boundary="${boundary}"`,
                '',
                `--${boundary}`,
                'Content-Type: text/plain; charset=UTF-8',
                'Content-Transfer-Encoding: base64',
                '',
                Buffer.from(textContent).toString('base64'),
                '',
                `--${boundary}`,
                'Content-Type: text/html; charset=UTF-8',
                'Content-Transfer-Encoding: base64',
                '',
                Buffer.from(htmlContent).toString('base64'),
                '',
                `--${boundary}--`,
                '',
                '.\r\n'
              ].join('\r\n');

              socket.write(rawMessage);
            }
            break;

          case 8: // Message accepted (250)
            if (code === 250) {
              step = 9;
              socket.write('QUIT\r\n');
              finish(null, { success: true, to });
            }
            break;
        }
      }
    });
  });
}

/**
 * Send Verification / Activation Email
 */
async function sendVerificationEmail({ to, nickname, token, baseUrl = null }) {
  const rootUrl = baseUrl || SMTP_CONFIG.appBaseUrl;
  const verificationLink = `${rootUrl}/verify.html?token=${token}`;

  const subject = `🌸 Verifikasi Akun & Setel Kata Sandi KiraKira Nihongo`;

  const textContent = `
Konnichiwa, ${nickname}-san!

Terima kasih telah mendaftar di KiraKira Nihongo Reading Gym.
Silakan klik tautan berikut untuk memvalidasi email Anda dan mengatur kata sandi akun Anda:

${verificationLink}

Tautan ini berlaku selama 24 jam. Jika Anda tidak merasa mendaftar, Anda dapat mengabaikan email ini.

Salam hangat,
Tim KiraKira Nihongo
`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fa; margin: 0; padding: 24px; color: #2d3748; }
    .card { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 36px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #edf2f7; }
    .logo { font-size: 28px; font-weight: 800; color: #e53e3e; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
    .badge { display: inline-block; background: #fed7d7; color: #9b2c2c; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px; }
    h2 { color: #1a202c; font-size: 22px; margin-top: 0; }
    p { font-size: 15px; line-height: 1.6; color: #4a5568; }
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { background: linear-gradient(135deg, #e53e3e 0%, #dd6b20 100%); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(229, 62, 62, 0.35); }
    .link-alt { word-break: break-all; font-size: 12px; background: #edf2f7; padding: 12px; border-radius: 8px; color: #4a5568; }
    .footer { margin-top: 36px; border-top: 1px solid #e2e8f0; padding-top: 18px; font-size: 12px; color: #a0aec0; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🌸 キラキラ日本語</div>
    <div class="badge">Aktivasi Akun Baru</div>
    <h2>Konnichiwa, ${nickname}-san!</h2>
    <p>Selamat datang di <strong>KiraKira Nihongo Reading Gym</strong>. Satu langkah lagi untuk mulai menguasai percakapan & membaca kanji 10 menit sehari.</p>
    <p>Silakan klik tombol di bawah untuk memverifikasi email Anda dan membuat kata sandi akun:</p>
    
    <div class="btn-container">
      <a href="${verificationLink}" class="btn" target="_blank">Aktifkan Akun & Buat Kata Sandi</a>
    </div>

    <p style="font-size: 13px; color: #718096;">Jika tombol di atas tidak dapat diklik, salin dan buka tautan berikut di browser Anda:</p>
    <div class="link-alt">${verificationLink}</div>

    <div class="footer">
      Tautan ini kedaluwarsa dalam 24 jam.<br>
      © ${new Date().getFullYear()} KiraKira Nihongo • Minna no Nihongo Reading Gym
    </div>
  </div>
</body>
</html>
`;

  try {
    const res = await sendRawSmtp({ to, subject, htmlContent, textContent });
    console.log(`[SMTP] Verification email sent to ${to} via ${SMTP_CONFIG.host}`);
    return { sent: true, to, verificationLink };
  } catch (err) {
    console.warn(`[SMTP Warning] Could not deliver email directly via ${SMTP_CONFIG.host}: ${err.message}`);
    console.log(`[SMTP Development Fallback] Verification Link for ${to}: ${verificationLink}`);
    // Return graceful object with the verification link so testing is seamless in all environments
    return { sent: false, offline: true, error: err.message, to, verificationLink };
  }
}

module.exports = {
  SMTP_CONFIG,
  sendVerificationEmail,
  sendRawSmtp
};
