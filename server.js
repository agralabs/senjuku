// KiraKira Nihongo - Zero-Dependency Local & Multi-User Server (Static + SQLite API)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleApiRequest } from './server/auth.js';
import { getDb } from './server/db.js';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const BASE_DIR = path.dirname(fileURLToPath(import.meta.url));

// Zero-dependency .env loader (for optional GOOGLE_TTS_API_KEY, AZURE_SPEECH_KEY, VOICEVOX_URL, SMTP_*, etc.)
try {
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
  }
} catch (err) {
  console.warn('[KiraKira Nihongo] .env load warning:', err.message);
}

// Initialize SQLite database schema on startup
getDb();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

const BLOCKED_PREFIXES = ['/server/', '/database/', '/tools/'];

const server = http.createServer(async (req, res) => {
  // Normalize URL
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Route /api/* requests to Auth, Profile, Progress Sync & Leaderboard API
  if (pathname.startsWith('/api/')) {
    await handleApiRequest(req, res, parsedUrl);
    return;
  }

  if (pathname === '/') {
    pathname = '/index.html';
  } else if (pathname === '/verify') {
    pathname = '/verify.html';
  }

  // Block direct static downloads of server code, database files, and dev tools
  if (BLOCKED_PREFIXES.some(prefix => pathname.toLowerCase().startsWith(prefix)) || pathname.toLowerCase().endsWith('.db')) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Safe path resolution
  const safePath = path.normalize(path.join(BASE_DIR, pathname));
  if (!safePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + pathname);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`[KiraKira Nihongo] Server running at http://${HOST}:${PORT}/`);
  console.log(`Open http://localhost:${PORT}/ in your browser to start your 15-minute daily reading drill!`);
});
