// Minna no Nihongo Lessons 1-14: Fill-in-the-Blank (Cloze Sentence) Database
// Mode Paling Sulit: Strict Kana/Kanji only (Tanpa Romaji & Tanpa Terjemahan)
// Target: Mengisi Kata Benda (名詞) atau Kata Kerja (動詞)
// Dilengkapi gambar vektor sederhana (SVG) untuk membantu pemahaman konteks situasi

import { CLOZE_15_25 } from './bank-15-25.js';
import { CLOZE_EXPANSION } from './bank-expansion.js';
import { getClozeIllustrationSvg } from './cloze-illustrations.js';

export const CLOZE_SENTENCE_ITEMS = [
  // ==================== BAB 1 ====================
  {
    id: "cloze_b1_01",
    lesson: 1,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "サントスさんは〔 ＿＿＿ 〕です。",
    fullSentence: "サントスさんは会社員です。",
    targetWord: "会社員",
    correctKana: "かいしゃいん",
    options: ["かいしゃいん", "がくせい", "けんきゅうしゃ", "ぎんこういん"],
    audioSentence: "サントスさんはかいしゃいんです。",
    svgType: "office_worker"
  },
  {
    id: "cloze_b1_02",
    lesson: 1,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "ワンさんは〔 ＿＿＿ 〕です。",
    fullSentence: "ワンさんは医者です。",
    targetWord: "医者",
    correctKana: "いしゃ",
    options: ["いしゃ", "せんせい", "かいしゃいん", "がくせい"],
    audioSentence: "ワンさんはいしゃです。",
    svgType: "doctor"
  },
  {
    id: "cloze_b1_03",
    lesson: 1,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "カリナさんは富士大学の〔 ＿＿＿ 〕です。",
    fullSentence: "カリナさんは富士大学の学生です。",
    targetWord: "学生",
    correctKana: "がくせい",
    options: ["がくせい", "けんきゅうしゃ", "せんせい", "いしゃ"],
    audioSentence: "カリナさんはふじだいがくのがくせいです。",
    svgType: "student"
  },

  // ==================== BAB 2 ====================
  {
    id: "cloze_b2_01",
    lesson: 2,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "これは 何の〔 ＿＿＿ 〕ですか。…車の 本です。",
    fullSentence: "これは何の雑誌ですか。…車の本です。",
    targetWord: "雑誌",
    correctKana: "ざっし",
    options: ["ざっし", "じしょ", "てちょう", "しんぶん"],
    audioSentence: "これはなんのざっしですか。くるまのほんです。",
    svgType: "magazine"
  },
  {
    id: "cloze_b2_02",
    lesson: 2,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "この〔 ＿＿＿ 〕は だれのですか。…山田さんのです。",
    fullSentence: "この傘はだれのですか。…山田さんのです。",
    targetWord: "傘",
    correctKana: "かさ",
    options: ["かさ", "かばん", "とけい", "かぎ"],
    audioSentence: "このかさはだれのですか。やまださんのです。",
    svgType: "umbrella"
  },
  {
    id: "cloze_b2_03",
    lesson: 2,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "あの〔 ＿＿＿ 〕は スイスの です。",
    fullSentence: "あの時計はスイスのです。",
    targetWord: "時計",
    correctKana: "とけい",
    options: ["とけい", "てちょう", "じしょ", "かばん"],
    audioSentence: "あのとけいはスイスのです。",
    svgType: "watch"
  },

  // ==================== BAB 3 ====================
  {
    id: "cloze_b3_01",
    lesson: 3,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "ワインの〔 ＿＿＿ 〕は 地下1階です。",
    fullSentence: "ワインの売り場は地下1階です。",
    targetWord: "売り場",
    correctKana: "うりば",
    options: ["うりば", "うけつけ", "しょくどう", "じむしょ"],
    audioSentence: "ワインのうりばはちかいっかいです。",
    svgType: "shopping"
  },
  {
    id: "cloze_b3_02",
    lesson: 3,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "お手洗いは〔 ＿＿＿ 〕ですか。…あちらです。",
    fullSentence: "お手洗いはどこですか。…あちらです。",
    targetWord: "どこ",
    correctKana: "どこ",
    options: ["どこ", "だれ", "どれ", "いくら"],
    audioSentence: "おてあらいはどこですか。あちらです。",
    svgType: "restroom"
  },

  // ==================== BAB 4 ====================
  {
    id: "cloze_b4_01",
    lesson: 4,
    pos: "verb",
    posLabelJa: "動詞 (Kata Kerja)",
    sentenceWithBlank: "毎朝 6時に〔 ＿＿＿ 〕。",
    fullSentence: "毎朝6時に起きます。",
    targetWord: "起きます",
    correctKana: "おきます",
    options: ["おきます", "ねます", "はたらきます", "やすみます"],
    audioSentence: "まいあさろくじにおきます。",
    svgType: "wake_up"
  },
  {
    id: "cloze_b4_02",
    lesson: 4,
    pos: "verb",
    posLabelJa: "動詞 (Kata Kerja)",
    sentenceWithBlank: "銀行は 9時から 3時まで〔 ＿＿＿ 〕。",
    fullSentence: "銀行は9時から3時まで働きます。",
    targetWord: "働きます",
    correctKana: "はたらきます",
    options: ["はたらきます", "おわります", "べんきょうします", "やすみます"],
    audioSentence: "ぎんこうはくじからさんじまではたらきます。",
    svgType: "bank"
  },
  {
    id: "cloze_b4_03",
    lesson: 4,
    pos: "verb",
    posLabelJa: "動詞 (Kata Kerja)",
    sentenceWithBlank: "夜 11時に〔 ＿＿＿ 〕。",
    fullSentence: "夜11時に寝ます。",
    targetWord: "寝ます",
    correctKana: "ねます",
    options: ["ねます", "おきます", "おわります", "はじまります"],
    audioSentence: "よるじゅういちじにねます。",
    svgType: "sleep"
  },

  // ==================== BAB 5 ====================
  {
    id: "cloze_b5_01",
    lesson: 5,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "わたしは〔 ＿＿＿ 〕で 会社へ 行きます。",
    fullSentence: "わたしは地下鉄で会社へ行きます。",
    targetWord: "地下鉄",
    correctKana: "ちかてつ",
    options: ["ちかてつ", "じてんしゃ", "ひこうき", "ふね"],
    audioSentence: "わたしはちかてつでかいしゃへいきます。",
    svgType: "subway"
  },
  {
    id: "cloze_b5_02",
    lesson: 5,
    pos: "verb",
    posLabelJa: "動詞 (Kata Kerja)",
    sentenceWithBlank: "来週 新幹線で 東京へ〔 ＿＿＿ 〕。",
    fullSentence: "来週新幹線で東京へ行きます。",
    targetWord: "行きます",
    correctKana: "いきます",
    options: ["いきます", "きます", "かえります", "のります"],
    audioSentence: "らいしゅうしんかんせんでとうきょうへいきます。",
    svgType: "bullet_train"
  },
  {
    id: "cloze_b5_03",
    lesson: 5,
    pos: "verb",
    posLabelJa: "動詞 (Kata Kerja)",
    sentenceWithBlank: "午後 7時に うちへ〔 ＿＿＿ 〕。",
    fullSentence: "午後7時にうちへ帰ります。",
    targetWord: "帰ります",
    correctKana: "かえります",
    options: ["かえります", "いきます", "きます", "あるきます"],
    audioSentence: "ごごしちじにうちへかえります。",
    svgType: "home"
  },

  // ==================== BAB 6 ====================
  {
    id: "cloze_b6_01",
    lesson: 6,
    pos: "verb",
    posLabelJa: "動詞 (Kata Kerja)",
    sentenceWithBlank: "毎朝 パンと 卵を〔 ＿＿＿ 〕。",
    fullSentence: "毎朝パンと卵を食べます。",
    targetWord: "食べます",
    correctKana: "たべます",
    options: ["たべます", "のみます", "かいます", "みます"],
    audioSentence: "まいあさパンとたまごをたべます。",
    svgType: "eat"
  },
  {
    id: "cloze_b6_02",
    lesson: 6,
    pos: "verb",
    posLabelJa: "動詞 (Kata Kerja)",
    sentenceWithBlank: "食堂で 冷たい お茶を〔 ＿＿＿ 〕。",
    fullSentence: "食堂で冷たいお茶を飲みます。",
    targetWord: "飲みます",
    correctKana: "のみます",
    options: ["のみます", "たべます", "すいます", "ききます"],
    audioSentence: "しょくどうでつめたいおちゃをのみます。",
    svgType: "drink"
  },
  {
    id: "cloze_b6_03",
    lesson: 6,
    pos: "verb",
    posLabelJa: "動詞 (Kata Kerja)",
    sentenceWithBlank: "デパートで 新しい 服を〔 ＿＿＿ 〕。",
    fullSentence: "デパートで新しい服を買います。",
    targetWord: "買います",
    correctKana: "かいます",
    options: ["かいます", "うります", "たべます", "よみます"],
    audioSentence: "デパートであたらしいふくをかいます。",
    svgType: "shopping_cart"
  },
  {
    id: "cloze_b6_04",
    lesson: 6,
    pos: "verb",
    posLabelJa: "動詞 (Kata Kerja)",
    sentenceWithBlank: "図書館で 本を〔 ＿＿＿ 〕。",
    fullSentence: "図書館で本を読みます。",
    targetWord: "読みます",
    correctKana: "よみます",
    options: ["よみます", "かきます", "ききます", "みます"],
    audioSentence: "としょかんでほんをよみます。",
    svgType: "read"
  },

  // ==================== BAB 7 ====================
  {
    id: "cloze_b7_01",
    lesson: 7,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "日本人は〔 ＿＿＿ 〕で ご飯を 食べます。",
    fullSentence: "日本人は箸でご飯を食べます。",
    targetWord: "箸",
    correctKana: "はし",
    options: ["はし", "スプーン", "フォーク", "ナイフ"],
    audioSentence: "にほんじんははしでごはんをたべます。",
    svgType: "chopsticks"
  },
  {
    id: "cloze_b7_02",
    lesson: 7,
    pos: "verb",
    posLabelJa: "動詞 (Kata Kerja)",
    sentenceWithBlank: "手帳に ボールペンで 名前を〔 ＿＿＿ 〕。",
    fullSentence: "手帳にボールペンで名前を書きます。",
    targetWord: "書きます",
    correctKana: "かきます",
    options: ["かきます", "よみます", "きります", "おくります"],
    audioSentence: "てちょうにボールペンでなまえをかきます。",
    svgType: "write"
  },
  {
    id: "cloze_b7_03",
    lesson: 7,
    pos: "verb",
    posLabelJa: "動詞 (Kata Kerja)",
    sentenceWithBlank: "友達に 誕生日の プレゼントを〔 ＿＿＿ 〕。",
    fullSentence: "友達に誕生日のプレゼントをあげます。",
    targetWord: "あげます",
    correctKana: "あげます",
    options: ["あげます", "もらいます", "かします", "かります"],
    audioSentence: "ともだちにたんじょうびのプレゼントをあげます。",
    svgType: "gift"
  },

  // ==================== BAB 8 ====================
  {
    id: "cloze_b8_01",
    lesson: 8,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "富士山は きれいな〔 ＿＿＿ 〕です。",
    fullSentence: "富士山はきれいな山です。",
    targetWord: "山",
    correctKana: "やま",
    options: ["やま", "まち", "かわ", "うみ"],
    audioSentence: "ふじさんはきれいなやまです。",
    svgType: "mountain"
  },
  {
    id: "cloze_b8_02",
    lesson: 8,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "日本の〔 ＿＿＿ 〕は おいしいですが、高いです。",
    fullSentence: "日本の料理はおいしいですが、高いです。",
    targetWord: "料理",
    correctKana: "りょうり",
    options: ["りょうり", "おちゃ", "くるま", "くだもの"],
    audioSentence: "にほんのりょうりはおいしいですが、たかいです。",
    svgType: "japanese_food"
  },

  // ==================== BAB 9 ====================
  {
    id: "cloze_b9_01",
    lesson: 9,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "わたしは イタリア料理が〔 ＿＿＿ 〕です。",
    fullSentence: "わたしはイタリア料理が好きです。",
    targetWord: "好き",
    correctKana: "すき",
    options: ["すき", "きらい", "じょうず", "へた"],
    audioSentence: "わたしはイタリアりょうりがすきです。",
    svgType: "heart"
  },
  {
    id: "cloze_b9_02",
    lesson: 9,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "時間が ありませんから、〔 ＿＿＿ 〕を 読みません。",
    fullSentence: "時間がありませんから、新聞を読みません。",
    targetWord: "新聞",
    correctKana: "しんぶん",
    options: ["しんぶん", "ざっし", "ほん", "てがみ"],
    audioSentence: "じかんがありませんから、しんぶんをよみません。",
    svgType: "newspaper"
  },

  // ==================== BAB 10 ====================
  {
    id: "cloze_b10_01",
    lesson: 10,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "庭に かわいい〔 ＿＿＿ 〕が います。",
    fullSentence: "庭にかわいい犬がいます。",
    targetWord: "犬",
    correctKana: "いぬ",
    options: ["いぬ", "ねこ", "とり", "ひと"],
    audioSentence: "にわにかわいいいぬがいます。",
    svgType: "dog"
  },
  {
    id: "cloze_b10_02",
    lesson: 10,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "机の 上に 家族の〔 ＿＿＿ 〕が あります。",
    fullSentence: "机の上に家族の写真があります。",
    targetWord: "写真",
    correctKana: "しゃしん",
    options: ["しゃしん", "ほん", "とけい", "かばん"],
    audioSentence: "つくえのうえにかぞくのしゃしんがあります。",
    svgType: "photo"
  },

  // ==================== BAB 11 ====================
  {
    id: "cloze_b11_01",
    lesson: 11,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "郵便局で 80円の〔 ＿＿＿ 〕を 買いました。",
    fullSentence: "郵便局で80円の切手を買いました。",
    targetWord: "切手",
    correctKana: "きって",
    options: ["きって", "はがき", "ふうとう", "にもつ"],
    audioSentence: "ゆうびんきょくではちじゅうえんのきってをかいました。",
    svgType: "stamp"
  },
  {
    id: "cloze_b11_02",
    lesson: 11,
    pos: "verb",
    posLabelJa: "動詞 (Kata Kerja)",
    sentenceWithBlank: "国へ 手紙を〔 ＿＿＿ 〕。",
    fullSentence: "国へ手紙を送ります。",
    targetWord: "送ります",
    correctKana: "おくります",
    options: ["おくります", "かきます", "かいます", "だします"],
    audioSentence: "くにへてがみをおくります。",
    svgType: "mail"
  },

  // ==================== BAB 12 ====================
  {
    id: "cloze_b12_01",
    lesson: 12,
    pos: "noun",
    posLabelJa: "名詞 (Kata Benda)",
    sentenceWithBlank: "きのうは 強い〔 ＿＿＿ 〕でした。",
    fullSentence: "きのうは強い雨でした。",
    targetWord: "雨",
    correctKana: "あめ",
    options: ["あめ", "ゆき", "くもり", "かぜ"],
    audioSentence: "きのうはつよいあめでした。",
    svgType: "rain"
  },

  // ==================== BAB 13 ====================
  {
    id: "cloze_b13_01",
    lesson: 13,
    pos: "verb",
    posLabelJa: "動詞 (Kata Kerja)",
    sentenceWithBlank: "のどが かわきましたから、冷たい 水を〔 ＿＿＿ 〕たいです。",
    fullSentence: "のどがかわきましたから、冷たい水を飲みたいです。",
    targetWord: "飲み",
    correctKana: "のみ",
    options: ["のみ", "たべ", "かい", "み"],
    audioSentence: "のどがかわきましたから、つめたいみずをのみたいです。",
    svgType: "water_glass"
  },
  {
    id: "cloze_b13_02",
    lesson: 13,
    pos: "verb",
    posLabelJa: "動詞 (Kata Kerja)",
    sentenceWithBlank: "新しい 車を〔 ＿＿＿ 〕たいです。",
    fullSentence: "新しい車を買いたいです。",
    targetWord: "買い",
    correctKana: "かい",
    options: ["かい", "うり", "のり", "み"],
    audioSentence: "あたらしいくるまをかいたいです。",
    svgType: "car"
  },

  // ==================== BAB 14 ====================
  {
    id: "cloze_b14_01",
    lesson: 14,
    pos: "verb",
    posLabelJa: "動詞 (Kata Kerja)",
    sentenceWithBlank: "あの 花屋の 前で〔 ＿＿＿ 〕ください。",
    fullSentence: "あの花屋の前で止めてください。",
    targetWord: "止めて",
    correctKana: "とめて",
    options: ["とめて", "まがって", "まって", "いって"],
    audioSentence: "あのはなやのまえでとめてください。",
    svgType: "stop_car"
  },
  {
    id: "cloze_b14_02",
    lesson: 14,
    pos: "verb",
    posLabelJa: "動詞 (Kata Kerja)",
    sentenceWithBlank: "今 外で 雨が〔 ＿＿＿ 〕います。",
    fullSentence: "今外で雨が降っています。",
    targetWord: "降って",
    correctKana: "ふって",
    options: ["ふって", "ふいて", "やんで", "ふって"],
    audioSentence: "いまそとであめがふっています。",
    svgType: "rain"
  },
  {
    id: "cloze_b14_03",
    lesson: 14,
    pos: "verb",
    posLabelJa: "動詞 (Kata Kerja)",
    sentenceWithBlank: "重い 荷物を〔 ＿＿＿ 〕ましょうか。",
    fullSentence: "重い荷物を持ちましょうか。",
    targetWord: "持ち",
    correctKana: "もち",
    options: ["もち", "あけ", "つけ", "とめ"],
    audioSentence: "おもいにもつをもちましょうか。",
    svgType: "luggage"
  },
  ...CLOZE_15_25,
  ...CLOZE_EXPANSION
];

// Helper to render cheerful, funny kawaii cartoon-sticker contextual illustrations
export function getContextSvg(svgType) {
  return getClozeIllustrationSvg(svgType);
}
