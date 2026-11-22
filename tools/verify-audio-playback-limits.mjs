// Automated verification suite for Voice Audio Playback Limits (R1, R2, R3)
// Zero external dependencies — pure Node.js ESM with a real-tree lightweight DOM harness.

import assert from 'node:assert/strict';

/* =========================================================
   LIGHTWEIGHT HTML-PARSING DOM HARNESS (ZERO DEPENDENCIES)
   ========================================================= */
class TestClassList {
  constructor(el) {
    this.el = el;
    this.set = new Set();
  }
  _syncFromAttr(val) {
    this.set = new Set(String(val || '').trim().split(/\s+/).filter(Boolean));
  }
  _syncToAttr() {
    this.el.attributes.class = Array.from(this.set).join(' ');
  }
  add(...classes) {
    classes.forEach(c => { if (c) this.set.add(c); });
    this._syncToAttr();
  }
  remove(...classes) {
    classes.forEach(c => this.set.delete(c));
    this._syncToAttr();
  }
  toggle(c, force) {
    if (force === undefined) {
      if (this.set.has(c)) {
        this.set.delete(c);
        this._syncToAttr();
        return false;
      }
      this.set.add(c);
      this._syncToAttr();
      return true;
    }
    if (force) this.set.add(c);
    else this.set.delete(c);
    this._syncToAttr();
    return Boolean(force);
  }
  contains(c) {
    return this.set.has(c);
  }
}

const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'path', 'polygon', 'circle', 'rect', 'line', 'polyline']);

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
}

class TestElement {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase();
    this.id = '';
    this.attributes = {};
    this.dataset = {};
    this.classList = new TestClassList(this);
    this.children = [];
    this.parentNode = null;
    this.style = {};
    this.hidden = false;
    this.disabled = false;
    this.value = '';
    this.checked = false;
    this.listeners = {};
    this.onclick = null;
    this.onchange = null;
    this._textContent = '';
  }

  get className() {
    return this.attributes.class || '';
  }
  set className(val) {
    this.attributes.class = String(val || '');
    this.classList._syncFromAttr(val);
  }

  get textContent() {
    if (this.children.length === 0) return this._textContent;
    return this._textContent + this.children.map(c => c.textContent).join('');
  }
  set textContent(val) {
    this.children = [];
    this._textContent = String(val ?? '');
  }

  get innerHTML() {
    return this._rawHtml || '';
  }
  set innerHTML(html) {
    this._rawHtml = String(html || '');
    this.children = [];
    this._textContent = '';
    parseHtmlInto(this, this._rawHtml);
  }

  setAttribute(name, value) {
    const key = name.toLowerCase();
    const strVal = String(value);
    this.attributes[key] = strVal;
    if (key === 'id') this.id = strVal;
    else if (key === 'class') this.classList._syncFromAttr(strVal);
    else if (key === 'disabled') this.disabled = true;
    else if (key === 'hidden') this.hidden = true;
    else if (key.startsWith('data-')) {
      this.dataset[toCamelCase(key.slice(5))] = strVal;
    }
  }

  getAttribute(name) {
    const key = name.toLowerCase();
    if (key === 'disabled') return this.disabled ? '' : null;
    return Object.prototype.hasOwnProperty.call(this.attributes, key) ? this.attributes[key] : null;
  }

  removeAttribute(name) {
    const key = name.toLowerCase();
    delete this.attributes[key];
    if (key === 'disabled') this.disabled = false;
    else if (key === 'hidden') this.hidden = false;
    else if (key.startsWith('data-')) {
      delete this.dataset[toCamelCase(key.slice(5))];
    }
  }

  hasAttribute(name) {
    const key = name.toLowerCase();
    if (key === 'disabled') return this.disabled;
    return Object.prototype.hasOwnProperty.call(this.attributes, key);
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  addEventListener(type, fn) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(fn);
  }

  focus() {
    global.document.activeElement = this;
  }

  blur() {
    if (global.document.activeElement === this) {
      global.document.activeElement = global.document.body;
    }
  }

  click() {
    // Match real browser behavior: disabled buttons ignore user clicks
    if (this.disabled) return;
    const evt = {
      target: this,
      currentTarget: this,
      preventDefault() {},
      stopPropagation() {}
    };
    if (typeof this.onclick === 'function') {
      this.onclick(evt);
    }
    if (this.listeners.click) {
      this.listeners.click.forEach(fn => fn(evt));
    }
  }

  matches(selector) {
    const sel = selector.trim();
    if (sel.startsWith('#')) return this.id === sel.slice(1);
    if (sel.startsWith('.')) return this.classList.contains(sel.slice(1));
    if (sel.startsWith('[') && sel.endsWith(']')) {
      const inner = sel.slice(1, -1);
      const eqIdx = inner.indexOf('=');
      if (eqIdx === -1) return this.hasAttribute(inner);
      const attrName = inner.slice(0, eqIdx).trim();
      const attrVal = inner.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      return this.getAttribute(attrName) === attrVal;
    }
    return this.tagName === sel.toUpperCase();
  }

  querySelectorAll(selector) {
    const results = [];
    const walk = (node) => {
      for (const child of node.children) {
        if (child.matches(selector)) results.push(child);
        walk(child);
      }
    };
    walk(this);
    return results;
  }

  querySelector(selector) {
    const all = this.querySelectorAll(selector);
    return all.length > 0 ? all[0] : null;
  }
}

function parseAttributes(el, attrStr) {
  const attrRegex = /([a-zA-Z0-9_:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m;
  while ((m = attrRegex.exec(attrStr)) !== null) {
    const name = m[1];
    const value = m[2] !== undefined ? m[2] : (m[3] !== undefined ? m[3] : (m[4] !== undefined ? m[4] : ''));
    el.setAttribute(name, value);
  }
}

function parseHtmlInto(root, html) {
  const cleaned = html.replace(/<!--[\s\S]*?-->/g, '');
  const tokenRegex = /<\/([a-zA-Z0-9-]+)\s*>|<([a-zA-Z0-9-]+)([^>]*?)(\/?)>|([^<]+)/g;
  const stack = [root];
  let match;

  while ((match = tokenRegex.exec(cleaned)) !== null) {
    const parent = stack[stack.length - 1];
    if (match[1]) {
      const closeTag = match[1].toUpperCase();
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tagName === closeTag) {
          stack.length = i;
          break;
        }
      }
    } else if (match[2]) {
      const tag = match[2].toLowerCase();
      const attrs = match[3] || '';
      const selfClose = Boolean(match[4]) || VOID_TAGS.has(tag);
      const el = new TestElement(tag);
      parseAttributes(el, attrs);
      parent.appendChild(el);
      if (!selfClose) {
        stack.push(el);
      }
    } else if (match[5]) {
      const text = match[5];
      if (text.trim()) {
        parent._textContent += text;
      }
    }
  }
}

/* =========================================================
   GLOBAL BROWSER MOCKS + SPEECH SPY
   ========================================================= */
const spokenUtterances = [];
const windowListeners = {};

function dispatchWindowKeydown(key, code = '') {
  const evt = {
    key,
    code: code || (key === ' ' ? 'Space' : ''),
    shiftKey: false,
    preventDefault() {}
  };
  (windowListeners.keydown || []).forEach(fn => fn(evt));
}

function resetSpokenLog() {
  spokenUtterances.length = 0;
}

global.window = {
  addEventListener: (event, fn) => {
    if (!windowListeners[event]) windowListeners[event] = [];
    windowListeners[event].push(fn);
  },
  localStorage: {
    _data: {},
    getItem(k) { return Object.prototype.hasOwnProperty.call(this._data, k) ? this._data[k] : null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
  },
  speechSynthesis: {
    speak(utter) { spokenUtterances.push(utter.text); },
    cancel() {},
    getVoices() { return [{ lang: 'ja-JP', name: 'Mock JA Voice' }]; }
  },
  AudioContext: class {
    constructor() { this.currentTime = 0; this.state = 'running'; this.destination = {}; }
    resume() {}
    createGain() {
      return {
        connect() {},
        gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }
      };
    }
    createOscillator() {
      return {
        connect() {},
        start() {},
        stop() {},
        frequency: { setValueAtTime() {} }
      };
    }
  }
};
global.window.webkitAudioContext = global.window.AudioContext;
global.localStorage = global.window.localStorage;
global.speechSynthesis = global.window.speechSynthesis;
global.SpeechSynthesisUtterance = class {
  constructor(text) { this.text = text; }
};

const bodyEl = new TestElement('body');
global.document = {
  body: bodyEl,
  activeElement: bodyEl,
  getElementById: () => new TestElement('div'),
  querySelectorAll: () => []
};

/* =========================================================
   DYNAMIC IMPORTS AFTER MOCKS ARE INSTALLED
   ========================================================= */
const { sound, PLAYBACK_LIMITS, PlaybackLimiter, getVoicePlaybackLimit } = await import('../js/audio.js');
const { DrillEngine } = await import('../js/drills.js');

let passedCount = 0;
function test(name, fn) {
  try {
    fn();
    passedCount += 1;
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`         ${err.message}`);
    process.exitCode = 1;
  }
}

function createHarnessEngine() {
  const cardContainer = new TestElement('div');
  const optionsGrid = new TestElement('div');
  const engine = new DrillEngine();
  engine.init({
    cardContainer,
    optionsGrid,
    timerDisplay: new TestElement('span'),
    progressFill: new TestElement('div'),
    cardsCount: new TestElement('span'),
    comboCount: new TestElement('span'),
    xpCount: new TestElement('span'),
    lessonInfo: new TestElement('span'),
    feedbackArea: new TestElement('div'),
    pauseBtn: new TestElement('button')
  });
  return { engine, cardContainer, optionsGrid };
}

function cleanupEngine(engine) {
  engine.sessionActive = false;
  engine.clearQuestionTimer();
  clearInterval(engine.timerInterval);
  clearTimeout(engine.autoAdvanceTimeout);
  global.document.activeElement = bodyEl;
}

/* =========================================================
   1. AUDIO MODULE UNIT TESTS
   ========================================================= */
console.log('\n1. Audio Module Core (PLAYBACK_LIMITS, getVoicePlaybackLimit, PlaybackLimiter, speakJapaneseManual)');

test('PLAYBACK_LIMITS exports expected limits (Quiz full sentence = 2, Learning all = 5)', () => {
  assert.equal(PLAYBACK_LIMITS.QUIZ_FULL_SENTENCE, 2);
  assert.equal(PLAYBACK_LIMITS.LEARNING_ALL, 5);
});

test('getVoicePlaybackLimit returns 2 for quiz sentence_romaji, 5 for all learning modes, null for other quiz modes', () => {
  assert.equal(getVoicePlaybackLimit('quiz', 'sentence_romaji'), 2);
  assert.equal(getVoicePlaybackLimit('quiz', 'kanji_match'), null);
  assert.equal(getVoicePlaybackLimit('quiz', 'katakana_blitz'), null);
  assert.equal(getVoicePlaybackLimit('quiz', 'sentence_cloze'), null);
  assert.equal(getVoicePlaybackLimit('quiz', 'vocab_booster_kana'), null);
  assert.equal(getVoicePlaybackLimit('quiz', 'vocab_booster_kanji'), null);

  assert.equal(getVoicePlaybackLimit('learning', 'kanji_match'), 5);
  assert.equal(getVoicePlaybackLimit('learning', 'sentence_romaji'), 5);
  assert.equal(getVoicePlaybackLimit('learning', 'sentence_cloze'), 5);
  assert.equal(getVoicePlaybackLimit('learning', 'vocab_booster_kana'), 5);
  assert.equal(getVoicePlaybackLimit('learning', 'vocab_booster_kanji'), 5);
  assert.equal(getVoicePlaybackLimit('learning', 'weakness_focus'), 5);
});

test('PlaybackLimiter tracks usage, remaining, exhaustion, and reset accurately', () => {
  const limiter = new PlaybackLimiter(2);
  assert.equal(limiter.hasLimit(), true);
  assert.equal(limiter.getUsed(), 0);
  assert.equal(limiter.getRemaining(), 2);
  assert.equal(limiter.isExhausted(), false);
  assert.equal(limiter.canPlay(), true);

  assert.equal(limiter.consumeManualPlay(), true);
  assert.equal(limiter.getUsed(), 1);
  assert.equal(limiter.getRemaining(), 1);
  assert.equal(limiter.isExhausted(), false);

  assert.equal(limiter.consumeManualPlay(), true);
  assert.equal(limiter.getUsed(), 2);
  assert.equal(limiter.getRemaining(), 0);
  assert.equal(limiter.isExhausted(), true);
  assert.equal(limiter.canPlay(), false);

  // Subsequent attempt blocked without incrementing usedPlays
  assert.equal(limiter.consumeManualPlay(), false);
  assert.equal(limiter.getUsed(), 2);
  assert.equal(limiter.getRemaining(), 0);

  limiter.reset(5);
  assert.equal(limiter.maxPlays, 5);
  assert.equal(limiter.getUsed(), 0);
  assert.equal(limiter.getRemaining(), 5);

  const unlimited = new PlaybackLimiter(null);
  assert.equal(unlimited.hasLimit(), false);
  assert.equal(unlimited.getRemaining(), null);
  for (let i = 0; i < 10; i++) {
    assert.equal(unlimited.consumeManualPlay(), true);
  }
  assert.equal(unlimited.isExhausted(), false);
});

test('sound.speakJapaneseManual enforces limiter and ignores empty text without consuming plays', () => {
  resetSpokenLog();
  const limiter = new PlaybackLimiter(2);

  // Auto-play does not consume limiter
  sound.speakJapanese('自動再生');
  assert.equal(spokenUtterances.length, 1);
  assert.equal(limiter.getUsed(), 0);

  // Empty or HTML-only whitespace text does not consume limiter
  assert.equal(sound.speakJapaneseManual('', limiter), false);
  assert.equal(sound.speakJapaneseManual('   ', limiter), false);
  assert.equal(sound.speakJapaneseManual('<b>   </b>', limiter), false);
  assert.equal(sound.speakJapaneseManual('<span>\t\n</span>', limiter), false);
  assert.equal(limiter.getUsed(), 0);
  assert.equal(spokenUtterances.length, 1);

  assert.equal(sound.speakJapaneseManual('一回目', limiter), true);
  assert.equal(sound.speakJapaneseManual('二回目', limiter), true);
  assert.equal(sound.speakJapaneseManual('三回目', limiter), false);
  assert.equal(spokenUtterances.length, 3);
  assert.equal(limiter.getRemaining(), 0);
});

/* =========================================================
   2. QUIZ MODE: TYPING FULL SENTENCE (2x LIMIT)
   ========================================================= */
console.log('\n2. Quiz Mode — Typing Full Sentence (sentence_romaji, max 2 manual plays)');

test('Quiz sentence_romaji: auto-play exempt, 2 manual plays allowed, UI updates 2/2 -> 1/2 -> 0/2, 3rd click + R + Space blocked, next question resets', () => {
  resetSpokenLog();
  const { engine, cardContainer } = createHarnessEngine();
  try {
    engine.startSession({
      sessionType: 'quiz',
      inputFormat: 'typing',
      mode: 'sentence_romaji',
      selectedLessons: ['all']
    });
    // Blur textarea so keyboard shortcuts R/Space are active
    global.document.activeElement = bodyEl;

    // Auto-play fired once on load without consuming manual allowance
    assert.equal(spokenUtterances.length, 1, 'Expected 1 automatic initial audio playback');
    assert.equal(engine.getManualAudioLimit(), 2);
    assert.equal(engine.getUsedManualAudioPlays(), 0);
    assert.equal(engine.getRemainingManualAudioPlays(), 2);

    const audioBtn = cardContainer.querySelector('#sRomajiAudioBtn');
    const countBadge = cardContainer.querySelector('#sRomajiAudioCount');
    assert.ok(audioBtn, '#sRomajiAudioBtn must exist');
    assert.ok(countBadge, '#sRomajiAudioCount must exist');
    assert.equal(countBadge.textContent, '2/2');
    assert.equal(audioBtn.disabled, false);
    assert.equal(audioBtn.getAttribute('data-plays-remaining'), '2');

    // Manual play 1
    audioBtn.click();
    assert.equal(spokenUtterances.length, 2);
    assert.equal(engine.getRemainingManualAudioPlays(), 1);
    assert.equal(countBadge.textContent, '1/2');
    assert.equal(audioBtn.disabled, false);

    // Manual play 2
    audioBtn.click();
    assert.equal(spokenUtterances.length, 3);
    assert.equal(engine.getRemainingManualAudioPlays(), 0);
    assert.equal(countBadge.textContent, '0/2');
    assert.equal(countBadge.classList.contains('exhausted'), true);
    assert.equal(audioBtn.disabled, true);
    assert.equal(audioBtn.getAttribute('aria-disabled'), 'true');
    assert.equal(audioBtn.classList.contains('audio-limit-reached'), true);

    // 3rd click (normal click AND direct onclick bypass attempt) must be blocked
    audioBtn.click();
    audioBtn.onclick({ stopPropagation() {} });
    assert.equal(spokenUtterances.length, 3, '3rd manual click must be blocked');

    // Keyboard R and Space must also be blocked
    dispatchWindowKeydown('r');
    dispatchWindowKeydown('R');
    dispatchWindowKeydown(' ', 'Space');
    assert.equal(spokenUtterances.length, 3, 'Keyboard R/Space must be blocked after 2 manual plays');

    // Even if launched with inputFormat = 'mcq', Space must NOT bypass limit
    engine.inputFormat = 'mcq';
    dispatchWindowKeydown(' ', 'Space');
    dispatchWindowKeydown('r');
    assert.equal(spokenUtterances.length, 3, 'Space/R must stay blocked in sentence_romaji regardless of inputFormat');

    // Advance to next question -> resets to 2/2 + fresh auto-play
    engine.currentIndex = 1;
    engine.renderCurrentView();
    global.document.activeElement = bodyEl;
    assert.equal(spokenUtterances.length, 4, 'Question 2 auto-play should fire');
    assert.equal(engine.getRemainingManualAudioPlays(), 2);
    const nextAudioBtn = cardContainer.querySelector('#sRomajiAudioBtn');
    const nextCountBadge = cardContainer.querySelector('#sRomajiAudioCount');
    assert.equal(nextCountBadge.textContent, '2/2');
    assert.equal(nextAudioBtn.disabled, false);

    // Verify R shortcut works on question 2 and consumes allowance
    dispatchWindowKeydown('r');
    assert.equal(spokenUtterances.length, 5);
    assert.equal(nextCountBadge.textContent, '1/2');
  } finally {
    cleanupEngine(engine);
  }
});

/* =========================================================
   3. QUIZ MODE: OTHER QUESTION TYPES REMAIN UNLIMITED
   ========================================================= */
console.log('\n3. Quiz Mode — Non-Full-Sentence Modes Remain Unlimited');

test('Quiz MCQ (kanji_match), Word Typing (kanji_match), and Quiz Cloze (sentence_cloze) allow >5 manual plays', () => {
  // 3a. Quiz MCQ
  resetSpokenLog();
  const h1 = createHarnessEngine();
  try {
    h1.engine.startSession({ sessionType: 'quiz', inputFormat: 'mcq', mode: 'kanji_match', selectedLessons: ['all'] });
    const initialCalls = spokenUtterances.length; // 1 auto-play
    const btn = h1.cardContainer.querySelector('#cardSpeechBtn');
    assert.ok(btn, 'Quiz MCQ #cardSpeechBtn must exist');
    for (let i = 0; i < 7; i++) btn.click();
    assert.equal(spokenUtterances.length, initialCalls + 7);
    assert.equal(btn.disabled, false);
  } finally {
    cleanupEngine(h1.engine);
  }

  // 3b. Quiz Word Typing
  resetSpokenLog();
  const h2 = createHarnessEngine();
  try {
    h2.engine.startSession({ sessionType: 'quiz', inputFormat: 'typing', mode: 'kanji_match', selectedLessons: ['all'] });
    const initialCalls = spokenUtterances.length; // 1 auto-play
    const btn = h2.cardContainer.querySelector('#cardSpeechBtn');
    assert.ok(btn, 'Quiz Word Typing #cardSpeechBtn must exist');
    for (let i = 0; i < 7; i++) btn.click();
    assert.equal(spokenUtterances.length, initialCalls + 7);
    assert.equal(btn.disabled, false);
  } finally {
    cleanupEngine(h2.engine);
  }

  // 3c. Quiz Cloze
  resetSpokenLog();
  const h3 = createHarnessEngine();
  try {
    h3.engine.startSession({ sessionType: 'quiz', inputFormat: 'mcq', mode: 'sentence_cloze', selectedLessons: ['all'] });
    const initialCalls = spokenUtterances.length; // 0 auto-play
    const btn = h3.cardContainer.querySelector('#clozeSpeechBtn');
    assert.ok(btn, 'Quiz Cloze #clozeSpeechBtn must exist');
    for (let i = 0; i < 7; i++) btn.click();
    assert.equal(spokenUtterances.length, initialCalls + 7);
    assert.equal(btn.disabled, false);
  } finally {
    cleanupEngine(h3.engine);
  }
});

/* =========================================================
   4. LEARNING MODE — ALL 5 QUESTION TYPES (5x LIMIT)
   ========================================================= */
console.log('\n4. Learning Mode — All 5 Audio & Question Types (max 5 manual plays)');

test('Learning Flashcard: auto-play exempt, 5 manual plays across word/sentence/R, Prev/Next preserves count, repeated flip cannot bypass', () => {
  resetSpokenLog();
  const { engine, cardContainer } = createHarnessEngine();
  try {
    engine.startSession({ sessionType: 'learning', inputFormat: 'mcq', mode: 'kanji_match', selectedLessons: ['all'] });
    global.document.activeElement = bodyEl;

    // Auto-play on load does NOT consume allowance
    assert.equal(spokenUtterances.length, 1);
    assert.equal(engine.getRemainingManualAudioPlays(), 5);

    const wordBtn = cardContainer.querySelector('#flashcardAudioBtn');
    const sentenceBtn = cardContainer.querySelector('#speakFcSentenceBtn');
    const counts = cardContainer.querySelectorAll('[data-audio-count]');
    assert.ok(wordBtn && sentenceBtn);
    assert.equal(counts.length, 2);
    assert.equal(counts[0].textContent, '5/5');
    assert.equal(counts[1].textContent, '5/5');

    // Play 1 (word button), Play 2 (sentence button), Play 3 (R key), Play 4 (word), Play 5 (sentence)
    wordBtn.click();
    assert.equal(counts[0].textContent, '4/5');
    sentenceBtn.click();
    assert.equal(counts[1].textContent, '3/5');
    dispatchWindowKeydown('r');
    assert.equal(counts[0].textContent, '2/5');
    wordBtn.click();
    assert.equal(counts[0].textContent, '1/5');
    sentenceBtn.click();
    assert.equal(counts[0].textContent, '0/5');
    assert.equal(counts[1].textContent, '0/5');
    assert.equal(spokenUtterances.length, 6); // 1 auto + 5 manual

    // Both buttons disabled
    assert.equal(wordBtn.disabled, true);
    assert.equal(sentenceBtn.disabled, true);
    assert.equal(wordBtn.classList.contains('audio-limit-reached'), true);
    assert.equal(sentenceBtn.classList.contains('audio-limit-reached'), true);

    // 6th play attempts blocked
    wordBtn.click();
    sentenceBtn.click();
    wordBtn.onclick({ stopPropagation() {} });
    dispatchWindowKeydown('r');
    assert.equal(spokenUtterances.length, 6, '6th manual play must be blocked on flashcard');

    // Repeated toggleFlashcardReveal plays at most 1 auto-reveal and does NOT allow infinite bypass
    engine.toggleFlashcardReveal(); // first reveal -> 1 auto-reveal
    assert.equal(spokenUtterances.length, 7);
    engine.toggleFlashcardReveal(); // close
    engine.toggleFlashcardReveal(); // re-open -> must NOT speak again
    engine.toggleFlashcardReveal(); // close
    engine.toggleFlashcardReveal(); // re-open -> must NOT speak again
    assert.equal(spokenUtterances.length, 7, 'Repeated flashcard flips must not bypass playback limit');

    // Next card gets fresh 5/5; returning via prevFlashcard preserves 0/5 and disabled state
    engine.nextFlashcard();
    assert.equal(engine.getRemainingManualAudioPlays(), 5);
    assert.equal(cardContainer.querySelector('#flashcardAudioBtn').disabled, false);

    engine.prevFlashcard();
    assert.equal(engine.getRemainingManualAudioPlays(), 0);
    assert.equal(cardContainer.querySelector('#flashcardAudioBtn').disabled, true);
    assert.equal(cardContainer.querySelector('#speakFcSentenceBtn').disabled, true);
    assert.equal(cardContainer.querySelector('[data-audio-count]').textContent, '0/5');
  } finally {
    cleanupEngine(engine);
  }
});

test('Learning Word Typing: auto-play exempt, 5 manual plays allowed, 6th blocked, repeated checkAnswer cannot bypass', () => {
  resetSpokenLog();
  const { engine, cardContainer } = createHarnessEngine();
  try {
    engine.startSession({ sessionType: 'learning', inputFormat: 'typing', mode: 'kanji_match', selectedLessons: ['all'] });
    global.document.activeElement = bodyEl;

    assert.equal(spokenUtterances.length, 1); // auto-play
    assert.equal(engine.getRemainingManualAudioPlays(), 5);

    const audioBtn = cardContainer.querySelector('#learningAudioBtn');
    const sentenceBtn = cardContainer.querySelector('#speakLearningSentenceBtn');
    const checkBtn = cardContainer.querySelector('#btnCheckTyping');
    const counts = cardContainer.querySelectorAll('[data-audio-count]');
    assert.equal(counts[0].textContent, '5/5');

    audioBtn.click();
    sentenceBtn.click();
    dispatchWindowKeydown('r');
    audioBtn.click();
    sentenceBtn.click();
    assert.equal(spokenUtterances.length, 6);
    assert.equal(counts[0].textContent, '0/5');
    assert.equal(audioBtn.disabled, true);
    assert.equal(sentenceBtn.disabled, true);

    // 6th manual play blocked
    audioBtn.click();
    sentenceBtn.click();
    dispatchWindowKeydown('r');
    assert.equal(spokenUtterances.length, 6);

    // Repeated checkAnswer clicks play auto-feedback at most once
    checkBtn.click();
    assert.equal(spokenUtterances.length, 7);
    checkBtn.click();
    checkBtn.click();
    assert.equal(spokenUtterances.length, 7, 'Repeated checkAnswer must not bypass playback limit');
  } finally {
    cleanupEngine(engine);
  }
});

test('Learning Full-Sentence Romaji: auto-play exempt, 5 manual plays allowed, 6th + R + Space blocked', () => {
  resetSpokenLog();
  const { engine, cardContainer } = createHarnessEngine();
  try {
    engine.startSession({ sessionType: 'learning', inputFormat: 'typing', mode: 'sentence_romaji', selectedLessons: ['all'] });
    global.document.activeElement = bodyEl;

    assert.equal(spokenUtterances.length, 1); // auto-play
    assert.equal(engine.getRemainingManualAudioPlays(), 5);

    const audioBtn = cardContainer.querySelector('#sRomajiAudioBtn');
    const countEl = cardContainer.querySelector('#sRomajiAudioCount');
    assert.equal(countEl.textContent, '5/5');

    for (let i = 4; i >= 0; i--) {
      audioBtn.click();
      assert.equal(countEl.textContent, `${i}/5`);
    }
    assert.equal(spokenUtterances.length, 6);
    assert.equal(audioBtn.disabled, true);

    audioBtn.click();
    audioBtn.onclick({ stopPropagation() {} });
    dispatchWindowKeydown('r');
    dispatchWindowKeydown(' ', 'Space');
    assert.equal(spokenUtterances.length, 6);
  } finally {
    cleanupEngine(engine);
  }
});

test('Learning Cloze: 5 manual plays allowed via button/R, 6th blocked, repeated reveal cannot bypass', () => {
  resetSpokenLog();
  const { engine, cardContainer } = createHarnessEngine();
  try {
    engine.startSession({ sessionType: 'learning', inputFormat: 'mcq', mode: 'sentence_cloze', selectedLessons: ['all'] });
    global.document.activeElement = bodyEl;

    assert.equal(spokenUtterances.length, 0); // no initial auto-play in cloze
    assert.equal(engine.getRemainingManualAudioPlays(), 5);

    const speechBtn = cardContainer.querySelector('#learningClozeSpeechBtn');
    const countEl = cardContainer.querySelector('[data-audio-count]');
    const revealBtn = cardContainer.querySelector('#btnRevealCloze');
    assert.equal(countEl.textContent, '5/5');

    speechBtn.click(); // 4/5
    dispatchWindowKeydown('r'); // 3/5
    speechBtn.click(); // 2/5
    speechBtn.click(); // 1/5
    speechBtn.click(); // 0/5

    assert.equal(spokenUtterances.length, 5);
    assert.equal(countEl.textContent, '0/5');
    assert.equal(speechBtn.disabled, true);

    // 6th play blocked
    speechBtn.click();
    dispatchWindowKeydown('r');
    assert.equal(spokenUtterances.length, 5);

    // Repeated reveal clicks play at most once
    revealBtn.click();
    assert.equal(spokenUtterances.length, 6);
    revealBtn.click();
    revealBtn.click();
    assert.equal(spokenUtterances.length, 6, 'Repeated cloze reveal must not bypass playback limit');
  } finally {
    cleanupEngine(engine);
  }
});

for (const vbMode of ['vocab_booster_kana', 'vocab_booster_kanji']) {
  test(`Learning Vocab Booster (${vbMode}): 5 manual plays allowed, count & disabled state survive renderBoard() swaps`, () => {
    resetSpokenLog();
    const { engine, cardContainer } = createHarnessEngine();
    try {
      engine.startSession({ sessionType: 'learning', inputFormat: 'mcq', mode: vbMode, selectedLessons: ['all'] });
      global.document.activeElement = bodyEl;

      assert.equal(spokenUtterances.length, 0);
      assert.equal(engine.getRemainingManualAudioPlays(), 5);

      const quotaBadge = cardContainer.querySelector('#vbAudioQuotaBadge');
      assert.ok(quotaBadge, '#vbAudioQuotaBadge must exist in Learning Vocab Booster');
      const countEl = quotaBadge.querySelector('[data-audio-count]');
      assert.equal(countEl.textContent, '5/5');

      let miniBtns = cardContainer.querySelectorAll('.vb-audio-mini');
      assert.equal(miniBtns.length, 3);

      // 2 manual plays
      miniBtns[0].click();
      miniBtns[1].click();
      assert.equal(spokenUtterances.length, 2);
      assert.equal(countEl.textContent, '3/5');

      // Trigger board re-render via move-down button on slot 0
      const moveDownBtn = cardContainer.querySelector('[data-move="down"]');
      assert.ok(moveDownBtn, 'Move down button should exist');
      moveDownBtn.click();

      // After renderBoard() re-render, count must still be 3/5 and buttons enabled
      assert.equal(countEl.textContent, '3/5');
      miniBtns = cardContainer.querySelectorAll('.vb-audio-mini');
      assert.equal(miniBtns.length, 3);
      assert.equal(miniBtns.every(b => !b.disabled), true);

      // Consume remaining 3 manual plays
      miniBtns[0].click();
      miniBtns[1].click();
      miniBtns[2].click();
      assert.equal(spokenUtterances.length, 5);
      assert.equal(countEl.textContent, '0/5');
      assert.equal(miniBtns.every(b => b.disabled === true), true);

      // Trigger another board swap re-render -> buttons MUST stay disabled at 0/5
      const moveDownBtn2 = cardContainer.querySelector('[data-move="down"]');
      moveDownBtn2.click();
      miniBtns = cardContainer.querySelectorAll('.vb-audio-mini');
      assert.equal(countEl.textContent, '0/5');
      assert.equal(miniBtns.every(b => b.disabled === true), true);

      // 6th click blocked
      miniBtns[0].click();
      miniBtns[0].onclick({ stopPropagation() {} });
      assert.equal(spokenUtterances.length, 5, '6th click on Vocab Booster audio must be blocked');
    } finally {
      cleanupEngine(engine);
    }
  });
}

/* =========================================================
   5. REGRESSION: NEXT -> PREV AUTO-PLAY REVISIT & SESSION RESET
   ========================================================= */
console.log('\n5. Regression — Next -> Prev Initial Auto-Play Bypass Prevention & Session Reset');

test('Learning Flashcard: Next -> Prev x3 on exhausted card triggers 0 additional auto-plays for card 0; new startSession resets', () => {
  resetSpokenLog();
  const { engine, cardContainer } = createHarnessEngine();
  try {
    engine.startSession({ sessionType: 'learning', inputFormat: 'mcq', mode: 'kanji_match', selectedLessons: ['all'] });
    global.document.activeElement = bodyEl;

    assert.equal(spokenUtterances.length, 1, 'Card 0 should auto-play once on initial load');
    const card0Text = engine.currentCard.kanji;

    // Exhaust all 5 manual plays on card 0
    const wordBtn = cardContainer.querySelector('#flashcardAudioBtn');
    for (let i = 0; i < 5; i++) wordBtn.click();
    assert.equal(spokenUtterances.length, 6);
    assert.equal(engine.getRemainingManualAudioPlays(), 0);

    // Cycle nextFlashcard -> prevFlashcard 3 times
    for (let cycle = 0; cycle < 3; cycle++) {
      engine.nextFlashcard();
      const beforeReturn = spokenUtterances.length;
      engine.prevFlashcard();
      assert.equal(
        spokenUtterances.length,
        beforeReturn,
        `Flashcard Next->Prev cycle ${cycle + 1} must trigger 0 additional speaks for card 0 (${card0Text})`
      );
      assert.equal(engine.getRemainingManualAudioPlays(), 0);
      assert.equal(cardContainer.querySelector('[data-audio-count]').textContent, '0/5');
      assert.equal(cardContainer.querySelector('#flashcardAudioBtn').disabled, true);
      assert.equal(cardContainer.querySelector('#speakFcSentenceBtn').disabled, true);
    }

    // Fresh startSession resets autoPlayedIndices so index 0 auto-plays once again
    resetSpokenLog();
    engine.startSession({ sessionType: 'learning', inputFormat: 'mcq', mode: 'kanji_match', selectedLessons: ['all'] });
    assert.equal(spokenUtterances.length, 1, 'Fresh startSession must auto-play card 0 once again');
    assert.equal(engine.getRemainingManualAudioPlays(), 5);
  } finally {
    cleanupEngine(engine);
  }
});

test('Learning Word Typing: Next -> Prev x3 on exhausted card triggers 0 additional auto-plays for card 0; new startSession resets', () => {
  resetSpokenLog();
  const { engine, cardContainer } = createHarnessEngine();
  try {
    engine.startSession({ sessionType: 'learning', inputFormat: 'typing', mode: 'kanji_match', selectedLessons: ['all'] });
    global.document.activeElement = bodyEl;

    assert.equal(spokenUtterances.length, 1, 'Card 0 should auto-play once on initial load');

    const audioBtn = cardContainer.querySelector('#learningAudioBtn');
    for (let i = 0; i < 5; i++) audioBtn.click();
    assert.equal(spokenUtterances.length, 6);
    assert.equal(engine.getRemainingManualAudioPlays(), 0);

    for (let cycle = 0; cycle < 3; cycle++) {
      engine.nextFlashcard();
      const beforeReturn = spokenUtterances.length;
      engine.prevFlashcard();
      assert.equal(
        spokenUtterances.length,
        beforeReturn,
        `Word Typing Next->Prev cycle ${cycle + 1} must trigger 0 additional speaks for card 0`
      );
      assert.equal(engine.getRemainingManualAudioPlays(), 0);
      assert.equal(cardContainer.querySelector('[data-audio-count]').textContent, '0/5');
      assert.equal(cardContainer.querySelector('#learningAudioBtn').disabled, true);
      assert.equal(cardContainer.querySelector('#speakLearningSentenceBtn').disabled, true);
    }

    // Fresh startSession resets autoPlayedIndices
    resetSpokenLog();
    engine.startSession({ sessionType: 'learning', inputFormat: 'typing', mode: 'kanji_match', selectedLessons: ['all'] });
    assert.equal(spokenUtterances.length, 1, 'Fresh startSession must auto-play card 0 once again');
    assert.equal(engine.getRemainingManualAudioPlays(), 5);
  } finally {
    cleanupEngine(engine);
  }
});

test('Learning Full-Sentence Romaji: ArrowRight -> ArrowLeft x3 on exhausted card triggers 0 additional auto-plays for card 0; new startSession resets', () => {
  resetSpokenLog();
  const { engine, cardContainer } = createHarnessEngine();
  try {
    engine.startSession({ sessionType: 'learning', inputFormat: 'typing', mode: 'sentence_romaji', selectedLessons: ['all'] });
    global.document.activeElement = bodyEl;

    assert.equal(spokenUtterances.length, 1, 'Card 0 should auto-play once on initial load');

    const audioBtn = cardContainer.querySelector('#sRomajiAudioBtn');
    for (let i = 0; i < 5; i++) audioBtn.click();
    assert.equal(spokenUtterances.length, 6);
    assert.equal(engine.getRemainingManualAudioPlays(), 0);

    for (let cycle = 0; cycle < 3; cycle++) {
      global.document.activeElement = bodyEl;
      dispatchWindowKeydown('ArrowRight', 'ArrowRight');
      assert.equal(engine.currentIndex, 1);
      const beforeReturn = spokenUtterances.length;
      global.document.activeElement = bodyEl;
      dispatchWindowKeydown('ArrowLeft', 'ArrowLeft');
      assert.equal(engine.currentIndex, 0);
      assert.equal(
        spokenUtterances.length,
        beforeReturn,
        `Learning sentence_romaji ArrowRight->ArrowLeft cycle ${cycle + 1} must trigger 0 additional speaks for card 0`
      );
      assert.equal(engine.getRemainingManualAudioPlays(), 0);
      assert.equal(cardContainer.querySelector('#sRomajiAudioCount').textContent, '0/5');
      assert.equal(cardContainer.querySelector('#sRomajiAudioBtn').disabled, true);
    }

    // Fresh startSession resets autoPlayedIndices
    resetSpokenLog();
    engine.startSession({ sessionType: 'learning', inputFormat: 'typing', mode: 'sentence_romaji', selectedLessons: ['all'] });
    assert.equal(spokenUtterances.length, 1, 'Fresh startSession must auto-play card 0 once again');
    assert.equal(engine.getRemainingManualAudioPlays(), 5);
  } finally {
    cleanupEngine(engine);
  }
});

console.log(`\nSummary: ${passedCount} tests passed.`);
if (process.exitCode && process.exitCode !== 0) {
  console.error('Some voice audio playback limit checks FAILED.');
} else {
  console.log('ALL VOICE AUDIO PLAYBACK LIMIT CHECKS PASSED!');
}
