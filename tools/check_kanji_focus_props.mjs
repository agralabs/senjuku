import { LESSONS_1_5 } from './data/lessons-1-5.js';
import { LESSONS_6_10 } from './data/lessons-6-10.js';
import { LESSONS_11_14 } from './data/lessons-11-14.js';

const allLessons = [...LESSONS_1_5, ...LESSONS_6_10, ...LESSONS_11_14];

let missing = 0;
for (const l of allLessons) {
  for (const kf of l.kanjiFocus) {
    if (!kf.char || !kf.meaning || !kf.words || !Array.isArray(kf.words)) {
      console.log(`Bad kanjiFocus in Lesson ${l.lessonNum}:`, kf);
      missing++;
    }
  }
}
console.log('Total checked kanjiFocus entries:', allLessons.reduce((sum, l) => sum + l.kanjiFocus.length, 0));
console.log('Missing/malformed entries:', missing);
