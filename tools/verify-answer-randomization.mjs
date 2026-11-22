// tools/verify-answer-randomization.mjs
// Statistical verification suite for drill answer appearance randomization
// User requirement: 2,000 iterations

import { fisherYatesShuffle, DrillEngine } from '../js/drills.js';
import { MASTER_DRILL_ITEMS } from '../data/kanji-vocabulary.js';
import { CLOZE_SENTENCE_ITEMS } from '../data/cloze-sentences.js';
import { buildVocabBoosterQuestions } from '../data/vocab-booster.js';

const ITERATIONS = 2000;
console.log(`=======================================================`);
console.log(`🧪 Running Answer Randomization Verification Suite`);
console.log(`📊 Iterations per test: ${ITERATIONS.toLocaleString()}`);
console.log(`=======================================================\n`);

let allTestsPassed = true;

// -------------------------------------------------------------
// TEST 1: MCQ Options Distribution (Kanji Match / Katakana Blitz)
// -------------------------------------------------------------
console.log(`--- Test 1: MCQ 4-Option Position Distribution (${ITERATIONS} iterations) ---`);
const engine = new DrillEngine();
const mcqSlotCounts = [0, 0, 0, 0];

for (let i = 0; i < ITERATIONS; i++) {
  const card = MASTER_DRILL_ITEMS[i % MASTER_DRILL_ITEMS.length];
  const options = engine.generateOptions(card);
  const correctIdx = options.indexOf(card.kana);
  if (correctIdx === -1) {
    console.error(`❌ Error: Correct answer '${card.kana}' not found in generated options!`, options);
    allTestsPassed = false;
    break;
  }
  mcqSlotCounts[correctIdx]++;
}

console.log('Slot 1 (Index 0):', `${mcqSlotCounts[0]} (${((mcqSlotCounts[0] / ITERATIONS) * 100).toFixed(2)}%)`);
console.log('Slot 2 (Index 1):', `${mcqSlotCounts[1]} (${((mcqSlotCounts[1] / ITERATIONS) * 100).toFixed(2)}%)`);
console.log('Slot 3 (Index 2):', `${mcqSlotCounts[2]} (${((mcqSlotCounts[2] / ITERATIONS) * 100).toFixed(2)}%)`);
console.log('Slot 4 (Index 3):', `${mcqSlotCounts[3]} (${((mcqSlotCounts[3] / ITERATIONS) * 100).toFixed(2)}%)`);

// Chi-Square test for uniform distribution (E = 500 for N=2000, 3 df, critical value at p=0.01 is 11.34)
const expected = ITERATIONS / 4;
const chiSqMcq = mcqSlotCounts.reduce((acc, obs) => acc + Math.pow(obs - expected, 2) / expected, 0);
console.log(`Chi-Square Value: ${chiSqMcq.toFixed(2)} (Threshold: < 11.34 for p=0.01)`);

const mcqUniform = mcqSlotCounts.every(c => Math.abs(c - expected) <= expected * 0.15) && chiSqMcq < 11.34;
if (mcqUniform) {
  console.log('✅ PASS: MCQ options uniformly distributed across all 4 positions.\n');
} else {
  console.error('❌ FAIL: MCQ options distribution deviates significantly from uniform!\n');
  allTestsPassed = false;
}

// -------------------------------------------------------------
// TEST 2: Cloze Sentences Options Distribution
// -------------------------------------------------------------
console.log(`--- Test 2: Cloze Sentences 4-Option Position Distribution (${ITERATIONS} iterations) ---`);
const clozeSlotCounts = [0, 0, 0, 0];

for (let i = 0; i < ITERATIONS; i++) {
  const item = CLOZE_SENTENCE_ITEMS[i % CLOZE_SENTENCE_ITEMS.length];
  const shuffled = fisherYatesShuffle(item.options);
  const correctIdx = shuffled.indexOf(item.correctKana);
  if (correctIdx === -1) {
    console.error(`❌ Error: Correct kana '${item.correctKana}' not found in shuffled options!`, shuffled);
    allTestsPassed = false;
    break;
  }
  clozeSlotCounts[correctIdx]++;
}

console.log('Slot 1 (Index 0):', `${clozeSlotCounts[0]} (${((clozeSlotCounts[0] / ITERATIONS) * 100).toFixed(2)}%)`);
console.log('Slot 2 (Index 1):', `${clozeSlotCounts[1]} (${((clozeSlotCounts[1] / ITERATIONS) * 100).toFixed(2)}%)`);
console.log('Slot 3 (Index 2):', `${clozeSlotCounts[2]} (${((clozeSlotCounts[2] / ITERATIONS) * 100).toFixed(2)}%)`);
console.log('Slot 4 (Index 3):', `${clozeSlotCounts[3]} (${((clozeSlotCounts[3] / ITERATIONS) * 100).toFixed(2)}%)`);

const chiSqCloze = clozeSlotCounts.reduce((acc, obs) => acc + Math.pow(obs - expected, 2) / expected, 0);
console.log(`Chi-Square Value: ${chiSqCloze.toFixed(2)} (Threshold: < 11.34 for p=0.01)`);

const clozeUniform = clozeSlotCounts.every(c => Math.abs(c - expected) <= expected * 0.15) && chiSqCloze < 11.34;
if (clozeUniform) {
  console.log('✅ PASS: Cloze options uniformly distributed across all 4 positions.\n');
} else {
  console.error('❌ FAIL: Cloze options distribution deviates significantly from uniform!\n');
  allTestsPassed = false;
}

// -------------------------------------------------------------
// TEST 3: Vocab Booster Strict Derangement Check
// -------------------------------------------------------------
console.log(`--- Test 3: Vocab Booster Strict Derangement (${ITERATIONS} questions) ---`);
let totalQuestionsChecked = 0;
let preMatchedCardsCount = 0;

// Generate 250 bytes of 8 questions = 2,000 questions (both kana and kanji scripts)
const bytesNeeded = Math.ceil(ITERATIONS / 8);
for (let b = 0; b < bytesNeeded; b++) {
  const scriptType = (b % 2 === 0) ? 'kana' : 'kanji';
  const lesson = (b % 14) + 1;
  const questions = buildVocabBoosterQuestions([lesson], scriptType, 8);
  for (const q of questions) {
    if (totalQuestionsChecked >= ITERATIONS) break;
    totalQuestionsChecked++;
    for (let r = 0; r < q.leftItems.length; r++) {
      if (q.leftItems[r].id === q.initialRightItems[r].id) {
        preMatchedCardsCount++;
      }
    }
  }
}

console.log(`Total Vocab Booster Questions Evaluated: ${totalQuestionsChecked}`);
console.log(`Total Pre-matched Cards Detected at Start: ${preMatchedCardsCount}`);

if (preMatchedCardsCount === 0) {
  console.log('✅ PASS: 100% strict derangement verified. Zero cards start pre-aligned in their matching row!\n');
} else {
  console.error(`❌ FAIL: Found ${preMatchedCardsCount} pre-matched cards on question start!\n`);
  allTestsPassed = false;
}

// -------------------------------------------------------------
// TEST 4: Question Presentation Order Randomization (buildByteQueue)
// -------------------------------------------------------------
console.log(`--- Test 4: Question Presentation Order Randomization (${ITERATIONS} sessions) ---`);
const testItems = Array.from({ length: 16 }, (_, i) => ({ id: `card_${i + 1}`, lesson: 1 }));
const firstCardDistribution = {};
for (let i = 0; i < 16; i++) {
  firstCardDistribution[`card_${i + 1}`] = 0;
}

for (let i = 0; i < ITERATIONS; i++) {
  const queue = engine.buildByteQueue(testItems, 8);
  if (queue.length !== 8) {
    console.error(`❌ Error: Queue length was ${queue.length}, expected 8!`);
    allTestsPassed = false;
    break;
  }
  const firstCardId = queue[0].id;
  firstCardDistribution[firstCardId] = (firstCardDistribution[firstCardId] || 0) + 1;
}

// Check that no single card dominates position 1 (Question 1)
const expectedPerCard = ITERATIONS / 16; // 125 for 2000
const counts = Object.values(firstCardDistribution);
const maxObserved = Math.max(...counts);
const minObserved = Math.min(...counts);
console.log(`First Question Distribution across 16 cards (Expected ~${expectedPerCard} each):`);
console.log(`Min: ${minObserved} (${((minObserved / ITERATIONS) * 100).toFixed(2)}%), Max: ${maxObserved} (${((maxObserved / ITERATIONS) * 100).toFixed(2)}%)`);

// Chi-Square across 16 cards (15 df, critical value at p=0.01 is 30.58)
const chiSqQueue = counts.reduce((acc, obs) => acc + Math.pow(obs - expectedPerCard, 2) / expectedPerCard, 0);
console.log(`Chi-Square Value: ${chiSqQueue.toFixed(2)} (Threshold: < 30.58 for p=0.01)`);

if (chiSqQueue < 30.58) {
  console.log('✅ PASS: Question 1 appearance is uniformly randomized across candidate cards (no deterministic order)!\n');
} else {
  console.error('❌ FAIL: Question presentation order is skewed or deterministic!\n');
  allTestsPassed = false;
}

console.log(`=======================================================`);
if (allTestsPassed) {
  console.log(`🎉 ALL TESTS PASSED SUCCESSFULLY (${ITERATIONS} iterations)!`);
  process.exit(0);
} else {
  console.error(`⚠️ VERIFICATION FAILED`);
  process.exit(1);
}
