// Speak Aloud Session Builder: 5 Reading Words (Verb/Noun/Adjective) + 3 Short Sentences
// 50/50 random Kana vs Kanji presentation per item

import { MASTER_DRILL_ITEMS } from './kanji-vocabulary.js';
import { SENTENCE_ROMAJI_ITEMS } from './sentence-romaji.js';

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const VERB_ENDINGS = ['ます', 'ません', 'ました', 'る', 'う', 'く', 'ぐ', 'す', 'つ', 'ぬ', 'ぶ', 'む'];
const VERB_MEANING_RE = /\b(pergi|datang|pulang|makan|minum|melihat|menonton|membaca|menulis|mendengar|berbicara|bicara|tidur|bangun|bekerja|belajar|beristirahat|bermain|membeli|mengajar|bertemu|meminjam|meminjamkan|mengirim|menelepon|naik|turun|masuk|keluar|tinggal|menunggu|mengambil|membawa|membuat|memakai|mengerti|lupa|ingat|mulai|selesai|mencoba|menggunakan|memberi|menerima|berjalan|berlari|berenang|memotong|mencuci|membersihkan|memasak|membuka|menutup|menyalakan|mematikan|duduk|berdiri|meletakkan|menunjukkan|mengatakan|bertanya|menjawab|berhenti|berubah|menikah|berbelanja)\b/i;

const ADJ_MEANING_RE = /\b(besar|kecil|baru|lama|bagus|baik|buruk|jelek|mahal|murah|panas|dingin|sejuk|hangat|ramai|sepi|tenang|terkenal|indah|cantik|tampan|bersih|kotor|mudah|gampang|sulit|susah|menarik|seru|membosankan|cepat|lambat|tinggi|rendah|panjang|pendek|sibuk|senggang|enak|lezat|manis|pedas|asin|sehat|kuat|lemah|suka|benci|pandai|mahir|pintar|cerah|mendung|gelap|terang|berat|ringan|luas|sempit|dekat|jauh|banyak|sedikit|sama|berbeda|penting|bahaya|aman|praktis|ramah|lucu|menyenangkan)\b/i;
const NOT_I_ADJ_KANA = new Set(['せんせい', 'がくせい', 'とけい', 'けいたい', 'えいが', 'りょこう', 'しゅくだい', 'きょねん', 'おととい', 'あさって', 'げつようび', 'かようび', 'すいようび', 'もくようび', 'きんようび', 'どようび', 'にちようび', 'やすみ', 'かいしゃいん', 'なんさい', 'きょうだい']);

const NOUN_PREFIX_RE = /^(kereta|mobil|bus|pesawat|kapal|sepeda|orang|guru|siswa|mahasiswa|dokter|karyawan|perusahaan|universitas|sekolah|rumah|kamar|toko|stasiun|bandara|restoran|buku|majalah|koran|surat|waktu|jam|hari|minggu|bulan|tahun|makanan|minuman|air|teh|kopi|nasi|roti|daging|ikan|buah|sayur)\b/i;

/**
 * Classify a MASTER_DRILL_ITEMS entry into 'verb', 'adjective', or 'noun'.
 */
export function classifyWordPos(item) {
  const kana = (item.kana || '').trim();
  const meaning = (item.meaningId || '').toLowerCase();

  if (VERB_MEANING_RE.test(meaning) || (kana.endsWith('ます') && kana.length > 2)) {
    return 'verb';
  }
  if (NOUN_PREFIX_RE.test(meaning)) {
    return 'noun';
  }
  if (ADJ_MEANING_RE.test(meaning)) {
    return 'adjective';
  }
  if (kana.endsWith('い') && kana.length >= 2 && !NOT_I_ADJ_KANA.has(kana) && item.type !== 'katakana') {
    return 'adjective';
  }
  if (VERB_ENDINGS.some(end => end.length >= 2 && kana.endsWith(end)) && kana.length > 3) {
    return 'verb';
  }
  return 'noun';
}

export function getPosLabelId(pos) {
  if (pos === 'verb') return 'Kata Kerja';
  if (pos === 'adjective') return 'Kata Sifat';
  if (pos === 'sentence') return 'Kalimat Pendek';
  return 'Kata Benda';
}

function pickDisplayScript(kanjiText, kanaText) {
  const cleanKanji = (kanjiText || '').trim();
  const cleanKana = (kanaText || '').trim();
  if (!cleanKanji || cleanKanji === cleanKana) {
    return 'kana';
  }
  // 50-50 random possibility between Kana and Kanji
  return Math.random() < 0.5 ? 'kanji' : 'kana';
}

/**
 * Build an 8-question Speak Aloud session:
 * - 5 reading words (mix of verbs, nouns, adjectives)
 * - 3 short sentences
 * - Each item randomly presented in Kana or Kanji (50/50)
 */
export function buildSpeakAloudQueue(selectedLessons = ['all']) {
  const isAll = !Array.isArray(selectedLessons) || selectedLessons.includes('all') || selectedLessons.length === 0;
  const lessonNums = isAll
    ? []
    : selectedLessons.map(l => parseInt(l, 10)).filter(n => !isNaN(n));

  // 1. Word pool (5 words: target mix of verb, adjective, noun)
  let wordPool = MASTER_DRILL_ITEMS.filter(it => it && it.kana && it.kana.trim().length > 0);
  if (lessonNums.length > 0) {
    const filtered = wordPool.filter(it => lessonNums.includes(it.lesson));
    if (filtered.length >= 5) {
      wordPool = filtered;
    } else if (filtered.length > 0) {
      // Pad with remaining lessons if user picked a single small lesson
      const existingIds = new Set(filtered.map(it => it.id));
      const extras = shuffleArray(wordPool.filter(it => !existingIds.has(it.id)));
      wordPool = [...filtered, ...extras.slice(0, 12)];
    }
  }

  const verbs = [];
  const adjectives = [];
  const nouns = [];
  shuffleArray(wordPool).forEach(it => {
    const pos = classifyWordPos(it);
    if (pos === 'verb') verbs.push({ ...it, pos });
    else if (pos === 'adjective') adjectives.push({ ...it, pos });
    else nouns.push({ ...it, pos });
  });

  const chosenWords = [];
  const usedWordIds = new Set();
  const takeFrom = (arr, maxCount) => {
    for (const item of arr) {
      if (chosenWords.length >= 5 || maxCount <= 0) break;
      if (usedWordIds.has(item.id)) continue;
      usedWordIds.add(item.id);
      chosenWords.push(item);
      maxCount--;
    }
  };

  // Aim for 2 verbs, 2 adjectives, 1 noun; top up from any remaining pool to reach 5
  takeFrom(verbs, 2);
  takeFrom(adjectives, 2);
  takeFrom(nouns, 1);
  if (chosenWords.length < 5) {
    takeFrom([...verbs, ...adjectives, ...nouns], 5 - chosenWords.length);
  }

  const wordCards = chosenWords.slice(0, 5).map(item => {
    const kanjiText = (item.kanji || item.kana).trim();
    const kanaText = (item.kana || '').trim();
    const displayScript = pickDisplayScript(kanjiText, kanaText);
    return {
      ...item,
      speakKind: 'word',
      posLabel: getPosLabelId(item.pos),
      displayScript,
      promptText: displayScript === 'kanji' ? kanjiText : kanaText,
      expectedKana: kanaText,
      expectedKanji: kanjiText,
      expectedRomaji: item.romaji || '',
      meaningText: item.meaningId || item.meaningEn || ''
    };
  });

  // 2. Short sentence pool (3 short sentences)
  let sentencePool = SENTENCE_ROMAJI_ITEMS.filter(
    it => it && it.text && it.kana && !it.isLongSentence && it.kana.length <= 28
  );
  if (sentencePool.length < 3) {
    sentencePool = SENTENCE_ROMAJI_ITEMS.filter(it => it && it.text && it.kana);
  }
  if (lessonNums.length > 0) {
    const filteredSent = sentencePool.filter(it => lessonNums.includes(it.lesson));
    if (filteredSent.length >= 3) {
      sentencePool = filteredSent;
    } else if (filteredSent.length > 0) {
      const existingIds = new Set(filteredSent.map(it => it.id));
      const extras = shuffleArray(sentencePool.filter(it => !existingIds.has(it.id)));
      sentencePool = [...filteredSent, ...extras.slice(0, 6)];
    }
  }

  const chosenSentences = shuffleArray(sentencePool).slice(0, 3);
  const sentenceCards = chosenSentences.map(item => {
    const kanjiText = (item.text || item.kana).trim();
    const kanaText = (item.kana || '').trim();
    const displayScript = pickDisplayScript(kanjiText, kanaText);
    return {
      ...item,
      speakKind: 'sentence',
      pos: 'sentence',
      posLabel: 'Kalimat Pendek',
      displayScript,
      promptText: displayScript === 'kanji' ? kanjiText : kanaText,
      expectedKana: kanaText,
      expectedKanji: kanjiText,
      expectedRomaji: item.romaji || '',
      meaningText: item.translation || ''
    };
  });

  return shuffleArray([...wordCards, ...sentenceCards]);
}
