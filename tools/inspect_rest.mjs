import { MASTER_DRILL_ITEMS } from './data/kanji-vocabulary.js';

for (let i = 25; i < MASTER_DRILL_ITEMS.length; i++) {
  const it = MASTER_DRILL_ITEMS[i];
  console.log(`[${i+1}] ${it.id} (L${it.lesson}): ${it.kanji} (${it.kana}) [${it.romaji}]`);
  console.log(`     Sentence: ${it.sentence}`);
  console.log(`     KanaSent: ${it.sentenceKana}`);
  console.log(`     ID:       ${it.sentenceId}`);
}
