// Web Speech API (SpeechRecognition) Wrapper & Japanese Spoken Reading Matcher
// Designed for desktop & mobile browsers (Android Chrome, iOS Safari 14.5+)

import { sound } from './audio.js';

export function isSpeechRecognitionSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * Convert Katakana to Hiragana and strip whitespace/punctuation for fair ASR comparison.
 */
export function normalizeJapaneseSpeech(str) {
  if (!str) return '';
  const hiragana = str.replace(/[\u30a1-\u30f6]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
  return hiragana
    .toLowerCase()
    .replace(/[\s\u3000。、．，！？!?「」『』（）()・…\-~～〜'".,:;]/g, '')
    .trim();
}

/**
 * Normalize common Japanese ASR particle/pronunciation equivalences (は/わ, へ/え, を/お).
 */
function normalizePhoneticKana(str) {
  return normalizeJapaneseSpeech(str)
    .replace(/は/g, 'わ')
    .replace(/へ/g, 'え')
    .replace(/を/g, 'お');
}

function levenshteinDistance(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function similarityRatio(a, b) {
  if (!a && !b) return 1;
  if (!a || !b) return 0;
  const maxLen = Math.max(a.length, b.length);
  return (maxLen - levenshteinDistance(a, b)) / maxLen;
}

/**
 * Check whether any recognized ASR alternative matches the expected Japanese word or sentence.
 */
export function checkSpokenJapaneseMatch(alternatives, card) {
  const alts = Array.isArray(alternatives)
    ? alternatives.filter(Boolean)
    : (alternatives ? [String(alternatives)] : []);

  if (alts.length === 0 || !card) {
    return { isCorrect: false, matchedTranscript: '', score: 0 };
  }

  const expKana = normalizeJapaneseSpeech(card.expectedKana || card.kana || '');
  const expKanji = normalizeJapaneseSpeech(card.expectedKanji || card.kanji || card.text || '');
  const expPhonetic = normalizePhoneticKana(card.expectedKana || card.kana || '');
  const isSentence = card.speakKind === 'sentence';

  let bestScore = 0;

  for (const raw of alts) {
    const norm = normalizeJapaneseSpeech(raw);
    const phonetic = normalizePhoneticKana(raw);

    if (!norm) continue;

    if (
      (expKana && (norm === expKana || phonetic === expPhonetic)) ||
      (expKanji && norm === expKanji)
    ) {
      return { isCorrect: true, matchedTranscript: raw, score: 100 };
    }

    const simKana = expKana ? similarityRatio(norm, expKana) : 0;
    const simPhonetic = expPhonetic ? similarityRatio(phonetic, expPhonetic) : 0;
    const simKanji = expKanji ? similarityRatio(norm, expKanji) : 0;
    const maxSim = Math.max(simKana, simPhonetic, simKanji);
    const pct = Math.round(maxSim * 100);
    if (pct > bestScore) bestScore = pct;

    if (isSentence && maxSim >= 0.8) {
      return { isCorrect: true, matchedTranscript: raw, score: pct };
    }
  }

  return { isCorrect: false, matchedTranscript: alts[0] || '', score: bestScore };
}

export function getFriendlySpeechError(errorCode) {
  switch (errorCode) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Izin mikrofon ditolak. Aktifkan akses mikrofon di pengaturan browser Anda.';
    case 'no-speech':
      return 'Suara tidak terdeteksi. Coba dekatkan mikrofon dan ucapkan lebih jelas.';
    case 'audio-capture':
      return 'Mikrofon tidak ditemukan pada perangkat ini.';
    case 'network':
      return 'Koneksi internet diperlukan untuk pengenalan suara browser.';
    case 'aborted':
      return '';
    default:
      return 'Gagal mengenali suara. Silakan coba tekan tombol mikrofon lagi.';
  }
}

export class SpeakAloudRecognizer {
  constructor() {
    this.recognition = null;
    this.isListening = false;
  }

  start({ onStart, onInterim, onResult, onError, onEnd } = {}) {
    if (!isSpeechRecognitionSupported()) {
      onError?.('unsupported', 'Browser ini belum mendukung pengenalan suara. Gunakan Chrome, Edge, atau Safari.');
      return false;
    }

    this.stop();

    // Stop active TTS/MP3 playback so iOS Safari does not interrupt the microphone
    if (sound && typeof sound.stopSpeech === 'function') {
      sound.stopSpeech();
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRec();
    rec.lang = 'ja-JP';
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 5;

    let finalEmitted = false;

    rec.onstart = () => {
      this.isListening = true;
      onStart?.();
    };

    rec.onresult = (event) => {
      let interimText = '';
      const finalAlternatives = [];

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          for (let j = 0; j < res.length; j++) {
            const t = res[j]?.transcript?.trim();
            if (t && !finalAlternatives.includes(t)) {
              finalAlternatives.push(t);
            }
          }
        } else {
          const t = res[0]?.transcript?.trim();
          if (t) interimText += t;
        }
      }

      if (interimText) {
        onInterim?.(interimText);
      }

      if (finalAlternatives.length > 0 && !finalEmitted) {
        finalEmitted = true;
        onResult?.(finalAlternatives);
      }
    };

    rec.onerror = (event) => {
      this.isListening = false;
      const code = event?.error || 'unknown';
      const msg = getFriendlySpeechError(code);
      if (msg) {
        onError?.(code, msg);
      }
    };

    rec.onend = () => {
      this.isListening = false;
      if (this.recognition === rec) {
        this.recognition = null;
      }
      onEnd?.();
    };

    this.recognition = rec;
    try {
      rec.start();
      return true;
    } catch (err) {
      this.isListening = false;
      this.recognition = null;
      onError?.('start-failed', 'Tidak dapat memulai mikrofon. Pastikan halaman menggunakan HTTPS/localhost.');
      return false;
    }
  }

  stop() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (_) {
        // ignore abort errors
      }
      this.recognition = null;
    }
    this.isListening = false;
  }
}
