import { LESSONS_1_5 } from './data/lessons-1-5.js';
import { LESSONS_6_10 } from './data/lessons-6-10.js';
import { LESSONS_11_14 } from './data/lessons-11-14.js';

const allLessons = [...LESSONS_1_5, ...LESSONS_6_10, ...LESSONS_11_14];

for (const l of allLessons) {
  console.log(`\n=== Bab ${l.lessonNum}: ${l.titleJa} ===`);
  console.log('Kanji Focus count:', l.kanjiFocus.length);
  for (const kf of l.kanjiFocus) {
    console.log(`  ${kf.kanji} (${kf.kana}) [${kf.romaji}] -> ${kf.meaning}`);
  }
}
