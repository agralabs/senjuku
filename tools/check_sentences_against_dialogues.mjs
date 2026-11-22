import fs from 'fs';
import { MASTER_DRILL_ITEMS } from './data/kanji-vocabulary.js';

// We can read all the dialogue texts from lessons-1-5.js, lessons-6-10.js, lessons-11-14.js
// which were transcribed from the PDF
import { LESSONS_1_5 } from './data/lessons-1-5.js';
import { LESSONS_6_10 } from './data/lessons-6-10.js';
import { LESSONS_11_14 } from './data/lessons-11-14.js';

const allLessons = [...LESSONS_1_5, ...LESSONS_6_10, ...LESSONS_11_14];
const allDialogueTexts = [];
for (const l of allLessons) {
  for (const s of l.sections) {
    if (s.dialogues) {
      for (const d of s.dialogues) {
        allDialogueTexts.push(d.text);
      }
    }
  }
}

console.log('Total dialogues extracted from lesson files:', allDialogueTexts.length);

console.log('\nChecking sentences in MASTER_DRILL_ITEMS against lesson dialogues:');
let missingSentences = [];
for (const item of MASTER_DRILL_ITEMS) {
  // Check if item.sentence is inside any dialogue text
  const match = allDialogueTexts.some(dt => dt.includes(item.sentence) || item.sentence.includes(dt));
  if (!match) {
    missingSentences.push({ id: item.id, kanji: item.kanji, sentence: item.sentence, lesson: item.lesson });
  }
}

console.log('Unmatched sentences count:', missingSentences.length);
for (const ms of missingSentences) {
  console.log(`L${ms.lesson} [${ms.id}] (${ms.kanji}): "${ms.sentence}"`);
}
