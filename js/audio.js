// Web Audio API Synthesizer & Native Japanese Male/Female TTS Engine
// Priority 1: Server Neural Japanese TTS (/api/tts -> Google Neural2 / Azure Keita & Nanami / VOICEVOX 青山龍星)
// Priority 2: Best Native Browser Japanese Male & Female voices (Edge Keita/Nanami, macOS Otoya/Kyoko, Android jac/jab)

export const PLAYBACK_LIMITS = Object.freeze({
  QUIZ_ALL: 3,
  QUIZ_FULL_SENTENCE: 3,
  LEARNING_ALL: 5
});

export function getVoicePlaybackLimit(sessionType, mode) {
  if (sessionType === 'learning') {
    return PLAYBACK_LIMITS.LEARNING_ALL;
  }
  if (sessionType === 'quiz') {
    return PLAYBACK_LIMITS.QUIZ_ALL;
  }
  return null;
}

export class PlaybackLimiter {
  constructor(maxPlays = null) {
    this.maxPlays = PlaybackLimiter.normalizeLimit(maxPlays);
    this.usedPlays = 0;
  }

  static normalizeLimit(maxPlays) {
    if (typeof maxPlays === 'number' && Number.isFinite(maxPlays) && maxPlays >= 0) {
      return Math.floor(maxPlays);
    }
    return null;
  }

  hasLimit() {
    return this.maxPlays !== null;
  }

  getUsed() {
    return this.usedPlays;
  }

  getRemaining() {
    if (!this.hasLimit()) return null;
    return Math.max(0, this.maxPlays - this.usedPlays);
  }

  isExhausted() {
    return this.hasLimit() && this.usedPlays >= this.maxPlays;
  }

  canPlay() {
    return !this.isExhausted();
  }

  consumeManualPlay() {
    if (this.isExhausted()) {
      return false;
    }
    this.usedPlays += 1;
    return true;
  }

  reset(maxPlays) {
    if (arguments.length > 0) {
      this.maxPlays = PlaybackLimiter.normalizeLimit(maxPlays);
    }
    this.usedPlays = 0;
  }
}

const MALE_VOICE_PRIORITY = [
  /keita.*(online|natural)/i,
  /daichi.*(online|natural)/i,
  /naoki.*(online|natural)/i,
  /\bkeita\b/i,
  /\bdaichi\b/i,
  /\bnaoki\b/i,
  /\botoya\b/i,
  /\bhattori\b/i,
  /ja-jp-x-jac/i,
  /ja-jp-x-jad/i,
  /\bichiro\b/i,
  /\b(takumi|kenji|eddy|reed|rocko|grandpa|male|man)\b|男性/i
];

const FEMALE_VOICE_PRIORITY = [
  /nanami.*(online|natural)/i,
  /shiori.*(online|natural)/i,
  /mayu.*(online|natural)/i,
  /aoi.*(online|natural)/i,
  /\bnanami\b/i,
  /\bkyoko\b/i,
  /\bo-ren\b/i,
  /ja-jp-x-jab/i,
  /google.*日本語|google.*japanese/i,
  /\bharuka\b/i,
  /\bayumi\b/i,
  /\bsayaka\b/i,
  /\b(female|woman|shelley|sandy|flo)\b|女性/i
];

const VOICE_PREF_KEY = 'kirakira_voice_prefs_v1';

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.muted = false;
    this.synth = (typeof window !== 'undefined' && window.speechSynthesis) ? window.speechSynthesis : null;
    this.jaVoices = [];
    this.selectedVoice = null;
    this.maleVoice = null;
    this.femaleVoice = null;
    this.localFallbackVoice = null;
    this.speechRate = 1.0;

    // Server Neural TTS state (Google Neural2 / Azure Keita / VOICEVOX)
    this.serverTts = { enabled: false, provider: 'browser-fallback', label: 'Browser Web Speech', maleVoice: null, femaleVoice: null };
    this.activeAudioEl = null;
    this.audioCache = new Map();

    // User manual browser voice overrides
    this.prefs = this.loadVoicePrefs();

    if (this.synth) {
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }

    this.refreshServerTtsStatus();
  }

  loadVoicePrefs() {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(VOICE_PREF_KEY) : null;
      return raw ? JSON.parse(raw) : { male: '', female: '' };
    } catch {
      return { male: '', female: '' };
    }
  }

  setPreferredVoices(prefs = {}) {
    this.prefs = {
      male: typeof prefs.male === 'string' ? prefs.male : (this.prefs.male || ''),
      female: typeof prefs.female === 'string' ? prefs.female : (this.prefs.female || '')
    };
    try {
      localStorage.setItem(VOICE_PREF_KEY, JSON.stringify(this.prefs));
    } catch { /* ignore */ }
    this.initVoices();
  }

  async refreshServerTtsStatus() {
    if (typeof fetch !== 'function') return;
    try {
      const resp = await fetch('/api/tts/status', { credentials: 'same-origin' });
      if (resp.ok) {
        const data = await resp.json();
        if (data && typeof data.enabled === 'boolean') {
          this.serverTts = data;
        }
      }
    } catch {
      // Offline or not yet authenticated — silently keep browser TTS fallback
    }
  }

  ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  pickRankedVoice(voices, patterns) {
    for (const pat of patterns) {
      const hit = voices.find(v => pat.test(v.name) || pat.test(v.voiceURI || ''));
      if (hit) return hit;
    }
    return null;
  }

  initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices() || [];
    const jaVoices = voices.filter(v => v.lang === 'ja-JP' || (v.lang || '').toLowerCase().startsWith('ja'));
    this.jaVoices = jaVoices;
    if (jaVoices.length === 0) return;

    const prefMale = this.prefs.male ? jaVoices.find(v => v.name === this.prefs.male) : null;
    const prefFemale = this.prefs.female ? jaVoices.find(v => v.name === this.prefs.female) : null;

    this.maleVoice = prefMale || this.pickRankedVoice(jaVoices, MALE_VOICE_PRIORITY) || null;
    this.femaleVoice = prefFemale || this.pickRankedVoice(jaVoices, FEMALE_VOICE_PRIORITY) || jaVoices.find(v => v !== this.maleVoice) || jaVoices[0];
    this.localFallbackVoice = jaVoices.find(v => v.localService) || null;
    this.selectedVoice = this.femaleVoice || jaVoices[0];
  }

  getVoiceDiagnostics() {
    if (!this.jaVoices.length) this.initVoices();
    const hasNativeMale = !!(this.serverTts.enabled || this.maleVoice);
    return {
      serverTts: this.serverTts,
      jaVoices: this.jaVoices.map(v => ({ name: v.name, lang: v.lang, local: !!v.localService })),
      maleVoiceName: this.serverTts.enabled
        ? `${this.serverTts.maleVoice} (${this.serverTts.label})`
        : (this.maleVoice ? this.maleVoice.name : null),
      femaleVoiceName: this.serverTts.enabled
        ? `${this.serverTts.femaleVoice} (${this.serverTts.label})`
        : (this.femaleVoice ? this.femaleVoice.name : null),
      hasNativeMale,
      prefs: { ...this.prefs }
    };
  }

  detectSpeakerGender(speakerLabel = '') {
    const s = String(speakerLabel || '');
    if (!s) return null;
    if (/\(\s*female\s*\)|\bfemale\b|wanita|perempuan|ibu\b|kimura|karina|maria|teresa|sato.*female/i.test(s)) {
      return 'female';
    }
    if (/\(\s*male\s*\)|\bmale\b|pria|laki|bapak\b|miller|santos|yamada|tanaka|watanabe|watt|gupta|lee\b|schmidt/i.test(s)) {
      return 'male';
    }
    return null;
  }

  setMuted(mute) {
    this.muted = !!mute;
    if (this.muted) this.stopSpeech();
  }

  isMuted() {
    return this.muted;
  }

  setSpeechRate(rate) {
    this.speechRate = Math.max(0.6, Math.min(1.5, rate));
  }

  // --- Web Audio Synth Sound FX ---
  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.15, startDelay = 0) {
    if (this.muted) return;
    try {
      this.ensureAudioContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      const startTime = this.audioCtx.currentTime + startDelay;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(gainVal, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.warn('Audio FX error:', e);
    }
  }

  playCorrect(combo = 1) {
    if (this.muted) return;
    const baseFreq = 523.25;
    const multiplier = Math.min(2.0, 1 + (combo - 1) * 0.08);
    this.playTone(baseFreq * multiplier, 'triangle', 0.1, 0.2, 0);
    this.playTone((baseFreq * 1.25) * multiplier, 'sine', 0.18, 0.22, 0.08);
  }

  playWrong() {
    if (this.muted) return;
    this.playTone(220, 'sawtooth', 0.15, 0.18, 0);
    this.playTone(180, 'sawtooth', 0.22, 0.2, 0.1);
  }

  playLevelUp() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.15, 0.25, idx * 0.09);
    });
  }

  playTick() {
    if (this.muted) return;
    this.playTone(880, 'sine', 0.04, 0.06, 0);
  }

  playCompleteFanfare() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 880.00, 1046.50];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.2, 0.25, idx * 0.12);
    });
  }

  // --- Server Neural TTS Playback (Native Japanese Male/Female) ---
  async playServerNeuralTts(cleanText, gender, rate, onEnd) {
    const cacheKey = `${gender}|${cleanText}`;
    let url = this.audioCache.get(cacheKey);
    if (!url) {
      const apiUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&gender=${encodeURIComponent(gender)}`;
      const resp = await fetch(apiUrl, { credentials: 'same-origin' });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const blob = await resp.blob();
      url = URL.createObjectURL(blob);
      this.audioCache.set(cacheKey, url);
    }

    const audio = new Audio(url);
    audio.playbackRate = Math.max(0.6, Math.min(1.5, rate || 1.0));
    this.activeAudioEl = audio;

    if (typeof onEnd === 'function') {
      audio.onended = () => {
        if (this.activeAudioEl === audio) this.activeAudioEl = null;
        onEnd();
      };
      audio.onerror = () => {
        if (this.activeAudioEl === audio) this.activeAudioEl = null;
        onEnd();
      };
    }
    await audio.play();
  }

  // --- Text to Speech (Native Japanese Male & Female) ---
  speakJapanese(text, onEnd, options = {}) {
    const endCb = typeof onEnd === 'function' ? onEnd : null;
    const cleanText = String(text || '').replace(/<[^>]+>/g, '').trim();
    if (!cleanText) {
      if (endCb) endCb();
      return;
    }

    this.stopSpeech();

    const gender = options.gender || this.detectSpeakerGender(options.speaker || '') || 'female';
    const rate = typeof options.rate === 'number' ? options.rate : this.speechRate;

    // 1. Prefer Server Neural Native Japanese TTS when configured
    if (this.serverTts && this.serverTts.enabled && typeof Audio !== 'undefined') {
      this.playServerNeuralTts(cleanText, gender, rate, endCb).catch(() => {
        this.speakWithBrowserSynth(cleanText, gender, rate, endCb);
      });
      return;
    }

    // 2. Fallback to best native Japanese browser voice
    this.speakWithBrowserSynth(cleanText, gender, rate, endCb);
  }

  speakWithBrowserSynth(cleanText, gender, rate, endCb) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      if (endCb) endCb();
      return;
    }

    try {
      this.synth.cancel();
      if (!this.selectedVoice || !this.jaVoices.length) this.initVoices();

      const utter = new SpeechSynthesisUtterance(cleanText);
      utter.lang = 'ja-JP';
      utter.rate = Math.max(0.6, Math.min(1.5, rate || this.speechRate));

      if (gender === 'male') {
        if (this.maleVoice) {
          utter.voice = this.maleVoice;
          utter.pitch = 0.98;
        } else if (this.localFallbackVoice) {
          // Local voices actually obey pitch; remote "Google 日本語" ignores pitch completely
          utter.voice = this.localFallbackVoice;
          utter.pitch = 0.72;
          utter.rate = Math.max(0.6, utter.rate * 0.95);
        } else {
          utter.voice = this.selectedVoice || this.femaleVoice;
          utter.pitch = 0.68;
          utter.rate = Math.max(0.6, utter.rate * 0.94);
        }
      } else if (gender === 'female') {
        utter.voice = this.femaleVoice || this.selectedVoice;
        utter.pitch = this.femaleVoice && /online|natural|kyoko|nanami/i.test(this.femaleVoice.name) ? 1.0 : 1.04;
      } else {
        utter.voice = this.selectedVoice;
        utter.pitch = 1.0;
      }

      if (!utter.voice) {
        const voices = this.synth.getVoices();
        const jaVoice = voices.find(v => v.lang === 'ja-JP' || (v.lang || '').startsWith('ja'));
        if (jaVoice) utter.voice = jaVoice;
      }

      if (endCb) {
        utter.onend = endCb;
        utter.onerror = endCb;
      }

      this.synth.speak(utter);
    } catch (e) {
      console.warn('TTS Error:', e);
      if (endCb) endCb();
    }
  }

  speakJapaneseManual(text, limiter, onEnd, options = {}) {
    const cleanText = typeof text === 'string' ? text.replace(/<[^>]+>/g, '').trim() : '';
    if (!cleanText) {
      return false;
    }
    if (limiter && !limiter.consumeManualPlay()) {
      return false;
    }
    this.speakJapanese(text, onEnd, options);
    return true;
  }

  stopSpeech() {
    if (this.activeAudioEl) {
      try {
        this.activeAudioEl.pause();
        this.activeAudioEl.currentTime = 0;
      } catch { /* ignore */ }
      this.activeAudioEl = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch { /* ignore */ }
    }
  }
}

export const sound = new SoundEngine();
