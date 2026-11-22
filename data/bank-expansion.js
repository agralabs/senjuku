// Question Bank Expansion — Bab 1–25 across Cloze, Kanji/Katakana Drill, and Vocab Booster
// Curated directly from Minna no Nihongo I Audio Transcripts (Tracks 001–087)
// Powers both Quiz Mode & Learning Mode across all 8 question categories.

export const CLOZE_EXPANSION = [
  // ==================== BAB 1 ====================
  {
    id: 'cloze_exp_b1_01', lesson: 1, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'ワットさんはさくら大学の〔 ＿＿＿ 〕です。',
    fullSentence: 'ワットさんはさくら大学の先生です。',
    targetWord: '先生', correctKana: 'せんせい',
    options: ['せんせい', 'がくせい', 'いしゃ', 'かいしゃいん'],
    audioSentence: 'ワットさんはさくらだいがくのせんせいです。', svgType: 'student'
  },
  {
    id: 'cloze_exp_b1_02', lesson: 1, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'シュミットさんはパワー電気の〔 ＿＿＿ 〕です。',
    fullSentence: 'シュミットさんはパワー電気のエンジニアです。',
    targetWord: 'エンジニア', correctKana: 'エンジニア',
    options: ['エンジニア', 'いしゃ', 'せんせい', 'ぎんこういん'],
    audioSentence: 'シュミットさんはパワーでんきのエンジニアです。', svgType: 'office_worker'
  },
  {
    id: 'cloze_exp_b1_03', lesson: 1, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'イーさんはAKCの〔 ＿＿＿ 〕です。',
    fullSentence: 'イーさんはAKCの研究者です。',
    targetWord: '研究者', correctKana: 'けんきゅうしゃ',
    options: ['けんきゅうしゃ', 'かいしゃいん', 'いしゃ', 'がくせい'],
    audioSentence: 'イーさんはAKCのけんきゅうしゃです。', svgType: 'study'
  },

  // ==================== BAB 2 ====================
  {
    id: 'cloze_exp_b2_01', lesson: 2, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'これはコンピューターの〔 ＿＿＿ 〕です。',
    fullSentence: 'これはコンピューターの本です。',
    targetWord: '本', correctKana: 'ほん',
    options: ['ほん', 'かさ', 'かぎ', 'とけい'],
    audioSentence: 'これはコンピューターのほんです。', svgType: 'read'
  },
  {
    id: 'cloze_exp_b2_02', lesson: 2, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'それはミラーさんの〔 ＿＿＿ 〕ですか。',
    fullSentence: 'それはミラーさんの傘ですか。',
    targetWord: '傘', correctKana: 'かさ',
    options: ['かさ', 'かばん', 'じしょ', 'しんぶん'],
    audioSentence: 'それはミラーさんのかさですか。', svgType: 'umbrella'
  },
  {
    id: 'cloze_exp_b2_03', lesson: 2, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'これは〔 ＿＿＿ 〕の辞書です。',
    fullSentence: 'これは日本語の辞書です。',
    targetWord: '日本語', correctKana: 'にほんご',
    options: ['にほんご', 'じどうしゃ', 'ざっし', 'えんぴつ'],
    audioSentence: 'これはにほんごのじしょです。', svgType: 'study'
  },

  // ==================== BAB 3 ====================
  {
    id: 'cloze_exp_b3_01', lesson: 3, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '〔 ＿＿＿ 〕は地下一階です。',
    fullSentence: '食堂は地下一階です。',
    targetWord: '食堂', correctKana: 'しょくどう',
    options: ['しょくどう', 'きょうしつ', 'じむしょ', 'かいぎしつ'],
    audioSentence: 'しょくどうはちかいっかいです。', svgType: 'eat'
  },
  {
    id: 'cloze_exp_b3_02', lesson: 3, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'すみません、〔 ＿＿＿ 〕はどこですか。',
    fullSentence: 'すみません、お手洗いはどこですか。',
    targetWord: 'お手洗い', correctKana: 'おてあらい',
    options: ['おてあらい', 'うけつけ', 'かいだん', 'へや'],
    audioSentence: 'すみません、おてあらいはどこですか。', svgType: 'restroom'
  },
  {
    id: 'cloze_exp_b3_03', lesson: 3, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'ワイン〔 ＿＿＿ 〕は地下一階でございます。',
    fullSentence: 'ワイン売り場は地下一階でございます。',
    targetWord: '売り場', correctKana: 'うりば',
    options: ['うりば', 'じむしょ', 'うけつけ', 'かいしゃ'],
    audioSentence: 'ワインうりばはちかいっかいでございます。', svgType: 'shopping'
  },
  {
    id: 'cloze_exp_b3_04', lesson: 3, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'お〔 ＿＿＿ 〕はどちらですか。アメリカです。',
    fullSentence: 'お国はどちらですか。アメリカです。',
    targetWord: '国', correctKana: 'くに',
    options: ['くに', 'かいしゃ', 'でんわ', 'へや'],
    audioSentence: 'おくにはどちらですか。アメリカです。', svgType: 'travel'
  },

  // ==================== BAB 4 ====================
  {
    id: 'cloze_exp_b4_01', lesson: 4, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '毎朝6時に〔 ＿＿＿ 〕。',
    fullSentence: '毎朝6時に起きます。',
    targetWord: '起きます', correctKana: 'おきます',
    options: ['おきます', 'ねます', 'はたらきます', 'やすみます'],
    audioSentence: 'まいあさろくじにおきます。', svgType: 'wake_up'
  },
  {
    id: 'cloze_exp_b4_02', lesson: 4, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '毎晩11時に〔 ＿＿＿ 〕。',
    fullSentence: '毎晩11時に寝ます。',
    targetWord: '寝ます', correctKana: 'ねます',
    options: ['ねます', 'おきます', 'おわります', 'はたらきます'],
    audioSentence: 'まいばんじゅういちじにねます。', svgType: 'sleep'
  },
  {
    id: 'cloze_exp_b4_03', lesson: 4, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '〔 ＿＿＿ 〕は9時から3時までです。',
    fullSentence: '銀行は9時から3時までです。',
    targetWord: '銀行', correctKana: 'ぎんこう',
    options: ['ぎんこう', 'ゆうびんきょく', 'としょかん', 'びじゅつかん'],
    audioSentence: 'ぎんこうはくじからさんじまでです。', svgType: 'bank'
  },

  // ==================== BAB 5 ====================
  {
    id: 'cloze_exp_b5_01', lesson: 5, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '〔 ＿＿＿ 〕で東京へ行きます。',
    fullSentence: '新幹線で東京へ行きます。',
    targetWord: '新幹線', correctKana: 'しんかんせん',
    options: ['しんかんせん', 'ちかてつ', 'じてんしゃ', 'ひこうき'],
    audioSentence: 'しんかんせんでとうきょうへいきます。', svgType: 'bullet_train'
  },
  {
    id: 'cloze_exp_b5_02', lesson: 5, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '昨日うちへ〔 ＿＿＿ 〕。',
    fullSentence: '昨日うちへ帰りました。',
    targetWord: '帰りました', correctKana: 'かえりました',
    options: ['かえりました', 'いきました', 'きました', 'やすみました'],
    audioSentence: 'きのううちへかえりました。', svgType: 'home'
  },
  {
    id: 'cloze_exp_b5_03', lesson: 5, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '〔 ＿＿＿ 〕と京都へ行きました。',
    fullSentence: '友達と京都へ行きました。',
    targetWord: '友達', correctKana: 'ともだち',
    options: ['ともだち', 'かぞく', 'ひとり', 'せんせい'],
    audioSentence: 'ともだちときょうとへいきました。', svgType: 'travel'
  },

  // ==================== BAB 6 ====================
  {
    id: 'cloze_exp_b6_01', lesson: 6, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '毎朝新聞を〔 ＿＿＿ 〕。',
    fullSentence: '毎朝新聞を読みます。',
    targetWord: '読みます', correctKana: 'よみます',
    options: ['よみます', 'かきます', 'ききます', 'みます'],
    audioSentence: 'まいあさしんぶんをよみます。', svgType: 'newspaper'
  },
  {
    id: 'cloze_exp_b6_02', lesson: 6, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '大阪城公園で〔 ＿＿＿ 〕を撮りました。',
    fullSentence: '大阪城公園で写真を撮りました。',
    targetWord: '写真', correctKana: 'しゃしん',
    options: ['しゃしん', 'てがみ', 'えいが', 'しんぶん'],
    audioSentence: 'おおさかじょうこうえんでしゃしんをとりました。', svgType: 'photo'
  },

  // ==================== BAB 7 ====================
  {
    id: 'cloze_exp_b7_01', lesson: 7, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '日本語で〔 ＿＿＿ 〕を書きます。',
    fullSentence: '日本語で手紙を書きます。',
    targetWord: '手紙', correctKana: 'てがみ',
    options: ['てがみ', 'はさみ', 'きっぷ', 'にもつ'],
    audioSentence: 'にほんごでてがみをかきます。', svgType: 'write'
  },
  {
    id: 'cloze_exp_b7_02', lesson: 7, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '木村さんに花を〔 ＿＿＿ 〕。',
    fullSentence: '木村さんに花をあげました。',
    targetWord: 'あげました', correctKana: 'あげました',
    options: ['あげました', 'もらいました', 'かしました', 'かりました'],
    audioSentence: 'きむらさんにはなをあげました。', svgType: 'gift'
  },
  {
    id: 'cloze_exp_b7_03', lesson: 7, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '先生に日本語を〔 ＿＿＿ 〕。',
    fullSentence: '先生に日本語を習いました。',
    targetWord: '習いました', correctKana: 'ならいました',
    options: ['ならいました', 'おしえました', 'かけました', 'おくりました'],
    audioSentence: 'せんせいににほんごをならいました。', svgType: 'study'
  },

  // ==================== BAB 8 ====================
  {
    id: 'cloze_exp_b8_01', lesson: 8, pos: 'noun', posLabelJa: '形容詞 (Kata Sifat)',
    sentenceWithBlank: '富士山は〔 ＿＿＿ 〕山です。',
    fullSentence: '富士山は高い山です。',
    targetWord: '高い', correctKana: 'たかい',
    options: ['たかい', 'やすい', 'ひくい', 'ふるい'],
    audioSentence: 'ふじさんはたかいやまです。', svgType: 'mountain'
  },
  {
    id: 'cloze_exp_b8_02', lesson: 8, pos: 'noun', posLabelJa: '形容詞 (Kata Sifat)',
    sentenceWithBlank: '桜は〔 ＿＿＿ 〕花です。',
    fullSentence: '桜はきれいな花です。',
    targetWord: 'きれいな', correctKana: 'きれいな',
    options: ['きれいな', 'しずかな', 'にぎやかな', 'しんせつな'],
    audioSentence: 'さくらはきれいなはなです。', svgType: 'heart'
  },
  {
    id: 'cloze_exp_b8_03', lesson: 8, pos: 'noun', posLabelJa: '形容詞 (Kata Sifat)',
    sentenceWithBlank: '日本の生活は〔 ＿＿＿ 〕ですか。',
    fullSentence: '日本の生活は忙しいですか。',
    targetWord: '忙しい', correctKana: 'いそがしい',
    options: ['いそがしい', 'たのしい', 'おいしい', 'あたらしい'],
    audioSentence: 'にほんのせいかつはいそがしいですか。', svgType: 'office'
  },
  {
    id: 'cloze_exp_b8_04', lesson: 8, pos: 'noun', posLabelJa: '形容詞 (Kata Sifat)',
    sentenceWithBlank: '日本の食べ物はとても〔 ＿＿＿ 〕です。',
    fullSentence: '日本の食べ物はとてもおいしいです。',
    targetWord: 'おいしい', correctKana: 'おいしい',
    options: ['おいしい', 'さむい', 'あつい', 'むずかしい'],
    audioSentence: 'にほんのたべものはとてもおいしいです。', svgType: 'japanese_food'
  },

  // ==================== BAB 9 ====================
  {
    id: 'cloze_exp_b9_01', lesson: 9, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'クラシックの〔 ＿＿＿ 〕へ行きませんか。',
    fullSentence: 'クラシックのコンサートへ行きませんか。',
    targetWord: 'コンサート', correctKana: 'コンサート',
    options: ['コンサート', 'スポーツ', 'レストラン', 'スーパー'],
    audioSentence: 'クラシックのコンサートへいきませんか。', svgType: 'music'
  },
  {
    id: 'cloze_exp_b9_02', lesson: 9, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '金曜日の晩は友達と〔 ＿＿＿ 〕があります。',
    fullSentence: '金曜日の晩は友達と約束があります。',
    targetWord: '約束', correctKana: 'やくそく',
    options: ['やくそく', 'ようじ', 'じかん', 'おかね'],
    audioSentence: 'きんようびのばんはともだちとやくそくがあります。', svgType: 'watch'
  },
  {
    id: 'cloze_exp_b9_03', lesson: 9, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: 'ひらがながよく〔 ＿＿＿ 〕。',
    fullSentence: 'ひらがながよくわかります。',
    targetWord: 'わかります', correctKana: 'わかります',
    options: ['わかります', 'あります', 'みます', 'ききます'],
    audioSentence: 'ひらがながよくわかります。', svgType: 'study'
  },
  {
    id: 'cloze_exp_b9_04', lesson: 9, pos: 'noun', posLabelJa: '形容詞 (Kata Sifat)',
    sentenceWithBlank: 'カリナさんは絵がとても〔 ＿＿＿ 〕です。',
    fullSentence: 'カリナさんは絵がとても上手です。',
    targetWord: '上手', correctKana: 'じょうず',
    options: ['じょうず', 'へた', 'すき', 'きらい'],
    audioSentence: 'カリナさんはえがとてもじょうずです。', svgType: 'heart'
  },

  // ==================== BAB 10 ====================
  {
    id: 'cloze_exp_b10_01', lesson: 10, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '部屋に〔 ＿＿＿ 〕があります。',
    fullSentence: '部屋に机があります。',
    targetWord: '机', correctKana: 'つくえ',
    options: ['つくえ', 'いぬ', 'ねこ', 'おとこのひと'],
    audioSentence: 'へやにつくえがあります。', svgType: 'home'
  },
  {
    id: 'cloze_exp_b10_02', lesson: 10, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'スーパーの〔 ＿＿＿ 〕に本屋があります。',
    fullSentence: 'スーパーの隣に本屋があります。',
    targetWord: '隣', correctKana: 'となり',
    options: ['となり', 'なか', 'そと', 'うえ'],
    audioSentence: 'スーパーのとなりにほんやがあります。', svgType: 'shopping'
  },
  {
    id: 'cloze_exp_b10_03', lesson: 10, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '〔 ＿＿＿ 〕の中に手紙があります。',
    fullSentence: '箱の中に手紙があります。',
    targetWord: '箱', correctKana: 'はこ',
    options: ['はこ', 'まど', 'いけ', 'にわ'],
    audioSentence: 'はこのなかにてがみがあります。', svgType: 'mail'
  },
  {
    id: 'cloze_exp_b10_04', lesson: 10, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: 'あそこに犬が〔 ＿＿＿ 〕。',
    fullSentence: 'あそこに犬がいます。',
    targetWord: 'います', correctKana: 'います',
    options: ['います', 'あります', 'いきます', 'きます'],
    audioSentence: 'あそこにいぬがいます。', svgType: 'dog'
  },

  // ==================== BAB 11 ====================
  {
    id: 'cloze_exp_b11_01', lesson: 11, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'オーストラリアへこの〔 ＿＿＿ 〕を送りたいです。',
    fullSentence: 'オーストラリアへこの荷物を送りたいです。',
    targetWord: '荷物', correctKana: 'にもつ',
    options: ['にもつ', 'きって', 'はがき', 'ふうとう'],
    audioSentence: 'オーストラリアへこのにもつをおくりたいです。', svgType: 'luggage'
  },
  {
    id: 'cloze_exp_b11_02', lesson: 11, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '80円の〔 ＿＿＿ 〕を5枚ください。',
    fullSentence: '80円の切手を5枚ください。',
    targetWord: '切手', correctKana: 'きって',
    options: ['きって', 'りんご', 'みかん', 'にもつ'],
    audioSentence: 'はちじゅうえんのきってをごまいください。', svgType: 'stamp'
  },
  {
    id: 'cloze_exp_b11_03', lesson: 11, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '船便で1か月ぐらい〔 ＿＿＿ 〕。',
    fullSentence: '船便で1か月ぐらいかかります。',
    targetWord: 'かかります', correctKana: 'かかります',
    options: ['かかります', 'います', 'やすみます', 'おくります'],
    audioSentence: 'ふなびんでいっかげつぐらいかかります。', svgType: 'mail'
  },
  {
    id: 'cloze_exp_b11_04', lesson: 11, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '〔 ＿＿＿ 〕は何人ですか。4人です。',
    fullSentence: '家族は何人ですか。4人です。',
    targetWord: '家族', correctKana: 'かぞく',
    options: ['かぞく', 'きょうだい', 'りょうしん', 'ともだち'],
    audioSentence: 'かぞくはなんにんですか。よにんです。', svgType: 'home'
  },

  // ==================== BAB 12 ====================
  {
    id: 'cloze_exp_b12_01', lesson: 12, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '京都の〔 ＿＿＿ 〕はどうでしたか。',
    fullSentence: '京都の祇園祭はどうでしたか。',
    targetWord: '祇園祭', correctKana: 'ぎおんまつり',
    options: ['ぎおんまつり', 'てんき', 'きせつ', 'りょこう'],
    audioSentence: 'きょうとのぎおんまつりはどうでしたか。', svgType: 'travel'
  },
  {
    id: 'cloze_exp_b12_02', lesson: 12, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '昨日の〔 ＿＿＿ 〕は雨でした。',
    fullSentence: '昨日の天気は雨でした。',
    targetWord: '天気', correctKana: 'てんき',
    options: ['てんき', 'きせつ', 'しけん', 'パーティー'],
    audioSentence: 'きのうのてんきはあめでした。', svgType: 'rain'
  },
  {
    id: 'cloze_exp_b12_03', lesson: 12, pos: 'noun', posLabelJa: '形容詞 (Kata Sifat)',
    sentenceWithBlank: '東京は大阪より人が〔 ＿＿＿ 〕です。',
    fullSentence: '東京は大阪より人が多いです。',
    targetWord: '多い', correctKana: 'おおい',
    options: ['おおい', 'すくない', 'ちかい', 'とおい'],
    audioSentence: 'とうきょうはおおさかよりひとがおおいです。', svgType: 'train'
  },
  {
    id: 'cloze_exp_b12_04', lesson: 12, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '1年でどの〔 ＿＿＿ 〕が一番好きですか。',
    fullSentence: '1年でどの季節が一番好きですか。',
    targetWord: '季節', correctKana: 'きせつ',
    options: ['きせつ', 'てんき', 'くだもの', 'スポーツ'],
    audioSentence: 'いちねんでどのきせつがいちばんすきですか。', svgType: 'mountain'
  },
  {
    id: 'cloze_exp_b12_05', lesson: 12, pos: 'noun', posLabelJa: '形容詞 (Kata Sifat)',
    sentenceWithBlank: '北海道は九州よりずっと〔 ＿＿＿ 〕です。',
    fullSentence: '北海道は九州よりずっと涼しいです。',
    targetWord: '涼しい', correctKana: 'すずしい',
    options: ['すずしい', 'あつい', 'あまい', 'からい'],
    audioSentence: 'ほっかいどうはきゅうしゅうよりずっとすずしいです。', svgType: 'travel'
  },

  // ==================== BAB 13 ====================
  {
    id: 'cloze_exp_b13_01', lesson: 13, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '駅まで子供を〔 ＿＿＿ 〕に行きます。',
    fullSentence: '駅まで子供を迎えに行きます。',
    targetWord: '迎え', correctKana: 'むかえ',
    options: ['むかえ', 'かいもの', 'さんぽ', 'けんぶつ'],
    audioSentence: 'えきまでこどもをむかえにいきます。', svgType: 'train'
  },
  {
    id: 'cloze_exp_b13_02', lesson: 13, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '〔 ＿＿＿ 〕の勉強に日本へ来ました。',
    fullSentence: '美術の勉強に日本へ来ました。',
    targetWord: '美術', correctKana: 'びじゅつ',
    options: ['びじゅつ', 'けいざい', 'スポーツ', 'りょうり'],
    audioSentence: 'びじゅつのべんきょうににほんへきました。', svgType: 'study'
  },
  {
    id: 'cloze_exp_b13_03', lesson: 13, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: 'のどがかわきましたから、何か〔 ＿＿＿ 〕です。',
    fullSentence: 'のどがかわきましたから、何か飲みたいです。',
    targetWord: '飲みたい', correctKana: 'のみたい',
    options: ['のみたい', 'たべたい', 'かいたい', 'ねたい'],
    audioSentence: 'のどがかわきましたから、なにかのみたいです。', svgType: 'water_glass'
  },
  {
    id: 'cloze_exp_b13_04', lesson: 13, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '新しい〔 ＿＿＿ 〕が欲しいです。',
    fullSentence: '新しいパソコンが欲しいです。',
    targetWord: 'パソコン', correctKana: 'パソコン',
    options: ['パソコン', 'じかん', 'おかね', 'くるま'],
    audioSentence: 'あたらしいパソコンがほしいです。', svgType: 'office'
  },

  // ==================== BAB 14 ====================
  {
    id: 'cloze_exp_b14_01', lesson: 14, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: 'あの信号を右へ〔 ＿＿＿ 〕ください。',
    fullSentence: 'あの信号を右へ曲がってください。',
    targetWord: '曲がって', correctKana: 'まがって',
    options: ['まがって', 'とめて', 'よんで', 'かいて'],
    audioSentence: 'あのしんごうをみぎへまがってください。', svgType: 'car'
  },
  {
    id: 'cloze_exp_b14_02', lesson: 14, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: 'あの花屋の前で〔 ＿＿＿ 〕ください。',
    fullSentence: 'あの花屋の前で止めてください。',
    targetWord: '止めて', correctKana: 'とめて',
    options: ['とめて', 'あけて', 'しめて', 'つけて'],
    audioSentence: 'あのはなやのまえでとめてください。', svgType: 'stop_car'
  },
  {
    id: 'cloze_exp_b14_03', lesson: 14, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '佐藤さんは1階で〔 ＿＿＿ 〕しています。',
    fullSentence: '佐藤さんは1階でコピーしています。',
    targetWord: 'コピー', correctKana: 'コピー',
    options: ['コピー', 'でんわ', 'パーティー', 'かいもの'],
    audioSentence: 'さとうさんはいっかいでコピーしています。', svgType: 'office'
  },

  // ==================== BAB 15 ====================
  {
    id: 'cloze_exp_b15_01', lesson: 15, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: 'ここで写真を〔 ＿＿＿ 〕もいいですか。',
    fullSentence: 'ここで写真を撮ってもいいですか。',
    targetWord: '撮って', correctKana: 'とって',
    options: ['とって', 'すって', 'すわって', 'つかって'],
    audioSentence: 'ここでしゃしんをとってもいいですか。', svgType: 'photo'
  },
  {
    id: 'cloze_exp_b15_02', lesson: 15, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '兄は大阪に〔 ＿＿＿ 〕います。',
    fullSentence: '兄は大阪に住んでいます。',
    targetWord: '住んで', correctKana: 'すんで',
    options: ['すんで', 'しって', 'もって', 'うって'],
    audioSentence: 'あにはおおさかにすんでいます。', svgType: 'home'
  },
  {
    id: 'cloze_exp_b15_03', lesson: 15, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '市役所の電話番号を〔 ＿＿＿ 〕いますか。',
    fullSentence: '市役所の電話番号を知っていますか。',
    targetWord: '知って', correctKana: 'しって',
    options: ['しって', 'すんで', 'つくって', 'うって'],
    audioSentence: 'しやくしょのでんわばんごうをしっていますか。', svgType: 'phone'
  },
  {
    id: 'cloze_exp_b15_04', lesson: 15, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'ここに〔 ＿＿＿ 〕を止めてはいけません。',
    fullSentence: 'ここに車を止めてはいけません。',
    targetWord: '車', correctKana: 'くるま',
    options: ['くるま', 'ほん', 'てがみ', 'かばん'],
    audioSentence: 'ここにくるまをとめてはいけません。', svgType: 'stop_car'
  },

  // ==================== BAB 16 ====================
  {
    id: 'cloze_exp_b16_01', lesson: 16, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '大阪駅で電車を〔 ＿＿＿ 〕ます。',
    fullSentence: '大阪駅で電車を乗り換えます。',
    targetWord: '乗り換え', correctKana: 'のりかえ',
    options: ['のりかえ', 'おり', 'の', 'だ'],
    audioSentence: 'おおさかえきででんしゃをのりかえます。', svgType: 'train'
  },
  {
    id: 'cloze_exp_b16_02', lesson: 16, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: 'まずここへカードを〔 ＿＿＿ 〕ください。',
    fullSentence: 'まずここへカードを入れてください。',
    targetWord: '入れて', correctKana: 'いれて',
    options: ['いれて', 'だして', 'おして', 'とって'],
    audioSentence: 'まずここへカードをいれてください。', svgType: 'bank'
  },
  {
    id: 'cloze_exp_b16_03', lesson: 16, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'マリアさんは〔 ＿＿＿ 〕が長くてきれいです。',
    fullSentence: 'マリアさんは髪が長くてきれいです。',
    targetWord: '髪', correctKana: 'かみ',
    options: ['かみ', 'せ', 'め', 'くち'],
    audioSentence: 'マリアさんはかみがながくてきれいです。', svgType: 'heart'
  },
  {
    id: 'cloze_exp_b16_04', lesson: 16, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '大学を〔 ＿＿＿ 〕から、会社で働きます。',
    fullSentence: '大学を出てから、会社で働きます。',
    targetWord: '出て', correctKana: 'でて',
    options: ['でて', 'はいって', 'やめて', 'おわって'],
    audioSentence: 'だいがくをでてから、かいしゃではたらきます。', svgType: 'office_worker'
  },

  // ==================== BAB 17 ====================
  {
    id: 'cloze_exp_b17_01', lesson: 17, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: 'ここでタバコを〔 ＿＿＿ 〕ください。',
    fullSentence: 'ここでタバコを吸わないでください。',
    targetWord: '吸わないで', correctKana: 'すわないで',
    options: ['すわないで', 'のまないで', 'たべないで', 'はなさないで'],
    audioSentence: 'ここでタバコをすわないでください。', svgType: 'health'
  },
  {
    id: 'cloze_exp_b17_02', lesson: 17, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '病院へ行って、〔 ＿＿＿ 〕をもらいました。',
    fullSentence: '病院へ行って、薬をもらいました。',
    targetWord: '薬', correctKana: 'くすり',
    options: ['くすり', 'ねつ', 'かぜ', 'びょうき'],
    audioSentence: 'びょういんへいって、くすりをもらいました。', svgType: 'doctor'
  },
  {
    id: 'cloze_exp_b17_03', lesson: 17, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: 'パスポートを〔 ＿＿＿ 〕なければなりません。',
    fullSentence: 'パスポートを見せなければなりません。',
    targetWord: '見せ', correctKana: 'みせ',
    options: ['みせ', 'かえ', 'はら', 'わすれ'],
    audioSentence: 'パスポートをみせなければなりません。', svgType: 'travel'
  },
  {
    id: 'cloze_exp_b17_04', lesson: 17, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '靴を〔 ＿＿＿ 〕なくてもいいです。',
    fullSentence: '靴を脱がなくてもいいです。',
    targetWord: '脱が', correctKana: 'ぬが',
    options: ['ぬが', 'はか', 'あらわ', 'かえさ'],
    audioSentence: 'くつをぬがなくてもいいです。', svgType: 'home'
  },

  // ==================== BAB 18 ====================
  {
    id: 'cloze_exp_b18_01', lesson: 18, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'ミラーさんの〔 ＿＿＿ 〕は何ですか。',
    fullSentence: 'ミラーさんの趣味は何ですか。',
    targetWord: '趣味', correctKana: 'しゅみ',
    options: ['しゅみ', 'にっき', 'しごと', 'やくそく'],
    audioSentence: 'ミラーさんのしゅみはなんですか。', svgType: 'heart'
  },
  {
    id: 'cloze_exp_b18_02', lesson: 18, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '私はピアノを〔 ＿＿＿ 〕ことができます。',
    fullSentence: '私はピアノを弾くことができます。',
    targetWord: '弾く', correctKana: 'ひく',
    options: ['ひく', 'うたう', 'およぐ', 'あらう'],
    audioSentence: 'わたしはピアノをひくことができます。', svgType: 'music'
  },
  {
    id: 'cloze_exp_b18_03', lesson: 18, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '寝る前に〔 ＿＿＿ 〕を書きます。',
    fullSentence: '寝る前に日記を書きます。',
    targetWord: '日記', correctKana: 'にっき',
    options: ['にっき', 'てがみ', 'げんきん', 'しゅみ'],
    audioSentence: 'ねるまえににっきをかきます。', svgType: 'write'
  },
  {
    id: 'cloze_exp_b18_04', lesson: 18, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '車を〔 ＿＿＿ 〕することができますか。',
    fullSentence: '車を運転することができますか。',
    targetWord: '運転', correctKana: 'うんてん',
    options: ['うんてん', 'よやく', 'かいもの', 'さんぽ'],
    audioSentence: 'くるまをうんてんすることができますか。', svgType: 'car'
  },

  // ==================== BAB 19 ====================
  {
    id: 'cloze_exp_b19_01', lesson: 19, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '富士山に〔 ＿＿＿ 〕ことがありますか。',
    fullSentence: '富士山に登ったことがありますか。',
    targetWord: '登った', correctKana: 'のぼった',
    options: ['のぼった', 'とまった', 'みた', 'いった'],
    audioSentence: 'ふじさんにのぼったことがありますか。', svgType: 'mountain'
  },
  {
    id: 'cloze_exp_b19_02', lesson: 19, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '休みの日は洗濯したり、〔 ＿＿＿ 〕したりします。',
    fullSentence: '休みの日は洗濯したり、掃除したりします。',
    targetWord: '掃除', correctKana: 'そうじ',
    options: ['そうじ', 'うんてん', 'よやく', 'しゅっちょう'],
    audioSentence: 'やすみのひはせんたくしたり、そうじしたりします。', svgType: 'home'
  },
  {
    id: 'cloze_exp_b19_03', lesson: 19, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: 'だんだん〔 ＿＿＿ 〕なりましたね。',
    fullSentence: 'だんだん寒くなりましたね。',
    targetWord: '寒く', correctKana: 'さむく',
    options: ['さむく', 'ねむく', 'つよく', 'よわく'],
    audioSentence: 'だんだんさむくなりましたね。', svgType: 'rain'
  },
  {
    id: 'cloze_exp_b19_04', lesson: 19, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '日本の〔 ＿＿＿ 〕に泊まったことがあります。',
    fullSentence: '日本の旅館に泊まったことがあります。',
    targetWord: '旅館', correctKana: 'りょかん',
    options: ['りょかん', 'びょういん', 'ぎんこう', 'としょかん'],
    audioSentence: 'にほんのりょかんにとまったことがあります。', svgType: 'travel'
  },

  // ==================== BAB 20 ====================
  {
    id: 'cloze_exp_b20_01', lesson: 20, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '夏休みに〔 ＿＿＿ 〕へ帰るの？',
    fullSentence: '夏休みに国へ帰るの？',
    targetWord: '国', correctKana: 'くに',
    options: ['くに', 'えき', 'うみ', 'やま'],
    audioSentence: 'なつやすみにくにへかえるの？', svgType: 'travel'
  },
  {
    id: 'cloze_exp_b20_02', lesson: 20, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: 'この漢字の読み方が〔 ＿＿＿ 〕？',
    fullSentence: 'この漢字の読み方がわかる？',
    targetWord: 'わかる', correctKana: 'わかる',
    options: ['わかる', 'みる', 'きく', 'いう'],
    audioSentence: 'このかんじのよみかたがわかる？', svgType: 'study'
  },
  {
    id: 'cloze_exp_b20_03', lesson: 20, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '日本へ来る前に〔 ＿＿＿ 〕を準備した？',
    fullSentence: '日本へ来る前にビザを準備した？',
    targetWord: 'ビザ', correctKana: 'ビザ',
    options: ['ビザ', 'きっぷ', 'ちず', 'めいし'],
    audioSentence: 'にほんへくるまえにビザをじゅんびした？', svgType: 'travel'
  },
  {
    id: 'cloze_exp_b20_04', lesson: 20, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '時間があったら、一緒に〔 ＿＿＿ 〕？',
    fullSentence: '時間があったら、一緒に食べる？',
    targetWord: '食べる', correctKana: 'たべる',
    options: ['たべる', 'ねる', 'いる', 'ある'],
    audioSentence: 'じかんがあったら、いっしょにたべる？', svgType: 'eat'
  },

  // ==================== BAB 21 ====================
  {
    id: 'cloze_exp_b21_01', lesson: 21, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '明日は雨が降ると〔 ＿＿＿ 〕。',
    fullSentence: '明日は雨が降ると思います。',
    targetWord: '思います', correctKana: 'おもいます',
    options: ['おもいます', 'いいます', 'ききます', 'みます'],
    audioSentence: 'あしたはあめがふるとおもいます。', svgType: 'rain'
  },
  {
    id: 'cloze_exp_b21_02', lesson: 21, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '日本の〔 ＿＿＿ 〕についてどう思いますか。',
    fullSentence: '日本の交通についてどう思いますか。',
    targetWord: '交通', correctKana: 'こうつう',
    options: ['こうつう', 'ぶっか', 'しゅしょう', 'ニュース'],
    audioSentence: 'にほんのこうつうについてどうおもいますか。', svgType: 'train'
  },
  {
    id: 'cloze_exp_b21_03', lesson: 21, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '会議であなたの〔 ＿＿＿ 〕を言ってください。',
    fullSentence: '会議であなたの意見を言ってください。',
    targetWord: '意見', correctKana: 'いけん',
    options: ['いけん', 'はなし', 'ゆめ', 'デザイン'],
    audioSentence: 'かいぎであなたのいけんをいってください。', svgType: 'office'
  },
  {
    id: 'cloze_exp_b21_04', lesson: 21, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '日本は物価が〔 ＿＿＿ 〕と思います。',
    fullSentence: '日本は物価が高いと思います。',
    targetWord: '高い', correctKana: 'たかい',
    options: ['たかい', 'やすい', 'ながい', 'みじかい'],
    audioSentence: 'にほんはぶっかがたかいとおもいます。', svgType: 'shopping'
  },

  // ==================== BAB 22 ====================
  {
    id: 'cloze_exp_b22_01', lesson: 22, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '眼鏡を〔 ＿＿＿ 〕いる人はミラーさんです。',
    fullSentence: '眼鏡をかけている人はミラーさんです。',
    targetWord: 'かけて', correctKana: 'かけて',
    options: ['かけて', 'きて', 'はいて', 'かぶって'],
    audioSentence: 'めがねをかけているひとはミラーさんです。', svgType: 'office_worker'
  },
  {
    id: 'cloze_exp_b22_02', lesson: 22, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'これは昨日〔 ＿＿＿ 〕ケーキです。',
    fullSentence: 'これは昨日作ったケーキです。',
    targetWord: '作った', correctKana: 'つくった',
    options: ['つくった', 'きた', 'かぶった', 'はいた'],
    audioSentence: 'これはきのうつくったケーキです。', svgType: 'eat'
  },
  {
    id: 'cloze_exp_b22_03', lesson: 22, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '駅に近い〔 ＿＿＿ 〕を探しています。',
    fullSentence: '駅に近いアパートを探しています。',
    targetWord: 'アパート', correctKana: 'アパート',
    options: ['アパート', 'コート', 'スーツ', 'セーター'],
    audioSentence: 'えきにちかいアパートをさがしています。', svgType: 'home'
  },
  {
    id: 'cloze_exp_b22_04', lesson: 22, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '朝ご飯を食べる〔 ＿＿＿ 〕がありません。',
    fullSentence: '朝ご飯を食べる時間がありません。',
    targetWord: '時間', correctKana: 'じかん',
    options: ['じかん', 'やくそく', 'ようじ', 'おかね'],
    audioSentence: 'あさごはんをたべるじかんがありません。', svgType: 'watch'
  },

  // ==================== BAB 23 ====================
  {
    id: 'cloze_exp_b23_01', lesson: 23, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '図書館で本を借りるとき、〔 ＿＿＿ 〕が要ります。',
    fullSentence: '図書館で本を借りるとき、カードが要ります。',
    targetWord: 'カード', correctKana: 'カード',
    options: ['カード', 'おつり', 'ちず', 'かぎ'],
    audioSentence: 'としょかんでほんをかりるとき、カードがいります。', svgType: 'read'
  },
  {
    id: 'cloze_exp_b23_02', lesson: 23, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: 'このボタンを〔 ＿＿＿ 〕と、お釣りが出ます。',
    fullSentence: 'このボタンを押すと、お釣りが出ます。',
    targetWord: '押す', correctKana: 'おす',
    options: ['おす', 'ひく', 'まわす', 'さわる'],
    audioSentence: 'このボタンをおすと、おつりがでます。', svgType: 'shopping'
  },
  {
    id: 'cloze_exp_b23_03', lesson: 23, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'あの〔 ＿＿＿ 〕を右へ曲がってください。',
    fullSentence: 'あの角を右へ曲がってください。',
    targetWord: '角', correctKana: 'かど',
    options: ['かど', 'はし', 'みち', 'こうさてん'],
    audioSentence: 'あのかどをみぎへまがってください。', svgType: 'car'
  },
  {
    id: 'cloze_exp_b23_04', lesson: 23, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '道を〔 ＿＿＿ 〕とき、車に気をつけてください。',
    fullSentence: '道を渡るとき、車に気をつけてください。',
    targetWord: '渡る', correctKana: 'わたる',
    options: ['わたる', 'まがる', 'あるく', 'とまる'],
    audioSentence: 'みちをわたるとき、くるまにきをつけてください。', svgType: 'stop_car'
  },

  // ==================== BAB 24 ====================
  {
    id: 'cloze_exp_b24_01', lesson: 24, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '山田さんは私に傘を〔 ＿＿＿ 〕くれました。',
    fullSentence: '山田さんは私に傘を貸してくれました。',
    targetWord: '貸して', correctKana: 'かして',
    options: ['かして', 'かりて', 'おしえて', 'おくって'],
    audioSentence: 'やまださんはわたしにかさをかしてくれました。', svgType: 'umbrella'
  },
  {
    id: 'cloze_exp_b24_02', lesson: 24, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '母が私にセーターを〔 ＿＿＿ 〕くれました。',
    fullSentence: '母が私にセーターを送ってくれました。',
    targetWord: '送って', correctKana: 'おくって',
    options: ['おくって', 'つれて', 'なおして', 'せつめいして'],
    audioSentence: 'ははがわたしにセーターをおくってくれました。', svgType: 'gift'
  },
  {
    id: 'cloze_exp_b24_03', lesson: 24, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '佐藤さんに駅まで〔 ＿＿＿ 〕もらいました。',
    fullSentence: '佐藤さんに駅まで送ってもらいました。',
    targetWord: '送って', correctKana: 'おくって',
    options: ['おくって', 'なおして', 'つれて', 'しょうかいして'],
    audioSentence: 'さとうさんにえきまでおくってもらいました。', svgType: 'car'
  },
  {
    id: 'cloze_exp_b24_04', lesson: 24, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '先生に間違いを〔 ＿＿＿ 〕もらいました。',
    fullSentence: '先生に間違いを直してもらいました。',
    targetWord: '直して', correctKana: 'なおして',
    options: ['なおして', 'かして', 'おくって', 'つくって'],
    audioSentence: 'せんせいにまちがいをなおしてもらいました。', svgType: 'study'
  },

  // ==================== BAB 25 ====================
  {
    id: 'cloze_exp_b25_01', lesson: 25, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '雨が〔 ＿＿＿ 〕ら、出かけません。',
    fullSentence: '雨が降ったら、出かけません。',
    targetWord: '降った', correctKana: 'ふった',
    options: ['ふった', 'やんだ', 'ついた', 'とった'],
    audioSentence: 'あめがふったら、でかけません。', svgType: 'rain'
  },
  {
    id: 'cloze_exp_b25_02', lesson: 25, pos: 'verb', posLabelJa: '動詞 (Kata Kerja)',
    sentenceWithBlank: '駅に〔 ＿＿＿ 〕ら、電話をください。',
    fullSentence: '駅に着いたら、電話をください。',
    targetWord: '着いた', correctKana: 'ついた',
    options: ['ついた', 'いった', 'きた', 'かえった'],
    audioSentence: 'えきについたら、でんわをください。', svgType: 'phone'
  },
  {
    id: 'cloze_exp_b25_03', lesson: 25, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: 'いくら〔 ＿＿＿ 〕ても、わかりません。',
    fullSentence: 'いくら考えても、わかりません。',
    targetWord: '考え', correctKana: 'かんがえ',
    options: ['かんがえ', 'がんばっ', 'はたら', 'しらべ'],
    audioSentence: 'いくらかんがえても、わかりません。', svgType: 'study'
  },
  {
    id: 'cloze_exp_b25_04', lesson: 25, pos: 'noun', posLabelJa: '名詞 (Kata Benda)',
    sentenceWithBlank: '東京へ〔 ＿＿＿ 〕しても、お元気で。',
    fullSentence: '東京へ転勤しても、お元気で。',
    targetWord: '転勤', correctKana: 'てんきん',
    options: ['てんきん', 'りゅうがく', 'しゅっちょう', 'けっこん'],
    audioSentence: 'とうきょうへてんきんしても、おげんきで。', svgType: 'office_worker'
  }
];

export const KANJI_VOCAB_EXPANSION = [
  // ==================== BAB 1–5 ====================
  { id: 'k_exp_01', lesson: 1, type: 'kanji', kanji: '名前', kana: 'なまえ', romaji: 'namae', meaningId: 'nama', meaningEn: 'name', sentence: 'お名前は何ですか。', sentenceKana: 'おなまえはなんですか。', sentenceId: 'Siapa nama Anda?', distractors: ['くに', 'しごと', 'だいがく'] },
  { id: 'k_exp_02', lesson: 2, type: 'kanji', kanji: '辞書', kana: 'じしょ', romaji: 'jisho', meaningId: 'kamus', meaningEn: 'dictionary', sentence: 'これは日本語の辞書です。', sentenceKana: 'これはにほんごのじしょです。', sentenceId: 'Ini kamus bahasa Jepang.', distractors: ['ざっし', 'しんぶん', 'てちょう'] },
  { id: 'k_exp_03', lesson: 3, type: 'kanji', kanji: '地下', kana: 'ちか', romaji: 'chika', meaningId: 'bawah tanah', meaningEn: 'basement', sentence: 'ワイン売り場は地下一階です。', sentenceKana: 'ワインうりばはちかいっかいです。', sentenceId: 'Bagian penjualan anggur di lantai B1.', distractors: ['かいだん', 'うけつけ', 'じむしょ'] },
  { id: 'k_exp_04', lesson: 3, type: 'katakana', kanji: 'ネクタイ', kana: 'ネクタイ', romaji: 'nekutai', meaningId: 'dasi', meaningEn: 'necktie', sentence: 'ネクタイ売り場は3階です。', sentenceKana: 'ネクタイうりばはさんがいです。', sentenceId: 'Bagian dasi di lantai 3.', distractors: ['ワイン', 'カメラ', 'エレベーター'] },
  { id: 'k_exp_05', lesson: 4, type: 'katakana', kanji: 'ニューヨーク', kana: 'ニューヨーク', romaji: 'nyuuyooku', meaningId: 'New York', meaningEn: 'New York', sentence: '今ニューヨークは何時ですか。', sentenceKana: 'いまニューヨークはなんじですか。', sentenceId: 'Sekarang jam berapa di New York?', distractors: ['ロンドン', 'バンコク', 'ペキン'] },
  { id: 'k_exp_06', lesson: 4, type: 'katakana', kanji: 'ロンドン', kana: 'ロンドン', romaji: 'rondon', meaningId: 'London', meaningEn: 'London', sentence: 'ロンドンは今午前9時です。', sentenceKana: 'ロンドンはいまごぜんくじです。', sentenceId: 'Di London sekarang jam 9 pagi.', distractors: ['ニューヨーク', 'パリ', 'シドニー'] },
  { id: 'k_exp_07', lesson: 4, type: 'kanji', kanji: '勉強', kana: 'べんきょう', romaji: 'benkyou', meaningId: 'belajar', meaningEn: 'study', sentence: '毎日日本語を勉強します。', sentenceKana: 'まいにちにほんごをべんきょうします。', sentenceId: 'Setiap hari belajar bahasa Jepang.', distractors: ['しごと', 'やすみ', 'かいぎ'] },
  { id: 'k_exp_08', lesson: 5, type: 'kanji', kanji: '新幹線', kana: 'しんかんせん', romaji: 'shinkansen', meaningId: 'kereta cepat Shinkansen', meaningEn: 'bullet train', sentence: '新幹線で東京へ行きます。', sentenceKana: 'しんかんせんでとうきょうへいきます。', sentenceId: 'Pergi ke Tokyo naik Shinkansen.', distractors: ['ちかてつ', 'ひこうき', 'じてんしゃ'] },
  { id: 'k_exp_09', lesson: 5, type: 'kanji', kanji: '誕生日', kana: 'たんじょうび', romaji: 'tanjoubi', meaningId: 'hari ulang tahun', meaningEn: 'birthday', sentence: '誕生日はいつですか。', sentenceKana: 'たんじょうびはいつですか。', sentenceId: 'Kapan hari ulang tahun Anda?', distractors: ['やすみ', 'きのう', 'らいしゅう'] },
  { id: 'k_exp_10', lesson: 5, type: 'katakana', kanji: 'タクシー', kana: 'タクシー', romaji: 'takushii', meaningId: 'taksi', meaningEn: 'taxi', sentence: 'タクシーでうちへ帰ります。', sentenceKana: 'タクシーでうちへかえります。', sentenceId: 'Pulang ke rumah naik taksi.', distractors: ['バス', 'デパート', 'スーパー'] },

  // ==================== BAB 6–10 ====================
  { id: 'k_exp_11', lesson: 6, type: 'kanji', kanji: '写真', kana: 'しゃしん', romaji: 'shashin', meaningId: 'foto', meaningEn: 'photograph', sentence: '公園で写真を撮りました。', sentenceKana: 'こうえんでしゃしんをとりました。', sentenceId: 'Mengambil foto di taman.', distractors: ['てがみ', 'しんぶん', 'えいが'] },
  { id: 'k_exp_12', lesson: 6, type: 'katakana', kanji: 'ビール', kana: 'ビール', romaji: 'biiru', meaningId: 'bir', meaningEn: 'beer', sentence: '一緒にビールを飲みませんか。', sentenceKana: 'いっしょにビールをのみませんか。', sentenceId: 'Maukah minum bir bersama?', distractors: ['コーヒー', 'ジュース', 'パン'] },
  { id: 'k_exp_13', lesson: 7, type: 'kanji', kanji: '手紙', kana: 'てがみ', romaji: 'tegami', meaningId: 'surat', meaningEn: 'letter', sentence: '母に手紙を書きました。', sentenceKana: 'ははにてがみをかきました。', sentenceId: 'Menulis surat untuk ibu.', distractors: ['きっぷ', 'はがき', 'にもつ'] },
  { id: 'k_exp_14', lesson: 7, type: 'kanji', kanji: '家族', kana: 'かぞく', romaji: 'kazoku', meaningId: 'keluarga', meaningEn: 'family', sentence: '家族に電話をかけます。', sentenceKana: 'かぞくにでんわをかけます。', sentenceId: 'Menelepon keluarga.', distractors: ['ともだち', 'きょうだい', 'りょうしん'] },
  { id: 'k_exp_15', lesson: 8, type: 'katakana', kanji: 'ハンサム', kana: 'ハンサム', romaji: 'hansamu', meaningId: 'tampan', meaningEn: 'handsome', sentence: 'ミラーさんはハンサムです。', sentenceKana: 'ミラーさんはハンサムです。', sentenceId: 'Bapak Miller tampan.', distractors: ['きれい', 'しんせつ', 'げんき'] },
  { id: 'k_exp_16', lesson: 8, type: 'katakana', kanji: 'レストラン', kana: 'レストラン', romaji: 'resutoran', meaningId: 'restoran', meaningEn: 'restaurant', sentence: 'あのレストランは有名です。', sentenceKana: 'あのレストランはゆうめいです。', sentenceId: 'Restoran itu terkenal.', distractors: ['デパート', 'ホテル', 'スーパー'] },
  { id: 'k_exp_17', lesson: 8, type: 'kanji', kanji: '有名', kana: 'ゆうめい', romaji: 'yuumei', meaningId: 'terkenal', meaningEn: 'famous', sentence: '奈良は有名な町です。', sentenceKana: 'ならはゆうめいなまちです。', sentenceId: 'Nara adalah kota yang terkenal.', distractors: ['しずか', 'にぎやか', 'しんせつ'] },
  { id: 'k_exp_18', lesson: 9, type: 'kanji', kanji: '約束', kana: 'やくそく', romaji: 'yakusoku', meaningId: 'janji', meaningEn: 'appointment / promise', sentence: '友達と約束があります。', sentenceKana: 'ともだちとやくそくがあります。', sentenceId: 'Ada janji dengan teman.', distractors: ['ようじ', 'じかん', 'りょこう'] },
  { id: 'k_exp_19', lesson: 9, type: 'kanji', kanji: '音楽', kana: 'おんがく', romaji: 'ongaku', meaningId: 'musik', meaningEn: 'music', sentence: '私は音楽が好きです。', sentenceKana: 'わたしはおんがくがすきです。', sentenceId: 'Saya suka musik.', distractors: ['えいが', 'スポーツ', 'りょうり'] },
  { id: 'k_exp_20', lesson: 10, type: 'kanji', kanji: '郵便局', kana: 'ゆうびんきょく', romaji: 'yuubinkyoku', meaningId: 'kantor pos', meaningEn: 'post office', sentence: '郵便局は銀行の隣です。', sentenceKana: 'ゆうびんきょくはぎんこうのとなりです。', sentenceId: 'Kantor pos di sebelah bank.', distractors: ['ぎんこう', 'としょかん', 'びょういん'] },
  { id: 'k_exp_21', lesson: 10, type: 'katakana', kanji: 'スーパー', kana: 'スーパー', romaji: 'suupaa', meaningId: 'supermarket', meaningEn: 'supermarket', sentence: '駅の近くにスーパーがあります。', sentenceKana: 'えきのちかくにスーパーがあります。', sentenceId: 'Di dekat stasiun ada supermarket.', distractors: ['デパート', 'コンビニ', 'レストラン'] },

  // ==================== BAB 11–14 ====================
  { id: 'k_exp_22', lesson: 11, type: 'kanji', kanji: '切手', kana: 'きって', romaji: 'kitte', meaningId: 'prangko', meaningEn: 'postage stamp', sentence: '80円の切手を5枚ください。', sentenceKana: 'はちじゅうえんのきってをごまいください。', sentenceId: 'Tolong 5 lembar prangko 80 yen.', distractors: ['はがき', 'ふうとう', 'にもつ'] },
  { id: 'k_exp_23', lesson: 11, type: 'kanji', kanji: '船便', kana: 'ふなびん', romaji: 'funabin', meaningId: 'pos laut', meaningEn: 'surface mail', sentence: '船便で1か月かかります。', sentenceKana: 'ふなびんでいっかげつかかります。', sentenceId: 'Dengan pos laut memakan waktu 1 bulan.', distractors: ['こうくうびん', 'にもつ', 'きって'] },
  { id: 'k_exp_24', lesson: 12, type: 'katakana', kanji: 'パーティー', kana: 'パーティー', romaji: 'paatii', meaningId: 'pesta', meaningEn: 'party', sentence: 'パーティーはとても楽しかったです。', sentenceKana: 'パーティーはとてもたのしかったです。', sentenceId: 'Pestanya sangat menyenangkan.', distractors: ['コンサート', 'レストラン', 'スポーツ'] },
  { id: 'k_exp_25', lesson: 12, type: 'katakana', kanji: 'サッカー', kana: 'サッカー', romaji: 'sakkaa', meaningId: 'sepak bola', meaningEn: 'soccer', sentence: 'サッカーと野球とどちらが好きですか。', sentenceKana: 'サッカーとやきゅうとどちらがすきですか。', sentenceId: 'Antara sepak bola dan bisbol mana yang lebih disukai?', distractors: ['テニス', 'スキー', 'ゴルフ'] },
  { id: 'k_exp_26', lesson: 12, type: 'kanji', kanji: '季節', kana: 'きせつ', romaji: 'kisetsu', meaningId: 'musim', meaningEn: 'season', sentence: '1年で秋が一番好きです。', sentenceKana: 'いちねんであきがいちばんすきです。', sentenceId: 'Dalam setahun paling suka musim gugur.', distractors: ['てんき', 'まつり', 'りょこう'] },
  { id: 'k_exp_27', lesson: 13, type: 'kanji', kanji: '美術', kana: 'びじゅつ', romaji: 'bijutsu', meaningId: 'seni rupa', meaningEn: 'fine arts', sentence: '美術の勉強に来ました。', sentenceKana: 'びじゅつのべんきょうにきました。', sentenceId: 'Datang untuk belajar seni rupa.', distractors: ['おんがく', 'けいざい', 'りょうり'] },
  { id: 'k_exp_28', lesson: 13, type: 'kanji', kanji: '時間', kana: 'じかん', romaji: 'jikan', meaningId: 'waktu', meaningEn: 'time', sentence: '毎日忙しいですから、時間が欲しいです。', sentenceKana: 'まいにちいそがしいですから、じかんがほしいです。', sentenceId: 'Karena sibuk setiap hari, saya ingin waktu.', distractors: ['おかね', 'やすみ', 'しごと'] },
  { id: 'k_exp_29', lesson: 14, type: 'kanji', kanji: '信号', kana: 'しんごう', romaji: 'shingou', meaningId: 'lampu lalu lintas', meaningEn: 'traffic light', sentence: 'あの信号を右へ曲がってください。', sentenceKana: 'あのしんごうをみぎへまがってください。', sentenceId: 'Tolong belok kanan di lampu lalu lintas itu.', distractors: ['かど', 'はし', 'みち'] },
  { id: 'k_exp_30', lesson: 14, type: 'katakana', kanji: 'コピー', kana: 'コピー', romaji: 'kopii', meaningId: 'fotokopi', meaningEn: 'photocopy', sentence: '1階でコピーしています。', sentenceKana: 'いっかいでコピーしています。', sentenceId: 'Sedang memfotokopi di lantai 1.', distractors: ['ファクス', 'メール', 'レポート'] },
  { id: 'k_exp_31', lesson: 14, type: 'kanji', kanji: '住所', kana: 'じゅうしょ', romaji: 'juusho', meaningId: 'alamat', meaningEn: 'address', sentence: 'あなたのうちの住所を書いてください。', sentenceKana: 'あなたのうちのじゅうしょをかいてください。', sentenceId: 'Tolong tuliskan alamat rumah Anda.', distractors: ['なまえ', 'ばんごう', 'ちず'] },

  // ==================== BAB 15–20 ====================
  { id: 'k_exp_32', lesson: 15, type: 'kanji', kanji: '市役所', kana: 'しやくしょ', romaji: 'shiyakusho', meaningId: 'balai kota', meaningEn: 'city hall', sentence: '市役所の電話番号を知っていますか。', sentenceKana: 'しやくしょのでんわばんごうをしっていますか。', sentenceId: 'Apakah tahu nomor telepon balai kota?', distractors: ['ゆうびんきょく', 'けいさつしょ', 'びょういん'] },
  { id: 'k_exp_33', lesson: 15, type: 'kanji', kanji: '独身', kana: 'どくしん', romaji: 'dokushin', meaningId: 'lajang', meaningEn: 'single / unmarried', sentence: 'いいえ、まだ独身です。', sentenceKana: 'いいえ、まだどくしんです。', sentenceId: 'Tidak, saya masih lajang.', distractors: ['けっこん', 'かぞく', 'りょうしん'] },
  { id: 'k_exp_34', lesson: 15, type: 'kanji', kanji: '高校', kana: 'こうこう', romaji: 'koukou', meaningId: 'SMA', meaningEn: 'high school', sentence: '姉は高校の教師です。', sentenceKana: 'あねはこうこうのきょうしです。', sentenceId: 'Kakak perempuan saya guru SMA.', distractors: ['だいがく', 'しょうがっこう', 'ちゅうがっこう'] },
  { id: 'k_exp_35', lesson: 15, type: 'katakana', kanji: 'カタログ', kana: 'カタログ', romaji: 'katarogu', meaningId: 'katalog', meaningEn: 'catalog', sentence: 'このカタログをもらってもいいですか。', sentenceKana: 'このカタログをもらってもいいですか。', sentenceId: 'Bolehkah saya mengambil katalog ini?', distractors: ['カレンダー', 'パンフレット', 'マニュアル'] },

  { id: 'k_exp_36', lesson: 16, type: 'kanji', kanji: '暗証番号', kana: 'あんしょうばんごう', romaji: 'anshou bangou', meaningId: 'nomor PIN', meaningEn: 'PIN number', sentence: '暗証番号を押してください。', sentenceKana: 'あんしょうばんごうをおしてください。', sentenceId: 'Silakan tekan nomor PIN.', distractors: ['でんわばんごう', 'じゅうしょ', 'きんがく'] },
  { id: 'k_exp_37', lesson: 16, type: 'kanji', kanji: '金額', kana: 'きんがく', romaji: 'kingaku', meaningId: 'jumlah uang', meaningEn: 'amount of money', sentence: '次に金額を押してください。', sentenceKana: 'つぎにきんがくをおしてください。', sentenceId: 'Selanjutnya silakan tekan jumlah uang.', distractors: ['ばんごう', 'ねだん', 'おつり'] },
  { id: 'k_exp_38', lesson: 16, type: 'kanji', kanji: '確認', kana: 'かくにん', romaji: 'kakunin', meaningId: 'konfirmasi', meaningEn: 'confirmation', sentence: '最後に確認ボタンを押します。', sentenceKana: 'さいごにかくにんボタンをおします。', sentenceId: 'Terakhir tekan tombol konfirmasi.', distractors: ['あんしょう', 'けっこん', 'うんてん'] },
  { id: 'k_exp_39', lesson: 16, type: 'katakana', kanji: 'カード', kana: 'カード', romaji: 'kaado', meaningId: 'kartu', meaningEn: 'card', sentence: 'まずここへカードを入れてください。', sentenceKana: 'まずここへカードをいれてください。', sentenceId: 'Pertama masukkan kartu ke sini.', distractors: ['ボタン', 'キャッシュ', 'レシート'] },

  { id: 'k_exp_40', lesson: 17, type: 'kanji', kanji: '熱', kana: 'ねつ', romaji: 'netsu', meaningId: 'demam', meaningEn: 'fever', sentence: 'きのうから熱があります。', sentenceKana: 'きのうからねつがあります。', sentenceId: 'Sejak kemarin saya demam.', distractors: ['かぜ', 'くすり', 'のど'] },
  { id: 'k_exp_41', lesson: 17, type: 'kanji', kanji: '保険証', kana: 'ほけんしょう', romaji: 'hokenshou', meaningId: 'kartu asuransi', meaningEn: 'health insurance card', sentence: '保険証を持って来なければなりません。', sentenceKana: 'ほけんしょうをもってこなければなりません。', sentenceId: 'Harus membawa kartu asuransi.', distractors: ['パスポート', 'めいし', 'きっぷ'] },
  { id: 'k_exp_42', lesson: 17, type: 'kanji', kanji: '残業', kana: 'ざんぎょう', romaji: 'zangyou', meaningId: 'lembur', meaningEn: 'overtime work', sentence: '今日は残業しなければなりません。', sentenceKana: 'きょうはざんぎょうしなければなりません。', sentenceId: 'Hari ini harus lembur.', distractors: ['しゅっちょう', 'やすみ', 'かいぎ'] },
  { id: 'k_exp_43', lesson: 17, type: 'katakana', kanji: 'パスポート', kana: 'パスポート', romaji: 'pasupooto', meaningId: 'paspor', meaningEn: 'passport', sentence: 'パスポートを見せてください。', sentenceKana: 'パスポートをみせてください。', sentenceId: 'Tolong perlihatkan paspor Anda.', distractors: ['ビザ', 'チケット', 'カード'] },

  { id: 'k_exp_44', lesson: 18, type: 'kanji', kanji: '日記', kana: 'にっき', romaji: 'nikki', meaningId: 'buku harian', meaningEn: 'diary', sentence: '寝る前に日記を書きます。', sentenceKana: 'ねるまえににっきをかきます。', sentenceId: 'Menulis buku harian sebelum tidur.', distractors: ['てがみ', 'ざっし', 'しんぶん'] },
  { id: 'k_exp_45', lesson: 18, type: 'kanji', kanji: '現金', kana: 'げんきん', romaji: 'genkin', meaningId: 'uang tunai', meaningEn: 'cash', sentence: '現金で払うことができます。', sentenceKana: 'げんきんではらうことができます。', sentenceId: 'Bisa membayar dengan uang tunai.', distractors: ['カード', 'おつり', 'きんがく'] },
  { id: 'k_exp_46', lesson: 18, type: 'kanji', kanji: '運転', kana: 'うんてん', romaji: 'unten', meaningId: 'mengemudi', meaningEn: 'driving', sentence: '車を運転することができます。', sentenceKana: 'くるまをうんてんすることができます。', sentenceId: 'Saya bisa mengemudikan mobil.', distractors: ['よやく', 'そうじ', 'せんたく'] },
  { id: 'k_exp_47', lesson: 18, type: 'katakana', kanji: 'ピアノ', kana: 'ピアノ', romaji: 'piano', meaningId: 'piano', meaningEn: 'piano', sentence: 'ミラーさんはピアノを弾くことができます。', sentenceKana: 'ミラーさんはピアノをひくことができます。', sentenceId: 'Bapak Miller bisa bermain piano.', distractors: ['ギター', 'バイオリン', 'コンサート'] },

  { id: 'k_exp_48', lesson: 19, type: 'kanji', kanji: '旅館', kana: 'りょかん', romaji: 'ryokan', meaningId: 'penginapan tradisional Jepang', meaningEn: 'Japanese inn', sentence: '京都の旅館に泊まりました。', sentenceKana: 'きょうとのりょかんにとまりました。', sentenceId: 'Menginap di ryokan Kyoto.', distractors: ['ホテル', 'びょういん', 'アパート'] },
  { id: 'k_exp_49', lesson: 19, type: 'kanji', kanji: '洗濯', kana: 'せんたく', romaji: 'sentaku', meaningId: 'mencuci pakaian', meaningEn: 'laundry', sentence: '日曜日に洗濯したり、掃除したりします。', sentenceKana: 'にちようびにせんたくしたり、そうじしたりします。', sentenceId: 'Hari Minggu mencuci, bersih-bersih, dll.', distractors: ['そうじ', 'りょうり', 'かいもの'] },
  { id: 'k_exp_50', lesson: 19, type: 'kanji', kanji: '掃除', kana: 'そうじ', romaji: 'souji', meaningId: 'bersih-bersih', meaningEn: 'cleaning', sentence: '部屋を掃除しました。', sentenceKana: 'へやをそうじしました。', sentenceId: 'Membersihkan kamar.', distractors: ['せんたく', 'べんきょう', 'うんてん'] },
  { id: 'k_exp_51', lesson: 19, type: 'katakana', kanji: 'ダイエット', kana: 'ダイエット', romaji: 'daietto', meaningId: 'diet', meaningEn: 'diet', sentence: '明日からまたダイエットします。', sentenceKana: 'あしたからまたダイエットします。', sentenceId: 'Mulai besok diet lagi.', distractors: ['スポーツ', 'ジョギング', 'スキー'] },

  { id: 'k_exp_52', lesson: 20, type: 'kanji', kanji: '夏休み', kana: 'なつやすみ', romaji: 'natsuyasumi', meaningId: 'liburan musim panas', meaningEn: 'summer vacation', sentence: '夏休みに国へ帰る？', sentenceKana: 'なつやすみにくにへかえる？', sentenceId: 'Pulang ke negara asal saat liburan musim panas?', distractors: ['ふゆやすみ', 'にちようび', 'たんじょうび'] },
  { id: 'k_exp_53', lesson: 20, type: 'kanji', kanji: '物価', kana: 'ぶっか', romaji: 'bukka', meaningId: 'harga barang', meaningEn: 'commodity prices', sentence: '日本の物価は高いね。', sentenceKana: 'にほんのぶっかはたかいね。', sentenceId: 'Harga barang di Jepang mahal ya.', distractors: ['ねだん', 'きんがく', 'おつり'] },
  { id: 'k_exp_54', lesson: 20, type: 'kanji', kanji: '着物', kana: 'きもの', romaji: 'kimono', meaningId: 'kimono', meaningEn: 'kimono', sentence: '着物を着たことがある？', sentenceKana: 'きものをきたことがある？', sentenceId: 'Pernah memakai kimono?', distractors: ['ようふく', 'くつ', 'ぼうし'] },
  { id: 'k_exp_55', lesson: 20, type: 'katakana', kanji: 'ビザ', kana: 'ビザ', romaji: 'biza', meaningId: 'visa', meaningEn: 'visa', sentence: 'ビザが要る？', sentenceKana: 'ビザがいる？', sentenceId: 'Perlu visa?', distractors: ['パスポート', 'カード', 'チケット'] },

  // ==================== BAB 21–25 ====================
  { id: 'k_exp_56', lesson: 21, type: 'kanji', kanji: '交通', kana: 'こうつう', romaji: 'koutsuu', meaningId: 'lalu lintas / transportasi', meaningEn: 'traffic / transportation', sentence: '東京は交通が便利です。', sentenceKana: 'とうきょうはこうつうがべんりです。', sentenceId: 'Transportasi di Tokyo praktis.', distractors: ['ぶっか', 'てんき', 'きせつ'] },
  { id: 'k_exp_57', lesson: 21, type: 'kanji', kanji: '意見', kana: 'いけん', romaji: 'iken', meaningId: 'pendapat', meaningEn: 'opinion', sentence: '会議で意見を言いました。', sentenceKana: 'かいぎでいけんをいいました。', sentenceId: 'Menyampaikan pendapat dalam rapat.', distractors: ['はなし', 'やくそく', 'しつもん'] },
  { id: 'k_exp_58', lesson: 21, type: 'kanji', kanji: '首相', kana: 'しゅしょう', romaji: 'shushou', meaningId: 'perdana menteri', meaningEn: 'prime minister', sentence: '新しい首相について話しました。', sentenceKana: 'あたらしいしゅしょうについてはなしました。', sentenceId: 'Berbicara tentang perdana menteri baru.', distractors: ['しゃちょう', 'ぶちょう', 'せんせい'] },
  { id: 'k_exp_59', lesson: 21, type: 'katakana', kanji: 'ニュース', kana: 'ニュース', romaji: 'nyuusu', meaningId: 'berita', meaningEn: 'news', sentence: '今朝のニュースを見ましたか。', sentenceKana: 'けさのニュースをみましたか。', sentenceId: 'Apakah menonton berita pagi ini?', distractors: ['アニメ', 'マンガ', 'ドラマ'] },

  { id: 'k_exp_60', lesson: 22, type: 'kanji', kanji: '家賃', kana: 'やちん', romaji: 'yachin', meaningId: 'uang sewa rumah', meaningEn: 'rent', sentence: '家賃はいくらですか。', sentenceKana: 'やちんはいくらですか。', sentenceId: 'Berapa uang sewanya?', distractors: ['きんがく', 'おつり', 'ぶっか'] },
  { id: 'k_exp_61', lesson: 22, type: 'kanji', kanji: '眼鏡', kana: 'めがね', romaji: 'megane', meaningId: 'kacamata', meaningEn: 'glasses', sentence: '眼鏡をかけている人は先生です。', sentenceKana: 'めがねをかけているひとはせんせいです。', sentenceId: 'Orang yang memakai kacamata adalah guru.', distractors: ['ぼうし', 'とけい', 'くつ'] },
  { id: 'k_exp_62', lesson: 22, type: 'kanji', kanji: '押入れ', kana: 'おしいれ', romaji: 'oshiire', meaningId: 'lemari dinding Jepang', meaningEn: 'Japanese closet', sentence: '押入れに布団を入れます。', sentenceKana: 'おしいれにふとんをいれます。', sentenceId: 'Memasukkan futon ke dalam oshiire.', distractors: ['へや', 'まど', 'かいだん'] },
  { id: 'k_exp_63', lesson: 22, type: 'katakana', kanji: 'アパート', kana: 'アパート', romaji: 'apaato', meaningId: 'apartemen', meaningEn: 'apartment', sentence: '静かなアパートを探しています。', sentenceKana: 'しずかなアパートをさがしています。', sentenceId: 'Sedang mencari apartemen yang tenang.', distractors: ['ホテル', 'デパート', 'スーパー'] },

  { id: 'k_exp_64', lesson: 23, type: 'kanji', kanji: '図書館', kana: 'としょかん', romaji: 'toshokan', meaningId: 'perpustakaan', meaningEn: 'library', sentence: '図書館で本を借ります。', sentenceKana: 'としょかんでほんをかります。', sentenceId: 'Meminjam buku di perpustakaan.', distractors: ['びじゅつかん', 'たいしかん', 'えいがかん'] },
  { id: 'k_exp_65', lesson: 23, type: 'kanji', kanji: '交差点', kana: 'こうさてん', romaji: 'kousaten', meaningId: 'persimpangan', meaningEn: 'intersection', sentence: '次の交差点を左へ曲がります。', sentenceKana: 'つぎのこうさてんをひだりへまがります。', sentenceId: 'Belok kiri di persimpangan berikutnya.', distractors: ['しんごう', 'かど', 'はし'] },
  { id: 'k_exp_66', lesson: 23, type: 'kanji', kanji: '橋', kana: 'はし', romaji: 'hashi', meaningId: 'jembatan', meaningEn: 'bridge', sentence: 'あの橋を渡ってください。', sentenceKana: 'あのはしをわたってください。', sentenceId: 'Tolong seberangi jembatan itu.', distractors: ['かど', 'みち', 'しんごう'] },
  { id: 'k_exp_67', lesson: 23, type: 'katakana', kanji: 'ボタン', kana: 'ボタン', romaji: 'botan', meaningId: 'tombol', meaningEn: 'button', sentence: 'このボタンを押すと切符が出ます。', sentenceKana: 'このボタンをおすときっぷがでます。', sentenceId: 'Jika menekan tombol ini tiket keluar.', distractors: ['カード', 'ドア', 'レシート'] },

  { id: 'k_exp_68', lesson: 24, type: 'kanji', kanji: '引っ越し', kana: 'ひっこし', romaji: 'hikkoshi', meaningId: 'pindah rumah', meaningEn: 'moving house', sentence: '友達が引っ越しを手伝ってくれました。', sentenceKana: 'ともだちがひっこしをてつだってくれました。', sentenceId: 'Teman membantu saya pindah rumah.', distractors: ['りょこう', 'しゅっちょう', 'てんきん'] },
  { id: 'k_exp_69', lesson: 24, type: 'kanji', kanji: '説明', kana: 'せつめい', romaji: 'setsumei', meaningId: 'penjelasan', meaningEn: 'explanation', sentence: '先生が文法を説明してくれました。', sentenceKana: 'せんせいがぶんぽうをせつめいしてくれました。', sentenceId: 'Guru menjelaskan tata bahasa untuk saya.', distractors: ['しょうかい', 'あんない', 'しつもん'] },
  { id: 'k_exp_70', lesson: 24, type: 'kanji', kanji: '案内', kana: 'あんない', romaji: 'annai', meaningId: 'memandu / mengantar keliling', meaningEn: 'guiding / showing around', sentence: '京都を案内してもらいました。', sentenceKana: 'きょうとをあんないしてもらいました。', sentenceId: 'Saya dipandu berkeliling Kyoto.', distractors: ['しょうかい', 'せつめい', 'よやく'] },
  { id: 'k_exp_71', lesson: 24, type: 'katakana', kanji: 'セーター', kana: 'セーター', romaji: 'seetaa', meaningId: 'sweter', meaningEn: 'sweater', sentence: '母がセーターを送ってくれました。', sentenceKana: 'ははがセーターをおくってくれました。', sentenceId: 'Ibu mengirimkan sweter untuk saya.', distractors: ['コート', 'シャツ', 'ネクタイ'] },

  { id: 'k_exp_72', lesson: 25, type: 'kanji', kanji: '転勤', kana: 'てんきん', romaji: 'tenkin', meaningId: 'mutasi kerja', meaningEn: 'job transfer', sentence: '来月東京へ転勤します。', sentenceKana: 'らいげつとうきょうへてんきんします。', sentenceId: 'Bulan depan pindah tugas ke Tokyo.', distractors: ['しゅっちょう', 'ひっこし', 'りゅうがく'] },
  { id: 'k_exp_73', lesson: 25, type: 'kanji', kanji: '田舎', kana: 'いなか', romaji: 'inaka', meaningId: 'kampung halaman / pedesaan', meaningEn: 'countryside', sentence: '年を取ったら田舎に住みたいです。', sentenceKana: 'としをとったらいなかにすみたいです。', sentenceId: 'Kalau sudah tua ingin tinggal di pedesaan.', distractors: ['とかい', 'まち', 'くに'] },
  { id: 'k_exp_74', lesson: 25, type: 'kanji', kanji: '機会', kana: 'きかい', romaji: 'kikai', meaningId: 'kesempatan', meaningEn: 'opportunity', sentence: '機会があったら、また来てください。', sentenceKana: 'きかいがあったら、またきてください。', sentenceId: 'Kalau ada kesempatan, silakan datang lagi.', distractors: ['じかん', 'やくそく', 'いけん'] },
  { id: 'k_exp_75', lesson: 25, type: 'katakana', kanji: 'チャンス', kana: 'チャンス', romaji: 'chansu', meaningId: 'kesempatan / peluang', meaningEn: 'chance', sentence: 'いいチャンスですから頑張ります。', sentenceKana: 'いいチャンスですからがんばります。', sentenceId: 'Karena ini peluang bagus, saya akan berusaha keras.', distractors: ['ニュース', 'デザイン', 'パーティー'] }
];

export const VOCAB_BOOSTER_EXPANSION = [
  // Curated directly from spoken transcripts to ensure every Bab 1–25 has strong Transcript coverage
  { id: 'vb_exp_2_1', lesson: 2, kana: 'ほん', kanji: '本', meaning: 'buku (bacaan)', sourceTag: 'Transcript' },
  { id: 'vb_exp_2_2', lesson: 2, kana: 'おみやげ', kanji: 'お土産', meaning: 'oleh-oleh', sourceTag: 'Transcript' },
  { id: 'vb_exp_5_1', lesson: 5, kana: 'しんかんせん', kanji: '新幹線', meaning: 'Shinkansen', sourceTag: 'Transcript' },
  { id: 'vb_exp_5_2', lesson: 5, kana: 'たんじょうび', kanji: '誕生日', meaning: 'hari ulang tahun', sourceTag: 'Transcript' },
  { id: 'vb_exp_7_1', lesson: 7, kana: 'かぞく', kanji: '家族', meaning: 'keluarga', sourceTag: 'Transcript' },
  { id: 'vb_exp_7_2', lesson: 7, kana: 'はな', kanji: '花', meaning: 'bunga', sourceTag: 'Transcript' },
  { id: 'vb_exp_10_1', lesson: 10, kana: 'ゆうびんきょく', kanji: '郵便局', meaning: 'kantor pos', sourceTag: 'Transcript' },
  { id: 'vb_exp_10_2', lesson: 10, kana: 'ちかく', kanji: '近く', meaning: 'dekat / sekitar', sourceTag: 'Transcript' },
  { id: 'vb_exp_12_1', lesson: 12, kana: 'まつり', kanji: '祭り', meaning: 'festival', sourceTag: 'Transcript' },
  { id: 'vb_exp_12_2', lesson: 12, kana: 'きせつ', kanji: '季節', meaning: 'musim', sourceTag: 'Transcript' },
  { id: 'vb_exp_13_1', lesson: 13, kana: 'びじゅつ', kanji: '美術', meaning: 'seni rupa', sourceTag: 'Transcript' },
  { id: 'vb_exp_13_2', lesson: 13, kana: 'じかん', kanji: '時間', meaning: 'waktu', sourceTag: 'Transcript' },
  { id: 'vb_exp_13_3', lesson: 13, kana: 'パソコン', kanji: '', meaning: 'komputer / laptop', sourceTag: 'Transcript' },
  { id: 'vb_exp_13_4', lesson: 13, kana: 'えき', kanji: '駅', meaning: 'stasiun kereta', sourceTag: 'Transcript' },
  { id: 'vb_exp_14_1', lesson: 14, kana: 'しんごう', kanji: '信号', meaning: 'lampu lalu lintas', sourceTag: 'Transcript' },
  { id: 'vb_exp_14_2', lesson: 14, kana: 'はなや', kanji: '花屋', meaning: 'toko bunga', sourceTag: 'Transcript' },
  { id: 'vb_exp_14_3', lesson: 14, kana: 'おつり', kanji: 'お釣り', meaning: 'uang kembalian', sourceTag: 'Transcript' },
  { id: 'vb_exp_14_4', lesson: 14, kana: 'じゅうしょ', kanji: '住所', meaning: 'alamat', sourceTag: 'Transcript' },
  { id: 'vb_exp_15_1', lesson: 15, kana: 'しやくしょ', kanji: '市役所', meaning: 'balai kota', sourceTag: 'Transcript' },
  { id: 'vb_exp_15_2', lesson: 15, kana: 'どくしん', kanji: '独身', meaning: 'lajang', sourceTag: 'Transcript' },
  { id: 'vb_exp_16_1', lesson: 16, kana: 'あんしょうばんごう', kanji: '暗証番号', meaning: 'nomor PIN', sourceTag: 'Transcript' },
  { id: 'vb_exp_16_2', lesson: 16, kana: 'きんがく', kanji: '金額', meaning: 'jumlah uang', sourceTag: 'Transcript' },
  { id: 'vb_exp_17_1', lesson: 17, kana: 'ねつ', kanji: '熱', meaning: 'demam', sourceTag: 'Transcript' },
  { id: 'vb_exp_17_2', lesson: 17, kana: 'ほけんしょう', kanji: '保険証', meaning: 'kartu asuransi kesehatan', sourceTag: 'Transcript' },
  { id: 'vb_exp_18_1', lesson: 18, kana: 'にっき', kanji: '日記', meaning: 'buku harian', sourceTag: 'Transcript' },
  { id: 'vb_exp_18_2', lesson: 18, kana: 'げんきん', kanji: '現金', meaning: 'uang tunai', sourceTag: 'Transcript' },
  { id: 'vb_exp_19_1', lesson: 19, kana: 'りょかん', kanji: '旅館', meaning: 'penginapan tradisional Jepang', sourceTag: 'Transcript' },
  { id: 'vb_exp_19_2', lesson: 19, kana: 'せんたく', kanji: '洗濯', meaning: 'mencuci pakaian', sourceTag: 'Transcript' },
  { id: 'vb_exp_19_3', lesson: 19, kana: 'そうじ', kanji: '掃除', meaning: 'bersih-bersih', sourceTag: 'Transcript' },
  { id: 'vb_exp_20_1', lesson: 20, kana: 'なつやすみ', kanji: '夏休み', meaning: 'liburan musim panas', sourceTag: 'Transcript' },
  { id: 'vb_exp_20_2', lesson: 20, kana: 'きもの', kanji: '着物', meaning: 'kimono', sourceTag: 'Transcript' },
  { id: 'vb_exp_21_1', lesson: 21, kana: 'こうつう', kanji: '交通', meaning: 'lalu lintas', sourceTag: 'Transcript' },
  { id: 'vb_exp_21_2', lesson: 21, kana: 'いけん', kanji: '意見', meaning: 'pendapat', sourceTag: 'Transcript' },
  { id: 'vb_exp_21_3', lesson: 21, kana: 'しゅしょう', kanji: '首相', meaning: 'perdana menteri', sourceTag: 'Transcript' },
  { id: 'vb_exp_22_1', lesson: 22, kana: 'やちん', kanji: '家賃', meaning: 'sewa rumah', sourceTag: 'Transcript' },
  { id: 'vb_exp_22_2', lesson: 22, kana: 'めがね', kanji: '眼鏡', meaning: 'kacamata', sourceTag: 'Transcript' },
  { id: 'vb_exp_22_3', lesson: 22, kana: 'おしいれ', kanji: '押入れ', meaning: 'lemari dinding Jepang', sourceTag: 'Transcript' },
  { id: 'vb_exp_23_1', lesson: 23, kana: 'こうさてん', kanji: '交差点', meaning: 'persimpangan jalan', sourceTag: 'Transcript' },
  { id: 'vb_exp_23_2', lesson: 23, kana: 'はし', kanji: '橋', meaning: 'jembatan', sourceTag: 'Transcript' },
  { id: 'vb_exp_24_1', lesson: 24, kana: 'ひっこし', kanji: '引っ越し', meaning: 'pindah rumah', sourceTag: 'Transcript' },
  { id: 'vb_exp_24_2', lesson: 24, kana: 'せつめい', kanji: '説明', meaning: 'penjelasan', sourceTag: 'Transcript' },
  { id: 'vb_exp_24_3', lesson: 24, kana: 'あんない', kanji: '案内', meaning: 'memandu jalan', sourceTag: 'Transcript' },
  { id: 'vb_exp_24_4', lesson: 24, kana: 'しょうかい', kanji: '紹介', meaning: 'perkenalan', sourceTag: 'Transcript' },
  { id: 'vb_exp_24_5', lesson: 24, kana: 'まちがい', kanji: '間違い', meaning: 'kesalahan', sourceTag: 'Transcript' },
  { id: 'vb_exp_25_1', lesson: 25, kana: 'いなか', kanji: '田舎', meaning: 'pedesaan / kampung', sourceTag: 'Transcript' },
  { id: 'vb_exp_25_2', lesson: 25, kana: 'げんき', kanji: '元気', meaning: 'sehat / bersemangat', sourceTag: 'Transcript' }
];
