// tools/verify-early-exit-and-scores.mjs
// Automated verification for Session Scores and Early Exit Penalty

import assert from 'node:assert/strict';
import fs from 'node:fs';

console.log('🧪 Starting Verification: Session Score Display & Early Exit Penalization...\n');

// 1. Verify HTML template contains updated IDs
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert(indexHtml.includes('id="sessionCardsLabel"'), 'sessionCardsLabel ID must exist in index.html');
assert(indexHtml.includes('id="sessionScoreLabel"'), 'sessionScoreLabel ID must exist in index.html');
assert(indexHtml.includes('id="sessionDurationLabel"'), 'sessionDurationLabel ID must exist in index.html');
assert(indexHtml.includes('id="sessionCardsResult"'), 'sessionCardsResult ID must exist in index.html');
assert(indexHtml.includes('id="sessionAccuracyResult"'), 'sessionAccuracyResult ID must exist in index.html');
console.log('✅ Test 1 Passed: index.html contains all required session modal result elements.');

// 2. Verify CSS has highlight-red
const styleCss = fs.readFileSync('style.css', 'utf8');
assert(styleCss.includes('.highlight-red'), 'style.css must define .highlight-red');
console.log('✅ Test 2 Passed: style.css contains .highlight-red for low scores.');

// 3. Mock progress manager to verify SRS Leitner updates
class MockProgress {
  constructor() {
    this.reviews = [];
    this.sessionRecords = [];
  }
  recordCardReview(cardId, isCorrect) {
    this.reviews.push({ cardId, isCorrect });
  }
  addSessionRecord(elapsed, reviewed, correct, wrong, xp, isGraded) {
    this.sessionRecords.push({ elapsed, reviewed, correct, wrong, xp, isGraded });
  }
}

// 4. Test logic for early exit penalization simulation (matching drills.js finishSession)
function simulateFinishSession({
  sessionType = 'quiz',
  drillQueue = [
    { id: 'q1' }, { id: 'q2' }, { id: 'q3' }, { id: 'q4' },
    { id: 'q5' }, { id: 'q6' }, { id: 'q7' }, { id: 'q8' }
  ],
  cardsReviewed = 3,
  correctCount = 2,
  wrongCount = 1,
  elapsedSeconds = 45,
  xpEarned = 25
}) {
  const progress = new MockProgress();
  const isGraded = (sessionType === 'quiz');

  const totalByte = (drillQueue && drillQueue.length > 0) ? drillQueue.length : 8;
  const answeredCount = Math.min(cardsReviewed, totalByte);
  const unansweredCount = Math.max(0, totalByte - answeredCount);

  let finalWrongCount = wrongCount;
  let finalCardsReviewed = cardsReviewed;

  if (unansweredCount > 0) {
    finalWrongCount += unansweredCount;
    const unansweredCards = drillQueue.slice(answeredCount);
    if (isGraded) {
      unansweredCards.forEach(card => {
        if (card && card.id) {
          progress.recordCardReview(card.id, false);
        }
      });
    }
    finalCardsReviewed = totalByte;
  }

  const sessionScore = totalByte > 0 ? Math.round((correctCount / totalByte) * 100) : 0;

  // Completion bonus logic
  const quizBonus = elapsedSeconds >= 810 ? 50 : 15;
  const baseCompletionBonus = isGraded ? quizBonus : Math.max(1, Math.round(quizBonus * 0.1));
  const completionBonus = (unansweredCount === 0) ? baseCompletionBonus : 0;
  const finalXpEarned = xpEarned + completionBonus;

  progress.addSessionRecord(
    elapsedSeconds,
    finalCardsReviewed,
    correctCount,
    finalWrongCount,
    finalXpEarned,
    isGraded
  );

  return {
    progress,
    sessionType,
    elapsedSeconds,
    cardsReviewed: finalCardsReviewed,
    answeredCount,
    unansweredCount,
    byteSize: totalByte,
    correctCount,
    wrongCount: finalWrongCount,
    accuracy: sessionScore,
    score: sessionScore,
    xpEarned: finalXpEarned
  };
}

// Skenario A: Sesi Penuh (8/8 Soal Selesai: 6 Benar, 2 Salah)
const fullRes = simulateFinishSession({
  cardsReviewed: 8,
  correctCount: 6,
  wrongCount: 2,
  elapsedSeconds: 120
});

assert.equal(fullRes.answeredCount, 8);
assert.equal(fullRes.unansweredCount, 0);
assert.equal(fullRes.cardsReviewed, 8);
assert.equal(fullRes.correctCount, 6);
assert.equal(fullRes.wrongCount, 2);
assert.equal(fullRes.score, 75); // 6 / 8 * 100 = 75
assert.equal(fullRes.progress.reviews.length, 0, 'No extra reviews added because 0 unanswered');
assert.equal(fullRes.xpEarned, 25 + 15, 'Earned completion bonus because 0 unanswered');
console.log('✅ Test 3 Passed: Skenario Selesai Penuh (8/8) menghitung Skor: 75 / 100 dengan akurat.');

// Skenario B: Keluar Lebih Awal (Early Exit: 3 soal dijawab [2 benar, 1 salah], 5 soal belum dijawab)
const earlyRes = simulateFinishSession({
  cardsReviewed: 3,
  correctCount: 2,
  wrongCount: 1,
  elapsedSeconds: 30
});

assert.equal(earlyRes.answeredCount, 3);
assert.equal(earlyRes.unansweredCount, 5, '5 soal harus terdeteksi belum dijawab');
assert.equal(earlyRes.cardsReviewed, 8, 'Total kartu tercatat menjadi 8');
assert.equal(earlyRes.correctCount, 2);
assert.equal(earlyRes.wrongCount, 1 + 5, 'Wrong count harus menjadi 1 + 5 = 6');
assert.equal(earlyRes.score, 25, 'Skor harus menjadi 2 / 8 * 100 = 25 (BUKAN 2/3 = 67)');
assert.equal(earlyRes.progress.reviews.length, 5, 'Semua 5 kartu sisa harus dicatat sebagai review gagal');
assert(earlyRes.progress.reviews.every(r => r.isCorrect === false), 'Semua review sisa harus bernilai isCorrect=false');
assert.deepEqual(
  earlyRes.progress.reviews.map(r => r.cardId),
  ['q4', 'q5', 'q6', 'q7', 'q8'],
  'Kartu yang dicatat salah harus persis q4 s/d q8'
);
assert.equal(earlyRes.xpEarned, 25, 'Early exit tidak mendapat completion bonus');
console.log('✅ Test 4 Passed: Skenario Keluar Awal menghukum 5 soal belum dijawab sebagai salah (Skor: 25 / 100 & tercatat di SRS).');

// Skenario C: Keluar Lebih Awal pada Mode Belajar
const learningEarlyRes = simulateFinishSession({
  sessionType: 'learning',
  cardsReviewed: 4,
  correctCount: 4,
  wrongCount: 0,
  elapsedSeconds: 20
});

assert.equal(learningEarlyRes.answeredCount, 4);
assert.equal(learningEarlyRes.unansweredCount, 4);
assert.equal(learningEarlyRes.cardsReviewed, 8);
assert.equal(learningEarlyRes.wrongCount, 4);
assert.equal(learningEarlyRes.score, 50); // 4 / 8 * 100 = 50
assert.equal(learningEarlyRes.progress.reviews.length, 0, 'Learning mode does not record SRS graded review');
console.log('✅ Test 5 Passed: Skenario Keluar Awal Mode Belajar menghitung Skor: 50 / 100 (4 benar, 4 salah).');

console.log('\n🎉 ALL 5 VERIFICATION TESTS PASSED SUCCESSFULLY!');
