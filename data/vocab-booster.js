// Vocabulary Booster Bank — Audited & aligned with Minna no Nihongo I Transcripts (Bab 1–25)
// Option B applied: 101 items re-mapped to spoken Bab; 133 textbook-only items tagged "Textbook Extra".

import { VOCAB_BOOSTER_15_25 } from './bank-15-25.js';
import { VOCAB_BOOSTER_EXPANSION } from './bank-expansion.js';

export const VOCAB_BOOSTER_ITEMS = [
  // ==================== BAB 1: Perkenalkan ====================
  { id: 'vb_1_2', lesson: 1, kana: 'わたしたち', kanji: '私達', meaning: 'kami', sourceTag: 'Textbook Extra' },
  { id: 'vb_1_5', lesson: 1, kana: 'せんせい', kanji: '先生', meaning: 'guru, dosen', sourceTag: 'Transcript' },
  { id: 'vb_1_7', lesson: 1, kana: 'がくせい', kanji: '学生', meaning: 'mahasiswa, siswa', sourceTag: 'Transcript' },
  { id: 'vb_1_8', lesson: 1, kana: 'かいしゃいん', kanji: '会社員', meaning: 'pegawai perusahaan', sourceTag: 'Transcript' },
  { id: 'vb_1_10', lesson: 1, kana: 'いしゃ', kanji: '医者', meaning: 'dokter', sourceTag: 'Transcript' },
  { id: 'vb_1_11', lesson: 1, kana: 'けんきゅうしゃ', kanji: '研究者', meaning: 'peneliti', sourceTag: 'Transcript' },
  { id: 'vb_1_12', lesson: 1, kana: 'だいがく', kanji: '大学', meaning: 'universitas', sourceTag: 'Transcript' },
  { id: 'vb_1_14', lesson: 1, kana: 'でんき', kanji: '電気', meaning: 'listrik, lampu', sourceTag: 'Transcript' },
  { id: 'vb_1_15', lesson: 1, kana: 'エンジニア', kanji: '', meaning: 'insinyur', sourceTag: 'Textbook Extra' },
  { id: 'vb_3_9', lesson: 1, kana: 'かいしゃ', kanji: '会社', meaning: 'perusahaan', sourceTag: 'Transcript', originalLesson: 3 },
  { id: 'vb_15_7', lesson: 1, kana: 'けんきゅうします', kanji: '研究します', meaning: 'meneliti', sourceTag: 'Transcript', originalLesson: 15 },

  // ==================== BAB 2: Mulai sekarang saya mohon bantuannya ====================
  { id: 'vb_1_1', lesson: 2, kana: 'わたし', kanji: '私', meaning: 'saya', sourceTag: 'Transcript', originalLesson: 1 },
  { id: 'vb_2_2', lesson: 2, kana: 'じしょ', kanji: '辞書', meaning: 'kamus', sourceTag: 'Transcript' },
  { id: 'vb_2_3', lesson: 2, kana: 'ざっし', kanji: '雑誌', meaning: 'majalah', sourceTag: 'Transcript' },
  { id: 'vb_2_5', lesson: 2, kana: 'てちょう', kanji: '手帳', meaning: 'buku catatan saku', sourceTag: 'Transcript' },
  { id: 'vb_2_6', lesson: 2, kana: 'めいし', kanji: '名刺', meaning: 'kartu nama', sourceTag: 'Textbook Extra' },
  { id: 'vb_2_7', lesson: 2, kana: 'えんぴつ', kanji: '鉛筆', meaning: 'pensil', sourceTag: 'Textbook Extra' },
  { id: 'vb_2_10', lesson: 2, kana: 'じどうしゃ', kanji: '自動車', meaning: 'mobil', sourceTag: 'Textbook Extra' },
  { id: 'vb_2_11', lesson: 2, kana: 'つくえ', kanji: '机', meaning: 'meja tulis', sourceTag: 'Textbook Extra' },
  { id: 'vb_2_14', lesson: 2, kana: 'かぎ', kanji: '', meaning: 'kunci', sourceTag: 'Textbook Extra' },
  { id: 'vb_2_15', lesson: 2, kana: 'かばん', kanji: '', meaning: 'tas', sourceTag: 'Transcript' },
  { id: 'vb_2_16', lesson: 2, kana: 'いす', kanji: '', meaning: 'kursi', sourceTag: 'Textbook Extra' },

  // ==================== BAB 3: Tolong berikan saya yang ini ====================
  { id: 'vb_1_18', lesson: 3, kana: 'にほん', kanji: '日本', meaning: 'Jepang', sourceTag: 'Transcript', originalLesson: 1 },
  { id: 'vb_2_1', lesson: 3, kana: 'ほん', kanji: '本', meaning: 'buku', sourceTag: 'Transcript', originalLesson: 2 },
  { id: 'vb_2_8', lesson: 3, kana: 'とけい', kanji: '時計', meaning: 'jam, arloji', sourceTag: 'Transcript', originalLesson: 2 },
  { id: 'vb_3_1', lesson: 3, kana: 'きょうしつ', kanji: '教室', meaning: 'ruang kelas', sourceTag: 'Textbook Extra' },
  { id: 'vb_3_2', lesson: 3, kana: 'しょくどう', kanji: '食堂', meaning: 'ruang makan, kantin', sourceTag: 'Transcript' },
  { id: 'vb_3_3', lesson: 3, kana: 'じむしょ', kanji: '事務所', meaning: 'kantor', sourceTag: 'Transcript' },
  { id: 'vb_3_4', lesson: 3, kana: 'かいぎしつ', kanji: '会議室', meaning: 'ruang rapat', sourceTag: 'Transcript' },
  { id: 'vb_3_5', lesson: 3, kana: 'うけつけ', kanji: '受付', meaning: 'resepsionis, penerima tamu', sourceTag: 'Textbook Extra' },
  { id: 'vb_3_8', lesson: 3, kana: 'くに', kanji: '国', meaning: 'negeri, negara', sourceTag: 'Transcript' },
  { id: 'vb_3_12', lesson: 3, kana: 'うりば', kanji: '売り場', meaning: 'tempat penjualan', sourceTag: 'Transcript' },
  { id: 'vb_3_13', lesson: 3, kana: 'ちか', kanji: '地下', meaning: 'bawah tanah', sourceTag: 'Transcript' },
  { id: 'vb_3_15', lesson: 3, kana: 'ネクタイ', kanji: '', meaning: 'dasi', sourceTag: 'Textbook Extra' },
  { id: 'vb_15_6', lesson: 3, kana: 'うります', kanji: '売ります', meaning: 'menjual', sourceTag: 'Transcript', originalLesson: 15 },

  // ==================== BAB 4: Di sana buka sampai jam berapa? ====================
  { id: 'vb_1_6', lesson: 4, kana: 'きょうし', kanji: '教師', meaning: 'pengajar, instruktur', sourceTag: 'Transcript', originalLesson: 1 },
  { id: 'vb_3_10', lesson: 4, kana: 'でんわ', kanji: '電話', meaning: 'telepon', sourceTag: 'Transcript', originalLesson: 3 },
  { id: 'vb_4_1', lesson: 4, kana: 'おきます', kanji: '起きます', meaning: 'bangun tidur', sourceTag: 'Transcript' },
  { id: 'vb_4_2', lesson: 4, kana: 'ねます', kanji: '寝ます', meaning: 'tidur', sourceTag: 'Textbook Extra' },
  { id: 'vb_4_3', lesson: 4, kana: 'はたらきます', kanji: '働きます', meaning: 'bekerja', sourceTag: 'Transcript' },
  { id: 'vb_4_4', lesson: 4, kana: 'やすみます', kanji: '休みます', meaning: 'beristirahat, libur', sourceTag: 'Transcript' },
  { id: 'vb_4_5', lesson: 4, kana: 'べんきょうします', kanji: '勉強します', meaning: 'belajar', sourceTag: 'Transcript' },
  { id: 'vb_4_6', lesson: 4, kana: 'おわります', kanji: '終わります', meaning: 'selesai', sourceTag: 'Transcript' },
  { id: 'vb_4_7', lesson: 4, kana: 'ぎんこう', kanji: '銀行', meaning: 'bank', sourceTag: 'Transcript' },
  { id: 'vb_4_9', lesson: 4, kana: 'としょかん', kanji: '図書館', meaning: 'perpustakaan', sourceTag: 'Transcript' },
  { id: 'vb_4_11', lesson: 4, kana: 'ごぜん', kanji: '午前', meaning: 'pagi (a.m.)', sourceTag: 'Transcript' },
  { id: 'vb_4_13', lesson: 4, kana: 'ひるやすみ', kanji: '昼休み', meaning: 'istirahat siang', sourceTag: 'Textbook Extra' },
  { id: 'vb_4_14', lesson: 4, kana: 'まいにち', kanji: '毎日', meaning: 'setiap hari', sourceTag: 'Transcript' },
  { id: 'vb_4_15', lesson: 4, kana: 'ばんごう', kanji: '番号', meaning: 'nomor', sourceTag: 'Transcript' },
  { id: 'vb_8_11', lesson: 4, kana: 'やすい', kanji: '安い', meaning: 'murah', sourceTag: 'Transcript', originalLesson: 8 },
  { id: 'vb_20_9', lesson: 4, kana: 'おわり', kanji: '終わり', meaning: 'akhir / selesai', sourceTag: 'Transcript', originalLesson: 20 },

  // ==================== BAB 5: Apakah kereta ini pergi ke Koshien? ====================
  { id: 'vb_1_16', lesson: 5, kana: 'かんこく', kanji: '韓国', meaning: 'Korea', sourceTag: 'Transcript', originalLesson: 1 },
  { id: 'vb_5_1', lesson: 5, kana: 'いきます', kanji: '行きます', meaning: 'pergi', sourceTag: 'Transcript' },
  { id: 'vb_5_2', lesson: 5, kana: 'きます', kanji: '来ます', meaning: 'datang', sourceTag: 'Transcript' },
  { id: 'vb_5_8', lesson: 5, kana: 'でんしゃ', kanji: '電車', meaning: 'kereta api listrik', sourceTag: 'Transcript' },
  { id: 'vb_5_10', lesson: 5, kana: 'しんかんせん', kanji: '新幹線', meaning: 'kereta super cepat (Shinkansen)', sourceTag: 'Textbook Extra' },
  { id: 'vb_5_14', lesson: 5, kana: 'たんじょうび', kanji: '誕生日', meaning: 'hari ulang tahun', sourceTag: 'Transcript' },
  { id: 'vb_5_15', lesson: 5, kana: 'らいねん', kanji: '来年', meaning: 'tahun depan', sourceTag: 'Textbook Extra' },
  { id: 'vb_17_4', lesson: 5, kana: 'いたい', kanji: '痛い', meaning: 'sakit / nyeri', sourceTag: 'Transcript', originalLesson: 17 },

  // ==================== BAB 6: Maukah pergi bersama-sama? ====================
  { id: 'vb_2_4', lesson: 6, kana: 'しんぶん', kanji: '新聞', meaning: 'surat kabar, koran', sourceTag: 'Transcript', originalLesson: 2 },
  { id: 'vb_4_12', lesson: 6, kana: 'ごご', kanji: '午後', meaning: 'sore / siang (p.m.)', sourceTag: 'Transcript', originalLesson: 4 },
  { id: 'vb_5_5', lesson: 6, kana: 'えき', kanji: '駅', meaning: 'stasiun kereta', sourceTag: 'Transcript', originalLesson: 5 },
  { id: 'vb_5_12', lesson: 6, kana: 'ともだち', kanji: '友達', meaning: 'teman, kawan', sourceTag: 'Transcript', originalLesson: 5 },
  { id: 'vb_6_1', lesson: 6, kana: 'たべます', kanji: '食べます', meaning: 'makan', sourceTag: 'Transcript' },
  { id: 'vb_6_2', lesson: 6, kana: 'のみます', kanji: '飲みます', meaning: 'minum', sourceTag: 'Transcript' },
  { id: 'vb_6_3', lesson: 6, kana: 'みます', kanji: '見ます', meaning: 'melihat, menonton', sourceTag: 'Transcript' },
  { id: 'vb_6_4', lesson: 6, kana: 'ききます', kanji: '聞きます', meaning: 'mendengar', sourceTag: 'Textbook Extra' },
  { id: 'vb_6_5', lesson: 6, kana: 'よみます', kanji: '読みます', meaning: 'membaca', sourceTag: 'Transcript' },
  { id: 'vb_6_6', lesson: 6, kana: 'かきます', kanji: '書きます', meaning: 'menulis, menggambar', sourceTag: 'Textbook Extra' },
  { id: 'vb_6_7', lesson: 6, kana: 'かいます', kanji: '買います', meaning: 'membeli', sourceTag: 'Transcript' },
  { id: 'vb_6_8', lesson: 6, kana: 'たまご', kanji: '卵', meaning: 'telur', sourceTag: 'Transcript' },
  { id: 'vb_6_9', lesson: 6, kana: 'にく', kanji: '肉', meaning: 'daging', sourceTag: 'Textbook Extra' },
  { id: 'vb_6_10', lesson: 6, kana: 'さかな', kanji: '魚', meaning: 'ikan', sourceTag: 'Textbook Extra' },
  { id: 'vb_6_13', lesson: 6, kana: 'えいが', kanji: '映画', meaning: 'film', sourceTag: 'Transcript' },
  { id: 'vb_6_15', lesson: 6, kana: 'しゅくだい', kanji: '宿題', meaning: 'pekerjaan rumah (PR)', sourceTag: 'Textbook Extra' },
  { id: 'vb_7_8', lesson: 6, kana: 'はな', kanji: '花', meaning: 'bunga', sourceTag: 'Transcript', originalLesson: 7 },
  { id: 'vb_8_7', lesson: 6, kana: 'あたらしい', kanji: '新しい', meaning: 'baru', sourceTag: 'Transcript', originalLesson: 8 },
  { id: 'vb_12_3', lesson: 6, kana: 'とおい', kanji: '遠い', meaning: 'jauh', sourceTag: 'Transcript', originalLesson: 12 },

  // ==================== BAB 7: Selamat datang ====================
  { id: 'vb_2_13', lesson: 7, kana: 'にほんご', kanji: '日本語', meaning: 'bahasa Jepang', sourceTag: 'Transcript', originalLesson: 2 },
  { id: 'vb_7_1', lesson: 7, kana: 'きります', kanji: '切ります', meaning: 'memotong, menggunting', sourceTag: 'Textbook Extra' },
  { id: 'vb_7_2', lesson: 7, kana: 'おくります', kanji: '送ります', meaning: 'mengirim', sourceTag: 'Transcript' },
  { id: 'vb_7_4', lesson: 7, kana: 'かります', kanji: '借ります', meaning: 'meminjam', sourceTag: 'Transcript' },
  { id: 'vb_7_9', lesson: 7, kana: 'にもつ', kanji: '荷物', meaning: 'barang, bagasi', sourceTag: 'Textbook Extra' },
  { id: 'vb_7_13', lesson: 7, kana: 'おみやげ', kanji: 'お土産', meaning: 'oleh-oleh, tanda mata', sourceTag: 'Transcript' },
  { id: 'vb_7_15', lesson: 7, kana: 'はさみ', kanji: '', meaning: 'gunting', sourceTag: 'Textbook Extra' },
  { id: 'vb_24_4', lesson: 7, kana: 'おくります', kanji: '送ります', meaning: 'mengantar / mengirim', sourceTag: 'Transcript', originalLesson: 24 },
  { id: 'vb_25_7', lesson: 7, kana: 'おく', kanji: '億', meaning: 'seratus juta', sourceTag: 'Transcript', originalLesson: 25 },

  // ==================== BAB 8: Sudah waktunya saya permisi pulang ====================
  { id: 'vb_5_13', lesson: 8, kana: 'かぞく', kanji: '家族', meaning: 'keluarga', sourceTag: 'Transcript', originalLesson: 5 },
  { id: 'vb_8_1', lesson: 8, kana: 'しずか', kanji: '静か', meaning: 'tenang, sunyi', sourceTag: 'Transcript' },
  { id: 'vb_8_3', lesson: 8, kana: 'しんせつ', kanji: '親切', meaning: 'ramah, baik hati', sourceTag: 'Textbook Extra' },
  { id: 'vb_8_6', lesson: 8, kana: 'ちいさい', kanji: '小さい', meaning: 'kecil', sourceTag: 'Textbook Extra' },
  { id: 'vb_8_8', lesson: 8, kana: 'ふるい', kanji: '古い', meaning: 'lama, kuno', sourceTag: 'Textbook Extra' },
  { id: 'vb_8_10', lesson: 8, kana: 'たかい', kanji: '高い', meaning: 'mahal, tinggi', sourceTag: 'Transcript' },
  { id: 'vb_8_12', lesson: 8, kana: 'いそがしい', kanji: '忙しい', meaning: 'sibuk', sourceTag: 'Transcript' },
  { id: 'vb_8_13', lesson: 8, kana: 'たのしい', kanji: '楽しい', meaning: 'menyenangkan', sourceTag: 'Transcript' },
  { id: 'vb_8_14', lesson: 8, kana: 'たべもの', kanji: '食べ物', meaning: 'makanan', sourceTag: 'Transcript' },
  { id: 'vb_8_15', lesson: 8, kana: 'せいかつ', kanji: '生活', meaning: 'kehidupan', sourceTag: 'Transcript' },
  { id: 'vb_19_11', lesson: 8, kana: 'おちゃ', kanji: 'お茶', meaning: 'teh / upacara teh', sourceTag: 'Transcript', originalLesson: 19 },

  // ==================== BAB 9: Sayang sekali, tapi... ====================
  { id: 'vb_7_3', lesson: 9, kana: 'かします', kanji: '貸します', meaning: 'meminjamkan', sourceTag: 'Transcript', originalLesson: 7 },
  { id: 'vb_7_6', lesson: 9, kana: 'ならいます', kanji: '習います', meaning: 'belajar (dari orang)', sourceTag: 'Transcript', originalLesson: 7 },
  { id: 'vb_8_9', lesson: 9, kana: 'むずかしい', kanji: '難しい', meaning: 'sulit, sukar', sourceTag: 'Transcript', originalLesson: 8 },
  { id: 'vb_9_1', lesson: 9, kana: 'すき', kanji: '好き', meaning: 'suka, gemar', sourceTag: 'Transcript' },
  { id: 'vb_9_2', lesson: 9, kana: 'きらい', kanji: '嫌い', meaning: 'tidak suka', sourceTag: 'Textbook Extra' },
  { id: 'vb_9_3', lesson: 9, kana: 'じょうず', kanji: '上手', meaning: 'pandai, mahir', sourceTag: 'Transcript' },
  { id: 'vb_9_4', lesson: 9, kana: 'へた', kanji: '下手', meaning: 'tidak mahir', sourceTag: 'Textbook Extra' },
  { id: 'vb_9_5', lesson: 9, kana: 'りょうり', kanji: '料理', meaning: 'masakan', sourceTag: 'Transcript' },
  { id: 'vb_9_7', lesson: 9, kana: 'やきゅう', kanji: '野球', meaning: 'bisbol', sourceTag: 'Textbook Extra' },
  { id: 'vb_9_8', lesson: 9, kana: 'おんがく', kanji: '音楽', meaning: 'musik', sourceTag: 'Textbook Extra' },
  { id: 'vb_9_9', lesson: 9, kana: 'うた', kanji: '歌', meaning: 'lagu, nyanyian', sourceTag: 'Transcript' },
  { id: 'vb_9_10', lesson: 9, kana: 'かんじ', kanji: '漢字', meaning: 'huruf kanji', sourceTag: 'Transcript' },
  { id: 'vb_9_13', lesson: 9, kana: 'やくそく', kanji: '約束', meaning: 'janji', sourceTag: 'Transcript' },
  { id: 'vb_9_15', lesson: 9, kana: 'スポーツ', kanji: '', meaning: 'olahraga', sourceTag: 'Transcript' },
  { id: 'vb_16_9', lesson: 9, kana: 'わかい', kanji: '若い', meaning: 'muda', sourceTag: 'Transcript', originalLesson: 16 },

  // ==================== BAB 10: Apakah ada kecap ikan (nam pla)? ====================
  { id: 'vb_3_7', lesson: 10, kana: 'かいだん', kanji: '階段', meaning: 'tangga', sourceTag: 'Transcript', originalLesson: 3 },
  { id: 'vb_3_14', lesson: 10, kana: 'おてあらい', kanji: 'お手洗い', meaning: 'toilet, kamar kecil', sourceTag: 'Transcript', originalLesson: 3 },
  { id: 'vb_10_3', lesson: 10, kana: 'いぬ', kanji: '犬', meaning: 'anjing', sourceTag: 'Transcript' },
  { id: 'vb_10_4', lesson: 10, kana: 'ねこ', kanji: '猫', meaning: 'kucing', sourceTag: 'Textbook Extra' },
  { id: 'vb_10_5', lesson: 10, kana: 'でんち', kanji: '電池', meaning: 'baterai', sourceTag: 'Textbook Extra' },
  { id: 'vb_10_7', lesson: 10, kana: 'れいぞうこ', kanji: '冷蔵庫', meaning: 'kulkas, lemari es', sourceTag: 'Textbook Extra' },
  { id: 'vb_10_8', lesson: 10, kana: 'まど', kanji: '窓', meaning: 'jendela', sourceTag: 'Transcript' },
  { id: 'vb_10_11', lesson: 10, kana: 'ほんや', kanji: '本屋', meaning: 'toko buku', sourceTag: 'Textbook Extra' },
  { id: 'vb_10_12', lesson: 10, kana: 'のりば', kanji: '乗り場', meaning: 'tempat naik kendaraan', sourceTag: 'Textbook Extra' },
  { id: 'vb_10_14', lesson: 10, kana: 'ちかく', kanji: '近く', meaning: 'dekat', sourceTag: 'Transcript' },
  { id: 'vb_12_2', lesson: 10, kana: 'ちかい', kanji: '近い', meaning: 'dekat', sourceTag: 'Transcript', originalLesson: 12 },

  // ==================== BAB 11: Tolong kirim yang ini ====================
  { id: 'vb_3_6', lesson: 11, kana: 'へや', kanji: '部屋', meaning: 'kamar', sourceTag: 'Transcript', originalLesson: 3 },
  { id: 'vb_3_11', lesson: 11, kana: 'くつ', kanji: '靴', meaning: 'sepatu', sourceTag: 'Transcript', originalLesson: 3 },
  { id: 'vb_4_8', lesson: 11, kana: 'ゆうびんきょく', kanji: '郵便局', meaning: 'kantor pos', sourceTag: 'Transcript', originalLesson: 4 },
  { id: 'vb_5_6', lesson: 11, kana: 'ひこうき', kanji: '飛行機', meaning: 'pesawat terbang', sourceTag: 'Transcript', originalLesson: 5 },
  { id: 'vb_5_7', lesson: 11, kana: 'ふね', kanji: '船', meaning: 'kapal laut', sourceTag: 'Transcript', originalLesson: 5 },
  { id: 'vb_6_14', lesson: 11, kana: 'てがみ', kanji: '手紙', meaning: 'surat', sourceTag: 'Transcript', originalLesson: 6 },
  { id: 'vb_7_7', lesson: 11, kana: 'かみ', kanji: '紙', meaning: 'kertas', sourceTag: 'Transcript', originalLesson: 7 },
  { id: 'vb_9_11', lesson: 11, kana: 'じかん', kanji: '時間', meaning: 'waktu', sourceTag: 'Transcript', originalLesson: 9 },
  { id: 'vb_10_15', lesson: 11, kana: 'あいだ', kanji: '間', meaning: 'antara', sourceTag: 'Transcript', originalLesson: 10 },
  { id: 'vb_11_1', lesson: 11, kana: 'ひとつ', kanji: '一つ', meaning: 'satu (buah)', sourceTag: 'Textbook Extra' },
  { id: 'vb_11_2', lesson: 11, kana: 'ふたつ', kanji: '二つ', meaning: 'dua (buah)', sourceTag: 'Textbook Extra' },
  { id: 'vb_11_3', lesson: 11, kana: 'みっつ', kanji: '三つ', meaning: 'tiga (buah)', sourceTag: 'Textbook Extra' },
  { id: 'vb_11_4', lesson: 11, kana: 'きって', kanji: '切手', meaning: 'perangko', sourceTag: 'Transcript' },
  { id: 'vb_11_5', lesson: 11, kana: 'ふうとう', kanji: '封筒', meaning: 'amplop', sourceTag: 'Textbook Extra' },
  { id: 'vb_11_6', lesson: 11, kana: 'そくたつ', kanji: '速達', meaning: 'surat kilat', sourceTag: 'Textbook Extra' },
  { id: 'vb_11_7', lesson: 11, kana: 'かきとめ', kanji: '書留', meaning: 'surat tercatat', sourceTag: 'Textbook Extra' },
  { id: 'vb_11_8', lesson: 11, kana: 'こうくうびん', kanji: '航空便', meaning: 'pos udara', sourceTag: 'Transcript' },
  { id: 'vb_11_9', lesson: 11, kana: 'ふなびん', kanji: '船便', meaning: 'pos laut', sourceTag: 'Transcript' },
  { id: 'vb_11_11', lesson: 11, kana: 'きょうだい', kanji: '兄弟', meaning: 'saudara kandung', sourceTag: 'Textbook Extra' },
  { id: 'vb_11_13', lesson: 11, kana: 'ぜんぶで', kanji: '全部で', meaning: 'semuanya', sourceTag: 'Transcript' },
  { id: 'vb_11_14', lesson: 11, kana: 'はがき', kanji: '', meaning: 'kartu pos', sourceTag: 'Textbook Extra' },
  { id: 'vb_12_13', lesson: 11, kana: 'てんき', kanji: '天気', meaning: 'cuaca', sourceTag: 'Transcript', originalLesson: 12 },

  // ==================== BAB 12: Bagaimana Festival Gion? ====================
  { id: 'vb_2_9', lesson: 12, kana: 'かさ', kanji: '傘', meaning: 'payung', sourceTag: 'Transcript', originalLesson: 2 },
  { id: 'vb_5_3', lesson: 12, kana: 'かえります', kanji: '帰ります', meaning: 'pulang, kembali', sourceTag: 'Transcript', originalLesson: 5 },
  { id: 'vb_8_2', lesson: 12, kana: 'ゆうめい', kanji: '有名', meaning: 'terkenal', sourceTag: 'Transcript', originalLesson: 8 },
  { id: 'vb_8_5', lesson: 12, kana: 'おおきい', kanji: '大きい', meaning: 'besar', sourceTag: 'Transcript', originalLesson: 8 },
  { id: 'vb_12_5', lesson: 12, kana: 'おそい', kanji: '遅い', meaning: 'lambat', sourceTag: 'Textbook Extra' },
  { id: 'vb_12_6', lesson: 12, kana: 'あたたかい', kanji: '暖かい', meaning: 'hangat', sourceTag: 'Textbook Extra' },
  { id: 'vb_12_7', lesson: 12, kana: 'すずしい', kanji: '涼しい', meaning: 'sejuk', sourceTag: 'Textbook Extra' },
  { id: 'vb_12_9', lesson: 12, kana: 'からい', kanji: '辛い', meaning: 'pedas', sourceTag: 'Transcript' },
  { id: 'vb_12_10', lesson: 12, kana: 'おもい', kanji: '重い', meaning: 'berat', sourceTag: 'Transcript' },
  { id: 'vb_12_12', lesson: 12, kana: 'きせつ', kanji: '季節', meaning: 'musim', sourceTag: 'Textbook Extra' },
  { id: 'vb_12_15', lesson: 12, kana: 'せかい', kanji: '世界', meaning: 'dunia', sourceTag: 'Textbook Extra' },
  { id: 'vb_17_8', lesson: 12, kana: 'かえします', kanji: '返します', meaning: 'mengembalikan', sourceTag: 'Transcript', originalLesson: 17 },

  // ==================== BAB 13: Tolong bayarnya dipisah ====================
  { id: 'vb_13_2', lesson: 13, kana: 'およぎます', kanji: '泳ぎます', meaning: 'berenang', sourceTag: 'Textbook Extra' },
  { id: 'vb_13_3', lesson: 13, kana: 'むかえます', kanji: '迎えます', meaning: 'menjemput', sourceTag: 'Transcript' },
  { id: 'vb_13_5', lesson: 13, kana: 'けっこんします', kanji: '結婚します', meaning: 'menikah', sourceTag: 'Textbook Extra' },
  { id: 'vb_13_6', lesson: 13, kana: 'かいものします', kanji: '買い物します', meaning: 'berbelanja', sourceTag: 'Textbook Extra' },
  { id: 'vb_13_8', lesson: 13, kana: 'さんぽします', kanji: '散歩します', meaning: 'berjalan-jalan', sourceTag: 'Textbook Extra' },
  { id: 'vb_13_10', lesson: 13, kana: 'せまい', kanji: '狭い', meaning: 'sempit', sourceTag: 'Textbook Extra' },
  { id: 'vb_13_12', lesson: 13, kana: 'はくぶつかん', kanji: '博物館', meaning: 'museum', sourceTag: 'Textbook Extra' },
  { id: 'vb_13_13', lesson: 13, kana: 'どうぶつえん', kanji: '動物園', meaning: 'kebun binatang', sourceTag: 'Textbook Extra' },
  { id: 'vb_13_14', lesson: 13, kana: 'しやくしょ', kanji: '市役所', meaning: 'kantor balai kota', sourceTag: 'Textbook Extra' },
  { id: 'vb_13_15', lesson: 13, kana: 'ちゅうしゃじょう', kanji: '駐車場', meaning: 'tempat parkir', sourceTag: 'Textbook Extra' },
  { id: 'vb_14_4', lesson: 13, kana: 'まちます', kanji: '待ちます', meaning: 'menunggu', sourceTag: 'Transcript', originalLesson: 14 },

  // ==================== BAB 14: Tolong antar sampai Midori-cho ====================
  { id: 'vb_14_2', lesson: 14, kana: 'しめます', kanji: '閉めます', meaning: 'menutup', sourceTag: 'Textbook Extra' },
  { id: 'vb_14_3', lesson: 14, kana: 'いそぎます', kanji: '急ぎます', meaning: 'buru-buru', sourceTag: 'Textbook Extra' },
  { id: 'vb_14_6', lesson: 14, kana: 'よびます', kanji: '呼びます', meaning: 'memanggil', sourceTag: 'Textbook Extra' },
  { id: 'vb_14_7', lesson: 14, kana: 'はなします', kanji: '話します', meaning: 'berbicara', sourceTag: 'Transcript' },
  { id: 'vb_14_8', lesson: 14, kana: 'とめます', kanji: '止めます', meaning: 'menghentikan, memarkir', sourceTag: 'Transcript' },
  { id: 'vb_14_9', lesson: 14, kana: 'まがります', kanji: '曲がります', meaning: 'belok', sourceTag: 'Textbook Extra' },
  { id: 'vb_14_10', lesson: 14, kana: 'じゅうしょ', kanji: '住所', meaning: 'alamat', sourceTag: 'Transcript' },
  { id: 'vb_14_11', lesson: 14, kana: 'ちず', kanji: '地図', meaning: 'peta', sourceTag: 'Textbook Extra' },
  { id: 'vb_14_12', lesson: 14, kana: 'しお', kanji: '塩', meaning: 'garam', sourceTag: 'Textbook Extra' },
  { id: 'vb_14_13', lesson: 14, kana: 'さとう', kanji: '砂糖', meaning: 'gula', sourceTag: 'Textbook Extra' },
  { id: 'vb_14_14', lesson: 14, kana: 'しんごう', kanji: '信号', meaning: 'lampu lalu lintas', sourceTag: 'Transcript' },
  { id: 'vb_14_15', lesson: 14, kana: 'いりぐち', kanji: '入口', meaning: 'pintu masuk', sourceTag: 'Textbook Extra' },
  { id: 'vb_14_16', lesson: 14, kana: 'でぐち', kanji: '出口', meaning: 'pintu keluar', sourceTag: 'Textbook Extra' },
  { id: 'vb_23_5', lesson: 14, kana: 'しんごう', kanji: '信号', meaning: 'lampu lalu lintas', sourceTag: 'Transcript', originalLesson: 23 },
  ...VOCAB_BOOSTER_15_25,
  ...VOCAB_BOOSTER_EXPANSION
];

/**
 * Generates an 8-question byte of 3-pair Vocabulary Booster questions for either 'kana' or 'kanji' script.
 * Each question contains 3 unique words (Indonesian on left, shuffled Kana or Kanji on right).
 */
export function buildVocabBoosterQuestions(selectedLessons, scriptType = 'kana', byteSize = 8) {
  const isAll = !selectedLessons || selectedLessons.length === 0 || selectedLessons.includes('all');
  const lessonNums = isAll ? null : selectedLessons.map(n => parseInt(n, 10)).filter(n => !isNaN(n));

  let pool = VOCAB_BOOSTER_ITEMS.filter(it => {
    if (scriptType === 'kanji' && !it.kanji) return false;
    if (lessonNums && lessonNums.length > 0 && !lessonNums.includes(it.lesson)) return false;
    return true;
  });

  if (pool.length < 3) {
    pool = VOCAB_BOOSTER_ITEMS.filter(it => scriptType === 'kanji' ? !!it.kanji : true);
  }

  const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const questions = [];
  let rolling = shuffle(pool);

  for (let q = 0; q < byteSize; q++) {
    if (rolling.length < 3) {
      rolling = [...rolling, ...shuffle(pool)];
    }

    // Pick 3 distinct items (avoid duplicate meanings or duplicate target text in the same trio)
    const trio = [];
    const usedIds = new Set();
    const usedTargets = new Set();
    const usedMeanings = new Set();

    for (let i = 0; i < rolling.length && trio.length < 3; i++) {
      const candidate = rolling[i];
      const targetText = scriptType === 'kanji' ? candidate.kanji : candidate.kana;
      if (!usedIds.has(candidate.id) && !usedTargets.has(targetText) && !usedMeanings.has(candidate.meaning)) {
        usedIds.add(candidate.id);
        usedTargets.add(targetText);
        usedMeanings.add(candidate.meaning);
        trio.push(candidate);
      }
    }

    // Remove chosen items from front of rolling pool so next question draws fresh words
    rolling = rolling.filter(it => !usedIds.has(it.id));

    // Create shuffled right-side array, guaranteed NOT to have any card starting already matched (strict derangement)!
    let rightOrder = shuffle(trio);
    let attempts = 0;
    while (rightOrder.some((r, idx) => r.id === trio[idx].id) && attempts < 25) {
      rightOrder = shuffle(trio);
      attempts++;
    }
    // If random sampling didn't hit a derangement after 25 tries, apply canonical rotation derangement
    if (rightOrder.some((r, idx) => r.id === trio[idx].id) && trio.length >= 2) {
      if (trio.length === 3) {
        rightOrder = [trio[1], trio[2], trio[0]];
      } else if (trio.length === 2) {
        rightOrder = [trio[1], trio[0]];
      }
    }

    questions.push({
      id: `vboost_${scriptType}_${q}_${trio.map(t => t.id).join('_')}`,
      lesson: trio[0].lesson,
      scriptType, // 'kana' or 'kanji'
      leftItems: trio.map(item => ({
        id: item.id,
        lesson: item.lesson,
        meaning: item.meaning,
        kana: item.kana,
        kanji: item.kanji,
        target: scriptType === 'kanji' ? item.kanji : item.kana,
        sourceTag: item.sourceTag || 'Transcript',
        originalLesson: item.originalLesson || null
      })),
      initialRightItems: rightOrder.map(item => ({
        id: item.id,
        lesson: item.lesson,
        meaning: item.meaning,
        kana: item.kana,
        kanji: item.kanji,
        target: scriptType === 'kanji' ? item.kanji : item.kana,
        sourceTag: item.sourceTag || 'Transcript',
        originalLesson: item.originalLesson || null
      }))
    });
  }

  // Presentation order shuffle for Vocab Booster questions in the session byte
  return shuffle(questions);
}
