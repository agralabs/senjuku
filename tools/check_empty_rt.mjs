import { LESSONS_1_5 } from './data/lessons-1-5.js';
import { LESSONS_6_10 } from './data/lessons-6-10.js';
import { LESSONS_11_14 } from './data/lessons-11-14.js';

const allLessons = [...LESSONS_1_5, ...LESSONS_6_10, ...LESSONS_11_14];

console.log('Searching for empty rt tags <rt></rt>:');
for (const l of allLessons) {
  for (const s of l.sections) {
    if (!s.dialogues) continue;
    for (const d of s.dialogues) {
      if (d.furigana && d.furigana.includes('<rt></rt>')) {
        console.log(`[L${l.lessonNum}] ${s.title}: ${d.text} -> ${d.furigana}`);
      }
    }
  }
}
