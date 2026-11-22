import { MASTER_DRILL_ITEMS } from './data/kanji-vocabulary.js';

for (let l = 1; l <= 14; l++) {
  const list = MASTER_DRILL_ITEMS.filter(i => i.lesson === l);
  console.log(`\n================== BAB ${l} (${list.length} ITEMS) ==================`);
  for (const item of list) {
    console.log(`ID: ${item.id} [${item.type}] | ${item.kanji} (${item.kana}) [${item.romaji}] -> ${item.meaningId}`);
    console.log(`   Distractors: ${item.distractors ? item.distractors.join(', ') : 'none'}`);
    console.log(`   Kalimat: ${item.sentence}`);
    console.log(`   Bacaan:  ${item.sentenceKana}`);
    console.log(`   Arti:    ${item.sentenceId}`);
  }
}
