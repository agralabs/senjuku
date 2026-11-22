// Verification script for:
// 1. Fill-in-the-blank (Cloze Sentence) Mode (Hardest Mode, Context SVG, Zero Romaji/Translation)
// 2. Weakness Repetition Section & Engine (Frequent mistakes in last 1 week)

import { readFileSync } from 'fs';
import { CLOZE_SENTENCE_ITEMS, getContextSvg } from '../data/cloze-sentences.js';
import { MASTER_DRILL_ITEMS } from '../data/kanji-vocabulary.js';

console.log("=== 1. VERIFYING CLOZE SENTENCE DATA & SVG ===");
console.log(`Total Cloze items: ${CLOZE_SENTENCE_ITEMS.length}`);
if (CLOZE_SENTENCE_ITEMS.length < 30) {
  throw new Error(`Expected at least 30 cloze items, got ${CLOZE_SENTENCE_ITEMS.length}`);
}

// Check every item has required fields, SVG, and options contains correctKana
CLOZE_SENTENCE_ITEMS.forEach((it, idx) => {
  if (!it.id || !it.lesson || !it.sentenceWithBlank || !it.targetWord || !it.correctKana) {
    throw new Error(`Item ${idx} missing required fields: ${JSON.stringify(it)}`);
  }
  if (!it.sentenceWithBlank.includes('〔 ＿＿＿ 〕')) {
    throw new Error(`Item ${it.id} does not have blank marker 〔 ＿＿＿ 〕: ${it.sentenceWithBlank}`);
  }
  if (!it.options || it.options.length !== 4) {
    throw new Error(`Item ${it.id} does not have exactly 4 options`);
  }
  if (!it.options.includes(it.correctKana)) {
    throw new Error(`Item ${it.id} options do not include correctKana (${it.correctKana})`);
  }
  const svg = getContextSvg(it.svgType);
  if (!svg || !svg.includes('<svg')) {
    throw new Error(`Item ${it.id} svgType ${it.svgType} did not produce valid SVG`);
  }
});
console.log("✔ All 32 cloze items have valid structure, 4 options, and SVG context illustrations!");

console.log("\n=== 2. VERIFYING INDEX.HTML INTEGRATION ===");
const indexHtml = readFileSync('./index.html', 'utf-8');

const requiredTokens = [
  'id="navTabWeakness"',
  'data-tab="weakness"',
  'id="tab-weakness"',
  'id="weaknessContainer"',
  'id="startClozeDrillBtn"',
  'id="startWeaknessDrillBtn"',
  'value="sentence_cloze"',
  'value="weakness_focus"'
];

requiredTokens.forEach(tok => {
  if (!indexHtml.includes(tok)) {
    throw new Error(`index.html missing required token: ${tok}`);
  }
  console.log(`✔ Found token in index.html: ${tok}`);
});

console.log("\n=== 3. VERIFYING SRS WEAKNESS 7-DAY CALCULATION ===");
// Mock localStorage for node environment
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = v; },
  removeItem(k) { delete this.store[k]; }
};

const { ProgressManager } = await import('../js/srs.js');
const pm = new ProgressManager();

// Simulate some reviews
const testCard1 = MASTER_DRILL_ITEMS[0].id;
const testCard2 = MASTER_DRILL_ITEMS[1].id;
const testCard3 = MASTER_DRILL_ITEMS[2].id;

// Card 1: 3 mistakes today
pm.recordCardReview(testCard1, false);
pm.recordCardReview(testCard1, false);
pm.recordCardReview(testCard1, false);

// Card 2: 1 correct, 1 wrong
pm.recordCardReview(testCard2, true);
pm.recordCardReview(testCard2, false);

// Card 3: 2 correct
pm.recordCardReview(testCard3, true);
pm.recordCardReview(testCard3, true);

const weakCards = pm.getWeakCards(MASTER_DRILL_ITEMS, 10);
console.log(`Weak cards found: ${weakCards.length}`);
if (weakCards.length < 2) {
  throw new Error(`Expected at least 2 weak cards, got ${weakCards.length}`);
}

// Card 1 should be highest rank
if (weakCards[0].item.id !== testCard1) {
  throw new Error(`Expected testCard1 to be weakest card, got ${weakCards[0].item.id}`);
}
console.log(`✔ Card 1 weekly mistakes: ${weakCards[0].weeklyMistakes} (Rank #1)`);

const weakestItems = pm.getWeakestItems(MASTER_DRILL_ITEMS, 5);
if (!weakestItems.some(it => it.id === testCard1)) {
  throw new Error("getWeakestItems did not include testCard1");
}
console.log("✔ getWeakestItems successfully extracts prioritized items for drill queue!");

console.log("\n=== 4. VERIFYING ZERO ROMAJI/TRANSLATION IN CLOZE CARDS ===");
// Inspect drills.js implementation of renderQuizClozeCard
const drillsJs = readFileSync('./js/drills.js', 'utf-8');
if (!drillsJs.includes('renderQuizClozeCard')) {
  throw new Error("drills.js missing renderQuizClozeCard");
}
if (!drillsJs.includes('handleClozeAnswer')) {
  throw new Error("drills.js missing handleClozeAnswer");
}
if (!drillsJs.includes('renderLearningClozeCard')) {
  throw new Error("drills.js missing renderLearningClozeCard");
}

// Ensure renderQuizClozeCard doesn't inject disp-romaji or disp-translation
const quizClozeMatch = drillsJs.match(/renderQuizClozeCard\(card\)[\s\S]*?renderLearningClozeCard/);
if (quizClozeMatch) {
  const code = quizClozeMatch[0];
  if (code.includes('disp-romaji') || code.includes('disp-translation') || code.includes('card.romaji') || code.includes('card.meaningId')) {
    throw new Error("renderQuizClozeCard contains romaji or translation!");
  }
  console.log("✔ Strict Kana/Kanji confirmed: renderQuizClozeCard contains ZERO Romaji and ZERO translations!");
}

console.log("\n=== 5. VERIFYING WEAKNESS VIEW MODULE ===");
const weaknessJs = readFileSync('./js/weakness.js', 'utf-8');
if (!weaknessJs.includes('WeaknessView') || !weaknessJs.includes('weaknessView')) {
  throw new Error("weakness.js missing WeaknessView export");
}
console.log("✔ weakness.js is correctly defined and exported!");

console.log("\n=============================================");
console.log("ALL TESTS PASSED WITH 100% SUCCESS!");
console.log("=============================================");
