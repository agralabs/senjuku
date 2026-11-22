// Romaji to Kana Converter and Japanese Answer Matching Engine
// Lightweight, zero-dependency, works offline and inside all modern browsers

const ROMAJI_TO_HIRAGANA_MAP = {
  // Triple / Double combos (Digraphs & Yōon)
  'kya': 'きゃ', 'kyu': 'きゅ', 'kyo': 'きょ',
  'sha': 'しゃ', 'shu': 'しゅ', 'sho': 'しょ', 'sya': 'しゃ', 'syu': 'しゅ', 'syo': 'しょ',
  'cha': 'ちゃ', 'chu': 'ちゅ', 'cho': 'ちょ', 'tya': 'ちゃ', 'tyu': 'ちゅ', 'tyo': 'ちょ',
  'nya': 'にゃ', 'nyu': 'にゅ', 'nyo': 'にょ',
  'hya': 'ひゃ', 'hyu': 'ひゅ', 'hyo': 'ひょ',
  'mya': 'みゃ', 'myu': 'みゅ', 'myo': 'みょ',
  'rya': 'りゃ', 'ryu': 'りゅ', 'ryo': 'りょ',
  'gya': 'ぎゃ', 'gyu': 'ぎゅ', 'gyo': 'ぎょ',
  'ja': 'じゃ', 'ju': 'じゅ', 'jo': 'じょ', 'jya': 'じゃ', 'jyu': 'じゅ', 'jyo': 'じょ',
  'zya': 'じゃ', 'zyu': 'じゅ', 'zyo': 'じょ',
  'bya': 'びゃ', 'byu': 'びゅ', 'byo': 'びょ',
  'pya': 'ぴゃ', 'pyu': 'ぴゅ', 'pyo': 'ぴょ',
  'tsu': 'つ', 'tso': 'つぉ',
  'shi': 'し', 'chi': 'ち',

  // Standard 2-character combos
  'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
  'sa': 'さ', 'si': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
  'ta': 'た', 'ti': 'ち', 'tu': 'つ', 'te': 'て', 'to': 'と',
  'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
  'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'hu': 'ふ', 'he': 'へ', 'ho': 'ほ',
  'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
  'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
  'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
  'wa': 'わ', 'wo': 'を',
  'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
  'za': 'ざ', 'zi': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
  'ji': 'じ',
  'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
  'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
  'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
  'nn': 'ん', "n'": 'ん',

  // Vowels
  'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
  '-': 'ー'
};

const ROMAJI_TO_KATAKANA_MAP = {
  // Triple / Double combos
  'kya': 'キャ', 'kyu': 'キュ', 'kyo': 'キョ',
  'sha': 'シャ', 'shu': 'シュ', 'sho': 'ショ', 'sya': 'シャ', 'syu': 'シュ', 'syo': 'ショ',
  'cha': 'チャ', 'chu': 'チュ', 'cho': 'チョ', 'tya': 'チャ', 'tyu': 'チュ', 'tyo': 'チョ',
  'nya': 'ニャ', 'nyu': 'ニュ', 'nyo': 'ニョ',
  'hya': 'ヒャ', 'hyu': 'ヒュ', 'hyo': 'ヒョ',
  'mya': 'ミャ', 'myu': 'ミュ', 'myo': 'ミョ',
  'rya': 'リャ', 'ryu': 'リュ', 'ryo': 'リョ',
  'gya': 'ギャ', 'gyu': 'ギュ', 'gyo': 'ギョ',
  'ja': 'ジャ', 'ju': 'ジュ', 'jo': 'ジョ', 'jya': 'ジャ', 'jyu': 'ジュ', 'jyo': 'ジョ',
  'zya': 'ジャ', 'zyu': 'ジュ', 'zyo': 'ジョ',
  'bya': 'ビャ', 'byu': 'ビュ', 'byo': 'ビョ',
  'pya': 'ピャ', 'pyu': 'ピュ', 'pyo': 'ピョ',
  'tsu': 'ツ',
  'shi': 'シ', 'chi': 'チ',
  'che': 'チェ', 'she': 'シェ', 'je': 'ジェ',

  // Standard 2-character combos
  'ka': 'カ', 'ki': 'キ', 'ku': 'ク', 'ke': 'ケ', 'ko': 'コ',
  'sa': 'サ', 'si': 'シ', 'su': 'ス', 'se': 'セ', 'so': 'ソ',
  'ta': 'タ', 'ti': 'チ', 'tu': 'ツ', 'te': 'テ', 'to': 'ト',
  'na': 'ナ', 'ni': 'ニ', 'nu': 'ヌ', 'ne': 'ネ', 'no': 'ノ',
  'ha': 'ハ', 'hi': 'ヒ', 'fu': 'フ', 'hu': 'フ', 'he': 'ヘ', 'ho': 'ホ',
  'ma': 'マ', 'mi': 'ミ', 'mu': 'ム', 'me': 'メ', 'mo': 'モ',
  'ya': 'ヤ', 'yu': 'ユ', 'yo': 'ヨ',
  'ra': 'ラ', 'ri': 'リ', 'ru': 'ル', 're': 'レ', 'ro': 'ロ',
  'wa': 'ワ', 'wo': 'ヲ',
  'ga': 'ガ', 'gi': 'ギ', 'gu': 'グ', 'ge': 'ゲ', 'go': 'ゴ',
  'za': 'ザ', 'zi': 'ジ', 'zu': 'ズ', 'ze': 'ゼ', 'zo': 'ゾ',
  'ji': 'ジ',
  'da': 'ダ', 'di': 'ヂ', 'du': 'ヅ', 'de': 'デ', 'do': 'ド',
  'ba': 'バ', 'bi': 'ビ', 'bu': 'ブ', 'be': 'ベ', 'bo': 'ボ',
  'pa': 'パ', 'pi': 'ピ', 'pu': 'プ', 'pe': 'ペ', 'po': 'ポ',
  'va': 'ヴァ', 'vi': 'ヴィ', 'vu': 'ヴ', 've': 'ヴェ', 'vo': 'ヴォ',
  'fa': 'ファ', 'fi': 'フィ', 'fe': 'フェ', 'fo': 'フォ',
  'ti': 'ティ', 'di': 'ディ',
  'nn': 'ン', "n'": 'ン',

  // Vowels
  'a': 'ア', 'i': 'イ', 'u': 'ウ', 'e': 'エ', 'o': 'オ',
  '-': 'ー'
};

/**
 * Converts romaji input text into Hiragana
 * Supports sokuon (small tsu っ on double consonants like kk, tt, ss)
 * Supports n before consonants or at word boundaries
 */
export function romajiToHiragana(input) {
  if (!input) return '';
  let str = input.toLowerCase();
  let result = '';
  let i = 0;

  while (i < str.length) {
    // Check if character is already Japanese (Hiragana, Katakana, Kanji, Punctuation)
    const code = str.charCodeAt(i);
    if (code >= 0x3000 && code <= 0x9faf) {
      result += str[i];
      i++;
      continue;
    }

    // Check 3-letter combos (kya, chu, tsu, etc.)
    const three = str.slice(i, i + 3);
    if (ROMAJI_TO_HIRAGANA_MAP[three]) {
      result += ROMAJI_TO_HIRAGANA_MAP[three];
      i += 3;
      continue;
    }

    // Double consonant check (sokuon っ): kk, ss, tt, pp, etc.
    if (str[i] === str[i + 1] && /[bcdfghjklmpqrstvwxyz]/.test(str[i]) && str[i] !== 'n') {
      result += 'っ';
      i++;
      continue;
    }

    // 'tc' -> っ + ch
    if (str[i] === 't' && str[i + 1] === 'c') {
      result += 'っ';
      i++;
      continue;
    }

    // 'n' before consonants or at end of string (except before vowels, y, or another n)
    if (str[i] === 'n') {
      const next = str[i + 1];
      if (next === 'n' || next === "'" || next === ' ') {
        result += 'ん';
        i += (next === ' ' ? 1 : 2);
        continue;
      } else if (!next || !/[aeiouy]/.test(next)) {
        result += 'ん';
        i++;
        continue;
      }
    }

    // Check 2-letter combos
    const two = str.slice(i, i + 2);
    if (ROMAJI_TO_HIRAGANA_MAP[two]) {
      result += ROMAJI_TO_HIRAGANA_MAP[two];
      i += 2;
      continue;
    }

    // Check single vowels or special characters
    const one = str[i];
    if (ROMAJI_TO_HIRAGANA_MAP[one]) {
      result += ROMAJI_TO_HIRAGANA_MAP[one];
      i++;
      continue;
    }

    // Passthrough other characters (numbers, punctuation, etc.)
    result += one;
    i++;
  }

  return result;
}

/**
 * Converts romaji input text into Katakana
 */
export function romajiToKatakana(input) {
  if (!input) return '';
  let str = input.toLowerCase();
  let result = '';
  let i = 0;

  while (i < str.length) {
    const code = str.charCodeAt(i);
    if (code >= 0x3000 && code <= 0x9faf) {
      result += str[i];
      i++;
      continue;
    }

    const three = str.slice(i, i + 3);
    if (ROMAJI_TO_KATAKANA_MAP[three]) {
      result += ROMAJI_TO_KATAKANA_MAP[three];
      i += 3;
      continue;
    }

    // Sokuon ッ
    if (str[i] === str[i + 1] && /[bcdfghjklmpqrstvwxyz]/.test(str[i]) && str[i] !== 'n') {
      result += 'ッ';
      i++;
      continue;
    }
    if (str[i] === 't' && str[i + 1] === 'c') {
      result += 'ッ';
      i++;
      continue;
    }

    if (str[i] === 'n') {
      const next = str[i + 1];
      if (next === 'n' || next === "'" || next === ' ') {
        result += 'ン';
        i += (next === ' ' ? 1 : 2);
        continue;
      } else if (!next || !/[aeiouy]/.test(next)) {
        result += 'ン';
        i++;
        continue;
      }
    }

    const two = str.slice(i, i + 2);
    if (ROMAJI_TO_KATAKANA_MAP[two]) {
      result += ROMAJI_TO_KATAKANA_MAP[two];
      i += 2;
      continue;
    }

    const one = str[i];
    if (ROMAJI_TO_KATAKANA_MAP[one]) {
      result += ROMAJI_TO_KATAKANA_MAP[one];
      i++;
      continue;
    }

    result += one;
    i++;
  }

  return result;
}

/**
 * Converts Hiragana string into Katakana
 */
export function hiraganaToKatakana(str) {
  if (!str) return '';
  return str.replace(/[\u3041-\u3096]/g, ch => 
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );
}

/**
 * Converts Katakana string into Hiragana
 */
export function katakanaToHiragana(str) {
  if (!str) return '';
  return str.replace(/[\u30a1-\u30f6]/g, ch => 
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

/**
 * Live typing converter: converts romaji buffer to Kana while preserving
 * a pending trailing 'n' so the user can still type 'na, ni, nu, ne, no'.
 */
export function liveRomajiToKana(input, isKatakana = false) {
  if (!input) return '';
  let str = input.toLowerCase();
  let result = '';
  let i = 0;
  const map = isKatakana ? ROMAJI_TO_KATAKANA_MAP : ROMAJI_TO_HIRAGANA_MAP;
  const sokuon = isKatakana ? 'ッ' : 'っ';
  const nChar = isKatakana ? 'ン' : 'ん';

  while (i < str.length) {
    const code = str.charCodeAt(i);
    if (code >= 0x3000 && code <= 0x9faf) {
      result += str[i];
      i++;
      continue;
    }

    const three = str.slice(i, i + 3);
    if (map[three]) {
      result += map[three];
      i += 3;
      continue;
    }

    // Double consonant check (sokuon)
    if (str[i] === str[i + 1] && /[bcdfghjklmpqrstvwxyz]/.test(str[i]) && str[i] !== 'n') {
      result += sokuon;
      i++;
      continue;
    }
    if (str[i] === 't' && str[i + 1] === 'c') {
      result += sokuon;
      i++;
      continue;
    }

    // 'n' handling:
    // If 'n' is followed by another 'n' or apostrophe or space -> convert to ん/ン
    if (str[i] === 'n') {
      const next = str[i + 1];
      if (next === 'n' || next === "'" || next === ' ') {
        result += nChar;
        i += (next === ' ' ? 1 : 2);
        continue;
      } else if (next && !/[aeiouy]/.test(next)) {
        // 'n' followed by another consonant (e.g. 'ns', 'nk', 'nt') -> convert to ん/ン
        result += nChar;
        i++;
        continue;
      }
      // If 'n' is at the very end of string, keep 'n' in live buffer until next letter or submit!
      if (!next) {
        result += 'n';
        i++;
        continue;
      }
    }

    const two = str.slice(i, i + 2);
    if (map[two]) {
      result += map[two];
      i += 2;
      continue;
    }

    const one = str[i];
    if (map[one]) {
      result += map[one];
      i++;
      continue;
    }

    result += one;
    i++;
  }

  return result;
}

/**
 * Normalizes input text for forgiving answer comparison:
 * - Trims whitespaces
 * - Strips middle dot ・, periods, and commas
 * - Normalizes romaji long vowels (ō -> ou, ū -> uu)
 */
export function normalizeText(text) {
  if (!text) return '';
  return text
    .trim()
    .replace(/[・\s\.,!?。、！？\-_]/g, '')
    .toLowerCase()
    .replace(/ō/g, 'ou')
    .replace(/ū/g, 'uu')
    .replace(/ā/g, 'aa')
    .replace(/ē/g, 'ee')
    .replace(/ī/g, 'ii');
}

/**
 * Comprehensive answer validation for typing mode
 * Returns { isCorrect: boolean, matchedType: string }
 */
export function checkAnswerMatch(userInput, card) {
  if (!userInput || !card) return { isCorrect: false, matchedType: '' };

  const rawInput = userInput.trim();
  const normInput = normalizeText(rawInput);

  const normKana = normalizeText(card.kana);
  const normKanji = normalizeText(card.kanji);
  const normRomaji = normalizeText(card.romaji);

  // 1. Direct match with Kanji or Kana
  if (rawInput === card.kana || normInput === normKana) {
    return { isCorrect: true, matchedType: 'kana' };
  }
  if (rawInput === card.kanji || normInput === normKanji) {
    return { isCorrect: true, matchedType: 'kanji' };
  }

  // 2. Direct match with Romaji
  if (normInput === normRomaji) {
    return { isCorrect: true, matchedType: 'romaji' };
  }

  // 3. Katakana <-> Hiragana interchangeable match
  const asHiragana = katakanaToHiragana(normInput);
  const asKatakana = hiraganaToKatakana(normInput);
  const targetAsHiragana = katakanaToHiragana(normKana);
  const targetAsKatakana = hiraganaToKatakana(normKana);

  if (asHiragana === targetAsHiragana || asKatakana === targetAsKatakana) {
    return { isCorrect: true, matchedType: 'kana_interchange' };
  }

  // 4. Romaji-converted match
  const convertedHira = normalizeText(romajiToHiragana(normInput));
  const convertedKata = normalizeText(romajiToKatakana(normInput));

  if (convertedHira === targetAsHiragana || convertedKata === targetAsKatakana) {
    return { isCorrect: true, matchedType: 'romaji_converted' };
  }

  return { isCorrect: false, matchedType: '' };
}

/**
 * Strict Kana-only answer validation (rejects Latin/Romaji input so user practices true Kana writing)
 */
export function checkKanaOnlyMatch(userInput, card) {
  if (!userInput || !card) return { isCorrect: false, matchedType: '', rejectedRomaji: false };

  const rawInput = userInput.trim();
  if (/[a-zA-Z]/.test(rawInput)) {
    return { isCorrect: false, matchedType: '', rejectedRomaji: true };
  }

  const normInput = normalizeText(rawInput);
  const normKana = normalizeText(card.kana);
  const normKanji = normalizeText(card.kanji);

  if (rawInput === card.kana || normInput === normKana) {
    return { isCorrect: true, matchedType: 'kana', rejectedRomaji: false };
  }
  if (rawInput === card.kanji || normInput === normKanji) {
    return { isCorrect: true, matchedType: 'kanji', rejectedRomaji: false };
  }

  // Allow Hiragana <-> Katakana interchange on Kana characters
  const asHiragana = katakanaToHiragana(normInput);
  const targetAsHiragana = katakanaToHiragana(normKana);
  if (asHiragana && asHiragana === targetAsHiragana) {
    return { isCorrect: true, matchedType: 'kana_interchange', rejectedRomaji: false };
  }

  return { isCorrect: false, matchedType: '', rejectedRomaji: false };
}
