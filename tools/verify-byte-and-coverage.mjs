import fs from 'fs';

// Mock browser globals
const store = {};
global.localStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => { store[k] = String(v); }
};
global.window = {
  localStorage: global.localStorage,
  speechSynthesis: { speak: () => {}, cancel: () => {}, getVoices: () => [] },
  AudioContext: class {
    createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } }; }
    createOscillator() { return { connect: () => {}, start: () => {}, stop: () => {}, frequency: { setValueAtTime: () => {} } }; }
  }
};
global.window.webkitAudioContext = global.window.AudioContext;
global.speechSynthesis = global.window.speechSynthesis;
global.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };

const { progress } = await import('../js/srs.js');
const { drillEngine, SESSION_BYTE_SIZE } = await import('../js/drills.js');
const { MASTER_DRILL_ITEMS } = await import('../data/kanji-vocabulary.js');
const { CLOZE_SENTENCE_ITEMS } = await import('../data/cloze-sentences.js');
const { SENTENCE_ROMAJI_ITEMS, checkSentenceRomajiMatch } = await import('../data/sentence-romaji.js');

function assert(cond, msg) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
  console.log(`✔ ${msg}`);
}

console.log('=== 1. VERIFY DEFAULT 0 BAB SELECTED & START DISABLED ===');
const html = fs.readFileSync('index.html', 'utf8');
const checkedLessons = html.match(/name="lessonCheck"[^>]*checked/g) || [];
assert(checkedLessons.length === 0, 'All 14 lessons are unchecked by default (reset state)');
assert(html.includes('id="startDrillBtn" disabled'), 'START button is disabled by default until >= 1 Bab is selected');
assert(html.includes('value="sentence_romaji"'), 'sentence_romaji option exists in drillModeSelect');
assert(html.includes('id="startSentenceRomajiBtn"'), 'startSentenceRomajiBtn quick chip exists in index.html');

console.log('\n=== 2. VERIFY FULL-SENTENCE ROMAJI BANK (30s / 45s) ===');
assert(SENTENCE_ROMAJI_ITEMS.length >= 100, `Loaded ${SENTENCE_ROMAJI_ITEMS.length} full audio sentences across Bab 1-14`);
const standard30 = SENTENCE_ROMAJI_ITEMS.filter(it => it.timeLimit === 30);
const long45 = SENTENCE_ROMAJI_ITEMS.filter(it => it.timeLimit === 45);
assert(standard30.length > 0 && long45.length > 0, `Timer limits split cleanly: ${standard30.length} standard (30s) + ${long45.length} long sentences (45s)`);
assert(checkSentenceRomajiMatch('ohayou gozaimasu', 'Ohayou gozaimasu.').isCorrect, 'Romaji matcher ignores case & punctuation');
assert(checkSentenceRomajiMatch('ohayo gozaimasu', 'Ohayou gozaimasu.').isCorrect, 'Romaji matcher accepts long-vowel variant (ou/o)');
assert(!checkSentenceRomajiMatch('konbanwa', 'Ohayou gozaimasu.').isCorrect, 'Romaji matcher rejects wrong sentence');

console.log('\n=== 3. VERIFY BYTE SIZE = 8 QUESTIONS ===');
assert(SESSION_BYTE_SIZE === 8, 'SESSION_BYTE_SIZE is strictly 8');
progress.resetProgress();
const qRomaji = drillEngine.buildByteQueue(SENTENCE_ROMAJI_ITEMS.filter(it => it.lesson === 1), 8);
assert(qRomaji.length === 8, `Audio Sentence Romaji byte builds exactly 8 questions (got ${qRomaji.length})`);

console.log('\n=== 4. VERIFY FULL SCORE RULE: >=80% ALL TYPES + 100% KALIMAT RUMPANG (2x WEIGHT) ===');
progress.resetProgress();
// Test on Bab 12 (9 vocab + 7 sentence_romaji + 1 cloze [2x weight] -> maxWeight = 9 + 7 + 2 = 18)
const b12Vocab = MASTER_DRILL_ITEMS.filter(it => it.lesson === 12);
const b12Sent = SENTENCE_ROMAJI_ITEMS.filter(it => it.lesson === 12);
const b12Cloze = CLOZE_SENTENCE_ITEMS.filter(it => it.lesson === 12);

// Answer 100% of Vocab (9) + 100% of Sentence Romaji (7) = 16/18 = 88.9% (>=80%), BUT 0% Kalimat Rumpang!
b12Vocab.forEach(it => progress.recordCardReview(it.id, true));
b12Sent.forEach(it => progress.recordCardReview(it.id, true));
let st12 = progress.getLessonCoverageStats(12, MASTER_DRILL_ITEMS, CLOZE_SENTENCE_ITEMS, SENTENCE_ROMAJI_ITEMS);
assert(st12.coveragePercent >= 80, `Bab 12 coverage without Rumpang = ${st12.coveragePercent}% (>=80%)`);
assert(st12.isClozeComplete === false && st12.isFullScore === false && st12.score <= 89,
  `Without 100% Kalimat Rumpang, Full Score is LOCKED (score capped at ${st12.score}/100)`);

// Now answer 100% of Kalimat Rumpang (2x highest weight!) -> Full Score 100 unlocked!
b12Cloze.forEach(it => progress.recordCardReview(it.id, true));
st12 = progress.getLessonCoverageStats(12, MASTER_DRILL_ITEMS, CLOZE_SENTENCE_ITEMS, SENTENCE_ROMAJI_ITEMS);
assert(st12.isClozeComplete === true && st12.isFullScore === true && st12.score === 100,
  `With >=80% overall + 100% Kalimat Rumpang, Full Score 100 is UNLOCKED!`);

console.log('\n=== 5. VERIFY LEARNING MODE = 10% OF QUIZ MODE WEIGHT ===');
progress.resetProgress();
// Bab 12 Cloze in Learning Mode = 0.2 weight (10% of Quiz 2.0 weight!)
b12Cloze.forEach(it => progress.recordLearningCardCoverage(it.id));
let st12Learn = progress.getLessonCoverageStats(12, MASTER_DRILL_ITEMS, CLOZE_SENTENCE_ITEMS, SENTENCE_ROMAJI_ITEMS);
assert(st12Learn.effectiveCredit === 0.2, `Cloze in Learning Mode = 0.2 credit (exact 10% of Quiz 2.0)`);
assert(st12Learn.isClozeComplete === false, `Learning Mode alone does NOT satisfy 100% Quiz Rumpang gate`);

// Upgrade same Cloze item via Quiz Mode -> 2.0 weight!
b12Cloze.forEach(it => progress.recordCardReview(it.id, true));
st12Learn = progress.getLessonCoverageStats(12, MASTER_DRILL_ITEMS, CLOZE_SENTENCE_ITEMS, SENTENCE_ROMAJI_ITEMS);
assert(st12Learn.effectiveCredit === 2.0 && st12Learn.isClozeComplete === true,
  `Same Cloze item in Quiz Mode = 2.0 credit (highest weight, 10x Learning)`);

console.log('\n🎉 ALL TESTS PASSED 100%!');
process.exit(0);
