import { MASTER_DRILL_ITEMS } from './data/kanji-vocabulary.js';
import { LESSONS_1_5 } from './data/lessons-1-5.js';
import { LESSONS_6_10 } from './data/lessons-6-10.js';
import { LESSONS_11_14 } from './data/lessons-11-14.js';

console.log('=== AUDITING MASTER_DRILL_ITEMS (' + MASTER_DRILL_ITEMS.length + ' items) ===');
for (const item of MASTER_DRILL_ITEMS) {
  console.log(`L${item.lesson} | ID: ${item.id} | Type: ${item.type} | Kanji: ${item.kanji} | Kana: ${item.kana} | Romaji: ${item.romaji} | Sentence: ${item.sentence} | SentenceKana: ${item.sentenceKana}`);
}

console.log('\n=== AUDITING LESSONS DATA ===');
const allLessons = [...LESSONS_1_5, ...LESSONS_6_10, ...LESSONS_11_14];
console.log('Total Lessons:', allLessons.length);
for (const l of allLessons) {
  console.log(`Lesson ${l.lesson}: "${l.title}" - Vocab count: ${l.vocabulary.length}, Conversations: ${l.conversations.length}`);
}
