import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const requiredIds = [
  'btnTypeQuiz', 'btnTypeLearning',
  'formatToggleContainer', 'btnFormatMcq', 'btnFormatTyping',
  'drillModeSelect',
  'headerDisplayToggleGroup', 'drillDisplayBar',
  'selectedLessonsCount', 'lessonDropdown', 'selectedLessonsTagCloud',
  'startDrillBtn', 'startWeaknessDrillBtn', 'startClozeDrillBtn', 'startKatakanaDrillBtn',
  'keyboardTipsBox', 'navTabWeakness'
];

let ok = true;
for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) {
    console.error(`❌ Missing ID: ${id}`);
    ok = false;
  } else {
    console.log(`✔ Found ID: ${id}`);
  }
}

if (!ok) {
  process.exit(1);
}
console.log('\n🎉 ALL REQUIRED IDS VERIFIED IN INDEX.HTML!');
