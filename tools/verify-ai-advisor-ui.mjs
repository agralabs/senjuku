// Zero-Dependency Frontend DOM & Non-Chatbot Verification for AI Advisor UI
import assert from 'node:assert/strict';
import { AiAdvisorView } from '../js/ai-advisor.js';

// Minimal DOM container harness supporting innerHTML inspection, querySelector(#id), and click events
class MockButton {
  constructor(id, disabled = false) {
    this.id = id;
    this.disabled = disabled;
    this.listeners = {};
  }
  addEventListener(evt, fn) {
    this.listeners[evt] = fn;
  }
  async click() {
    if (this.disabled) return;
    if (this.listeners.click) {
      await this.listeners.click({ preventDefault() {} });
    }
  }
}

class MockContainer {
  constructor() {
    this._html = '';
    this._buttons = new Map();
  }
  set innerHTML(val) {
    this._html = String(val || '');
    this._buttons.clear();
    // Parse <button ... id="..." ...> tags from rendered HTML
    const btnRegex = /<button\b([^>]*)>/gi;
    let m;
    while ((m = btnRegex.exec(this._html)) !== null) {
      const attrs = m[1];
      const idMatch = attrs.match(/\bid="([^"]+)"/i);
      if (idMatch) {
        const disabled = /\bdisabled\b/i.test(attrs);
        this._buttons.set(idMatch[1], new MockButton(idMatch[1], disabled));
      }
    }
  }
  get innerHTML() {
    return this._html;
  }
  querySelector(selector) {
    if (selector.startsWith('#')) {
      return this._buttons.get(selector.slice(1)) || null;
    }
    return null;
  }
}

function assertNoChatbotInputs(html, stateLabel) {
  assert.ok(!/<input\b/i.test(html), `[${stateLabel}] Must contain ZERO <input> elements`);
  assert.ok(!/<textarea\b/i.test(html), `[${stateLabel}] Must contain ZERO <textarea> elements`);
  assert.ok(!/<form\b/i.test(html), `[${stateLabel}] Must contain ZERO <form> elements`);
  assert.ok(!/\bcontenteditable\b/i.test(html), `[${stateLabel}] Must contain ZERO contenteditable attributes`);
}

function mockRes(status, jsonObj) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return jsonObj;
    }
  };
}

let loginOpened = false;
let drillLaunched = false;
let fetchResponder = null;
const fetchLog = [];

const container = new MockContainer();
const view = new AiAdvisorView();
view.init(container, {
  fetchImpl: async (url, opts) => {
    fetchLog.push({ url, method: opts?.method || 'GET', body: opts?.body ? JSON.parse(opts.body) : null });
    return await fetchResponder(url, opts);
  },
  onOpenLogin: () => { loginOpened = true; },
  onLaunchDrill: () => { drillLaunched = true; }
});

// 1. Unauthenticated (401) state
console.log('=== 1. UNAUTHENTICATED GUEST STATE ===');
fetchResponder = async () => mockRes(401, { error: 'Unauthorized' });
await view.loadStatus();
assert.equal(view.state, 'unauthenticated');
assertNoChatbotInputs(container.innerHTML, 'unauthenticated');
assert.ok(container.innerHTML.includes('btnAdvisorOpenLogin'));
await container.querySelector('#btnAdvisorOpenLogin').click();
assert.equal(loginOpened, true, 'Guest CTA must invoke onOpenLogin');
console.log('PASS: Unauthenticated state & login CTA verified');

// 2. Insufficient data state
console.log('=== 2. INSUFFICIENT DATA STATE ===');
fetchResponder = async () => mockRes(200, {
  enabled: true,
  model: 'gemini-3.5-flash-lite',
  hasEnoughData: false,
  cachedAdvice: null
});
await view.loadStatus();
assert.equal(view.state, 'insufficient_data');
assertNoChatbotInputs(container.innerHTML, 'insufficient_data');
assert.ok(container.innerHTML.includes('btnAdvisorStartDrill'));
await container.querySelector('#btnAdvisorStartDrill').click();
assert.equal(drillLaunched, true, 'Insufficient data CTA must invoke onLaunchDrill');
console.log('PASS: Insufficient data state & drill CTA verified');

// 3. Idle -> Loading -> Ready state + XSS Escaping
console.log('=== 3. IDLE -> LOADING -> READY + XSS ESCAPING ===');
fetchResponder = async () => mockRes(200, {
  enabled: true,
  model: 'gemini-3.5-flash-lite',
  hasEnoughData: true,
  cachedAdvice: null
});
await view.loadStatus();
assert.equal(view.state, 'idle');
assertNoChatbotInputs(container.innerHTML, 'idle');
assert.ok(container.innerHTML.includes('Buat Saran AI'));

let resolveGenerate;
fetchResponder = () => new Promise(resolve => { resolveGenerate = resolve; });
const genPromise = view.generate({ forceRefresh: false });

// While in-flight, verify loading skeleton & disabled button & no inputs
assert.equal(view.state, 'loading');
assert.ok(container.innerHTML.includes('aria-busy="true"'), 'Loading skeleton must have aria-busy="true"');
assert.equal(container.querySelector('#btnGenerateAiAdvice').disabled, true);
assertNoChatbotInputs(container.innerHTML, 'loading');

// Resolve with XSS payloads embedded in advice
resolveGenerate(mockRes(200, {
  status: 'ready',
  cached: false,
  source: 'gemini',
  model: 'gemini-3.5-flash-lite',
  generatedAt: '2026-11-21T14:00:00.000Z',
  locale: 'id',
  advice: {
    bestStudyWindow: 'Pagi (05:00–11:59) <img src=x onerror=alert(1)>',
    wordCount: 42,
    bullets: [
      { category: 'strength', text: 'Kanji kuat 92% <script>evil()</script> di Bab 1.' },
      { category: 'weakness', text: 'Kalimat Rumpang masih 35% di 会社員.' },
      { category: 'timing', text: 'Sesi Pagi 95% akurat dibanding malam.' }
    ]
  }
}));
await genPromise;

assert.equal(view.state, 'ready');
assertNoChatbotInputs(container.innerHTML, 'ready');
assert.ok(container.innerHTML.includes('Perbarui Saran'), 'Button label should switch to Refresh');
assert.ok(container.innerHTML.includes('42 kata'));
assert.ok(container.innerHTML.includes('Gemini 3.5 Flash-Lite'));
assert.ok(!container.innerHTML.includes('<script>'), 'Raw <script> tag must be escaped');
assert.ok(!container.innerHTML.includes('<img '), 'Raw <img> tag must be escaped');
assert.ok(container.innerHTML.includes('&lt;script&gt;evil()&lt;/script&gt;'), 'Escaped script text must be present');
assert.ok(container.innerHTML.includes('&lt;img src=x onerror=alert(1)&gt;'), 'Escaped img text must be present');
const bulletMatches = container.innerHTML.match(/class="ai-advisor-bullet-item /g) || [];
assert.equal(bulletMatches.length, 3, 'Should render all 3 bullets');
console.log('PASS: Idle -> Loading -> Ready transitions and XSS escaping verified');

// 4. Rate Limit (429) preserves existing advice & shows inline banner
console.log('=== 4. RATE LIMIT (429) PRESERVES ADVICE ===');
fetchResponder = async () => mockRes(429, {
  status: 'rate_limited',
  error: 'Tunggu 45 detik sebelum memperbarui saran lagi.',
  retryAfterSec: 45
});
await view.generate({ forceRefresh: true });
assert.equal(view.state, 'ready', 'Previously loaded advice must be preserved on 429');
assert.ok(container.innerHTML.includes('Tunggu 45 detik'), 'Inline cooldown error banner must appear');
assert.ok(container.innerHTML.includes('Kalimat Rumpang masih 35%'), 'Existing bullets must remain visible');
assertNoChatbotInputs(container.innerHTML, 'rate_limited');
console.log('PASS: 429 rate-limit banner preserves existing advice');

// 5. ID / EN Locale Toggle (segmented buttons, NOT text inputs)
console.log('=== 5. ID / EN LOCALE TOGGLE ===');
fetchResponder = async () => mockRes(200, {
  enabled: true,
  model: 'gemini-3.5-flash-lite',
  hasEnoughData: true,
  cachedAdvice: null
});
await container.querySelector('#btnAdvisorLocaleEn').click();
assert.equal(view.locale, 'en');
assert.ok(fetchLog.some(f => f.url === '/api/advisor/status?locale=en'));
assert.ok(container.innerHTML.includes('Data-Backed Study Advice'));
assert.ok(container.innerHTML.includes('Generate AI Advice'));
assertNoChatbotInputs(container.innerHTML, 'locale_en');
console.log('PASS: ID/EN button toggle verified');

// 6. Error state (500 without prior advice)
console.log('=== 6. ERROR STATE (500) ===');
fetchResponder = async () => mockRes(500, { error: 'Server error' });
await view.generate({ forceRefresh: false });
assert.equal(view.state, 'error');
assert.ok(container.innerHTML.includes('Server error'));
assertNoChatbotInputs(container.innerHTML, 'error');
console.log('PASS: Error state verified');

// 7. Regression: loadStatus() while generate() is in-flight keeps state === 'loading' & blocks duplicate POST
console.log('=== 7. REGRESSION: loadStatus() DOES NOT CLOBBER IN-FLIGHT generate() ===');
let resolveInFlightGen;
let postCount = 0;
fetchResponder = async (url, opts) => {
  if ((opts?.method || 'GET') === 'POST') {
    postCount++;
    return new Promise(resolve => { resolveInFlightGen = resolve; });
  }
  return mockRes(200, { enabled: true, hasEnoughData: true, cachedAdvice: null });
};
const inFlightPromise = view.generate({ forceRefresh: false });
assert.equal(view.state, 'loading');
await view.loadStatus();
assert.equal(view.state, 'loading', 'loadStatus() must not reset in-flight loading state');
await view.generate({ forceRefresh: false });
assert.equal(postCount, 1, 'Second concurrent POST must be blocked while loading');
resolveInFlightGen(mockRes(200, {
  status: 'ready',
  cached: false,
  source: 'gemini',
  model: 'gemini-3.5-flash-lite',
  generatedAt: '2026-11-21T14:30:00.000Z',
  locale: view.locale,
  advice: {
    bestStudyWindow: 'Morning (05:00–11:59)',
    wordCount: 30,
    bullets: [
      { category: 'strength', text: 'Kanji accuracy is strong at 92%.' },
      { category: 'weakness', text: 'Cloze sentences need extra review.' },
      { category: 'timing', text: 'Morning sessions deliver your best accuracy.' }
    ]
  }
}));
await inFlightPromise;
assert.equal(view.state, 'ready');
console.log('PASS: loadStatus() preserves in-flight loading state and prevents duplicate POST');

// 8. Regression: Rapid setLocale('en') (slow) -> setLocale('id') (fast) discards stale EN response
console.log('=== 8. REGRESSION: RAPID LOCALE TOGGLE DISCARDS STALE RESPONSE ===');
// Start from 'id' so setLocale('en') triggers a real switch
view.locale = 'id';
let resolveSlowEn;
fetchResponder = async (url) => {
  if (url.includes('locale=en')) {
    return new Promise(resolve => { resolveSlowEn = resolve; });
  }
  return mockRes(200, {
    enabled: true,
    hasEnoughData: true,
    cachedAdvice: {
      bestStudyWindow: 'Pagi (05:00–11:59)',
      wordCount: 28,
      bullets: [
        { category: 'strength', text: 'Respon Bahasa Indonesia yang cepat menang.' },
        { category: 'weakness', text: 'Kalimat rumpang perlu latihan tambahan.' },
        { category: 'timing', text: 'Belajar pagi memberi akurasi tertinggi.' }
      ]
    },
    cachedAt: '2026-11-21T14:35:00.000Z',
    cachedSource: 'gemini'
  });
};
const slowEnPromise = view.setLocale('en');
const fastIdPromise = view.setLocale('id');
await fastIdPromise;
assert.equal(view.locale, 'id');
assert.ok(container.innerHTML.includes('Respon Bahasa Indonesia yang cepat menang.'));

// Now resolve the stale EN response after ID has already settled
resolveSlowEn(mockRes(200, {
  enabled: true,
  hasEnoughData: true,
  cachedAdvice: {
    bestStudyWindow: 'STALE_EN_WINDOW',
    wordCount: 25,
    bullets: [
      { category: 'strength', text: 'STALE_EN_BULLET should never overwrite ID.' },
      { category: 'weakness', text: 'Stale weakness bullet.' },
      { category: 'timing', text: 'Stale timing bullet.' }
    ]
  },
  cachedAt: '2026-11-21T14:34:00.000Z',
  cachedSource: 'gemini'
}));
await slowEnPromise;
assert.equal(view.locale, 'id');
assert.ok(!container.innerHTML.includes('STALE_EN_BULLET'), 'Stale EN response must be discarded');
assert.ok(container.innerHTML.includes('Respon Bahasa Indonesia yang cepat menang.'));
console.log('PASS: Out-of-order stale locale response discarded cleanly');

// 9. Regression: setLocale('en') from state === 'error' does not flash "Terjadi kesalahan."
console.log('=== 9. REGRESSION: setLocale() FROM ERROR STATE DOES NOT FLASH INDONESIAN ERROR ===');
view.locale = 'id';
view.state = 'error';
view.errorMessage = 'Gagal sebelumnya.';
view.render();
let resolveAfterLocaleSwitch;
fetchResponder = () => new Promise(resolve => { resolveAfterLocaleSwitch = resolve; });
const switchFromErrPromise = view.setLocale('en');
assert.equal(view.state, 'idle', 'setLocale() must reset state to idle immediately');
assert.ok(!container.innerHTML.includes('Terjadi kesalahan.'), 'Must not flash hardcoded Indonesian error');
assert.ok(container.innerHTML.includes('aria-pressed="true"'), 'Locale buttons must expose aria-pressed');
resolveAfterLocaleSwitch(mockRes(200, { enabled: true, hasEnoughData: true, cachedAdvice: null }));
await switchFromErrPromise;
console.log('PASS: setLocale() from error state resets cleanly without flashing Indonesian fallback');

// 10. Regression: Bullet with Object.prototype category ('toString') falls back to action badge cleanly
console.log('=== 10. REGRESSION: Object.prototype CATEGORY COLLISION GUARD ===');
view.locale = 'en';
view.state = 'ready';
view.advice = {
  bestStudyWindow: 'Morning (05:00–11:59)',
  wordCount: 24,
  bullets: [
    { category: 'toString', text: 'Prototype key must safely map to Next Step action badge.' },
    { category: 'strength', text: 'Kanji accuracy stays above 90%.' },
    { category: 'timing', text: 'Morning study sessions are most consistent.' }
  ]
};
view.render();
assert.ok(!container.innerHTML.includes('undefined'), 'Prototype category must never render undefined');
assert.ok(container.innerHTML.includes('Next Step'), 'Prototype category must fall back to action badge');
assertNoChatbotInputs(container.innerHTML, 'prototype_category');
console.log('PASS: Object.prototype category collision safely falls back to action badge');

// 11. Regression: clearLocalState() immediately wipes User A's advice HTML from container.innerHTML
console.log('=== 11. REGRESSION: clearLocalState() IMMEDIATELY WIPES STALE ADVICE DOM ===');
view.locale = 'en';
view.state = 'ready';
view.advice = {
  bestStudyWindow: 'USER_A_PRIVATE_WINDOW',
  wordCount: 22,
  bullets: [
    { category: 'strength', text: 'USER_A_PRIVATE_ADVICE_BULLET_1' },
    { category: 'weakness', text: 'USER_A_PRIVATE_ADVICE_BULLET_2' },
    { category: 'timing', text: 'USER_A_PRIVATE_ADVICE_BULLET_3' }
  ]
};
view.render();
assert.ok(container.innerHTML.includes('USER_A_PRIVATE_ADVICE_BULLET_1'), 'Precondition: User A advice should be rendered');
view.clearLocalState();
assert.equal(view.state, 'idle', 'clearLocalState() must reset state to idle');
assert.equal(view.advice, null, 'clearLocalState() must clear in-memory advice');
assert.ok(!container.innerHTML.includes('USER_A_PRIVATE_ADVICE_BULLET_1'), 'clearLocalState() must immediately wipe User A advice from DOM');
assert.ok(!container.innerHTML.includes('USER_A_PRIVATE_WINDOW'), 'clearLocalState() must immediately wipe User A study window from DOM');
assert.ok(container.innerHTML.includes('data-advisor-state="idle"'), 'DOM should immediately reflect idle state');
assertNoChatbotInputs(container.innerHTML, 'clear_local_state');
console.log('PASS: clearLocalState() immediately wipes User A advice HTML from DOM');

// 12. Regression: In-flight generate() resolving (200 OK) after clearLocalState() + loadStatus() (unauthenticated) is discarded
console.log('=== 12. REGRESSION: IN-FLIGHT generate() (200 OK) DISCARDED AFTER AUTH SWITCH ===');
let resolveUserAGen200;
fetchResponder = async (url, opts) => {
  if ((opts?.method || 'GET') === 'POST') {
    return new Promise(resolve => { resolveUserAGen200 = resolve; });
  }
  return mockRes(401, { error: 'Unauthorized' });
};
const userAGen200Promise = view.generate({ forceRefresh: false });
assert.equal(view.state, 'loading', 'generate() should enter loading state');

// User A logs out while generate() is in-flight
view.clearLocalState();
assert.equal(view.state, 'idle', 'clearLocalState() must clear loading state so loadStatus() is not blocked');
await view.loadStatus();
assert.equal(view.state, 'unauthenticated', 'loadStatus() after logout must settle to unauthenticated');
assert.ok(container.innerHTML.includes('btnAdvisorOpenLogin'), 'Guest login CTA must be rendered');

// Now User A's stale POST /api/advisor/generate resolves 200 OK
resolveUserAGen200(mockRes(200, {
  status: 'ready',
  cached: false,
  source: 'gemini',
  model: 'gemini-3.5-flash-lite',
  generatedAt: '2026-11-21T15:00:00.000Z',
  locale: 'en',
  advice: {
    bestStudyWindow: 'USER_A_LEAKED_WINDOW',
    wordCount: 25,
    bullets: [
      { category: 'strength', text: 'USER_A_LEAKED_200_ADVICE should never appear.' },
      { category: 'weakness', text: 'Stale User A weakness.' },
      { category: 'timing', text: 'Stale User A timing.' }
    ]
  }
}));
await userAGen200Promise;
assert.equal(view.state, 'unauthenticated', 'Stale User A 200 OK must not overwrite unauthenticated state');
assert.equal(view.advice, null, 'Stale User A 200 OK must not populate advice');
assert.ok(!container.innerHTML.includes('USER_A_LEAKED_200_ADVICE'), 'Stale User A 200 OK must not render into DOM');
assert.ok(container.innerHTML.includes('btnAdvisorOpenLogin'), 'Unauthenticated DOM must remain intact');
console.log('PASS: In-flight generate() (200 OK) discarded after clearLocalState() + loadStatus()');

// 13. Regression: In-flight generate() failing (500 & network throw) after clearLocalState() does not restore User A prevAdvice
console.log('=== 13. REGRESSION: IN-FLIGHT generate() FAILURE (500 & THROW) DOES NOT RESTORE prevAdvice ===');
const userAPrevAdvice = {
  bestStudyWindow: 'USER_A_PREV_WINDOW',
  wordCount: 24,
  bullets: [
    { category: 'strength', text: 'USER_A_PREV_ADVICE_SECRET must never be restored.' },
    { category: 'weakness', text: 'Prior weakness.' },
    { category: 'timing', text: 'Prior timing.' }
  ]
};

// 13a: HTTP 500 error path
view.state = 'ready';
view.advice = userAPrevAdvice;
view.render();
let resolveUserAGen500;
fetchResponder = async (url, opts) => {
  if ((opts?.method || 'GET') === 'POST') {
    return new Promise(resolve => { resolveUserAGen500 = resolve; });
  }
  return mockRes(401, { error: 'Unauthorized' });
};
const userAGen500Promise = view.generate({ forceRefresh: true });
assert.equal(view.state, 'loading');
view.clearLocalState();
await view.loadStatus();
assert.equal(view.state, 'unauthenticated');
resolveUserAGen500(mockRes(500, { error: 'USER_A_500_ERROR' }));
await userAGen500Promise;
assert.equal(view.state, 'unauthenticated', 'Stale 500 response must not overwrite unauthenticated state');
assert.equal(view.advice, null, 'Stale 500 response must not restore User A prevAdvice');
assert.ok(!container.innerHTML.includes('USER_A_PREV_ADVICE_SECRET'), 'User A prevAdvice must not leak into DOM on 500');
assert.ok(!container.innerHTML.includes('USER_A_500_ERROR'), 'Stale 500 error message must not render into DOM');

// 13b: Network throw / catch path
view.state = 'ready';
view.advice = userAPrevAdvice;
view.render();
let rejectUserAGenNet;
fetchResponder = async (url, opts) => {
  if ((opts?.method || 'GET') === 'POST') {
    return new Promise((_, reject) => { rejectUserAGenNet = reject; });
  }
  return mockRes(401, { error: 'Unauthorized' });
};
const userAGenNetPromise = view.generate({ forceRefresh: true });
assert.equal(view.state, 'loading');
view.clearLocalState();
await view.loadStatus();
assert.equal(view.state, 'unauthenticated');
rejectUserAGenNet(new Error('Simulated network disconnect'));
await userAGenNetPromise;
assert.equal(view.state, 'unauthenticated', 'Stale network throw must not overwrite unauthenticated state');
assert.equal(view.advice, null, 'Stale network throw must not restore User A prevAdvice');
assert.ok(!container.innerHTML.includes('USER_A_PREV_ADVICE_SECRET'), 'User A prevAdvice must not leak into DOM on network throw');
assert.ok(container.innerHTML.includes('btnAdvisorOpenLogin'), 'Unauthenticated DOM must remain intact after stale catch');
console.log('PASS: In-flight generate() failures (500 & network throw) discarded without restoring prevAdvice');

// 14. Regression: clearLocalState() resets exhausted 3x/day quota so User A's limit never leaks to User B (even on HTTP 500)
console.log('=== 14. REGRESSION: clearLocalState() RESETS EXHAUSTED QUOTA & GUARDS NULL/EMPTY COERCION ===');
view.locale = 'en';
fetchResponder = async () => mockRes(200, {
  enabled: true,
  hasEnoughData: true,
  dailyLimit: 3,
  remainingToday: 0,
  cachedAdvice: {
    bestStudyWindow: 'Morning (05:00–11:59)',
    wordCount: 22,
    bullets: [
      { category: 'strength', text: 'User A exhausted quota strength bullet.' },
      { category: 'weakness', text: 'User A exhausted quota weakness bullet.' },
      { category: 'timing', text: 'User A exhausted quota timing bullet.' }
    ]
  },
  cachedAt: '2026-11-21T15:20:00.000Z',
  cachedSource: 'gemini'
});
await view.loadStatus();
assert.equal(view.dailyLimit, 3);
assert.equal(view.remainingToday, 0);
assert.equal(container.querySelector('#btnGenerateAiAdvice').disabled, true, 'Precondition: User A button must be disabled when remainingToday=0');
assert.ok(container.innerHTML.includes('Daily Limit (3/3) Reached'), 'Precondition: User A must see daily-limit-reached label');

// User A logs out -> clearLocalState() must reset quota and re-enable action button immediately
view.clearLocalState();
assert.equal(view.dailyLimit, 3, 'clearLocalState() must reset dailyLimit to 3');
assert.equal(view.remainingToday, 3, 'clearLocalState() must reset remainingToday to 3');
assert.equal(container.querySelector('#btnGenerateAiAdvice').disabled, false, 'clearLocalState() must re-enable #btnGenerateAiAdvice');
assert.ok(!container.innerHTML.includes('Daily Limit (3/3) Reached'), 'clearLocalState() must remove EN daily-limit-reached label');
assert.ok(!container.innerHTML.includes('Batas 3×/Hari Tercapai'), 'clearLocalState() must remove ID daily-limit-reached label');
assertNoChatbotInputs(container.innerHTML, 'quota_reset_clear');

// User B logs in and transient loadStatus() returns HTTP 500 -> User B's button must stay enabled
fetchResponder = async () => mockRes(500, { error: 'Transient status failure for User B' });
await view.loadStatus();
assert.equal(view.state, 'error', 'Transient 500 should render error state for User B');
assert.equal(view.dailyLimit, 3, 'User B dailyLimit must remain 3 on transient 500');
assert.equal(view.remainingToday, 3, 'User B remainingToday must remain 3 on transient 500');
assert.equal(container.querySelector('#btnGenerateAiAdvice').disabled, false, 'User B #btnGenerateAiAdvice must NOT be disabled by User A leaked quota');
assert.ok(!container.innerHTML.includes('Daily Limit (3/3) Reached'), 'User B error state must NOT show User A daily-limit-reached label');
assertNoChatbotInputs(container.innerHTML, 'user_b_transient_500');

// Defensive numeric guard: null or '' quota fields in API payload must NOT coerce to 0
fetchResponder = async () => mockRes(200, {
  enabled: true,
  hasEnoughData: true,
  dailyLimit: null,
  remainingToday: '',
  cachedAdvice: null
});
await view.loadStatus();
assert.equal(view.dailyLimit, 3, 'null dailyLimit must not coerce to 0');
assert.equal(view.remainingToday, 3, 'empty-string remainingToday must not coerce to 0');
assert.equal(container.querySelector('#btnGenerateAiAdvice').disabled, false, 'null/empty quota fields must not disable #btnGenerateAiAdvice');
assertNoChatbotInputs(container.innerHTML, 'null_empty_quota_guard');
console.log('PASS: clearLocalState() quota reset, User B 500 isolation, and null/empty numeric guards verified');

console.log('\nALL AI ADVISOR FRONTEND UI & NON-CHATBOT TESTS PASSED (14/14)!');
