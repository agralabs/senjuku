// Minna no Nihongo Lessons 1-14: Fill-in-the-Blank (Cloze Sentence) Database
// Mode Paling Sulit: Strict Kana/Kanji only (Tanpa Romaji & Tanpa Terjemahan)
// Target: Mengisi Kata Benda (名詞) atau Kata Kerja (動詞)
// Dilengkapi gambar vektor sederhana (SVG) untuk membantu pemahaman konteks situasi

import { CLOZE_15_25 } from './bank-15-25.js';
import { CLOZE_EXPANSION } from './bank-expansion.js';

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

// Helper to render crisp contextual SVG vector illustrations
export function getContextSvg(svgType) {
  const svgs = {
    office_worker: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="40" cy="24" r="12" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1"/>
        <path d="M22 62c0-10 8-18 18-18s18 8 18 18" stroke="#6366f1"/>
        <polygon points="40,44 44,52 40,64 36,52" fill="#ef4444" stroke="#ef4444" stroke-width="1.5"/>
        <rect x="52" y="48" width="16" height="12" rx="2" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b"/>
        <path d="M57 48v-3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3" stroke="#f59e0b"/>
      </svg>
    `,
    doctor: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="40" cy="24" r="12" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981"/>
        <path d="M22 64c0-10 8-18 18-18s18 8 18 18" stroke="#10b981"/>
        <rect x="36" y="48" width="8" height="14" fill="#ffffff" stroke="#10b981"/>
        <path d="M30 46v6c0 6 4 10 10 10s10-4 10-10v-6" stroke="#0ea5e9"/>
        <circle cx="40" cy="62" r="3" fill="#0ea5e9" stroke="#0ea5e9"/>
      </svg>
    `,
    student: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="40" cy="30" r="11" fill="rgba(236, 72, 153, 0.15)" stroke="#ec4899"/>
        <path d="M22 64c0-9 8-16 18-16s18 7 18 16" stroke="#ec4899"/>
        <polygon points="40,12 18,22 40,32 62,22" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1"/>
        <path d="M62 22v12" stroke="#6366f1"/>
      </svg>
    `,
    magazine: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="20" y="16" width="40" height="48" rx="4" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b"/>
        <line x1="28" y1="28" x2="52" y2="28" stroke="#f59e0b"/>
        <line x1="28" y1="38" x2="48" y2="38" stroke="#f59e0b"/>
        <rect x="28" y="46" width="24" height="10" rx="1" fill="#f59e0b" stroke="#f59e0b"/>
      </svg>
    `,
    umbrella: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 42 A 24 24 0 0 1 64 42 Z" fill="rgba(14, 165, 233, 0.2)" stroke="#0ea5e9"/>
        <line x1="40" y1="18" x2="40" y2="58" stroke="#0ea5e9"/>
        <path d="M40 58 a 5 5 0 0 1 -10 0" stroke="#0ea5e9"/>
        <circle cx="24" cy="22" r="1.5" fill="#0ea5e9"/>
        <circle cx="56" cy="22" r="1.5" fill="#0ea5e9"/>
      </svg>
    `,
    watch: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="32" y="10" width="16" height="60" rx="4" fill="rgba(100, 116, 139, 0.2)" stroke="#64748b"/>
        <circle cx="40" cy="40" r="18" fill="#1e293b" stroke="#f59e0b" stroke-width="3"/>
        <line x1="40" y1="40" x2="40" y2="28" stroke="#ffffff"/>
        <line x1="40" y1="40" x2="48" y2="40" stroke="#f59e0b"/>
      </svg>
    `,
    shopping: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="22" y="28" width="36" height="38" rx="3" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1"/>
        <path d="M30 28v-8a10 10 0 0 1 20 0v8" stroke="#6366f1"/>
        <circle cx="40" cy="46" r="4" fill="#6366f1"/>
      </svg>
    `,
    restroom: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="30" cy="24" r="6" fill="#0ea5e9" stroke="#0ea5e9"/>
        <path d="M22 60v-16a4 4 0 0 1 8 0v16" stroke="#0ea5e9"/>
        <circle cx="50" cy="24" r="6" fill="#ec4899" stroke="#ec4899"/>
        <path d="M42 60l5-20h6l5 20" stroke="#ec4899"/>
      </svg>
    `,
    wake_up: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="40" cy="44" r="20" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b"/>
        <line x1="40" y1="44" x2="40" y2="32" stroke="#f59e0b"/>
        <line x1="40" y1="44" x2="48" y2="44" stroke="#f59e0b"/>
        <path d="M24 20l6 6" stroke="#f59e0b"/>
        <path d="M56 20l-6 6" stroke="#f59e0b"/>
        <line x1="40" y1="12" x2="40" y2="18" stroke="#f59e0b"/>
      </svg>
    `,
    bank: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="40,16 16,30 64,30" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981"/>
        <line x1="22" y1="30" x2="22" y2="54" stroke="#10b981"/>
        <line x1="34" y1="30" x2="34" y2="54" stroke="#10b981"/>
        <line x1="46" y1="30" x2="46" y2="54" stroke="#10b981"/>
        <line x1="58" y1="30" x2="58" y2="54" stroke="#10b981"/>
        <rect x="14" y="54" width="52" height="10" rx="1" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981"/>
      </svg>
    `,
    sleep: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M48 20a18 18 0 1 1-22 26 22 22 0 0 0 22-26z" fill="rgba(139, 92, 246, 0.25)" stroke="#8b5cf6"/>
        <text x="50" y="24" font-family="sans-serif" font-weight="bold" font-size="14" fill="#f59e0b">Z</text>
        <text x="58" y="16" font-family="sans-serif" font-weight="bold" font-size="10" fill="#f59e0b">z</text>
      </svg>
    `,
    subway: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="22" y="18" width="36" height="42" rx="6" fill="rgba(14, 165, 233, 0.2)" stroke="#0ea5e9"/>
        <line x1="28" y1="28" x2="52" y2="28" stroke="#0ea5e9"/>
        <rect x="28" y="34" width="24" height="12" rx="2" fill="#0ea5e9"/>
        <circle cx="30" cy="52" r="2.5" fill="#f59e0b"/>
        <circle cx="50" cy="52" r="2.5" fill="#f59e0b"/>
        <line x1="28" y1="64" x2="22" y2="68" stroke="#64748b"/>
        <line x1="52" y1="64" x2="58" y2="68" stroke="#64748b"/>
      </svg>
    `,
    bullet_train: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 48 L46 48 Q64 48 64 36 Q64 24 46 24 L16 24 Z" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1"/>
        <line x1="22" y1="32" x2="32" y2="32" stroke="#6366f1"/>
        <line x1="38" y1="32" x2="48" y2="32" stroke="#6366f1"/>
        <path d="M52 34 L60 36" stroke="#ef4444" stroke-width="3"/>
        <line x1="12" y1="56" x2="68" y2="56" stroke="#64748b" stroke-dasharray="4 2"/>
      </svg>
    `,
    home: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="40,16 16,36 64,36" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e"/>
        <rect x="24" y="36" width="32" height="28" rx="2" fill="rgba(244, 63, 94, 0.1)" stroke="#f43f5e"/>
        <rect x="34" y="48" width="12" height="16" fill="#f43f5e"/>
      </svg>
    `,
    eat: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 38 a20 20 0 0 0 40 0z" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b"/>
        <line x1="16" y1="38" x2="64" y2="38" stroke="#f59e0b"/>
        <line x1="32" y1="58" x2="48" y2="58" stroke="#f59e0b" stroke-width="3"/>
        <line x1="28" y1="20" x2="52" y2="34" stroke="#ffffff" stroke-width="2"/>
        <line x1="24" y1="24" x2="48" y2="38" stroke="#ffffff" stroke-width="2"/>
      </svg>
    `,
    drink: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M26 26 l4 36 h20 l4-36 z" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981"/>
        <path d="M54 34 h8 a4 4 0 0 1 4 4 v8 a4 4 0 0 1 -4 4 h-8" stroke="#10b981"/>
        <line x1="34" y1="16" x2="34" y2="22" stroke="#10b981" stroke-dasharray="2 2"/>
        <line x1="42" y1="14" x2="42" y2="22" stroke="#10b981" stroke-dasharray="2 2"/>
      </svg>
    `,
    shopping_cart: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="32" cy="62" r="4" fill="#6366f1"/>
        <circle cx="56" cy="62" r="4" fill="#6366f1"/>
        <path d="M16 20 h10 l8 32 h24 l6-22 h-44" stroke="#6366f1"/>
      </svg>
    `,
    read: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M40 28 c-6-6-14-6-22-4 v32 c8-2 16-2 22 4 c6-6 14-6 22-4 v-32 c-8-2-16-2-22 4 z" fill="rgba(14, 165, 233, 0.2)" stroke="#0ea5e9"/>
        <line x1="40" y1="28" x2="40" y2="60" stroke="#0ea5e9"/>
      </svg>
    `,
    chopsticks: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="20" y1="18" x2="60" y2="58" stroke="#f59e0b" stroke-width="3.5"/>
        <line x1="28" y1="16" x2="64" y2="50" stroke="#f59e0b" stroke-width="3.5"/>
        <circle cx="58" cy="54" r="8" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b"/>
      </svg>
    `,
    write: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 58 l4-16 28-28 12 12-28 28z" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1"/>
        <line x1="18" y1="62" x2="26" y2="62" stroke="#6366f1"/>
      </svg>
    `,
    gift: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="22" y="32" width="36" height="32" rx="2" fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e"/>
        <rect x="18" y="24" width="44" height="8" rx="2" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e"/>
        <line x1="40" y1="24" x2="40" y2="64" stroke="#f43f5e" stroke-width="3"/>
        <path d="M40 24 c-6-8-12 0-4 4 z" fill="#f43f5e"/>
        <path d="M40 24 c6-8 12 0 4 4 z" fill="#f43f5e"/>
      </svg>
    `,
    mountain: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="40,18 16,62 64,62" fill="rgba(14, 165, 233, 0.2)" stroke="#0ea5e9"/>
        <polygon points="40,18 32,34 40,32 48,34" fill="#ffffff" stroke="#0ea5e9"/>
        <circle cx="62" cy="22" r="6" fill="#ef4444" stroke="#ef4444"/>
      </svg>
    `,
    japanese_food: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="40" cy="48" rx="24" ry="12" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981"/>
        <circle cx="32" cy="44" r="5" fill="#ef4444"/>
        <circle cx="48" cy="44" r="5" fill="#f59e0b"/>
        <line x1="20" y1="24" x2="60" y2="24" stroke="#ffffff"/>
      </svg>
    `,
    heart: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M40 60 C16 44 14 26 28 20 C34 17 40 22 40 24 C40 22 46 17 52 20 C66 26 64 44 40 60 Z" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e"/>
      </svg>
    `,
    newspaper: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="20" y="20" width="40" height="42" rx="2" fill="rgba(100, 116, 139, 0.2)" stroke="#64748b"/>
        <rect x="26" y="26" width="16" height="12" fill="#64748b"/>
        <line x1="46" y1="28" x2="54" y2="28" stroke="#64748b"/>
        <line x1="46" y1="34" x2="54" y2="34" stroke="#64748b"/>
        <line x1="26" y1="44" x2="54" y2="44" stroke="#64748b"/>
        <line x1="26" y1="50" x2="54" y2="50" stroke="#64748b"/>
      </svg>
    `,
    dog: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="40" cy="42" rx="18" ry="14" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b"/>
        <circle cx="34" cy="38" r="2.5" fill="#ffffff"/>
        <circle cx="46" cy="38" r="2.5" fill="#ffffff"/>
        <polygon points="40,42 37,46 43,46" fill="#f59e0b"/>
        <path d="M24 32 C20 22 26 18 30 26" stroke="#f59e0b" fill="#f59e0b"/>
        <path d="M56 32 C60 22 54 18 50 26" stroke="#f59e0b" fill="#f59e0b"/>
      </svg>
    `,
    photo: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="18" y="24" width="44" height="34" rx="4" fill="rgba(14, 165, 233, 0.2)" stroke="#0ea5e9"/>
        <circle cx="40" cy="41" r="8" stroke="#0ea5e9"/>
        <circle cx="52" cy="31" r="2" fill="#0ea5e9"/>
      </svg>
    `,
    stamp: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="24" y="20" width="32" height="40" rx="2" fill="rgba(236, 72, 153, 0.2)" stroke="#ec4899" stroke-dasharray="4 2"/>
        <circle cx="40" cy="40" r="8" fill="#ec4899"/>
      </svg>
    `,
    mail: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="18" y="24" width="44" height="32" rx="3" fill="rgba(14, 165, 233, 0.15)" stroke="#0ea5e9"/>
        <polyline points="18,24 40,42 62,24" stroke="#0ea5e9"/>
      </svg>
    `,
    rain: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M24 38 a12 12 0 0 1 22 -6 a14 14 0 0 1 18 10 a10 10 0 0 1 -4 8 h-36 z" fill="rgba(100, 116, 139, 0.3)" stroke="#64748b"/>
        <line x1="28" y1="56" x2="24" y2="64" stroke="#0ea5e9" stroke-width="3"/>
        <line x1="40" y1="56" x2="36" y2="64" stroke="#0ea5e9" stroke-width="3"/>
        <line x1="52" y1="56" x2="48" y2="64" stroke="#0ea5e9" stroke-width="3"/>
      </svg>
    `,
    water_glass: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M26 22 l4 40 h20 l4-40 z" fill="rgba(14, 165, 233, 0.25)" stroke="#0ea5e9"/>
        <path d="M28 36 q12 4 24 0" stroke="#0ea5e9"/>
      </svg>
    `,
    car: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="28" cy="56" r="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <circle cx="54" cy="56" r="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <path d="M18 48 l4-12 q2-6 10-6 h16 q8 0 12 6 l6 12 h2 v8 h-68 v-8 z" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b"/>
      </svg>
    `,
    stop_car: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="40" cy="40" r="22" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" stroke-width="3"/>
        <rect x="26" y="36" width="28" height="8" rx="2" fill="#ef4444"/>
      </svg>
    `,
    luggage: `
      <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="22" y="28" width="36" height="40" rx="4" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1"/>
        <path d="M32 28v-10h16v10" stroke="#6366f1"/>
        <line x1="30" y1="42" x2="50" y2="42" stroke="#6366f1"/>
        <circle cx="28" cy="68" r="2.5" fill="#6366f1"/>
        <circle cx="52" cy="68" r="2.5" fill="#6366f1"/>
      </svg>
    `
  };

  return svgs[svgType] || `
    <svg viewBox="0 0 80 80" class="cloze-svg" fill="none" stroke="currentColor" stroke-width="2.5">
      <circle cx="40" cy="40" r="20" stroke="#6366f1" fill="rgba(99, 102, 241, 0.15)"/>
      <text x="40" y="46" text-anchor="middle" font-size="20" fill="#6366f1" font-weight="bold">？</text>
    </svg>
  `;
}
