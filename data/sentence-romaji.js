// Full-Sentence Romaji Typing Bank derived directly from the Minna no Nihongo Audio Transcripts (Bab 1-14)

import { LESSONS_1_5 } from './lessons-1-5.js';
import { LESSONS_6_10 } from './lessons-6-10.js';
import { LESSONS_11_14 } from './lessons-11-14.js';
import { LESSONS_15_20 } from './lessons-15-20.js';
import { LESSONS_21_25 } from './lessons-21-25.js';

const ALL_LESSONS = [...LESSONS_1_5, ...LESSONS_6_10, ...LESSONS_11_14, ...LESSONS_15_20, ...LESSONS_21_25];

/**
 * Extract pure Kana reading from a dialogue's furigana HTML (<ruby>漢字<rt>かんじ</rt></ruby> -> かんじ)
 */
export function extractSentenceKana(furiganaHtml, fallbackText = '') {
  const src = furiganaHtml || fallbackText || '';
  return src
    .replace(/<ruby>[\s\S]*?<rt>([\s\S]*?)<\/rt>[\s\S]*?<\/ruby>/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function buildSentenceRomajiBank() {
  const items = [];

  ALL_LESSONS.forEach(lesson => {
    const lessonNum = lesson.id;
    (lesson.sections || []).forEach((sec, secIdx) => {
      (sec.dialogues || []).forEach((dlg, dlgIdx) => {
        if (dlg.speakerType === 'narrator') return;
        if (!dlg.text || !dlg.romaji || dlg.romaji.trim().length < 4) return;

        const cleanRomaji = dlg.romaji.trim();
        const isLongSentence = cleanRomaji.length >= 65;
        const timeLimit = isLongSentence ? 45 : 30; // 30s standard, 45s for longer sentences
        const kanaReading = extractSentenceKana(dlg.furigana, dlg.text);

        items.push({
          id: `sromaji_l${lessonNum}_${secIdx}_${dlgIdx}`,
          lesson: lessonNum,
          track: sec.track || '',
          sectionTitle: sec.title || '',
          speaker: dlg.speaker || '',
          text: dlg.text.trim(),
          furigana: dlg.furigana || dlg.text.trim(),
          kana: kanaReading,
          romaji: cleanRomaji,
          translation: dlg.translation || '',
          timeLimit,
          isLongSentence,
          type: 'sentence_romaji'
        });
      });
    });
  });

  return items;
}

export const SENTENCE_ROMAJI_ITEMS = buildSentenceRomajiBank();

/**
 * Normalize a Romaji sentence for fair, learner-friendly comparison:
 * - Case-insensitive, strips punctuation & hyphens/apostrophes
 * - Normalizes macrons (ō->o, ū->u, ā->a, ē->e, ī->i) and common long-vowel variants (ou/oo->o, uu->u)
 * - Normalizes Hepburn/Kunrei variants (shi/si, chi/ti, tsu/tu, fu/hu, ji/zi)
 * - Compares ignoring space-splitting differences (e.g. "ohayou gozaimasu" == "ohayougozaimasu")
 */
export function normalizeRomajiSentence(str) {
  if (!str) return '';
  let s = str.toLowerCase().trim();

  // Replace macrons & accented vowels
  s = s
    .replace(/[āâ]/g, 'a')
    .replace(/[īî]/g, 'i')
    .replace(/[ūû]/g, 'u')
    .replace(/[ēê]/g, 'e')
    .replace(/[ōô]/g, 'o');

  // Remove punctuation, Japanese symbols, hyphens, apostrophes
  s = s.replace(/[.,!?;:'"()\[\]{}「」『』、。！？〜~\-—–…\/]/g, ' ');

  // Collapse whitespace
  s = s.replace(/\s+/g, ' ').trim();

  // Canonicalize phonetic variants for compact comparison
  const compact = s
    .replace(/\s+/g, '')
    .replace(/ou/g, 'o')
    .replace(/oo/g, 'o')
    .replace(/uu/g, 'u')
    .replace(/ee/g, 'e')
    .replace(/aa/g, 'a')
    .replace(/shi/g, 'si')
    .replace(/chi/g, 'ti')
    .replace(/tsu/g, 'tu')
    .replace(/fu/g, 'hu')
    .replace(/ji/g, 'zi')
    .replace(/dzu/g, 'zu')
    .replace(/wo/g, 'o');

  return compact;
}

export function checkSentenceRomajiMatch(typed, expectedRomaji) {
  const normTyped = normalizeRomajiSentence(typed);
  const normExpected = normalizeRomajiSentence(expectedRomaji);

  if (!normTyped) {
    return { isCorrect: false, normTyped, normExpected };
  }

  return {
    isCorrect: normTyped === normExpected,
    normTyped,
    normExpected
  };
}

/**
 * Normalize Japanese Kana sentence for fair comparison (ignores punctuation, spaces, Katakana<->Hiragana)
 */
export function normalizeKanaSentence(str) {
  if (!str) return '';
  // Convert Katakana (U+30A1-U+30F6) to Hiragana (U+3041-U+3096) and strip punctuation/spaces
  let out = '';
  for (const ch of String(str).trim()) {
    const code = ch.charCodeAt(0);
    if (code >= 0x30A1 && code <= 0x30F6) {
      out += String.fromCharCode(code - 0x60);
    } else if (code >= 0xFF10 && code <= 0xFF19) {
      // Full-width digits -> half-width
      out += String.fromCharCode(code - 0xFEE0);
    } else {
      out += ch;
    }
  }
  return out.replace(/[\s・\.,!?。、！？「」『』（）\(\)\-_〜～…]/g, '');
}

/**
 * Strict Kana-only check for full-sentence typing (rejects Latin/Romaji so user practices Kana writing)
 */
export function checkSentenceKanaMatch(typed, card) {
  if (!typed || !card) return { isCorrect: false, rejectedRomaji: false };
  const raw = String(typed).trim();
  if (/[a-zA-Z]/.test(raw)) {
    return { isCorrect: false, rejectedRomaji: true };
  }
  const normTyped = normalizeKanaSentence(raw);
  if (!normTyped) return { isCorrect: false, rejectedRomaji: false };

  const normExpectedKana = normalizeKanaSentence(card.kana || extractSentenceKana(card.furigana, card.text));
  const normExpectedText = normalizeKanaSentence(card.text || '');

  const isCorrect = (normTyped === normExpectedKana) || (Boolean(normExpectedText) && normTyped === normExpectedText);
  return { isCorrect, rejectedRomaji: false, normTyped, normExpectedKana };
}
