// Automated verification test for Romaji & Translation Display Toggles

import fs from 'fs';
import path from 'path';
import http from 'http';

console.log('=== RUNNING DISPLAY TOGGLES VERIFICATION ===\n');

let failed = false;
function assert(cond, msg) {
  if (!cond) {
    console.error(`❌ FAIL: ${msg}`);
    failed = true;
  } else {
    console.log(`✅ PASS: ${msg}`);
  }
}

// 1. Verify index.html contains all toggle elements
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert(indexHtml.includes('id="headerToggleRomajiBtn"'), 'index.html has #headerToggleRomajiBtn');
assert(indexHtml.includes('id="headerToggleTransBtn"'), 'index.html has #headerToggleTransBtn');
assert(indexHtml.includes('id="drillHudToggleRomajiBtn"'), 'index.html has #drillHudToggleRomajiBtn');
assert(indexHtml.includes('id="drillHudToggleTransBtn"'), 'index.html has #drillHudToggleTransBtn');
assert(indexHtml.includes('id="setupToggleRomajiCheckbox"'), 'index.html has #setupToggleRomajiCheckbox');
assert(indexHtml.includes('id="setupToggleTransCheckbox"'), 'index.html has #setupToggleTransCheckbox');
assert(indexHtml.includes('<kbd>M</kbd> Toggle Romaji'), 'index.html has M shortcut in keyboard tips');
assert(indexHtml.includes('<kbd>T</kbd> Toggle Arti'), 'index.html has T shortcut in keyboard tips');

// 2. Verify js/explorer.js
const explorerJs = fs.readFileSync('js/explorer.js', 'utf8');
assert(explorerJs.includes('id="toggleRomajiCheckbox"'), 'explorer.js includes #toggleRomajiCheckbox in template');
assert(explorerJs.includes('id="toggleTransCheckbox"'), 'explorer.js includes #toggleTransCheckbox in template');
assert(explorerJs.includes('bubble-romaji disp-romaji'), 'explorer.js has disp-romaji class on bubble-romaji');
assert(explorerJs.includes('bubble-translation disp-translation'), 'explorer.js has disp-translation class on bubble-translation');
assert(explorerJs.includes('setShowRomaji'), 'explorer.js has setShowRomaji method');
assert(explorerJs.includes('setShowTranslations'), 'explorer.js has setShowTranslations method');
assert(explorerJs.includes('updateDisplayToggles'), 'explorer.js has updateDisplayToggles method');

// 3. Verify js/drills.js
const drillsJs = fs.readFileSync('js/drills.js', 'utf8');
assert(drillsJs.includes('flashcard-romaji disp-romaji'), 'drills.js has disp-romaji on flashcard');
assert(drillsJs.includes('flashcard-meaning-row disp-translation'), 'drills.js has disp-translation on flashcard meaning');
assert(drillsJs.includes('fc-sentence-id disp-translation'), 'drills.js has disp-translation on flashcard sentence ID');
assert(drillsJs.includes('drill-sentence-id disp-translation'), 'drills.js has disp-translation on quiz sentence ID');
assert(drillsJs.includes('quiz-romaji disp-romaji'), 'drills.js has disp-romaji on quiz feedback');
assert(drillsJs.includes('quiz-meaning-row disp-translation'), 'drills.js has disp-translation on quiz feedback');

// 4. Verify style.css
const styleCss = fs.readFileSync('style.css', 'utf8');
assert(styleCss.includes('body.hide-romaji .bubble-romaji'), 'style.css has body.hide-romaji rules for transcript bubbles');
assert(styleCss.includes('body.hide-romaji .flashcard-romaji'), 'style.css has body.hide-romaji rules for flashcards');
assert(styleCss.includes('body.hide-romaji .quiz-romaji'), 'style.css has body.hide-romaji rules for quiz');
assert(styleCss.includes('body.hide-translation .bubble-translation'), 'style.css has body.hide-translation for transcript');
assert(styleCss.includes('body.hide-translation .flashcard-meaning-row'), 'style.css has body.hide-translation for flashcards');
assert(styleCss.includes('body.hide-translation .drill-sentence-id'), 'style.css has body.hide-translation for quiz');
assert(styleCss.includes('.display-toggle-group'), 'style.css has .display-toggle-group');
assert(styleCss.includes('.header-toggle-btn'), 'style.css has .header-toggle-btn');
assert(styleCss.includes('.hud-toggle-pill'), 'style.css has .hud-toggle-pill');
assert(styleCss.includes('.drill-display-bar'), 'style.css has .drill-display-bar');
assert(styleCss.includes('.dialogue-bubble'), 'style.css has .dialogue-bubble styling');

// 5. Verify js/app.js
const appJs = fs.readFileSync('js/app.js', 'utf8');
assert(appJs.includes('initReadingPreferences'), 'app.js has initReadingPreferences');
assert(appJs.includes('setReadingPreference'), 'app.js has setReadingPreference');
assert(appJs.includes('toggleReadingPreference'), 'app.js has toggleReadingPreference');
assert(appJs.includes('applyReadingPreferences'), 'app.js has applyReadingPreferences');
assert(appJs.includes('headerToggleRomajiBtn'), 'app.js handles headerToggleRomajiBtn');
assert(appJs.includes('drillHudToggleRomajiBtn'), 'app.js handles drillHudToggleRomajiBtn');
assert(appJs.includes('setupToggleRomajiCheckbox'), 'app.js handles setupToggleRomajiCheckbox');
assert(appJs.includes("'m'") || appJs.includes('"m"'), 'app.js handles M key for Romaji toggle');
assert(appJs.includes("'t'") || appJs.includes('"t"'), 'app.js handles T key for Translation toggle');

// 6. Test HTTP server response
const req = http.get('http://127.0.0.1:3000/index.html', (res) => {
  assert(res.statusCode === 200, 'HTTP server returns 200 for index.html');
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    assert(data.includes('headerToggleRomajiBtn'), 'HTTP server serves updated index.html with Romaji toggle');
    if (failed) {
      console.error('\n❌ SOME VERIFICATIONS FAILED');
      process.exit(1);
    } else {
      console.log('\n🎉 ALL 28 VERIFICATION CHECKS PASSED!');
    }
  });
});

req.on('error', (err) => {
  console.error('HTTP request error:', err.message);
  process.exit(1);
});
