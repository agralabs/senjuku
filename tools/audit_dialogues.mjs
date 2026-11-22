import { LESSONS_1_5 } from './data/lessons-1-5.js';
import { LESSONS_6_10 } from './data/lessons-6-10.js';
import { LESSONS_11_14 } from './data/lessons-11-14.js';

const allLessons = [...LESSONS_1_5, ...LESSONS_6_10, ...LESSONS_11_14];

let issues = [];

for (const l of allLessons) {
  for (const s of l.sections) {
    if (!s.dialogues) continue;
    for (const d of s.dialogues) {
      if (!d.text || !d.furigana || !d.romaji || !d.translation) {
        issues.push(`Lesson ${l.lessonNum} - "${s.title}": missing property in dialogue: ${JSON.stringify(d)}`);
      }
      // Check for common romanization or kana mismatch
      if (d.text.includes('何時') && !d.furigana.includes('なんじ')) {
        issues.push(`Lesson ${l.lessonNum}: text has 何時 but furigana doesn't have なんじ: ${d.text} vs ${d.furigana}`);
      }
    }
  }
}

console.log('Dialogue audit complete. Issues found:', issues.length);
for (const iss of issues) {
  console.log(' - ' + iss);
}
