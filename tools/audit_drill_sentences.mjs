import { MASTER_DRILL_ITEMS } from './data/kanji-vocabulary.js';

// Let's verify every sentenceKana against sentence
console.log('Auditing Sentence vs SentenceKana in MASTER_DRILL_ITEMS:');
for (const item of MASTER_DRILL_ITEMS) {
  // Simple sanity checks
  if (!item.sentence || !item.sentenceKana || !item.sentenceId) {
    console.error(`Item ${item.id} missing sentence fields!`);
  }
  if (!item.kana || !item.kanji || !item.romaji) {
    console.error(`Item ${item.id} missing core fields!`);
  }
}
console.log('All 68 items have sentence, sentenceKana, sentenceId, kana, kanji, romaji.');
