// Master Kanji & Vocabulary Database compiled directly from Minna no Nihongo Lessons 1-14 transcripts
// Strictly audited against official audio transcript dialogues (minna_shokyu_1_001.mp3 to 050.mp3)
// Optimized for READING drills with Kana readings, Indonesian translations, and drill distractors

import { KANJI_VOCAB_15_25 } from './bank-15-25.js';
import { KANJI_VOCAB_EXPANSION } from './bank-expansion.js';

export const MASTER_DRILL_ITEMS = [
  {
    "id": "k_001",
    "lesson": 1,
    "type": "kanji",
    "kanji": "先生",
    "kana": "せんせい",
    "romaji": "sensei",
    "meaningId": "guru / pengajar",
    "meaningEn": "teacher / instructor",
    "sentence": "あなたは先生ですか。",
    "sentenceKana": "あなたはせんせいですか。",
    "sentenceId": "Apakah Anda seorang guru?",
    "distractors": [
      "がくせい",
      "せんしゅう",
      "かいしゃいん"
    ]
  },
  {
    "id": "k_002",
    "lesson": 1,
    "type": "kanji",
    "kanji": "会社員",
    "kana": "かいしゃいん",
    "romaji": "kaishain",
    "meaningId": "karyawan perusahaan",
    "meaningEn": "company employee",
    "sentence": "サントスさんは会社員です。",
    "sentenceKana": "サントスさんはかいしゃいんです。",
    "sentenceId": "Bapak Santos adalah karyawan perusahaan.",
    "distractors": [
      "かいしゃにん",
      "がくせい",
      "けんきゅうしゃ"
    ]
  },
  {
    "id": "k_003",
    "lesson": 1,
    "type": "kanji",
    "kanji": "学生",
    "kana": "がくせい",
    "romaji": "gakusei",
    "meaningId": "pelajar / mahasiswa",
    "meaningEn": "student",
    "sentence": "カリナさんは富士大学の学生です。",
    "sentenceKana": "カリナさんはふじだいがくのがくせいです。",
    "sentenceId": "Karina adalah mahasiswi Universitas Fuji.",
    "distractors": [
      "せんせい",
      "だいがく",
      "いしゃ"
    ]
  },
  {
    "id": "k_004",
    "lesson": 1,
    "type": "kanji",
    "kanji": "研究者",
    "kana": "けんきゅうしゃ",
    "romaji": "kenkyuusha",
    "meaningId": "peneliti",
    "meaningEn": "researcher",
    "sentence": "イーさんは研究者ですか。",
    "sentenceKana": "イーさんはけんきゅうしゃですか。",
    "sentenceId": "Apakah Saudara Lee seorang peneliti?",
    "distractors": [
      "けんきゅう",
      "かいしゃいん",
      "がくしゃ"
    ]
  },
  {
    "id": "k_005",
    "lesson": 1,
    "type": "kanji",
    "kanji": "医者",
    "kana": "いしゃ",
    "romaji": "isha",
    "meaningId": "dokter",
    "meaningEn": "doctor / physician",
    "sentence": "ワンさんは医者です。",
    "sentenceKana": "ワンさんはいしゃです。",
    "sentenceId": "Saudara Wang adalah seorang dokter.",
    "distractors": [
      "けんきゅうしゃ",
      "いんしゃ",
      "ぎんこういん"
    ]
  },
  {
    "id": "k_006",
    "lesson": 1,
    "type": "kanji",
    "kanji": "何歳",
    "kana": "なんさい",
    "romaji": "nansai",
    "meaningId": "berapa umur / usia berapa",
    "meaningEn": "how old",
    "sentence": "太郎ちゃんは何歳ですか。",
    "sentenceKana": "たろうちゃんはなんさいですか。",
    "sentenceId": "Taro berumur berapa tahun?",
    "distractors": [
      "なにさい",
      "なんじ",
      "なんにん"
    ]
  },
  {
    "id": "k_007",
    "lesson": 1,
    "type": "kanji",
    "kanji": "お名前",
    "kana": "おなまえ",
    "romaji": "onamae",
    "meaningId": "nama (sopan)",
    "meaningEn": "name (polite)",
    "sentence": "お名前は？",
    "sentenceKana": "おなまえは？",
    "sentenceId": "Siapa nama Anda?",
    "distractors": [
      "おなまえん",
      "おほんめい",
      "なまえ"
    ]
  },
  {
    "id": "k_008",
    "lesson": 1,
    "type": "kanji",
    "kanji": "電気",
    "kana": "でんき",
    "romaji": "denki",
    "meaningId": "listrik / lampu",
    "meaningEn": "electricity / light",
    "sentence": "こちらはパワー電気のシュミットさんです。",
    "sentenceKana": "こちらはパワーでんきのシュミットさんです。",
    "sentenceId": "Ini adalah Bapak Schmidt dari Perusahaan Listrik Power.",
    "distractors": [
      "でんしゃ",
      "てんき",
      "でんわ"
    ]
  },
  {
    "id": "kt_001",
    "lesson": 1,
    "type": "katakana",
    "kanji": "マイク・ミラー",
    "kana": "マイク・ミラー",
    "romaji": "Maiku Miraa",
    "meaningId": "Mike Miller (nama tokoh)",
    "meaningEn": "Mike Miller",
    "sentence": "こちらはマイク・ミラーさんです。",
    "sentenceKana": "こちらはマイク・ミラーさんです。",
    "sentenceId": "Ini adalah Bapak Mike Miller.",
    "distractors": [
      "マイク・シュミット",
      "ワン・ミラー",
      "サントス"
    ]
  },
  {
    "id": "kt_002",
    "lesson": 1,
    "type": "katakana",
    "kanji": "アメリカ",
    "kana": "アメリカ",
    "romaji": "Amerika",
    "meaningId": "Amerika Serikat",
    "meaningEn": "USA / America",
    "sentence": "アメリカから来ました。",
    "sentenceKana": "アメリカからきました。",
    "sentenceId": "Saya berasal dari Amerika.",
    "distractors": [
      "イギリス",
      "メキシコ",
      "タイ"
    ]
  },
  {
    "id": "kt_013",
    "lesson": 1,
    "type": "katakana",
    "kanji": "サントス",
    "kana": "サントス",
    "romaji": "Santosu",
    "meaningId": "Santos (nama tokoh dari Brasil)",
    "meaningEn": "Santos",
    "sentence": "サントスさんは会社員です。",
    "sentenceKana": "サントスさんはかいしゃいんです。",
    "sentenceId": "Bapak Santos adalah karyawan perusahaan.",
    "distractors": [
      "シュミット",
      "ミラー",
      "タワポン"
    ]
  },
  {
    "id": "k_009",
    "lesson": 2,
    "type": "kanji",
    "kanji": "手帳",
    "kana": "てちょう",
    "romaji": "techou",
    "meaningId": "buku catatan saku / agenda",
    "meaningEn": "pocket notebook / planner",
    "sentence": "これは手帳ですか。",
    "sentenceKana": "これはてちょうですか。",
    "sentenceId": "Apakah ini buku catatan?",
    "distractors": [
      "てがみ",
      "じしょ",
      "ほん"
    ]
  },
  {
    "id": "k_010",
    "lesson": 2,
    "type": "kanji",
    "kanji": "辞書",
    "kana": "じしょ",
    "romaji": "jisho",
    "meaningId": "kamus",
    "meaningEn": "dictionary",
    "sentence": "いいえ、違います。辞書です。",
    "sentenceKana": "いいえ、ちがいます。じしょです。",
    "sentenceId": "Bukan, salah. Ini kamus.",
    "distractors": [
      "ざっし",
      "てちょう",
      "としょかん"
    ]
  },
  {
    "id": "k_011",
    "lesson": 2,
    "type": "kanji",
    "kanji": "雑誌",
    "kana": "ざっし",
    "romaji": "zasshi",
    "meaningId": "majalah",
    "meaningEn": "magazine",
    "sentence": "これは何の雑誌ですか。",
    "sentenceKana": "これはなんのざっしですか。",
    "sentenceId": "Ini majalah tentang apa?",
    "distractors": [
      "じしょ",
      "ざっしん",
      "きって"
    ]
  },
  {
    "id": "k_012",
    "lesson": 2,
    "type": "kanji",
    "kanji": "車",
    "kana": "くるま",
    "romaji": "kuruma",
    "meaningId": "mobil / kendaraan",
    "meaningEn": "car / vehicle",
    "sentence": "あの車は木村さんのですか。",
    "sentenceKana": "あのくるまはきむらさんのですか。",
    "sentenceId": "Apakah mobil itu milik Saudari Kimura?",
    "distractors": [
      "でんしゃ",
      "じてんしゃ",
      "ひこうき"
    ]
  },
  {
    "id": "k_013",
    "lesson": 2,
    "type": "kanji",
    "kanji": "お世話",
    "kana": "おせわ",
    "romaji": "osewa",
    "meaningId": "bantuan / perawatan",
    "meaningEn": "help / assistance / care",
    "sentence": "これからお世話になります。",
    "sentenceKana": "これからおせわになります。",
    "sentenceId": "Mulai sekarang saya mohon bantuannya.",
    "distractors": [
      "おねがい",
      "おへや",
      "おみやげ"
    ]
  },
  {
    "id": "kt_003",
    "lesson": 2,
    "type": "katakana",
    "kanji": "コーヒー",
    "kana": "コーヒー",
    "romaji": "koohii",
    "meaningId": "kopi",
    "meaningEn": "coffee",
    "sentence": "あの、これ、コーヒーです。どうぞ。",
    "sentenceKana": "あの、これ、コーヒーです。どうぞ。",
    "sentenceId": "Permisi, ini kopi. Silakan diterima.",
    "distractors": [
      "紅茶",
      "お茶",
      "ジュース"
    ]
  },
  {
    "id": "kt_004",
    "lesson": 2,
    "type": "katakana",
    "kanji": "チョコレート",
    "kana": "チョコレート",
    "romaji": "chokoreeto",
    "meaningId": "cokelat",
    "meaningEn": "chocolate",
    "sentence": "チョコレートです。どうもありがとうございます。",
    "sentenceKana": "チョコレートです。どうもありがとうございます。",
    "sentenceId": "Ini cokelat. Terima kasih banyak.",
    "distractors": [
      "ケーキ",
      "パン",
      "クッキー"
    ]
  },
  {
    "id": "kt_005",
    "lesson": 2,
    "type": "katakana",
    "kanji": "コンピューター",
    "kana": "コンピューター",
    "romaji": "konpyuutaa",
    "meaningId": "komputer",
    "meaningEn": "computer",
    "sentence": "コンピューターの会社です。",
    "sentenceKana": "コンピューターのかいしゃです。",
    "sentenceId": "Perusahaan komputer.",
    "distractors": [
      "テレビ",
      "カメラ",
      "ラジオ"
    ]
  },
  {
    "id": "kt_006",
    "lesson": 2,
    "type": "katakana",
    "kanji": "カメラ",
    "kana": "カメラ",
    "romaji": "kamera",
    "meaningId": "kamera",
    "meaningEn": "camera",
    "sentence": "カメラの雑誌です。",
    "sentenceKana": "カメラのざっしです。",
    "sentenceId": "Majalah kamera.",
    "distractors": [
      "テレビ",
      "ビデオ",
      "ラジオ"
    ]
  },
  {
    "id": "k_014",
    "lesson": 3,
    "type": "kanji",
    "kanji": "地下",
    "kana": "ちか",
    "romaji": "chika",
    "meaningId": "bawah tanah / lantai basemen",
    "meaningEn": "underground / basement",
    "sentence": "地下1階です。",
    "sentenceKana": "ちかいっかいです。",
    "sentenceId": "Di lantai basemen 1 (B1).",
    "distractors": [
      "じか",
      "ちげ",
      "ちじょう"
    ]
  },
  {
    "id": "k_015",
    "lesson": 3,
    "type": "kanji",
    "kanji": "売り場",
    "kana": "うりば",
    "romaji": "uriba",
    "meaningId": "bagian penjualan / konter",
    "meaningEn": "sales counter / department",
    "sentence": "すみません。ワイン売り場はどこですか。",
    "sentenceKana": "すみません。ワインうりばはどこですか。",
    "sentenceId": "Permisi. Di mana bagian penjualan wine?",
    "distractors": [
      "ばしょ",
      "うりや",
      "かいじょう"
    ]
  },
  {
    "id": "k_016",
    "lesson": 3,
    "type": "kanji",
    "kanji": "事務所",
    "kana": "じむしょ",
    "romaji": "jimusho",
    "meaningId": "kantor",
    "meaningEn": "office",
    "sentence": "すみません。事務所はどこですか。",
    "sentenceKana": "すみません。じむしょはどこですか。",
    "sentenceId": "Permisi. Di mana kantor?",
    "distractors": [
      "かいぎしつ",
      "しょくどう",
      "うけつけ"
    ]
  },
  {
    "id": "k_017",
    "lesson": 3,
    "type": "kanji",
    "kanji": "食堂",
    "kana": "しょくどう",
    "romaji": "shokudou",
    "meaningId": "kantin / ruang makan",
    "meaningEn": "cafeteria / dining hall",
    "sentence": "食堂はそこです。",
    "sentenceKana": "しょくどうはそこです。",
    "sentenceId": "Kantin ada di situ.",
    "distractors": [
      "しょくじ",
      "りょうりや",
      "きょうしつ"
    ]
  },
  {
    "id": "k_018",
    "lesson": 3,
    "type": "kanji",
    "kanji": "会議室",
    "kana": "かいぎしつ",
    "romaji": "kaigishitsu",
    "meaningId": "ruang rapat",
    "meaningEn": "meeting / conference room",
    "sentence": "佐藤さんは会議室です。",
    "sentenceKana": "さとうさんはかいぎしつです。",
    "sentenceId": "Ibu Sato ada di ruang rapat.",
    "distractors": [
      "きょうしつ",
      "じむしょ",
      "けんきゅうしつ"
    ]
  },
  {
    "id": "k_019",
    "lesson": 3,
    "type": "kanji",
    "kanji": "時計",
    "kana": "とけい",
    "romaji": "tokei",
    "meaningId": "jam / arloji",
    "meaningEn": "clock / watch",
    "sentence": "すみません。この時計はいくらですか。",
    "sentenceKana": "すみません。このとけいはいくらですか。",
    "sentenceId": "Permisi. Berapa harga jam tangan ini?",
    "distractors": [
      "じけい",
      "じかん",
      "とっけい"
    ]
  },
  {
    "id": "kt_007",
    "lesson": 3,
    "type": "katakana",
    "kanji": "ワイン",
    "kana": "ワイン",
    "romaji": "wain",
    "meaningId": "anggur (minuman wine)",
    "meaningEn": "wine",
    "sentence": "すみません。そのワインを見せてください。",
    "sentenceKana": "すみません。そのワインをみせてください。",
    "sentenceId": "Permisi. Tolong perlihatkan anggur (wine) itu.",
    "distractors": [
      "ビール",
      "ジュース",
      "ウイスキー"
    ]
  },
  {
    "id": "k_020",
    "lesson": 4,
    "type": "kanji",
    "kanji": "今朝",
    "kana": "けさ",
    "romaji": "kesa",
    "meaningId": "tadi pagi",
    "meaningEn": "this morning",
    "sentence": "今朝何時に起きましたか。",
    "sentenceKana": "けさなんじにおきましたか。",
    "sentenceId": "Tadi pagi Anda bangun jam berapa?",
    "distractors": [
      "こんちょう",
      "きょうのあさ",
      "まいあさ"
    ]
  },
  {
    "id": "k_021",
    "lesson": 4,
    "type": "kanji",
    "kanji": "昨日",
    "kana": "きのう",
    "romaji": "kinou",
    "meaningId": "kemarin",
    "meaningEn": "yesterday",
    "sentence": "昨日勉強しましたか。",
    "sentenceKana": "きのうべんきょうしましたか。",
    "sentenceId": "Apakah kemarin Anda belajar?",
    "distractors": [
      "さくじつ",
      "あした",
      "おととい"
    ]
  },
  {
    "id": "k_022",
    "lesson": 4,
    "type": "kanji",
    "kanji": "銀行",
    "kana": "ぎんこう",
    "romaji": "ginkou",
    "meaningId": "bank",
    "meaningEn": "bank",
    "sentence": "あなたの国の銀行は何時から何時までですか。",
    "sentenceKana": "あなたのくにのぎんこうはなんじからなんじまでですか。",
    "sentenceId": "Bank di negara Anda buka dari jam berapa sampai jam berapa?",
    "distractors": [
      "びょういん",
      "がっこう",
      "ゆうびんきょく"
    ]
  },
  {
    "id": "k_023",
    "lesson": 4,
    "type": "kanji",
    "kanji": "図書館",
    "kana": "としょかん",
    "romaji": "toshokan",
    "meaningId": "perpustakaan",
    "meaningEn": "library",
    "sentence": "月曜日図書館は休みです。",
    "sentenceKana": "げつようびとしょかんはやすみです。",
    "sentenceId": "Hari Senin perpustakaan libur.",
    "distractors": [
      "びじゅつかん",
      "ほんや",
      "たいかん"
    ]
  },
  {
    "id": "k_024",
    "lesson": 4,
    "type": "kanji",
    "kanji": "昼休み",
    "kana": "ひるやすみ",
    "romaji": "hiruyasumi",
    "meaningId": "istirahat siang",
    "meaningEn": "lunch break",
    "sentence": "昼休みは12時15分から1時15分までです。",
    "sentenceKana": "ひるやすみは12じ15ふんから1じ15ふんまでです。",
    "sentenceId": "Istirahat siang dari jam 12:15 sampai jam 1:15.",
    "distractors": [
      "ばんやすみ",
      "あさやすみ",
      "なつやすみ"
    ]
  },
  {
    "id": "k_025",
    "lesson": 4,
    "type": "kanji",
    "kanji": "美術館",
    "kana": "びじゅつかん",
    "romaji": "bijutsukan",
    "meaningId": "museum seni",
    "meaningEn": "art museum",
    "sentence": "美術館の電話番号は075の138の6697です。",
    "sentenceKana": "びじゅつかんのでんわばんごうは075の138の6697です。",
    "sentenceId": "Nomor telepon museum seni adalah 075-138-6697.",
    "distractors": [
      "としょかん",
      "はくぶつかん",
      "えいがかん"
    ]
  },
  {
    "id": "k_057",
    "lesson": 4,
    "type": "kanji",
    "kanji": "電話番号",
    "kana": "でんわばんごう",
    "romaji": "denwabangou",
    "meaningId": "nomor telepon",
    "meaningEn": "phone number",
    "sentence": "「あすか」の電話番号は何番ですか。",
    "sentenceKana": "「あすか」のでんわばんごうはなんばんですか。",
    "sentenceId": "Berapa nomor telepon “Asuka”?",
    "distractors": [
      "へやばんごう",
      "じゅうしょ",
      "でんきばんごう"
    ]
  },
  {
    "id": "k_058",
    "lesson": 4,
    "type": "kanji",
    "kanji": "休み",
    "kana": "やすみ",
    "romaji": "yasumi",
    "meaningId": "libur / istirahat",
    "meaningEn": "rest / holiday",
    "sentence": "休みは何曜日ですか。",
    "sentenceKana": "やすみはなんようびですか。",
    "sentenceId": "Hari liburnya hari apa?",
    "distractors": [
      "きゅうじつ",
      "しごと",
      "じかん"
    ]
  },
  {
    "id": "k_026",
    "lesson": 5,
    "type": "kanji",
    "kanji": "普通",
    "kana": "ふつう",
    "romaji": "futsuu",
    "meaningId": "kereta lokal biasa",
    "meaningEn": "local train / ordinary",
    "sentence": "いいえ、次の普通ですよ。",
    "sentenceKana": "いいえ、つぎのふつうですよ。",
    "sentenceId": "Tidak, kereta biasa (lokal) yang berikutnya.",
    "distractors": [
      "きゅうこう",
      "とっきゅう",
      "ふとう"
    ]
  },
  {
    "id": "k_027",
    "lesson": 5,
    "type": "kanji",
    "kanji": "誕生日",
    "kana": "たんじょうび",
    "romaji": "tanjoubi",
    "meaningId": "hari ulang tahun",
    "meaningEn": "birthday",
    "sentence": "誕生日は何月何日ですか。",
    "sentenceKana": "たんじょうびはなんがつなんにちですか。",
    "sentenceId": "Ulang tahun Anda tanggal berapa bulan apa?",
    "distractors": [
      "たんじょう",
      "きねんび",
      "しょうにち"
    ]
  },
  {
    "id": "k_028",
    "lesson": 5,
    "type": "kanji",
    "kanji": "去年",
    "kana": "きょねん",
    "romaji": "kyonen",
    "meaningId": "tahun lalu",
    "meaningEn": "last year",
    "sentence": "去年の6月に来ました。",
    "sentenceKana": "きょねんのろくがつにきました。",
    "sentenceId": "Saya datang pada bulan Juni tahun lalu.",
    "distractors": [
      "ことし",
      "らいねん",
      "まいねん"
    ]
  },
  {
    "id": "k_059",
    "lesson": 5,
    "type": "kanji",
    "kanji": "電車",
    "kana": "でんしゃ",
    "romaji": "densha",
    "meaningId": "kereta listrik",
    "meaningEn": "train (electric)",
    "sentence": "この電車は甲子園へ行きますか。",
    "sentenceKana": "このでんしゃはこうしえんへいきますか。",
    "sentenceId": "Apakah kereta ini pergi ke Koshien?",
    "distractors": [
      "くるま",
      "ちかてつ",
      "しんかんせん"
    ]
  },
  {
    "id": "k_060",
    "lesson": 5,
    "type": "kanji",
    "kanji": "甲子園",
    "kana": "こうしえん",
    "romaji": "Koushien",
    "meaningId": "Koshien (nama stasiun / stadion)",
    "meaningEn": "Koshien (station / stadium name)",
    "sentence": "すみません。甲子園までいくらですか。",
    "sentenceKana": "すみません。こうしえんまでいくらですか。",
    "sentenceId": "Permisi. Sampai Koshien berapa ongkosnya?",
    "distractors": [
      "とうきょう",
      "おおさか",
      "きょうと"
    ]
  },
  {
    "id": "kt_014",
    "lesson": 5,
    "type": "katakana",
    "kanji": "スーパー",
    "kana": "スーパー",
    "romaji": "suupaa",
    "meaningId": "supermarket",
    "meaningEn": "supermarket",
    "sentence": "何でスーパーへ行きますか。",
    "sentenceKana": "なんでスーパーへいきますか。",
    "sentenceId": "Naik apa pergi ke supermarket?",
    "distractors": [
      "デパート",
      "コンビニ",
      "マーケット"
    ]
  },
  {
    "id": "k_029",
    "lesson": 6,
    "type": "kanji",
    "kanji": "友達",
    "kana": "ともだち",
    "romaji": "tomodachi",
    "meaningId": "teman / sahabat",
    "meaningEn": "friend",
    "sentence": "明日友達とお花見をします。",
    "sentenceKana": "あしたともだちとおはなみをします。",
    "sentenceId": "Besok saya melihat bunga sakura bersama teman.",
    "distractors": [
      "かぞく",
      "こども",
      "せんせい"
    ]
  },
  {
    "id": "k_030",
    "lesson": 6,
    "type": "kanji",
    "kanji": "新聞",
    "kana": "しんぶん",
    "romaji": "shinbun",
    "meaningId": "koran / surat kabar",
    "meaningEn": "newspaper",
    "sentence": "毎朝新聞を読みますか。",
    "sentenceKana": "まいあさしんぶんをよみますか。",
    "sentenceId": "Apakah Anda membaca koran setiap pagi?",
    "distractors": [
      "ほん",
      "ざっし",
      "てがみ"
    ]
  },
  {
    "id": "k_031",
    "lesson": 6,
    "type": "kanji",
    "kanji": "映画",
    "kana": "えいが",
    "romaji": "eiga",
    "meaningId": "film / bioskop",
    "meaningEn": "movie / film",
    "sentence": "神戸で映画を見ました。",
    "sentenceKana": "こうべでえいがをみました。",
    "sentenceId": "Saya menonton film di Kobe.",
    "distractors": [
      "おんがく",
      "てれび",
      "しゃしん"
    ]
  },
  {
    "id": "k_032",
    "lesson": 6,
    "type": "kanji",
    "kanji": "お酒",
    "kana": "おさけ",
    "romaji": "osake",
    "meaningId": "minuman keras / sake Jepang",
    "meaningEn": "alcohol / Japanese sake",
    "sentence": "山田さんはお酒を飲みますか。",
    "sentenceKana": "やまださんはおさけをのみますか。",
    "sentenceId": "Apakah Saudara Yamada minum sake?",
    "distractors": [
      "おちゃ",
      "みず",
      "びーる"
    ]
  },
  {
    "id": "k_062",
    "lesson": 6,
    "type": "kanji",
    "kanji": "お花見",
    "kana": "おはなみ",
    "romaji": "ohanami",
    "meaningId": "melihat bunga sakura (tradisi hanami)",
    "meaningEn": "cherry blossom viewing",
    "sentence": "明日友達とお花見をします。",
    "sentenceKana": "あしたともだちとおはなみをします。",
    "sentenceId": "Besok saya akan melihat bunga sakura bersama teman.",
    "distractors": [
      "つきみ",
      "ゆきみ",
      "はなび"
    ]
  },
  {
    "id": "k_063",
    "lesson": 6,
    "type": "kanji",
    "kanji": "朝ご飯",
    "kana": "あさごはん",
    "romaji": "asagohan",
    "meaningId": "sarapan / makan pagi",
    "meaningEn": "breakfast",
    "sentence": "今朝朝ご飯を食べましたか。",
    "sentenceKana": "けさあさごはんをたべましたか。",
    "sentenceId": "Tadi pagi apakah sudah makan sarapan?",
    "distractors": [
      "ひるごはん",
      "ばんごはん",
      "おやつ"
    ]
  },
  {
    "id": "kt_015",
    "lesson": 6,
    "type": "katakana",
    "kanji": "テニス",
    "kana": "テニス",
    "romaji": "tenisu",
    "meaningId": "tenis",
    "meaningEn": "tennis",
    "sentence": "日曜日一緒にテニスをしませんか。",
    "sentenceKana": "にちようびいっしょにテニスをしませんか。",
    "sentenceId": "Hari Minggu maukah bermain tenis bersama?",
    "distractors": [
      "サッカー",
      "ゴルフ",
      "野球"
    ]
  },
  {
    "id": "k_033",
    "lesson": 7,
    "type": "kanji",
    "kanji": "お土産",
    "kana": "おみやげ",
    "romaji": "omiyage",
    "meaningId": "oleh-oleh / buah tangan",
    "meaningEn": "souvenir / gift",
    "sentence": "メキシコのお土産です。",
    "sentenceKana": "メキシコのおみやげです。",
    "sentenceId": "Oleh-oleh dari Meksiko.",
    "distractors": [
      "プレゼント",
      "てみやげ",
      "おくりもの"
    ]
  },
  {
    "id": "k_034",
    "lesson": 7,
    "type": "kanji",
    "kanji": "晩ご飯",
    "kana": "ばんごはん",
    "romaji": "bangohan",
    "meaningId": "makan malam",
    "meaningEn": "dinner / evening meal",
    "sentence": "もう晩ご飯を食べましたか。",
    "sentenceKana": "もうばんごはんをたべましたか。",
    "sentenceId": "Apakah sudah makan malam?",
    "distractors": [
      "あさごはん",
      "ひるごはん",
      "おひる"
    ]
  },
  {
    "id": "k_064",
    "lesson": 7,
    "type": "kanji",
    "kanji": "母",
    "kana": "はは",
    "romaji": "haha",
    "meaningId": "ibu (ibu saya)",
    "meaningEn": "mother (my mother)",
    "sentence": "誕生日に母にもらいました。",
    "sentenceKana": "たんじょうびにははにもらいました。",
    "sentenceId": "Saya mendapatkannya dari ibu pada hari ulang tahun.",
    "distractors": [
      "ちち",
      "あね",
      "いもうと"
    ]
  },
  {
    "id": "k_065",
    "lesson": 7,
    "type": "kanji",
    "kanji": "手紙",
    "kana": "てがみ",
    "romaji": "tegami",
    "meaningId": "surat",
    "meaningEn": "letter",
    "sentence": "この手紙、エアメールでお願いします。",
    "sentenceKana": "このてがみ、エアメールでおねがいします。",
    "sentenceId": "Surat ini, tolong dikirim lewat pos udara.",
    "distractors": [
      "きって",
      "はがき",
      "ほん"
    ]
  },
  {
    "id": "kt_008",
    "lesson": 7,
    "type": "katakana",
    "kanji": "スプーン",
    "kana": "スプーン",
    "romaji": "supuun",
    "meaningId": "sendok",
    "meaningEn": "spoon",
    "sentence": "このスプーン素敵ですね。",
    "sentenceKana": "このスプーンすてきですね。",
    "sentenceId": "Sendok ini bagus sekali, ya.",
    "distractors": [
      "フォーク",
      "ナイフ",
      "カップ"
    ]
  },
  {
    "id": "kt_009",
    "lesson": 7,
    "type": "katakana",
    "kanji": "ネクタイ",
    "kana": "ネクタイ",
    "romaji": "nekutai",
    "meaningId": "dasi",
    "meaningEn": "necktie",
    "sentence": "そのネクタイ素敵ですね。",
    "sentenceKana": "そのネクタイすてきですね。",
    "sentenceId": "Dasi itu bagus sekali, ya.",
    "distractors": [
      "シャツ",
      "コート",
      "スーツ"
    ]
  },
  {
    "id": "kt_016",
    "lesson": 7,
    "type": "katakana",
    "kanji": "レポート",
    "kana": "レポート",
    "romaji": "repooto",
    "meaningId": "laporan / paper",
    "meaningEn": "report",
    "sentence": "もう東京にレポートを送りましたか。",
    "sentenceKana": "もうとうきょうにレポートをおくりましたか。",
    "sentenceId": "Apakah sudah mengirim laporan ke Tokyo?",
    "distractors": [
      "手紙",
      "メール",
      "ノート"
    ]
  },
  {
    "id": "k_035",
    "lesson": 8,
    "type": "kanji",
    "kanji": "生活",
    "kana": "せいかつ",
    "romaji": "seikatsu",
    "meaningId": "kehidupan / gaya hidup",
    "meaningEn": "life / living",
    "sentence": "日本の生活はどうですか。",
    "sentenceKana": "にほんのせいかつはどうですか。",
    "sentenceId": "Bagaimana kehidupan di Jepang?",
    "distractors": [
      "かつどう",
      "せいがく",
      "くらし"
    ]
  },
  {
    "id": "k_036",
    "lesson": 8,
    "type": "kanji",
    "kanji": "忙しい",
    "kana": "いそがしい",
    "romaji": "isogashii",
    "meaningId": "sibuk",
    "meaningEn": "busy",
    "sentence": "忙しいですが、面白いです。",
    "sentenceKana": "いそがしいですが、おもしろいです。",
    "sentenceId": "Sibuk, tetapi menarik.",
    "distractors": [
      "さびしい",
      "うれしい",
      "たのしい"
    ]
  },
  {
    "id": "k_037",
    "lesson": 8,
    "type": "kanji",
    "kanji": "面白い",
    "kana": "おもしろい",
    "romaji": "omoshiroi",
    "meaningId": "menarik / lucu",
    "meaningEn": "interesting / amusing",
    "sentence": "仕事は面白いですか。",
    "sentenceKana": "しごとはおもしろいですか。",
    "sentenceId": "Apakah pekerjaan Anda menarik?",
    "distractors": [
      "おもたい",
      "たのしい",
      "むずかしい"
    ]
  },
  {
    "id": "k_066",
    "lesson": 8,
    "type": "kanji",
    "kanji": "元気",
    "kana": "げんき",
    "romaji": "genki",
    "meaningId": "sehat / bugar / semangat",
    "meaningEn": "healthy / energetic",
    "sentence": "家族は元気ですか。",
    "sentenceKana": "かぞくはげんきですか。",
    "sentenceId": "Apakah keluarga Anda sehat?",
    "distractors": [
      "てんき",
      "びょうき",
      "きぶん"
    ]
  },
  {
    "id": "k_067",
    "lesson": 8,
    "type": "kanji",
    "kanji": "白い",
    "kana": "しろい",
    "romaji": "shiroi",
    "meaningId": "putih",
    "meaningEn": "white",
    "sentence": "いいえ、その白いシャツです。",
    "sentenceKana": "いいえ、そのしろいシャツです。",
    "sentenceId": "Bukan, kemeja putih itu.",
    "distractors": [
      "あかい",
      "くろい",
      "あおい"
    ]
  },
  {
    "id": "k_068",
    "lesson": 8,
    "type": "kanji",
    "kanji": "冷たい",
    "kana": "つめたい",
    "romaji": "tsumetai",
    "meaningId": "dingin (benda atau minuman)",
    "meaningEn": "cold (touch / beverage)",
    "sentence": "冷たいお茶はいかがですか。",
    "sentenceKana": "つめたいおちゃはいかがですか。",
    "sentenceId": "Bagaimana dengan teh dingin (mau minum teh dingin)?",
    "distractors": [
      "あつい",
      "ぬるい",
      "あまい"
    ]
  },
  {
    "id": "k_069",
    "lesson": 8,
    "type": "kanji",
    "kanji": "お茶",
    "kana": "おちゃ",
    "romaji": "ocha",
    "meaningId": "teh hijau Jepang",
    "meaningEn": "green tea / Japanese tea",
    "sentence": "これから冷たいお茶を飲みます。",
    "sentenceKana": "これからつめたいおちゃをのみます。",
    "sentenceId": "Setelah ini mereka akan minum teh dingin.",
    "distractors": [
      "こうちゃ",
      "コーヒー",
      "みず"
    ]
  },
  {
    "id": "k_038",
    "lesson": 9,
    "type": "kanji",
    "kanji": "残念",
    "kana": "ざんねん",
    "romaji": "zannen",
    "meaningId": "sayang sekali / disayangkan",
    "meaningEn": "regrettable / pity",
    "sentence": "そうですか。残念ですね。",
    "sentenceKana": "そうですか。ざんねんですね。",
    "sentenceId": "Begitu ya. Sayang sekali, ya.",
    "distractors": [
      "きねん",
      "しんぱい",
      "あんしん"
    ]
  },
  {
    "id": "k_039",
    "lesson": 9,
    "type": "kanji",
    "kanji": "約束",
    "kana": "やくそく",
    "romaji": "yakusoku",
    "meaningId": "janji",
    "meaningEn": "promise / appointment",
    "sentence": "友達と約束がありますから……。",
    "sentenceKana": "ともだちとやくそくがありますから……。",
    "sentenceId": "Karena saya ada janji dengan teman...",
    "distractors": [
      "よやく",
      "あんない",
      "れんらく"
    ]
  },
  {
    "id": "k_040",
    "lesson": 9,
    "type": "kanji",
    "kanji": "上手",
    "kana": "じょうず",
    "romaji": "jouzu",
    "meaningId": "pandai / terampil",
    "meaningEn": "skillful / good at",
    "sentence": "歌が上手ですか。",
    "sentenceKana": "うたがじょうずですか。",
    "sentenceId": "Apakah Anda pandai bernyanyi?",
    "distractors": [
      "へた",
      "じょうし",
      "うわて"
    ]
  },
  {
    "id": "k_041",
    "lesson": 9,
    "type": "kanji",
    "kanji": "料理",
    "kana": "りょうり",
    "romaji": "ryouri",
    "meaningId": "masakan / memasak",
    "meaningEn": "cooking / cuisine",
    "sentence": "うちでいつも料理をしますから。",
    "sentenceKana": "うちでいつもりょうりをしますから。",
    "sentenceId": "Karena di rumah saya selalu memasak.",
    "distractors": [
      "りょこう",
      "りょうしん",
      "しょくじ"
    ]
  },
  {
    "id": "k_070",
    "lesson": 9,
    "type": "kanji",
    "kanji": "漢字",
    "kana": "かんじ",
    "romaji": "kanji",
    "meaningId": "huruf Kanji",
    "meaningEn": "Kanji characters",
    "sentence": "漢字がわかりますか。",
    "sentenceKana": "かんじがわかりますか。",
    "sentenceId": "Apakah Anda mengerti huruf Kanji?",
    "distractors": [
      "かな",
      "ひらがな",
      "かんしゃ"
    ]
  },
  {
    "id": "k_071",
    "lesson": 9,
    "type": "kanji",
    "kanji": "財布",
    "kana": "さいふ",
    "romaji": "saifu",
    "meaningId": "dompet",
    "meaningEn": "wallet / purse",
    "sentence": "いつも財布にいくらありますか。",
    "sentenceKana": "いつもさいふにいくらありますか。",
    "sentenceId": "Biasanya di dalam dompet ada uang berapa?",
    "distractors": [
      "かばん",
      "きっぷ",
      "ふくろ"
    ]
  },
  {
    "id": "kt_017",
    "lesson": 9,
    "type": "katakana",
    "kanji": "コンサート",
    "kana": "コンサート",
    "romaji": "konsaato",
    "meaningId": "konser musik",
    "meaningEn": "concert",
    "sentence": "クラシックのコンサートへ行きませんか。",
    "sentenceKana": "クラシックのコンサートへいきませんか。",
    "sentenceId": "Maukah pergi ke konser musik klasik?",
    "distractors": [
      "パーティー",
      "イベント",
      "カラオケ"
    ]
  },
  {
    "id": "kt_018",
    "lesson": 9,
    "type": "katakana",
    "kanji": "チケット",
    "kana": "チケット",
    "romaji": "chiketto",
    "meaningId": "tiket (bioskop/pertunjukan)",
    "meaningEn": "ticket",
    "sentence": "映画のチケットがあります。",
    "sentenceKana": "えいがのチケットがあります。",
    "sentenceId": "Ada tiket film.",
    "distractors": [
      "きっぷ",
      "パスポート",
      "カード"
    ]
  },
  {
    "id": "k_042",
    "lesson": 10,
    "type": "kanji",
    "kanji": "階段",
    "kana": "かいだん",
    "romaji": "kaidan",
    "meaningId": "tangga",
    "meaningEn": "stairs / staircase",
    "sentence": "お手洗いはあの階段の後ろです。",
    "sentenceKana": "おてあらいはあのかいだんのうしろです。",
    "sentenceId": "Toiletnya ada di belakang tangga itu.",
    "distractors": [
      "エレベーター",
      "エスカレーター",
      "かいそう"
    ]
  },
  {
    "id": "k_043",
    "lesson": 10,
    "type": "kanji",
    "kanji": "後ろ",
    "kana": "うしろ",
    "romaji": "ushiro",
    "meaningId": "belakang",
    "meaningEn": "behind / back",
    "sentence": "お手洗いはあの階段の後ろです。",
    "sentenceKana": "おてあらいはあのかいだんのうしろです。",
    "sentenceId": "Toiletnya ada di belakang tangga itu.",
    "distractors": [
      "まえ",
      "ひだり",
      "みぎ"
    ]
  },
  {
    "id": "k_072",
    "lesson": 10,
    "type": "kanji",
    "kanji": "部屋",
    "kana": "へや",
    "romaji": "heya",
    "meaningId": "kamar / ruangan",
    "meaningEn": "room",
    "sentence": "あなたの部屋に時計がありますか。",
    "sentenceKana": "あなたのへやにとけいがありますか。",
    "sentenceId": "Apakah di kamar Anda ada jam?",
    "distractors": [
      "いえ",
      "うち",
      "へん"
    ]
  },
  {
    "id": "k_073",
    "lesson": 10,
    "type": "kanji",
    "kanji": "近く",
    "kana": "ちかく",
    "romaji": "chikaku",
    "meaningId": "dekat",
    "meaningEn": "near / nearby",
    "sentence": "うちの近くに何がありますか。",
    "sentenceKana": "うちのちかくになにがありますか。",
    "sentenceId": "Di dekat rumah Anda ada apa?",
    "distractors": [
      "とおく",
      "となり",
      "あいだ"
    ]
  },
  {
    "id": "k_074",
    "lesson": 10,
    "type": "kanji",
    "kanji": "公園",
    "kana": "こうえん",
    "romaji": "kouen",
    "meaningId": "taman umum",
    "meaningEn": "park",
    "sentence": "テレーザちゃんは公園にいます。",
    "sentenceKana": "テレーザちゃんはこうえんにいます。",
    "sentenceId": "Tereza ada di taman.",
    "distractors": [
      "えんてい",
      "びょういん",
      "がっこう"
    ]
  },
  {
    "id": "k_075",
    "lesson": 10,
    "type": "kanji",
    "kanji": "左",
    "kana": "ひだり",
    "romaji": "hidari",
    "meaningId": "kiri",
    "meaningEn": "left",
    "sentence": "あの電話の左ですよ。",
    "sentenceKana": "あのでんわのひだりですよ。",
    "sentenceId": "Di sebelah kiri telepon itu, lho.",
    "distractors": [
      "みぎ",
      "まえ",
      "うしろ"
    ]
  },
  {
    "id": "kt_010",
    "lesson": 10,
    "type": "katakana",
    "kanji": "ナンプラー",
    "kana": "ナンプラー",
    "romaji": "nanpuraa",
    "meaningId": "nam pla (kecap ikan Thailand)",
    "meaningEn": "fish sauce (nam pla)",
    "sentence": "あのう、ナンプラーありますか。",
    "sentenceKana": "あのう、ナンプラーありますか。",
    "sentenceId": "Permisi, apakah ada kecap ikan (nam pla)?",
    "distractors": [
      "タイカレー",
      "ラーメン",
      "サラダ"
    ]
  },
  {
    "id": "k_044",
    "lesson": 11,
    "type": "kanji",
    "kanji": "郵便局",
    "kana": "ゆうびんきょく",
    "romaji": "yuubinkyoku",
    "meaningId": "kantor pos",
    "meaningEn": "post office",
    "sentence": "ええ、ちょっと郵便局まで。",
    "sentenceKana": "ええ、ちょっとゆうびんきょくまで。",
    "sentenceId": "Ya, sebentar ke kantor pos.",
    "distractors": [
      "ぎんこう",
      "やくしょ",
      "びょういん"
    ]
  },
  {
    "id": "k_045",
    "lesson": 11,
    "type": "kanji",
    "kanji": "船便",
    "kana": "ふなびん",
    "romaji": "funabin",
    "meaningId": "pos lewat kapal laut",
    "meaningEn": "sea mail / surface mail",
    "sentence": "じゃ、船便でお願いします。",
    "sentenceKana": "じゃ、ふなびんでおねがいします。",
    "sentenceId": "Kalau begitu, tolong kirim lewat kapal laut saja.",
    "distractors": [
      "こうくうびん",
      "ふねびん",
      "せんびん"
    ]
  },
  {
    "id": "k_046",
    "lesson": 11,
    "type": "kanji",
    "kanji": "航空便",
    "kana": "こうくうびん",
    "romaji": "koukuubin",
    "meaningId": "pos udara / pos pesawat",
    "meaningEn": "airmail",
    "sentence": "航空便はいくらですか。",
    "sentenceKana": "こうくうびんはいくらですか。",
    "sentenceId": "Kalau pos udara berapa biayanya?",
    "distractors": [
      "ふなびん",
      "ひこうき",
      "そらびん"
    ]
  },
  {
    "id": "k_047",
    "lesson": 11,
    "type": "kanji",
    "kanji": "切手",
    "kana": "きって",
    "romaji": "kitte",
    "meaningId": "perangko",
    "meaningEn": "postage stamp",
    "sentence": "80円の切手を10枚と50円の切手を10枚ください。",
    "sentenceKana": "80えんのきってを10まいと50えんのきってを10まいください。",
    "sentenceId": "Tolong berikan perangko 80 yen 10 lembar dan perangko 50 yen 10 lembar.",
    "distractors": [
      "てがみ",
      "きっぷ",
      "はがき"
    ]
  },
  {
    "id": "k_076",
    "lesson": 11,
    "type": "kanji",
    "kanji": "家族",
    "kana": "かぞく",
    "romaji": "kazoku",
    "meaningId": "keluarga",
    "meaningEn": "family",
    "sentence": "家族は何人ですか。",
    "sentenceKana": "かぞくはなんにんですか。",
    "sentenceId": "Keluarga Anda ada berapa orang?",
    "distractors": [
      "きょうだい",
      "りょうしん",
      "ともだち"
    ]
  },
  {
    "id": "k_077",
    "lesson": 11,
    "type": "kanji",
    "kanji": "飛行機",
    "kana": "ひこうき",
    "romaji": "hikouki",
    "meaningId": "pesawat terbang",
    "meaningEn": "airplane",
    "sentence": "あなたの国から日本まで飛行機で何時間かかりますか。",
    "sentenceKana": "あなたのくにからにほんまでひこうきでなんじかんかかりますか。",
    "sentenceId": "Dari negara Anda sampai ke Jepang memakan waktu berapa jam naik pesawat?",
    "distractors": [
      "ふね",
      "しんかんせん",
      "じどうしゃ"
    ]
  },
  {
    "id": "k_078",
    "lesson": 11,
    "type": "kanji",
    "kanji": "妹",
    "kana": "いもうと",
    "romaji": "imouto",
    "meaningId": "adik perempuan (adik kandung saya)",
    "meaningEn": "younger sister",
    "sentence": "ええ、妹が1人います。学生です。",
    "sentenceKana": "ええ、いもうとが1りいます。がくせいです。",
    "sentenceId": "Ya, saya punya 1 adik perempuan. Dia seorang pelajar.",
    "distractors": [
      "あね",
      "おとうと",
      "あに"
    ]
  },
  {
    "id": "kt_011",
    "lesson": 11,
    "type": "katakana",
    "kanji": "エアメール",
    "kana": "エアメール",
    "romaji": "eameeru",
    "meaningId": "pos udara (airmail)",
    "meaningEn": "airmail",
    "sentence": "この手紙、エアメールでお願いします。",
    "sentenceKana": "このてがみ、エアメールでおねがいします。",
    "sentenceId": "Surat ini, tolong dikirim lewat pos udara (airmail).",
    "distractors": [
      "メール",
      "ふなびん",
      "ホテル"
    ]
  },
  {
    "id": "k_048",
    "lesson": 12,
    "type": "kanji",
    "kanji": "写真",
    "kana": "しゃしん",
    "romaji": "shashin",
    "meaningId": "foto / potret",
    "meaningEn": "photograph / picture",
    "sentence": "写真をたくさん撮りました。これです。",
    "sentenceKana": "しゃしんをたくさんとりました。これです。",
    "sentenceId": "Saya mengambil banyak foto. Ini dia.",
    "distractors": [
      "カメラ",
      "えいが",
      "しゃしつ"
    ]
  },
  {
    "id": "k_049",
    "lesson": 12,
    "type": "kanji",
    "kanji": "有名",
    "kana": "ゆうめい",
    "romaji": "yuumei",
    "meaningId": "terkenal / termasyhur",
    "meaningEn": "famous",
    "sentence": "祇園祭は京都の祭りで一番有名ですからね。",
    "sentenceKana": "ぎおんまつりはきょうとのまつりでいちばんゆうめいだからね。",
    "sentenceId": "Karena Festival Gion adalah festival yang paling terkenal di Kyoto, ya.",
    "distractors": [
      "なまえ",
      "ゆうりょう",
      "にんき"
    ]
  },
  {
    "id": "k_079",
    "lesson": 12,
    "type": "kanji",
    "kanji": "祇園祭",
    "kana": "ぎおんまつり",
    "romaji": "Gion Matsuri",
    "meaningId": "Festival Gion di Kyoto",
    "meaningEn": "Gion Festival",
    "sentence": "祇園祭はどうでしたか。",
    "sentenceKana": "ぎおんまつりはどうでしたか。",
    "sentenceId": "Bagaimana Festival Gion?",
    "distractors": [
      "さくらまつり",
      "なつまつり",
      "ゆきまつり"
    ]
  },
  {
    "id": "k_080",
    "lesson": 12,
    "type": "kanji",
    "kanji": "天気",
    "kana": "てんき",
    "romaji": "tenki",
    "meaningId": "cuaca",
    "meaningEn": "weather",
    "sentence": "昨日の天気はどうでしたか。",
    "sentenceKana": "きのうのてんきはどうでしたか。",
    "sentenceId": "Bagaimana cuaca kemarin?",
    "distractors": [
      "でんき",
      "げんき",
      "きおん"
    ]
  },
  {
    "id": "k_081",
    "lesson": 12,
    "type": "kanji",
    "kanji": "先週",
    "kana": "せんしゅう",
    "romaji": "senshuu",
    "meaningId": "minggu lalu",
    "meaningEn": "last week",
    "sentence": "先週は忙しかったですか。",
    "sentenceKana": "せんしゅうはいそがしかったですか。",
    "sentenceId": "Apakah minggu lalu sibuk?",
    "distractors": [
      "こんしゅう",
      "らいしゅう",
      "せんげつ"
    ]
  },
  {
    "id": "k_082",
    "lesson": 12,
    "type": "kanji",
    "kanji": "海",
    "kana": "うみ",
    "romaji": "umi",
    "meaningId": "laut / pantai",
    "meaningEn": "sea / ocean",
    "sentence": "海のほうが好きです。",
    "sentenceKana": "うみのほうがすきです。",
    "sentenceId": "Saya lebih suka laut.",
    "distractors": [
      "やま",
      "かわ",
      "みず"
    ]
  },
  {
    "id": "k_083",
    "lesson": 12,
    "type": "kanji",
    "kanji": "山",
    "kana": "やま",
    "romaji": "yama",
    "meaningId": "gunung",
    "meaningEn": "mountain",
    "sentence": "ミラーさんは海と山とどちらが好きですか。",
    "sentenceKana": "ミラーさんはうみとやまとどちらがすきですか。",
    "sentenceId": "Bapak Miller lebih suka laut atau gunung?",
    "distractors": [
      "うみ",
      "かわ",
      "もり"
    ]
  },
  {
    "id": "k_084",
    "lesson": 12,
    "type": "kanji",
    "kanji": "天ぷら",
    "kana": "てんぷら",
    "romaji": "tenpura",
    "meaningId": "tempura (gorengan khas Jepang)",
    "meaningEn": "tempura",
    "sentence": "天ぷらが一番おいしかったです。",
    "sentenceKana": "てんぷらがいちばんおいしかったです。",
    "sentenceId": "Tempura yang paling enak.",
    "distractors": [
      "すし",
      "さしみ",
      "ラーメン"
    ]
  },
  {
    "id": "k_085",
    "lesson": 12,
    "type": "kanji",
    "kanji": "刺身",
    "kana": "さしみ",
    "romaji": "sashimi",
    "meaningId": "sashimi (irisan ikan segar)",
    "meaningEn": "sashimi",
    "sentence": "刺身や天ぷらや寿司を食べました。",
    "sentenceKana": "さしみやてんぷらやすしをたべました。",
    "sentenceId": "Saya makan sashimi, tempura, sushi, dan lain-lain.",
    "distractors": [
      "すし",
      "てんぷら",
      "やきにく"
    ]
  },
  {
    "id": "k_050",
    "lesson": 13,
    "type": "kanji",
    "kanji": "別々に",
    "kana": "べつべつに",
    "romaji": "betsubetsu ni",
    "meaningId": "secara terpisah / bayar sendiri-sendiri",
    "meaningEn": "separately",
    "sentence": "すみません。別々にお願いします。",
    "sentenceKana": "すみません。べつべつにおねがいします。",
    "sentenceId": "Permisi. Tolong bayarnya dipisah.",
    "distractors": [
      "いっしょに",
      "ひとつずつ",
      "べつに"
    ]
  },
  {
    "id": "k_051",
    "lesson": 13,
    "type": "kanji",
    "kanji": "定食",
    "kana": "ていしょく",
    "romaji": "teishoku",
    "meaningId": "paket makanan lengkap",
    "meaningEn": "set meal",
    "sentence": "天ぷら定食と牛丼ですね。",
    "sentenceKana": "てんぷらていしょくとぎゅうどんですね。",
    "sentenceId": "Paket tempura dan gyudon, ya.",
    "distractors": [
      "しょくじ",
      "りょうり",
      "てんぷら"
    ]
  },
  {
    "id": "k_052",
    "lesson": 13,
    "type": "kanji",
    "kanji": "子供",
    "kana": "こども",
    "romaji": "kodomo",
    "meaningId": "anak / anak-anak",
    "meaningEn": "child / children",
    "sentence": "駅まで子供を迎えに行きます。",
    "sentenceKana": "えきまでこどもをむかえにいきます。",
    "sentenceId": "Saya pergi menjemput anak sampai ke stasiun.",
    "distractors": [
      "おんなのこ",
      "おとこのこ",
      "かぞく"
    ]
  },
  {
    "id": "k_086",
    "lesson": 13,
    "type": "kanji",
    "kanji": "欲しい",
    "kana": "ほしい",
    "romaji": "hoshii",
    "meaningId": "ingin / mau (menginginkan benda)",
    "meaningEn": "want / desirable",
    "sentence": "今何が一番欲しいですか。",
    "sentenceKana": "いまなにがいちばんほしいですか。",
    "sentenceId": "Sekarang apa yang paling Anda inginkan?",
    "distractors": [
      "おいしい",
      "たのしい",
      "あたらしい"
    ]
  },
  {
    "id": "k_087",
    "lesson": 13,
    "type": "kanji",
    "kanji": "時間",
    "kana": "じかん",
    "romaji": "jikan",
    "meaningId": "waktu / jam",
    "meaningEn": "time",
    "sentence": "私は毎日忙しいですから、時間が欲しいです。",
    "sentenceKana": "わたしはまいにちいそがしいですから、じかんがほしいです。",
    "sentenceId": "Karena setiap hari saya sibuk, saya ingin waktu.",
    "distractors": [
      "とけい",
      "じき",
      "じぶん"
    ]
  },
  {
    "id": "k_088",
    "lesson": 13,
    "type": "kanji",
    "kanji": "夏休み",
    "kana": "なつやすみ",
    "romaji": "natsuyasumi",
    "meaningId": "liburan musim panas",
    "meaningEn": "summer vacation",
    "sentence": "山田さん、夏休みはどこか行きますか。",
    "sentenceKana": "やまださん、なつやすみはどこかいきますか。",
    "sentenceId": "Saudara Yamada, libur musim panas apakah pergi ke suatu tempat?",
    "distractors": [
      "ふゆやすみ",
      "ひるやすみ",
      "はるやすみ"
    ]
  },
  {
    "id": "k_089",
    "lesson": 13,
    "type": "kanji",
    "kanji": "牛丼",
    "kana": "ぎゅうどん",
    "romaji": "gyuudon",
    "meaningId": "gyudon (mangkuk nasi daging sapi)",
    "meaningEn": "beef rice bowl (gyudon)",
    "sentence": "私は牛丼。",
    "sentenceKana": "わたしはぎゅうどん。",
    "sentenceId": "Saya gyudon (nasi mangkuk daging sapi).",
    "distractors": [
      "かつどん",
      "てんどん",
      "うなぎ"
    ]
  },
  {
    "id": "k_090",
    "lesson": 13,
    "type": "kanji",
    "kanji": "切符",
    "kana": "きっぷ",
    "romaji": "kippu",
    "meaningId": "tiket (perjalanan / transportasi)",
    "meaningEn": "ticket",
    "sentence": "飛行機の切符をあなたにあげます。",
    "sentenceKana": "ひこうきのきっぷをあなたにあげます。",
    "sentenceId": "Saya berikan tiket pesawat untuk Anda.",
    "distractors": [
      "きって",
      "てがみ",
      "きそく"
    ]
  },
  {
    "id": "kt_012",
    "lesson": 13,
    "type": "katakana",
    "kanji": "パソコン",
    "kana": "パソコン",
    "romaji": "pasokon",
    "meaningId": "komputer laptop / PC pribadi",
    "meaningEn": "personal computer / laptop",
    "sentence": "新しいパソコンが欲しいです。",
    "sentenceKana": "あたらしいパソコンがほしいです。",
    "sentenceId": "Saya ingin komputer (laptop) baru.",
    "distractors": [
      "スマートフォン",
      "エアコン",
      "カメラ"
    ]
  },
  {
    "id": "kt_019",
    "lesson": 13,
    "type": "katakana",
    "kanji": "レストラン",
    "kana": "レストラン",
    "romaji": "resutoran",
    "meaningId": "restoran",
    "meaningEn": "restaurant",
    "sentence": "駅の前にいいレストランがあります。",
    "sentenceKana": "えきのまえにいいレストランがあります。",
    "sentenceId": "Di depan stasiun ada restoran yang bagus.",
    "distractors": [
      "ホテル",
      "カフェ",
      "スーパー"
    ]
  },
  {
    "id": "k_053",
    "lesson": 14,
    "type": "kanji",
    "kanji": "信号",
    "kana": "しんごう",
    "romaji": "shingou",
    "meaningId": "lampu lalu lintas",
    "meaningEn": "traffic lights",
    "sentence": "あの信号を右へ曲がってください。",
    "sentenceKana": "あのしんごうをみぎへまがってください。",
    "sentenceId": "Permisi. Tolong belok ke kanan di lampu lalu lintas itu.",
    "distractors": [
      "でんわ",
      "ばんごう",
      "みち"
    ]
  },
  {
    "id": "k_054",
    "lesson": 14,
    "type": "kanji",
    "kanji": "右",
    "kana": "みぎ",
    "romaji": "migi",
    "meaningId": "kanan",
    "meaningEn": "right",
    "sentence": "あの信号を右へ曲がってください。",
    "sentenceKana": "あのしんごうをみぎへまがってください。",
    "sentenceId": "Tolong belok ke kanan di lampu lalu lintas itu.",
    "distractors": [
      "ひだり",
      "まえ",
      "うしろ"
    ]
  },
  {
    "id": "k_055",
    "lesson": 14,
    "type": "kanji",
    "kanji": "お釣り",
    "kana": "おつり",
    "romaji": "otsuri",
    "meaningId": "uang kembalian",
    "meaningEn": "change (money)",
    "sentence": "3,200円のお釣りです。ありがとうございました。",
    "sentenceKana": "3,200えんのおつりです。ありがとうございました。",
    "sentenceId": "Kembaliannya 3.200 yen. Terima kasih banyak.",
    "distractors": [
      "おかね",
      "きっぷ",
      "おつかれ"
    ]
  },
  {
    "id": "k_056",
    "lesson": 14,
    "type": "kanji",
    "kanji": "住所",
    "kana": "じゅうしょ",
    "romaji": "juusho",
    "meaningId": "alamat rumah / tempat tinggal",
    "meaningEn": "address",
    "sentence": "あなたのうちの住所を書いてください。",
    "sentenceKana": "あなたのうちのじゅうしょをかいてください。",
    "sentenceId": "Tolong tuliskan alamat rumah Anda.",
    "distractors": [
      "じむしょ",
      "ばしょ",
      "なまえ"
    ]
  },
  {
    "id": "k_091",
    "lesson": 14,
    "type": "kanji",
    "kanji": "雨",
    "kana": "あめ",
    "romaji": "ame",
    "meaningId": "hujan",
    "meaningEn": "rain",
    "sentence": "今雨が降っていますか。",
    "sentenceKana": "いまあめがふっていますか。",
    "sentenceId": "Apakah sekarang sedang turun hujan?",
    "distractors": [
      "ゆき",
      "かぜ",
      "くも"
    ]
  },
  {
    "id": "k_092",
    "lesson": 14,
    "type": "kanji",
    "kanji": "降る",
    "kana": "ふる",
    "romaji": "furu",
    "meaningId": "turun (hujan / salju)",
    "meaningEn": "to fall (rain / snow)",
    "sentence": "今雨が降っていますか。",
    "sentenceKana": "いまあめがふっていますか。",
    "sentenceId": "Apakah sekarang sedang turun hujan?",
    "distractors": [
      "ふく",
      "ふるう",
      "ふるす"
    ]
  },
  {
    "id": "k_093",
    "lesson": 14,
    "type": "kanji",
    "kanji": "花屋",
    "kana": "はなや",
    "romaji": "hanaya",
    "meaningId": "toko bunga",
    "meaningEn": "flower shop",
    "sentence": "あの花屋の前で止めてください。",
    "sentenceKana": "あのはなやのまえでとめてください。",
    "sentenceId": "Tolong berhenti di depan toko bunga itu.",
    "distractors": [
      "ほんや",
      "さかなや",
      "にくや"
    ]
  },
  {
    "id": "k_094",
    "lesson": 14,
    "type": "kanji",
    "kanji": "止める",
    "kana": "とめる",
    "romaji": "tomeru",
    "meaningId": "menghentikan (kendaraan)",
    "meaningEn": "to stop / park",
    "sentence": "あの花屋の前で止めてください。",
    "sentenceKana": "あのはなやのまえでとめてください。",
    "sentenceId": "Tolong berhenti di depan toko bunga itu.",
    "distractors": [
      "のめる",
      "たてる",
      "あける"
    ]
  },
  {
    "id": "k_095",
    "lesson": 14,
    "type": "kanji",
    "kanji": "曲がる",
    "kana": "まがる",
    "romaji": "magaru",
    "meaningId": "berbelok",
    "meaningEn": "to turn",
    "sentence": "あの信号を右へ曲がってください。",
    "sentenceKana": "あのしんごうをみぎへまがってください。",
    "sentenceId": "Tolong belok ke kanan di lampu lalu lintas itu.",
    "distractors": [
      "あがる",
      "わたる",
      "おりる"
    ]
  },
  {
    "id": "kt_020",
    "lesson": 14,
    "type": "katakana",
    "kanji": "タクシー",
    "kana": "タクシー",
    "romaji": "takushii",
    "meaningId": "taksi",
    "meaningEn": "taxi",
    "sentence": "みどり町までお願いします。",
    "sentenceKana": "みどりちょうまでおねがいします。",
    "sentenceId": "Tolong antar sampai Midori-cho.",
    "distractors": [
      "バス",
      "電車",
      "地下鉄"
    ]
  },
  ...KANJI_VOCAB_15_25,
  ...KANJI_VOCAB_EXPANSION
];
