// KiraKira Nihongo — Native Japanese Neural TTS Engine (Zero External Dependencies)
// Supports Google Cloud TTS (ja-JP-Neural2-C Male / B Female), Azure Speech (KeitaNeural / NanamiNeural),
// or local VOICEVOX (Speaker 13 青山龍星 Male / Speaker 2 四国めたん Female), with permanent disk caching.

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const BASE_DIR = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const CACHE_DIR = path.join(BASE_DIR, 'data', 'tts-cache');

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export function getTtsConfig() {
  const googleKey = (process.env.GOOGLE_TTS_API_KEY || '').trim();
  const isDummyGoogleKey = !googleKey || ['your_key', 'your_key_here', '<your_key>'].includes(googleKey.toLowerCase()) || googleKey.startsWith('your_');
  if (googleKey && !isDummyGoogleKey) {
    return {
      enabled: true,
      provider: 'google-cloud-tts',
      label: 'Google Cloud Neural2 (Native JP)',
      maleVoice: (process.env.GOOGLE_TTS_MALE_VOICE || 'ja-JP-Neural2-C').trim(),
      femaleVoice: (process.env.GOOGLE_TTS_FEMALE_VOICE || 'ja-JP-Neural2-B').trim(),
      mimeType: 'audio/mpeg',
      ext: '.mp3',
      googleKey
    };
  }

  const azureKey = (process.env.AZURE_SPEECH_KEY || '').trim();
  const azureRegion = (process.env.AZURE_SPEECH_REGION || '').trim();
  if (azureKey && azureRegion) {
    return {
      enabled: true,
      provider: 'azure-speech',
      label: 'Azure Neural (Keita & Nanami)',
      maleVoice: (process.env.AZURE_TTS_MALE_VOICE || 'ja-JP-KeitaNeural').trim(),
      femaleVoice: (process.env.AZURE_TTS_FEMALE_VOICE || 'ja-JP-NanamiNeural').trim(),
      mimeType: 'audio/mpeg',
      ext: '.mp3',
      azureKey,
      azureRegion
    };
  }

  const voicevoxUrl = (process.env.VOICEVOX_URL || '').trim().replace(/\/+$/, '');
  if (voicevoxUrl) {
    return {
      enabled: true,
      provider: 'voicevox',
      label: 'VOICEVOX Local (Native JP)',
      maleVoice: String(process.env.VOICEVOX_MALE_SPEAKER || '13'), // 青山龍星 (Aoyama Ryusei - natural Japanese male)
      femaleVoice: String(process.env.VOICEVOX_FEMALE_SPEAKER || '2'), // 四国めたん (Shikoku Metan - natural Japanese female)
      mimeType: 'audio/wav',
      ext: '.wav',
      voicevoxUrl
    };
  }

  return {
    enabled: false,
    provider: 'browser-fallback',
    label: 'Browser Web Speech',
    maleVoice: null,
    femaleVoice: null
  };
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function synthesizeGoogle(cfg, text, voiceName) {
  const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(cfg.googleKey)}`;
  const body = {
    input: { text },
    voice: { languageCode: 'ja-JP', name: voiceName },
    audioConfig: { audioEncoding: 'MP3', speakingRate: 0.96, pitch: 0.0 }
  };
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`Google TTS HTTP ${resp.status}: ${errText.slice(0, 200)}`);
  }
  const data = await resp.json();
  if (!data.audioContent) throw new Error('Google TTS returned empty audioContent');
  return Buffer.from(data.audioContent, 'base64');
}

async function synthesizeAzure(cfg, text, voiceName) {
  const endpoint = `https://${cfg.azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
  const ssml = `<speak version='1.0' xml:lang='ja-JP'><voice xml:lang='ja-JP' name='${escapeXml(voiceName)}'><prosody rate='-4%'>${escapeXml(text)}</prosody></voice></speak>`;
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': cfg.azureKey,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-96kbitrate-mono-mp3',
      'User-Agent': 'KiraKiraNihongo'
    },
    body: ssml
  });
  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`Azure TTS HTTP ${resp.status}: ${errText.slice(0, 200)}`);
  }
  const arrBuf = await resp.arrayBuffer();
  return Buffer.from(arrBuf);
}

async function synthesizeVoicevox(cfg, text, speakerId) {
  const qResp = await fetch(`${cfg.voicevoxUrl}/audio_query?text=${encodeURIComponent(text)}&speaker=${encodeURIComponent(speakerId)}`, {
    method: 'POST'
  });
  if (!qResp.ok) throw new Error(`VOICEVOX audio_query HTTP ${qResp.status}`);
  const queryJson = await qResp.json();
  queryJson.speedScale = 0.95;

  const sResp = await fetch(`${cfg.voicevoxUrl}/synthesis?speaker=${encodeURIComponent(speakerId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(queryJson)
  });
  if (!sResp.ok) throw new Error(`VOICEVOX synthesis HTTP ${sResp.status}`);
  const arrBuf = await sResp.arrayBuffer();
  return Buffer.from(arrBuf);
}

export async function handleTtsRequest(req, res, parsedUrl) {
  const cfg = getTtsConfig();

  if (parsedUrl.pathname === '/api/tts/status') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      enabled: cfg.enabled,
      provider: cfg.provider,
      label: cfg.label,
      maleVoice: cfg.maleVoice,
      femaleVoice: cfg.femaleVoice
    }));
    return true;
  }

  if (parsedUrl.pathname === '/api/tts') {
    if (!cfg.enabled) {
      res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Neural TTS provider is not configured on server.' }));
      return true;
    }

    const rawText = (parsedUrl.searchParams.get('text') || '').trim();
    const genderParam = (parsedUrl.searchParams.get('gender') || 'female').toLowerCase();
    const gender = genderParam === 'male' ? 'male' : 'female';

    if (!rawText || rawText.length > 300) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Invalid text parameter (1–300 chars required).' }));
      return true;
    }

    const voiceName = gender === 'male' ? cfg.maleVoice : cfg.femaleVoice;
    const hash = crypto.createHash('sha256').update(`${cfg.provider}|${voiceName}|${rawText}`).digest('hex').slice(0, 28);
    ensureCacheDir();
    const cacheFile = path.join(CACHE_DIR, `${hash}${cfg.ext}`);

    try {
      let audioBuf;
      if (fs.existsSync(cacheFile)) {
        audioBuf = fs.readFileSync(cacheFile);
      } else {
        if (cfg.provider === 'google-cloud-tts') {
          audioBuf = await synthesizeGoogle(cfg, rawText, voiceName);
        } else if (cfg.provider === 'azure-speech') {
          audioBuf = await synthesizeAzure(cfg, rawText, voiceName);
        } else if (cfg.provider === 'voicevox') {
          audioBuf = await synthesizeVoicevox(cfg, rawText, voiceName);
        } else {
          throw new Error('Unsupported TTS provider');
        }
        fs.writeFileSync(cacheFile, audioBuf);
      }

      res.writeHead(200, {
        'Content-Type': cfg.mimeType,
        'Content-Length': audioBuf.length,
        'Cache-Control': 'public, max-age=31536000, immutable'
      });
      res.end(audioBuf);
    } catch (err) {
      console.error('[TTS Error]', err.message);
      res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'TTS synthesis failed', detail: err.message }));
    }
    return true;
  }

  return false;
}
