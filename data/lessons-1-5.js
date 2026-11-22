// Japanese Audio Transcriptions Data (Minna no Nihongo) - Lessons 1 to 5
// Fully digitized from the audio transcript with Indonesian translations & Furigana readings

export const LESSONS_1_5 = [
  {
    id: 1,
    lessonNum: "第1課",
    titleJa: "第1課 はじめまして",
    titleId: "Pelajaran 1: Percakapan (Perkenalkan)",
    theme: "Self Introductions & Meeting People",
    kanjiFocus: [
      { char: "第", on: "ダイ (dai)", kun: "-", meaning: "Urutan / Ke- (Ordinal prefix)", words: ["第1課 (だい1か)"] },
      { char: "課", on: "カ (ka)", kun: "-", meaning: "Pelajaran / Bab", words: ["第1課 (だい1か)"] },
      { char: "会", on: "カイ (kai)", kun: "あ・う (a-u)", meaning: "Bertemu / Perkumpulan", words: ["会話 (かいわ)", "会社 (かいしゃ)"] },
      { char: "話", on: "ワ (wa)", kun: "はな・す (hana-su)", meaning: "Bicara / Percakapan", words: ["会話 (かいわ)", "電話 (でんわ)"] },
      { char: "先", on: "セン (sen)", kun: "さき (saki)", meaning: "Sebelum / Lebih dulu", words: ["先生 (せんせい)", "先月 (せんげつ)"] },
      { char: "生", on: "セイ (sei), ショウ (shou)", kun: "い・きる, う・まれる", meaning: "Hidup / Lahir", words: ["先生 (せんせい)", "学生 (がくせい)"] },
      { char: "何", on: "カ (ka)", kun: "なに, なん (nani, nan)", meaning: "Apa / Berapa", words: ["何 (なに/なん)", "何歳 (なんさい)"] },
      { char: "歳", on: "サイ (sai)", kun: "-", meaning: "Umur / Tahun usia", words: ["何歳 (なんさい)", "29歳 (にじゅうきゅうさい)"] },
      { char: "人", on: "ジン (jin), ニン (nin)", kun: "ひと (hito)", meaning: "Orang", words: ["アメリカ人 (アメリカじん)", "会社員 (かいしゃいん)"] },
      { char: "社", on: "シャ (sha)", kun: "やしろ (yashiro)", meaning: "Perusahaan / Tempat suci", words: ["会社員 (かいしゃいん)", "会社 (かいしゃ)"] },
      { char: "員", on: "イン (in)", kun: "-", meaning: "Anggota / Karyawan", words: ["会社員 (かいしゃいん)"] },
      { char: "名", on: "メイ (mei), ミョウ (myou)", kun: "な (na)", meaning: "Nama", words: ["お名前 (おなまえ)"] },
      { char: "前", on: "ゼン (zen)", kun: "まえ (mae)", meaning: "Depan / Nama", words: ["お名前 (おなまえ)", "駅の前 (えきのまえ)"] },
      { char: "電", on: "デン (den)", kun: "-", meaning: "Listrik", words: ["パワー電気 (パワーでんき)", "電話 (でんわ)"] },
      { char: "気", on: "キ (ki)", kun: "-", meaning: "Energi / Semangat / Hawa", words: ["電気 (でんき)", "元気 (げんき)"] },
      { char: "大", on: "ダイ (dai), タイ (tai)", kun: "おお・きい (oo-kii)", meaning: "Besar", words: ["大学 (だいがく)", "大きい (おおきい)"] },
      { char: "学", on: "ガク (gaku)", kun: "まな・ぶ (mana-bu)", meaning: "Belajar / Ilmu", words: ["大学 (だいがく)", "学生 (がくせい)"] },
      { char: "研", on: "ケン (ken)", kun: "と・ぐ", meaning: "Meneliti", words: ["研究者 (けんきゅうしゃ)"] },
      { char: "究", on: "キュウ (kyuu)", kun: "きわ・める", meaning: "Mendalami", words: ["研究者 (けんきゅうしゃ)"] },
      { char: "者", on: "シャ (sha)", kun: "もの (mono)", meaning: "Orang yang ahli", words: ["研究者 (けんきゅうしゃ)", "医者 (いしゃ)"] },
      { char: "医", on: "イ (i)", kun: "-", meaning: "Medis / Pengobatan", words: ["医者 (いしゃ)"] }
    ],
    sections: [
      {
        track: "minna_shokyu_1_001.mp3",
        title: "第1課 会話 (はじめまして)",
        dialogues: [
          {
            speaker: "Narrator",
            speakerType: "narrator",
            text: "第1課 会話",
            furigana: "<ruby>第<rt>だい</rt></ruby>1<ruby>課<rt>か</rt></ruby> <ruby>会<rt>かい</rt></ruby><ruby>話<rt>わ</rt></ruby>",
            romaji: "Dai-ikka Kaiwa",
            translation: "Pelajaran 1: Percakapan"
          },
          {
            speaker: "Narrator",
            speakerType: "narrator",
            text: "はじめまして",
            furigana: "はじめまして",
            romaji: "Hajimemashite",
            translation: "Perkenalkan"
          },
          {
            speaker: "Speaker A (Female)",
            speakerType: "female",
            text: "おはようございます。",
            furigana: "おはようございます。",
            romaji: "Ohayou gozaimasu.",
            translation: "Selamat pagi."
          },
          {
            speaker: "Speaker B (Male 1)",
            speakerType: "male",
            text: "おはようございます。佐藤さん、こちらはマイク・ミラーさんです。",
            furigana: "おはようございます。<ruby>佐<rt>さ</rt></ruby><ruby>藤<rt>とう</rt></ruby>さん、こちらはマイク・ミラーさんです。",
            romaji: "Ohayou gozaimasu. Satou-san, kochira wa Maiku Miraa-san desu.",
            translation: "Selamat pagi. Ibu Sato, ini adalah Bapak Mike Miller."
          },
          {
            speaker: "Speaker C (Male 2)",
            speakerType: "male",
            text: "はじめまして。マイク・ミラーです。アメリカから来ました。どうぞよろしく。",
            furigana: "はじめまして。マイク・ミラーです。アメリカから<ruby>来<rt>き</rt></ruby>ました。どうぞよろしく。",
            romaji: "Hajimemashite. Maiku Miraa desu. Amerika kara kimashita. Douzo yoroshiku.",
            translation: "Perkenalkan. Saya Mike Miller. Saya berasal dari Amerika. Senang berkenalan dengan Anda."
          },
          {
            speaker: "Speaker A (Female)",
            speakerType: "female",
            text: "佐藤けい子です。どうぞよろしく。",
            furigana: "<ruby>佐<rt>さ</rt></ruby><ruby>藤<rt>とう</rt></ruby>けい<ruby>子<rt>こ</rt></ruby>です。どうぞよろしく。",
            romaji: "Satou Keiko desu. Douzo yoroshiku.",
            translation: "Saya Keiko Sato. Senang berkenalan dengan Anda."
          }
        ]
      },
      {
        track: "minna_shokyu_1_002.mp3",
        title: "第1課 問題 1番 (練習)",
        dialogues: [
          { speaker: "Narrator", speakerType: "narrator", text: "第1課 問題", furigana: "<ruby>第<rt>だい</rt></ruby>1<ruby>課<rt>か</rt></ruby> <ruby>問<rt>もん</rt></ruby><ruby>題<rt>だい</rt></ruby>", romaji: "Dai-ikka Mondai", translation: "Pelajaran 1: Latihan Soal" },
          { speaker: "Narrator", speakerType: "narrator", text: "1番 例", furigana: "1<ruby>番<rt>ばん</rt></ruby> <ruby>例<rt>れい</rt></ruby>", romaji: "Ichiban Rei", translation: "Nomor 1: Contoh" },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "あなたは先生ですか。", furigana: "あなたは<ruby>先<rt>せん</rt></ruby><ruby>生<rt>せい</rt></ruby>ですか。", romaji: "Anata wa sensei desu ka.", translation: "Apakah Anda seorang guru?" },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "あなたはサントスさんですか。", furigana: "あなたはサントスさんですか。", romaji: "Anata wa Santosu-san desu ka.", translation: "Apakah Anda Bapak Santos?" },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "お名前は？", furigana: "お<ruby>名<rt>な</rt></ruby><ruby>前<rt>まえ</rt></ruby>は？", romaji: "Onamae wa?", translation: "Siapa nama Anda?" },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "何歳ですか。", furigana: "<ruby>何<rt>なん</rt></ruby><ruby>歳<rt>さい</rt></ruby>ですか。", romaji: "Nansai desu ka.", translation: "Berapa umur Anda?" },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "アメリカ人ですか。", furigana: "アメリカ<ruby>人<rt>じん</rt></ruby>ですか。", romaji: "Amerika-jin desu ka.", translation: "Apakah Anda orang Amerika?" },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "会社員ですか。", furigana: "<ruby>会<rt>かい</rt></ruby><ruby>社<rt>しゃ</rt></ruby><ruby>員<rt>いん</rt></ruby>ですか。", romaji: "Kaishain desu ka.", translation: "Apakah Anda seorang karyawan perusahaan?" }
        ]
      },
      {
        track: "minna_shokyu_1_003.mp3",
        title: "第1課 問題 2番 (確認)",
        dialogues: [
          { speaker: "Speaker A (Female)", speakerType: "female", text: "こちらはパワー電気のシュミットさんです。", furigana: "こちらはパワー<ruby>電<rt>でん</rt></ruby><ruby>気<rt>き</rt></ruby>のシュミットさんです。", romaji: "Kochira wa Pawaa Denki no Shumitto-san desu.", translation: "Ini adalah Bapak Schmidt dari Perusahaan Listrik Power." },
          { speaker: "Speaker B (Male)", speakerType: "male", text: "はじめまして、シュミットです。どうぞよろしく。", furigana: "はじめまして、シュミットです。どうぞよろしく。", romaji: "Hajimemashite, Shumitto desu. Douzo yoroshiku.", translation: "Perkenalkan, saya Schmidt. Senang berkenalan dengan Anda." },
          { speaker: "Speaker A (Female)", speakerType: "female", text: "お名前は？", furigana: "お<ruby>名<rt>な</rt></ruby><ruby>前<rt>まえ</rt></ruby>は？", romaji: "Onamae wa?", translation: "Siapa nama Anda?" },
          { speaker: "Speaker B (Male)", speakerType: "male", text: "ワンです。いいえ、ワンです。", furigana: "ワンです。いいえ、ワンです。", romaji: "Wan desu. Iie, Wan desu.", translation: "Saya Wang. Bukan, saya Wang." },
          { speaker: "Speaker B (Male)", speakerType: "male", text: "29歳です。", furigana: "29<ruby>歳<rt>さい</rt></ruby>です。", romaji: "Nijuukyuu-sai desu.", translation: "29 tahun." }
        ]
      },
      {
        track: "minna_shokyu_1_004.mp3",
        title: "第1課 問題 3番 (人物・職業)",
        dialogues: [
          { speaker: "Speaker A (Female)", speakerType: "female", text: "太郎ちゃんは何歳ですか。8歳です。", furigana: "<ruby>太<rt>た</rt></ruby><ruby>郎<rt>ろう</rt></ruby>ちゃんは<ruby>何<rt>なん</rt></ruby><ruby>歳<rt>さい</rt></ruby>ですか。8<ruby>歳<rt>さい</rt></ruby>です。", romaji: "Tarou-chan wa nansai desu ka. Hassai desu.", translation: "Taro berumur berapa tahun? 8 tahun." },
          { speaker: "Speaker B (Male)", speakerType: "male", text: "サントスさんは先生ですか。いいえ、先生じゃありません。会社員です。", furigana: "サントスさんは<ruby>先<rt>せん</rt></ruby><ruby>生<rt>せい</rt></ruby>ですか。いいえ、<ruby>先<rt>せん</rt></ruby><ruby>生<rt>せい</rt></ruby>じゃありません。<ruby>会<rt>かい</rt></ruby><ruby>社<rt>しゃ</rt></ruby><ruby>員<rt>いん</rt></ruby>です。", romaji: "Santosu-san wa sensei desu ka. Iie, sensei ja arimasen. Kaishain desu.", translation: "Apakah Bapak Santos seorang guru? Bukan, saya bukan guru. Saya karyawan perusahaan." },
          { speaker: "Speaker B (Female)", speakerType: "female", text: "あの方はどなたですか。カリナさんです。富士大学の学生です。", furigana: "あの<ruby>方<rt>かた</rt></ruby>はどなたですか。カリナさんです。<ruby>富<rt>ふ</rt></ruby><ruby>士<rt>じ</rt></ruby><ruby>大<rt>だい</rt></ruby><ruby>学<rt>がく</rt></ruby>の<ruby>学<rt>がく</rt></ruby><ruby>生<rt>せい</rt></ruby>です。", romaji: "Ano kata wa donata desu ka. Karina-san desu. Fuji Daigaku no gakusei desu.", translation: "Siapakah orang itu? Dia adalah Saudari Karina. Mahasiswi Universitas Fuji." },
          { speaker: "Speaker B (Female)", speakerType: "female", text: "イーさんは研究者ですか。はい。ワンさんは医者です。", furigana: "イーさんは<ruby>研<rt>けん</rt></ruby><ruby>究<rt>きゅう</rt></ruby><ruby>者<rt>しゃ</rt></ruby>ですか。はい。ワンさんは<ruby>医<rt>い</rt></ruby><ruby>者<rt>しゃ</rt></ruby>です。", romaji: "Ii-san wa kenkyuusha desu ka. Hai. Wan-san wa isha desu.", translation: "Apakah Saudara Lee seorang peneliti? Ya. Saudara Wang adalah seorang dokter." }
        ]
      }
    ]
  },
  {
    id: 2,
    lessonNum: "第2課",
    titleJa: "第2課 これからお世話になります",
    titleId: "Pelajaran 2: Percakapan (Mulai sekarang saya mohon bantuannya)",
    theme: "Items, Possessions & Greetings to Neighbors",
    kanjiFocus: [
      { char: "世", on: "セイ, セ (sei, se)", kun: "よ (yo)", meaning: "Dunia / Kehidupan", words: ["お世話 (おせわ)"] },
      { char: "話", on: "ワ (wa)", kun: "はな・す", meaning: "Bicara / Menjaga", words: ["お世話 (おせわ)"] },
      { char: "願", on: "ガン (gan)", kun: "ねが・う (nega-u)", meaning: "Mohon / Berdoa", words: ["お願いします (おねがいします)"] },
      { char: "手", on: "シュ (shu)", kun: "て (te)", meaning: "Tangan", words: ["手帳 (てちょう)"] },
      { char: "帳", on: "チョウ (chou)", kun: "-", meaning: "Buku catatan", words: ["手帳 (てちょう)"] },
      { char: "雑", on: "ザツ (zatsu)", kun: "-", meaning: "Aneka ragam / Campuran", words: ["雑誌 (ざっし)"] },
      { char: "誌", on: "シ (shi)", kun: "-", meaning: "Majalah / Catatan", words: ["雑誌 (ざっし)"] },
      { char: "辞", on: "ジ (ji)", kun: "や・める", meaning: "Kata / Kamus", words: ["辞書 (じしょ)"] },
      { char: "書", on: "ショ (sho)", kun: "か・く (ka-ku)", meaning: "Menulis / Buku", words: ["辞書 (じしょ)", "本 (ほん)"] },
      { char: "車", on: "シャ (sha)", kun: "くるま (kuruma)", meaning: "Mobil / Kereta", words: ["車 (くるま)", "電車 (でんしゃ)"] },
      { char: "私", on: "シ (shi)", kun: "わたし, わたくし", meaning: "Saya", words: ["私 (わたし)"] }
    ],
    sections: [
      {
        track: "minna_shokyu_1_005.mp3",
        title: "第2課 会話 (これからお世話になります)",
        dialogues: [
          { speaker: "Narrator", speakerType: "narrator", text: "第2課 会話 これからお世話になります", furigana: "<ruby>第<rt>だい</rt></ruby>2<ruby>課<rt>か</rt></ruby> <ruby>会<rt>かい</rt></ruby><ruby>話<rt>わ</rt></ruby> これからお<ruby>世<rt>せ</rt></ruby><ruby>話<rt>わ</rt></ruby>になります", romaji: "Dai-nika Kaiwa Korekara osewa ni narimasu", translation: "Pelajaran 2: Percakapan - Mulai sekarang saya mohon bantuannya" },
          { speaker: "Speaker A (Male 1)", speakerType: "male", text: "はい、どなたですか。", furigana: "はい、どなたですか。", romaji: "Hai, donata desu ka.", translation: "Ya, siapa?" },
          { speaker: "Speaker B (Male 2)", speakerType: "male", text: "408のサントスです。こんにちは、サントスです。これからお世話になります。どうぞよろしくお願いします。", furigana: "408のサントスです。こんにちは、サントスです。これからお<ruby>世<rt>せ</rt></ruby><ruby>話<rt>わ</rt></ruby>になります。どうぞよろしくお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Yon-maru-hachi no Santosu desu. Konnichiwa, Santosu desu. Korekara osewa ni narimasu. Douzo yoroshiku onegaishimasu.", translation: "Saya Santos dari kamar 408. Halo, saya Santos. Mulai sekarang saya mohon bantuannya. Senang berkenalan dengan Anda." },
          { speaker: "Speaker A (Male 1)", speakerType: "male", text: "こちらこそよろしくお願いします。", furigana: "こちらこそよろしくお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Kochira koso yoroshiku onegaishimasu.", translation: "Saya juga mohon bantuannya." },
          { speaker: "Speaker B (Male 2)", speakerType: "male", text: "あの、これ、コーヒーです。どうぞ。", furigana: "あの、これ、コーヒーです。どうぞ。", romaji: "Ano, kore, koohii desu. Douzo.", translation: "Permisi, ini kopi. Silakan diterima." },
          { speaker: "Speaker A (Male 1)", speakerType: "male", text: "どうもありがとうございます。", furigana: "どうもありがとうございます。", romaji: "Doumo arigatou gozaimasu.", translation: "Terima kasih banyak." }
        ]
      },
      {
        track: "minna_shokyu_1_006.mp3",
        title: "第2課 問題 1番 (指示詞 これ・それ・あれ)",
        dialogues: [
          { speaker: "Speaker A (Male)", speakerType: "male", text: "これは手帳ですか。", furigana: "これは<ruby>手<rt>て</rt></ruby><ruby>帳<rt>ちょう</rt></ruby>ですか。", romaji: "Kore wa techou desu ka.", translation: "Apakah ini buku catatan?" },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "これは「あ」ですか、「お」ですか。", furigana: "これは「あ」ですか、「お」ですか。", romaji: "Kore wa 'a' desu ka, 'o' desu ka.", translation: "Apakah ini 'a' atau 'o'?" },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "これは何ですか。これは何の雑誌ですか。", furigana: "これは<ruby>何<rt>なん</rt></ruby>ですか。これは<ruby>何<rt>なん</rt></ruby>の<ruby>雑<rt>ざっ</rt></ruby><ruby>誌<rt>し</rt></ruby>ですか。", romaji: "Kore wa nan desu ka. Kore wa nan no zasshi desu ka.", translation: "Apakah ini? Ini majalah tentang apa?" },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "このかばんはあなたのですか。", furigana: "このかばんはあなたのですか。", romaji: "Kono kaban wa anata no desu ka.", translation: "Apakah tas ini milik Anda?" }
        ]
      },
      {
        track: "minna_shokyu_1_007.mp3",
        title: "第2課 問題 2番 (隣人への挨拶)",
        dialogues: [
          { speaker: "Speaker B (Male)", speakerType: "male", text: "505のミラーです。これからお世話になります。どうぞよろしくお願いします。", furigana: "505のミラーです。これからお<ruby>世<rt>せ</rt></ruby><ruby>話<rt>わ</rt></ruby>になります。どうぞよろしくお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Go-maru-go no Miraa desu. Korekara osewa ni narimasu. Douzo yoroshiku onegaishimasu.", translation: "Saya Miller dari kamar 505. Mulai sekarang saya mohon bantuannya. Senang berkenalan dengan Anda." },
          { speaker: "Speaker A (Female)", speakerType: "female", text: "田中です。こちらこそよろしくお願いします。", furigana: "<ruby>田<rt>た</rt></ruby><ruby>中<rt>なか</rt></ruby>です。こちらこそよろしくお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Tanaka desu. Kochira koso yoroshiku onegaishimasu.", translation: "Saya Tanaka. Saya juga mohon bantuannya." },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "あの、これ、どうぞ。チョコレートです。", furigana: "あの、これ、どうぞ。チョコレートです。", romaji: "Ano, kore, douzo. Chokoreeto desu.", translation: "Permisi, ini silakan. Ini cokelat." }
        ]
      },
      {
        track: "minna_shokyu_1_008.mp3",
        title: "第2課 問題 3番 (持ち物の確認)",
        dialogues: [
          { speaker: "Speaker A (Male)", speakerType: "male", text: "それは手帳ですか。いいえ、違います。辞書です。", furigana: "それは<ruby>手<rt>て</rt></ruby><ruby>帳<rt>ちょう</rt></ruby>ですか。いいえ、<ruby>違<rt>ちが</rt></ruby>います。<ruby>辞<rt>じ</rt></ruby><ruby>書<rt>しょ</rt></ruby>です。", romaji: "Sore wa techou desu ka. Iie, chigaimasu. Jisho desu.", translation: "Apakah itu buku catatan? Bukan, salah. Ini kamus." },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "木村さん、あの車は木村さんのですか。はい、そうです。私のです。", furigana: "<ruby>木<rt>き</rt></ruby><ruby>村<rt>むら</rt></ruby>さん、あの<ruby>車<rt>くるま</rt></ruby>は<ruby>木<rt>き</rt></ruby><ruby>村<rt>むら</rt></ruby>さんのですか。はい、そうです。<ruby>私<rt>わたし</rt></ruby>のです。", romaji: "Kimura-san, ano kuruma wa Kimura-san no desu ka. Hai, sou desu. Watashi no desu.", translation: "Saudari Kimura, apakah mobil itu milik Saudari Kimura? Ya, betul. Milik saya." },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "それはコンピューターの雑誌ですか。いいえ、カメラの雑誌です。", furigana: "それはコンピューターの<ruby>雑<rt>ざっ</rt></ruby><ruby>誌<rt>し</rt></ruby>ですか。いいえ、カメラの<ruby>雑<rt>ざっ</rt></ruby><ruby>誌<rt>し</rt></ruby>です。", romaji: "Sore wa konpyuutaa no zasshi desu ka. Iie, kamera no zasshi desu.", translation: "Apakah itu majalah komputer? Bukan, ini majalah kamera." }
        ]
      }
    ]
  },
  {
    id: 3,
    lessonNum: "第3課",
    titleJa: "第3課 これをください",
    titleId: "Pelajaran 3: Percakapan (Tolong berikan saya yang ini)",
    theme: "Shopping, Locations & Floor Levels",
    kanjiFocus: [
      { char: "地", on: "チ, ジ (chi, ji)", kun: "-", meaning: "Tanah / Bumi", words: ["地下1階 (ちかいっかい)"] },
      { char: "下", on: "カ, ゲ (ka, ge)", kun: "した, さ・がる", meaning: "Bawah", words: ["地下 (ちか)", "下 (した)"] },
      { char: "階", on: "カイ (kai)", kun: "-", meaning: "Lantai tingkat", words: ["地下1階 (ちかいっかい)", "8階 (はっかい)"] },
      { char: "日", on: "ニチ, ジツ (nichi, jitsu)", kun: "ひ, か (hi, ka)", meaning: "Matahari / Hari / Jepang", words: ["日本 (にほん)", "日曜日 (にちようび)"] },
      { char: "本", on: "ホン (hon)", kun: "もと (moto)", meaning: "Buku / Asal / Dasar", words: ["日本 (にほん)", "本 (ほん)"] },
      { char: "円", on: "エン (en)", kun: "まる・い", meaning: "Yen / Lingkaran", words: ["2,500円 (にせんごひゃくえん)"] },
      { char: "国", on: "コク (koku)", kun: "くに (kuni)", meaning: "Negara", words: ["お国 (おくに)", "外国人 (がいこくじん)"] },
      { char: "時", on: "ジ (ji)", kun: "とき (toki)", meaning: "Waktu / Jam", words: ["時計 (とけい)", "何時 (なんじ)"] },
      { char: "計", on: "ケイ (kei)", kun: "はか・る", meaning: "Mengukur / Rencana", words: ["時計 (とけい)"] },
      { char: "場", on: "ジョウ (jou)", kun: "ば (ba)", meaning: "Tempat", words: ["売り場 (うりば)", "場所 (ばしょ)"] },
      { char: "売", on: "バイ (bai)", kun: "う・る (u-ru)", meaning: "Menjual", words: ["売り場 (うりば)"] },
      { char: "事", on: "ジ (ji)", kun: "こと (koto)", meaning: "Hal / Urusan", words: ["事務所 (じむしょ)", "仕事 (しごと)"] },
      { char: "務", on: "ム (mu)", kun: "つと・める", meaning: "Tugas / Kantor", words: ["事務所 (じむしょ)"] },
      { char: "所", on: "ショ (sho)", kun: "ところ (tokoro)", meaning: "Tempat", words: ["事務所 (じむしょ)", "所 (ところ)"] },
      { char: "食", on: "ショク (shoku)", kun: "た・べる", meaning: "Makan", words: ["食堂 (しょくどう)", "食べ物 (たべもの)"] },
      { char: "堂", on: "ドウ (dou)", kun: "-", meaning: "Balai / Aula", words: ["食堂 (しょくどう)"] },
      { char: "議", on: "ギ (gi)", kun: "-", meaning: "Rapat / Musyawarah", words: ["会議室 (かいぎしつ)"] },
      { char: "室", on: "シツ (shitsu)", kun: "むろ", meaning: "Ruangan", words: ["会議室 (かいぎしつ)", "教室 (きょうしつ)"] }
    ],
    sections: [
      {
        track: "minna_shokyu_1_009.mp3",
        title: "第3課 会話 (これをください)",
        dialogues: [
          { speaker: "Speaker A (Male)", speakerType: "male", text: "いらっしゃいませ。", furigana: "いらっしゃいませ。", romaji: "Irasshaimase.", translation: "Selamat datang." },
          { speaker: "Speaker B (Female)", speakerType: "female", text: "すみません。ワイン売り場はどこですか。", furigana: "すみません。ワイン<ruby>売<rt>う</rt></ruby>り<ruby>場<rt>ば</rt></ruby>はどこですか。", romaji: "Sumimasen. Wain uriba wa doko desu ka.", translation: "Permisi. Di mana bagian penjualan anggur (wine)?" },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "地下1階です。", furigana: "<ruby>地<rt>ち</rt></ruby><ruby>下<rt>か</rt></ruby>1<ruby>階<rt>かい</rt></ruby>です。", romaji: "Chika ikkai desu.", translation: "Di lantai basemen 1 (B1)." },
          { speaker: "Speaker B (Female)", speakerType: "female", text: "すみません。そのワインを見せてください。これはどこのワインですか。", furigana: "すみません。そのワインを<ruby>見<rt>み</rt></ruby>せてください。これはどこのワインですか。", romaji: "Sumimasen. Sono wain o misete kudasai. Kore wa doko no wain desu ka.", translation: "Permisi. Tolong perlihatkan anggur (wine) itu. Ini anggur dari mana?" },
          { speaker: "Speaker C (Female)", speakerType: "female", text: "日本のです。2,500円です。", furigana: "<ruby>日<rt>に</rt></ruby><ruby>本<rt>ほん</rt></ruby>のです。2,500<ruby>円<rt>えん</rt></ruby>です。", romaji: "Nihon no desu. Nisen gohyaku-en desu.", translation: "Dari Jepang. Harganya 2.500 yen." },
          { speaker: "Speaker B (Female)", speakerType: "female", text: "じゃ、これをください。", furigana: "じゃ、これをください。", romaji: "Ja, kore o kudasai.", translation: "Kalau begitu, tolong berikan saya yang ini." }
        ]
      },
      {
        track: "minna_shokyu_1_010.mp3",
        title: "第3課 問題 1番 (場所・国・値段)",
        dialogues: [
          { speaker: "Speaker A (Male)", speakerType: "male", text: "お国はどちらですか。うちはどちらですか。", furigana: "お<ruby>国<rt>くに</rt></ruby>はどちらですか。うちはどちらですか。", romaji: "Okuni wa dochira desu ka. Uchi wa dochira desu ka.", translation: "Negara asal Anda dari mana? Rumah Anda di mana?" },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "あなたの時計はどこの時計ですか。", furigana: "あなたの<ruby>時<rt>と</rt></ruby><ruby>計<rt>けい</rt></ruby>はどこの<ruby>時<rt>と</rt></ruby><ruby>計<rt>けい</rt></ruby>ですか。", romaji: "Anata no tokei wa doko no tokei desu ka.", translation: "Jam tangan Anda buatan mana?" },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "あなたのカメラは日本のですか。いくらですか。", furigana: "あなたのカメラは<ruby>日<rt>に</rt></ruby><ruby>本<rt>ほん</rt></ruby>のですか。いくらですか。", romaji: "Anata no kamera wa Nihon no desu ka. Ikura desu ka.", translation: "Apakah kamera Anda buatan Jepang? Berapa harganya?" }
        ]
      },
      {
        track: "minna_shokyu_1_011.mp3",
        title: "第3課 問題 2番 (建物案内)",
        dialogues: [
          { speaker: "Speaker A (Male)", speakerType: "male", text: "すみません。事務所はどこですか。あそこです。食堂は？そこです。", furigana: "すみません。<ruby>事<rt>じ</rt></ruby><ruby>務<rt>む</rt></ruby><ruby>所<rt>しょ</rt></ruby>はどこですか。あそこです。<ruby>食<rt>しょく</rt></ruby><ruby>堂<rt>どう</rt></ruby>は？そこです。", romaji: "Sumimasen. Jimusho wa doko desu ka. Asoko desu. Shokudou wa? Soko desu.", translation: "Permisi. Di mana kantor? Di sana. Kalau kantin? Di situ." },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "佐藤さんはどちらですか。会議室です。ミラーさんも会議室ですか。はい、そうです。", furigana: "<ruby>佐<rt>さ</rt></ruby><ruby>藤<rt>とう</rt></ruby>さんはどちらですか。<ruby>会<rt>かい</rt></ruby><ruby>議<rt>ぎ</rt></ruby><ruby>室<rt>しつ</rt></ruby>です。ミラーさんも<ruby>会<rt>かい</rt></ruby><ruby>議<rt>ぎ</rt></ruby><ruby>室<rt>しつ</rt></ruby>ですか。はい、そうです。", romaji: "Satou-san wa dochira desu ka. Kaigishitsu desu. Miraa-san mo kaigishitsu desu ka. Hai, sou desu.", translation: "Ibu Sato ada di mana? Di ruang rapat. Apakah Bapak Miller juga di ruang rapat? Ya, betul." },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "すみません。時計売り場はどこですか。8階です。この時計はいくらですか。23,600円です。", furigana: "すみません。<ruby>時<rt>と</rt></ruby><ruby>計<rt>けい</rt></ruby><ruby>売<rt>う</rt></ruby>り<ruby>場<rt>ば</rt></ruby>はどこですか。8<ruby>階<rt>かい</rt></ruby>です。この<ruby>時<rt>と</rt></ruby><ruby>計<rt>けい</rt></ruby>はいくらですか。23,600<ruby>円<rt>えん</rt></ruby>です。", romaji: "Sumimasen. Tokei uriba wa doko desu ka. Hachi-kai desu. Kono tokei wa ikura desu ka. Ni-man san-zen roppyaku-en desu.", translation: "Permisi. Di mana bagian penjualan jam tangan? Di lantai 8. Jam tangan ini harganya berapa? 23.600 yen." }
        ]
      }
    ]
  },
  {
    id: 4,
    lessonNum: "第4課",
    titleJa: "第4課 そちらは何時までですか",
    titleId: "Pelajaran 4: Percakapan (Di sana buka sampai jam berapa?)",
    theme: "Time, Daily Schedule, Days of the Week",
    kanjiFocus: [
      { char: "今", on: "コン, キン (kon, kin)", kun: "いま (ima)", meaning: "Sekarang", words: ["今 (いま)", "今朝 (けさ)", "今晩 (こんばん)"] },
      { char: "半", on: "ハン (han)", kun: "なか・ば", meaning: "Setengah / Separuh", words: ["4時半 (よじはん)", "半 (はん)"] },
      { char: "休", on: "キュウ (kyuu)", kun: "やす・む", meaning: "Istirahat / Libur", words: ["休み (やすみ)", "昼休み (ひるやすみ)"] },
      { char: "曜", on: "ヨウ (you)", kun: "-", meaning: "Hari dalam seminggu", words: ["何曜日 (なんようび)", "日曜日 (にちようび)", "月曜日 (げつようび)"] },
      { char: "銀", on: "ギン (gin)", kun: "-", meaning: "Perak", words: ["銀行 (ぎんこう)"] },
      { char: "行", on: "コウ, ギョウ (kou, gyou)", kun: "い・く (i-ku)", meaning: "Pergi / Lembaga", words: ["銀行 (ぎんこう)", "行きます (いきます)"] },
      { char: "毎", on: "マイ (mai)", kun: "-", meaning: "Setiap", words: ["毎日 (まいにち)", "毎朝 (まいあさ)"] },
      { char: "起", on: "キ (ki)", kun: "お・きる (o-kiru)", meaning: "Bangun", words: ["起きます (おきます)"] },
      { char: "寝", on: "シン (shin)", kun: "ね・る (ne-ru)", meaning: "Tidur", words: ["寝ます (ねます)"] },
      { char: "勉", on: "ベン (ben)", kun: "つと・める", meaning: "Berusaha giat", words: ["勉強します (べんきょうします)"] },
      { char: "強", on: "キョウ, ゴウ", kun: "つよ・い (tsuyo-i)", meaning: "Kuat", words: ["勉強 (べんきょう)"] },
      { char: "昨", on: "サク (saku)", kun: "-", meaning: "Lalu / Kemarin", words: ["昨日 (きのう)"] },
      { char: "朝", on: "チョウ (chou)", kun: "あさ (asa)", meaning: "Pagi", words: ["朝 (あさ)", "今朝 (けさ)", "毎朝 (まいあさ)"] },
      { char: "昼", on: "チュウ (chuu)", kun: "ひる (hiru)", meaning: "Siang", words: ["昼休み (ひるやすみ)", "昼ご飯 (ひるごはん)"] },
      { char: "晩", on: "バン (ban)", kun: "-", meaning: "Malam", words: ["晩 (ばん)", "今晩 (こんばん)", "晩ご飯 (ばんごはん)"] },
      { char: "働", on: "ドウ (dou)", kun: "はたら・く", meaning: "Bekerja", words: ["働きます (はたらきます)"] },
      { char: "終", on: "シュウ (shuu)", kun: "お・わる (o-waru)", meaning: "Selesai / Berakhir", words: ["終わります (おわります)"] },
      { char: "図", on: "ズ, ト (zu, to)", kun: "はか・る", meaning: "Gambar / Rencana", words: ["図書館 (としょかん)"] },
      { char: "館", on: "カン (kan)", kun: "-", meaning: "Gedung / Aula publik", words: ["図書館 (としょかん)", "美術館 (びじゅつかん)"] }
    ],
    sections: [
      {
        track: "minna_shokyu_1_012.mp3",
        title: "第4課 会話 (そちらは何時までですか)",
        dialogues: [
          { speaker: "Speaker A (Male)", speakerType: "male", text: "すみません。「あすか」の電話番号は何番ですか。", furigana: "すみません。「あすか」の<ruby>電<rt>でん</rt></ruby><ruby>話<rt>わ</rt></ruby><ruby>番<rt>ばん</rt></ruby><ruby>号<rt>ごう</rt></ruby>は<ruby>何<rt>なん</rt></ruby><ruby>番<rt>ばん</rt></ruby>ですか。", romaji: "Sumimasen. 'Asuka' no denwabangou wa nanban desu ka.", translation: "Permisi. Berapa nomor telepon 'Asuka'?" },
          { speaker: "Speaker B (Female)", speakerType: "female", text: "「あすか」ですか。5275の2725です。", furigana: "「あすか」ですか。5275の2725です。", romaji: "'Asuka' desu ka. Go-ni-nana-go no ni-nana-ni-go desu.", translation: "'Asuka', ya? 5275-2725." },
          { speaker: "Speaker C (Female)", speakerType: "female", text: "はい、「あすか」です。10時までです。休みは日曜日です。", furigana: "はい、「あすか」です。10<ruby>時<rt>じ</rt></ruby>までです。<ruby>休<rt>やす</rt></ruby>みは<ruby>日<rt>にち</rt></ruby><ruby>曜<rt>よう</rt></ruby><ruby>日<rt>び</rt></ruby>です。", romaji: "Hai, 'Asuka' desu. Juu-ji made desu. Yasumi wa nichiyoubi desu.", translation: "Ya, dengan 'Asuka'. Sampai jam 10. Hari liburnya hari Minggu." }
        ]
      },
      {
        track: "minna_shokyu_1_013.mp3",
        title: "第4課 問題 1番 (時刻と生活習慣)",
        dialogues: [
          { speaker: "Speaker A (Male)", speakerType: "male", text: "今何時ですか。あなたの国の銀行は何時から何時までですか。", furigana: "<ruby>今<rt>いま</rt></ruby><ruby>何<rt>なん</rt></ruby><ruby>時<rt>じ</rt></ruby>ですか。あなたの<ruby>国<rt>くに</rt></ruby>の<ruby>銀<rt>ぎん</rt></ruby><ruby>行<rt>こう</rt></ruby>は<ruby>何<rt>なん</rt></ruby><ruby>時<rt>じ</rt></ruby>から<ruby>何<rt>なん</rt></ruby><ruby>時<rt>じ</rt></ruby>までですか。", romaji: "Ima nanji desu ka. Anata no kuni no ginkou wa nanji kara nanji made desu ka.", translation: "Sekarang jam berapa? Bank di negara Anda buka dari jam berapa sampai jam berapa?" },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "毎日何時に起きますか。昨日勉強しましたか。", furigana: "<ruby>毎<rt>まい</rt></ruby><ruby>日<rt>にち</rt></ruby><ruby>何<rt>なん</rt></ruby><ruby>時<rt>じ</rt></ruby>に<ruby>起<rt>お</rt></ruby>きますか。<ruby>昨日<rt>きのう</rt></ruby><ruby>勉<rt>べん</rt></ruby><ruby>強<rt>きょう</rt></ruby>しましたか。", romaji: "Mainichi nanji ni okimasu ka. Kinou benkyou shimashita ka.", translation: "Setiap hari Anda bangun jam berapa? Apakah kemarin Anda belajar?" }
        ]
      },
      {
        track: "minna_shokyu_1_014.mp3",
        title: "第4課 問題 2番 (世界の時間と睡眠)",
        dialogues: [
          { speaker: "Speaker B (Female)", speakerType: "female", text: "4時半です。ロンドンは午前7時半です。", furigana: "4<ruby>時<rt>じ</rt></ruby><ruby>半<rt>はん</rt></ruby>です。ロンドンは<ruby>午<rt>ご</rt></ruby><ruby>前<rt>ぜん</rt></ruby>7<ruby>時<rt>じ</rt></ruby><ruby>半<rt>はん</rt></ruby>です。", romaji: "Yoji han desu. Rondon wa gozen shichiji han desu.", translation: "Jam setengah lima (4:30). Di London jam setengah delapan pagi (7:30 AM)." },
          { speaker: "Speaker B (Female)", speakerType: "female", text: "昨日12時に寝ました。今朝6時半に起きました。", furigana: "<ruby>昨日<rt>きのう</rt></ruby>12<ruby>時<rt>じ</rt></ruby>に<ruby>寝<rt>ね</rt></ruby>ました。<ruby>今朝<rt>けさ</rt></ruby>6<ruby>時<rt>じ</rt></ruby><ruby>半<rt>はん</rt></ruby>に<ruby>起<rt>お</rt></ruby>きました。", romaji: "Kinou juuni-ji ni nemashita. Kesa rokuji han ni okimashita.", translation: "Kemarin saya tidur jam 12. Tadi pagi saya bangun jam setengah tujuh (6:30)." }
        ]
      },
      {
        track: "minna_shokyu_1_015.mp3",
        title: "第4課 問題 3番 (勤務時間と図書館)",
        dialogues: [
          { speaker: "Speaker B (Male)", speakerType: "male", text: "ミラーさん、昨日10時まで働きました。今日5時に終わります。", furigana: "ミラーさん、<ruby>昨日<rt>きのう</rt></ruby>10<ruby>時<rt>じ</rt></ruby>まで<ruby>働<rt>はたら</rt></ruby>きました。<ruby>今日<rt>きょう</rt></ruby>5<ruby>時<rt>じ</rt></ruby>に<ruby>終<rt>お</rt></ruby>わります。", romaji: "Miraa-san, kinou juuji made hatarakimashita. Kyou goji ni owarimasu.", translation: "Bapak Miller kemarin bekerja sampai jam 10. Hari ini selesai jam 5." },
          { speaker: "Speaker B (Female)", speakerType: "female", text: "みどり図書館ですか。月曜日図書館は休みです。", furigana: "みどり<ruby>図<rt>と</rt></ruby><ruby>書<rt>しょ</rt></ruby><ruby>館<rt>かん</rt></ruby>ですか。<ruby>月<rt>げつ</rt></ruby><ruby>曜<rt>よう</rt></ruby><ruby>日<rt>び</rt></ruby><ruby>図<rt>と</rt></ruby><ruby>書<rt>しょ</rt></ruby><ruby>館<rt>かん</rt></ruby>は<ruby>休<rt>やす</rt></ruby>みです。", romaji: "Midori toshokan desu ka. Getsuyoubi toshokan wa yasumi desu.", translation: "Perpustakaan Midori? Hari Senin perpustakaan libur." }
        ]
      }
    ]
  },
  {
    id: 5,
    lessonNum: "第5課",
    titleJa: "第5課 この電車は甲子園へ行きますか",
    titleId: "Pelajaran 5: Percakapan (Apakah kereta ini pergi ke Koshien?)",
    theme: "Transportation, Dates & Travel Destinations",
    kanjiFocus: [
      { char: "電", on: "デン (den)", kun: "-", meaning: "Listrik", words: ["電車 (でんしゃ)"] },
      { char: "車", on: "シャ (sha)", kun: "くるま (kuruma)", meaning: "Kendaraan / Mobil", words: ["電車 (でんしゃ)", "車 (くるま)"] },
      { char: "甲", on: "コウ (kou)", kun: "-", meaning: "Pertama / Baju zirah", words: ["甲子園 (こうしえん)"] },
      { char: "園", on: "エン (en)", kun: "その", meaning: "Taman", words: ["甲子園 (こうしえん)", "公園 (こうえん)"] },
      { char: "普", on: "フ (fu)", kun: "-", meaning: "Umum / Biasa", words: ["普通 (ふつう)"] },
      { char: "通", on: "ツウ (tsuu)", kun: "とお・る, かよ・う", meaning: "Lewat / Biasa", words: ["普通 (ふつう)"] },
      { char: "次", on: "ジ, シ (ji, shi)", kun: "つぎ (tsugi)", meaning: "Berikutnya", words: ["次の (つぎの)"] },
      { char: "番", on: "バン (ban)", kun: "-", meaning: "Nomor", words: ["5番線 (ごばんせん)", "何番線 (なんばんせん)"] },
      { char: "線", on: "セン (sen)", kun: "-", meaning: "Garis / Jalur peron", words: ["5番線 (ごばんせん)"] },
      { char: "誰", on: "-", kun: "だれ (dare)", meaning: "Siapa", words: ["誰 (だれ)"] },
      { char: "誕", on: "タン (tan)", kun: "-", meaning: "Kelahiran", words: ["誕生日 (たんじょうび)"] },
      { char: "月", on: "ゲツ, ガツ (getsu, gatsu)", kun: "つき (tsuki)", meaning: "Bulan", words: ["何月 (なんがつ)", "4月 (しがつ)", "月曜日 (げつようび)"] },
      { char: "火", on: "カ (ka)", kun: "ひ (hi)", meaning: "Api / Selasa", words: ["火曜日 (かようび)"] },
      { char: "水", on: "スイ (sui)", kun: "みず (mizu)", meaning: "Air / Rabu", words: ["水曜日 (すいようび)"] },
      { char: "金", on: "キン (kin)", kun: "かね (kane)", meaning: "Emas / Uang / Jumat", words: ["金曜日 (きんようび)", "お金 (おかね)"] },
      { char: "土", on: "ド, ト (do, to)", kun: "つち (tsuchi)", meaning: "Tanah / Sabtu", words: ["土曜日 (どようび)"] },
      { char: "去", on: "キョ, コ (kyo, ko)", kun: "さ・る", meaning: "Lalu / Lampau", words: ["去年 (きょねん)"] },
      { char: "年", on: "ネン (nen)", kun: "とし (toshi)", meaning: "Tahun", words: ["去年 (きょねん)", "1年 (いちねん)"] },
      { char: "京", on: "キョウ, ケイ (kyou, kei)", kun: "みやこ", meaning: "Ibukota", words: ["京都 (きょうと)", "東京 (とうきょう)"] },
      { char: "都", on: "ト, ツ (to, tsu)", kun: "みやこ", meaning: "Kota metropolis", words: ["京都 (きょうと)", "東京都 (とうきょうと)"] }
    ],
    sections: [
      {
        track: "minna_shokyu_1_017.mp3",
        title: "第5課 会話 (この電車は甲子園へ行きますか)",
        dialogues: [
          { speaker: "Speaker A (Male)", speakerType: "male", text: "すみません。甲子園までいくらですか。", furigana: "すみません。<ruby>甲<rt>こう</rt></ruby><ruby>子<rt>し</rt></ruby><ruby>園<rt>えん</rt></ruby>までいくらですか。", romaji: "Sumimasen. Koushien made ikura desu ka.", translation: "Permisi. Sampai Koshien berapa ongkosnya?" },
          { speaker: "Speaker B (Female)", speakerType: "female", text: "350円です。どういたしまして。", furigana: "350<ruby>円<rt>えん</rt></ruby>です。どういたしまして。", romaji: "Sanbyaku gojuu-en desu. Dou itashimashite.", translation: "350 yen. Sama-sama." },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "甲子園は何番線ですか。あのう、この電車は甲子園へ行きますか。", furigana: "<ruby>甲<rt>こう</rt></ruby><ruby>子<rt>し</rt></ruby><ruby>園<rt>えん</rt></ruby>は<ruby>何<rt>なん</rt></ruby><ruby>番<rt>ばん</rt></ruby><ruby>線<rt>せん</rt></ruby>ですか。あのう、この<ruby>電<rt>でん</rt></ruby><ruby>車<rt>しゃ</rt></ruby>は<ruby>甲<rt>こう</rt></ruby><ruby>子<rt>し</rt></ruby><ruby>園<rt>えん</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きますか。", romaji: "Koushien wa nanbansen desu ka. Anou, kono densha wa Koushien e ikimasu ka.", translation: "Kereta ke Koshien di peron nomor berapa? Permisi, apakah kereta ini ke Koshien?" },
          { speaker: "Speaker D (Male)", speakerType: "male", text: "いいえ、次の普通ですよ。", furigana: "いいえ、<ruby>次<rt>つぎ</rt></ruby>の<ruby>普<rt>ふ</rt></ruby><ruby>通<rt>つう</rt></ruby>ですよ。", romaji: "Iie, tsugi no futsuu desu yo.", translation: "Tidak, kereta biasa (lokal) yang berikutnya." }
        ]
      },
      {
        track: "minna_shokyu_1_018.mp3",
        title: "第5課 問題 1番 (移動とカレンダー)",
        dialogues: [
          { speaker: "Speaker A (Male)", speakerType: "male", text: "日曜日どこへ行きますか。何でスーパーへ行きますか。誰とスーパーへ行きますか。", furigana: "<ruby>日<rt>にち</rt></ruby><ruby>曜<rt>よう</rt></ruby><ruby>日<rt>び</rt></ruby>どこへ<ruby>行<rt>い</rt></ruby>きますか。<ruby>何<rt>なん</rt></ruby>でスーパーへ<ruby>行<rt>い</rt></ruby>きますか。<ruby>誰<rt>だれ</rt></ruby>とスーパーへ<ruby>行<rt>い</rt></ruby>きますか。", romaji: "Nichiyoubi doko e ikimasu ka. Nande suupaa e ikimasu ka. Dare to suupaa e ikimasu ka.", translation: "Hari Minggu pergi ke mana? Naik apa ke supermarket? Bersama siapa pergi ke supermarket?" },
          { speaker: "Speaker A (Male)", speakerType: "male", text: "誕生日は何月何日ですか。", furigana: "<ruby>誕<rt>たん</rt></ruby><ruby>生<rt>じょう</rt></ruby><ruby>日<rt>び</rt></ruby>は<ruby>何<rt>なん</rt></ruby><ruby>月<rt>がつ</rt></ruby><ruby>何<rt>なん</rt></ruby><ruby>日<rt>にち</rt></ruby>ですか。", romaji: "Tanjoubi wa nangatsu nannichi desu ka.", translation: "Ulang tahun Anda tanggal berapa bulan apa?" }
        ]
      },
      {
        track: "minna_shokyu_1_019.mp3",
        title: "第5課 問題 2番 (旅行先と日付)",
        dialogues: [
          { speaker: "Speaker B (Male)", speakerType: "male", text: "奈良へ行きました。佐藤さんは？どこも行きませんでした。", furigana: "<ruby>奈<rt>な</rt></ruby><ruby>良<rt>ら</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きました。<ruby>佐<rt>さ</rt></ruby><ruby>藤<rt>とう</rt></ruby>さんは？どこも<ruby>行<rt>い</rt></ruby>きませんでした。", romaji: "Nara e ikimashita. Satou-san wa? Dokomo ikimasen deshita.", translation: "Saya pergi ke Nara. Bagaimana dengan Ibu Sato? Saya tidak pergi ke mana-mana." },
          { speaker: "Speaker B (Male)", speakerType: "male", text: "今日は4月8日です。火曜日です。", furigana: "<ruby>今日<rt>きょう</rt></ruby>は4<ruby>月<rt>がつ</rt></ruby>8<ruby>日<rt>にち</rt></ruby>です。<ruby>火<rt>か</rt></ruby><ruby>曜<rt>よう</rt></ruby><ruby>日<rt>び</rt></ruby>です。", romaji: "Kyou wa shigatsu youka desu. Kayoubi desu.", translation: "Hari ini tanggal 8 April. Hari Selasa." }
        ]
      },
      {
        track: "minna_shokyu_1_020.mp3",
        title: "第5課 問題 3番 (同行者と来日時期)",
        dialogues: [
          { speaker: "Speaker A (Female)", speakerType: "female", text: "ミラーさんはあさって山田さんと名古屋へ行きます。", furigana: "ミラーさんはあさって<ruby>山<rt>やま</rt></ruby><ruby>田<rt>だ</rt></ruby>さんと<ruby>名<rt>な</rt></ruby><ruby>古<rt>ご</rt></ruby><ruby>屋<rt>や</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きます。", romaji: "Miraa-san wa asatte Yamada-san to Nagoya e ikimasu.", translation: "Bapak Miller lusa pergi ke Nagoya bersama Saudara Yamada." },
          { speaker: "Speaker B (Female)", speakerType: "female", text: "去年の6月に来ました。韓国から来ました。", furigana: "<ruby>去<rt>きょ</rt></ruby><ruby>年<rt>ねん</rt></ruby>の6<ruby>月<rt>がつ</rt></ruby>に<ruby>来<rt>き</rt></ruby>ました。<ruby>韓<rt>かん</rt></ruby><ruby>国<rt>こく</rt></ruby>から<ruby>来<rt>き</rt></ruby>ました。", romaji: "Kyonen no rokugatsu ni kimashita. Kankoku kara kimashita.", translation: "Saya datang pada bulan Juni tahun lalu. Datang dari Korea Selatan." }
        ]
      }
    ]
  }
];
