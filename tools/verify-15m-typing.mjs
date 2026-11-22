// Automated verification test for 15-Minute Target and Direct Typing Mode
import fs from 'fs';
import path from 'path';
import http from 'http';
import { 
  romajiToHiragana, 
  romajiToKatakana, 
  liveRomajiToKana, 
  checkAnswerMatch,
  normalizeText
} from '../js/kana-converter.js';

console.log('=== VERIFYING KIRA-KIRA NIHONGO: 15-MIN TARGET & TYPING MODE ===\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failCount++;
  }
}

// 1. Test Kana Converter Engine
console.log('--- 1. Kana Transliteration & Match Tests ---');
assert(romajiToHiragana('sensei') === 'せんせい', 'romajiToHiragana("sensei") -> "せんせい"');
assert(romajiToHiragana('nihon') === 'にほん', 'romajiToHiragana("nihon") -> "にほん"');
assert(romajiToHiragana('gakusei') === 'がくせい', 'romajiToHiragana("gakusei") -> "がくせい"');
assert(romajiToHiragana('chikatetsu') === 'ちかてつ', 'romajiToHiragana("chikatetsu") -> "ちかてつ"');
assert(romajiToHiragana('shinkansen') === 'しんかんせん', 'romajiToHiragana("shinkansen") -> "しんかんせん"');
assert(romajiToKatakana('terebi') === 'テレビ', 'romajiToKatakana("terebi") -> "テレビ"');
assert(romajiToKatakana('pan') === 'パン', 'romajiToKatakana("pan") -> "パン"');

// Test live typing with trailing 'n'
assert(liveRomajiToKana('sensei') === 'せんせい', 'liveRomajiToKana("sensei") -> "せんせい"');
assert(liveRomajiToKana('nihon') === 'にほn', 'liveRomajiToKana("nihon") keeps trailing "n" in live buffer ("にほn")');
assert(liveRomajiToKana('nihonn') === 'にほん', 'liveRomajiToKana("nihonn") converts double n to "にほん"');
assert(liveRomajiToKana('niho') === 'にほ', 'liveRomajiToKana("niho") -> "にほ"');

// Test answer match against card targets
const sampleCard = {
  kana: 'せんせい',
  kanji: '先生',
  romaji: 'sensei',
  id: 'guru'
};

assert(checkAnswerMatch('sensei', sampleCard).isCorrect, 'checkAnswerMatch with Romaji "sensei" matches');
assert(checkAnswerMatch('せんせい', sampleCard).isCorrect, 'checkAnswerMatch with Hiragana "せんせい" matches');
assert(checkAnswerMatch('先生', sampleCard).isCorrect, 'checkAnswerMatch with Kanji "先生" matches');
assert(checkAnswerMatch('SENSEI', sampleCard).isCorrect, 'checkAnswerMatch case-insensitive "SENSEI" matches');
assert(!checkAnswerMatch('gakusei', sampleCard).isCorrect, 'checkAnswerMatch wrong answer rejected');

const katakanaCard = {
  kana: 'テレビ',
  kanji: 'テレビ',
  romaji: 'terebi',
  id: 'televisi'
};
assert(checkAnswerMatch('terebi', katakanaCard).isCorrect, 'checkAnswerMatch Katakana with romaji matches');
assert(checkAnswerMatch('テレビ', katakanaCard).isCorrect, 'checkAnswerMatch Katakana direct matches');
assert(checkAnswerMatch('てれび', katakanaCard).isCorrect, 'checkAnswerMatch Hiragana converted to Katakana matches');

// 2. Verify 15-Minute Target in index.html
console.log('\n--- 2. File Contents & 15-Minute Target Audit ---');
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert(indexHtml.includes('Daily Drill (15 Mnt)'), 'index.html has tab text "Daily Drill (15 Mnt)"');
assert(indexHtml.includes('Target: 15 Menit Sehari'), 'index.html has hero badge "Target: 15 Menit Sehari"');
assert(indexHtml.includes('id="drillTimerText">15:00'), 'index.html timer defaults to 15:00');
assert(indexHtml.includes('btnFormatMcq'), 'index.html contains btnFormatMcq');
assert(indexHtml.includes('btnFormatTyping'), 'index.html contains btnFormatTyping');
assert(indexHtml.includes('startTypingDrillBtn'), 'index.html contains startTypingDrillBtn');

// 3. Verify drills.js 15-minute timer & typing features
const drillsJs = fs.readFileSync('js/drills.js', 'utf8');
assert(drillsJs.includes('timerSeconds = 900'), 'drills.js timerSeconds set to 900 (15 min)');
assert(drillsJs.includes('initialSeconds = 900'), 'drills.js initialSeconds set to 900');
assert(drillsJs.includes('inputFormat') && drillsJs.includes('renderTypingQuizCard'), 'drills.js has typing quiz renderer');
assert(drillsJs.includes('renderTypingLearningCard'), 'drills.js has typing learning card renderer');

// 4. Verify srs.js 15-minute goal
const srsJs = fs.readFileSync('js/srs.js', 'utf8');
assert(srsJs.includes('dailyGoalMinutes: 15'), 'srs.js dailyGoalMinutes set to 15');
assert(srsJs.includes('weeklyGoalMinutes: 105'), 'srs.js weeklyGoalMinutes set to 105');

// 5. Verify scorecard.js 15-minute goal
const scorecardJs = fs.readFileSync('js/scorecard.js', 'utf8');
assert(scorecardJs.includes('todayMins / 15') || scorecardJs.includes('15 menit'), 'scorecard.js tracks 15 minutes daily goal');

// 6. Verify app.js wiring
const appJs = fs.readFileSync('js/app.js', 'utf8');
assert(appJs.includes('btnFormatMcq') && appJs.includes('btnFormatTyping'), 'app.js caches format buttons');
assert(appJs.includes('setInputFormat'), 'app.js defines setInputFormat method');
assert(appJs.includes('inputFormat: format'), 'app.js passes inputFormat to drillEngine');

// 7. Verify style.css typing styles
const styleCss = fs.readFileSync('style.css', 'utf8');
assert(styleCss.includes('.japanese-typing-input'), 'style.css contains .japanese-typing-input styles');
assert(styleCss.includes('.format-pills'), 'style.css contains .format-pills styles');
assert(styleCss.includes('.live-preview-chip'), 'style.css contains .live-preview-chip styles');

// 8. Test HTTP Server
console.log('\n--- 3. Testing Local Web Server ---');
const req = http.get('http://127.0.0.1:3000/', (res) => {
  assert(res.statusCode === 200, `HTTP Server responded with status ${res.statusCode}`);
  console.log(`\n================================`);
  console.log(`TOTAL TESTS: ${passCount + failCount}`);
  console.log(`PASSED: ${passCount}`);
  console.log(`FAILED: ${failCount}`);
  console.log(`================================`);
  process.exit(failCount === 0 ? 0 : 1);
});

req.on('error', (err) => {
  console.error(`❌ HTTP Server Error: ${err.message}`);
  process.exit(1);
});
