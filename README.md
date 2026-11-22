# きらきら日本語 (KiraKira Nihongo) — Japanese Reading Gym

Aplikasi web interaktif modern yang dirancang khusus untuk menguasai kemampuan **membaca Kana (Hiragana & Katakana) serta Kanji** langsung dari transkrip percakapan autentik **Minna no Nihongo (Bab 1 sampai Bab 14)**.

---

## 🎯 Fitur & Filosofi Utama

1. **Fokus Murni Membaca (Zero Writing Pressure)**:
   - Tidak ada tes menulis atau menggambar goresan kanji.
   - Melatih refleks visual otak dalam mengenali bentuk huruf, bacaan (*on'yomi/kun'yomi*), dan artinya dalam konteks kalimat.

2. **Bite-sized Learning: 10 Menit per Hari**:
   - Penghitung waktu mundur 10:00 dengan visual *circular timer ring*.
   - Target optimal 15–25 kartu kanji per sesi.
   - Peringatan istirahat sehat (*cooling down*) setelah 10 menit selesai untuk memaksimalkan konsolidasi memori jangka panjang (*long-term memory*).

3. **Spaced Repetition System (SRS) & Repetisi Cepat**:
   - Kartu yang salah dijawab akan langsung dimasukkan kembali ke antrean latihan berikutnya.
   - Algoritma interval pengulangan berjenjang: 1 hari &rarr; 3 hari &rarr; 7 hari &rarr; 14 hari.
   - Pelacakan kata-kata lemah (*weak items*) secara transparan.

4. **Transkrip Percakapan Lengkap (Bab 1 - 14)**:
   - Dilengkapi terjemahan Bahasa Indonesia yang selaras dengan audio transkrip.
   - **3 Mode Furigana**:
     - **Tampilkan Semua**: Furigana selalu aktif di atas kanji.
     - **Hover to Reveal**: Furigana disembunyikan/diburamkan dan baru muncul saat kursor diarahkan ke kanji (sangat efektif menguji ingatan).
     - **Tanpa Furigana**: Uji membaca kanji murni tanpa bantuan huruf furigana.
   - Pelafalan audio otomatis menggunakan browser Web Speech API (`ja-JP`) dan efek suara interaktif Web Audio API.

5. **Scorecard Harian & Mingguan (Visual Progress)**:
   - **Daily Scorecard**: Persentase target 10 menit, jumlah kartu terbaca, persentase akurasi, dan XP.
   - **Weekly Scorecard**: Grafik batang interaktif SVG 7 hari dengan indikator garis merah target 10 menit.
   - **SRS Retention Stack**: Visualisasi status penguasaan kosakata (*Mastered*, *Reviewing*, *Learning*, *Unlearned*).
   - **Ekspor/Impor Cadangan**: Progres belajar tersimpan di `localStorage` peramban dan dapat diekspor/diimpor sebagai berkas `.json`.

---

## 🚀 Cara Menjalankan Aplikasi

Pastikan **Node.js** telah terpasang di komputer Anda.

### Cara 1: Menggunakan Perintah Terminal / PowerShell
```powershell
cd c:\my-data\antigravproj\japanese
node server.js
```
Lalu buka browser Anda di alamat:
👉 **[http://localhost:3000](http://localhost:3000)**

### Cara 2: Klik Dua Kali di Windows
Cukup klik dua kali berkas **`start.bat`** di folder `c:\my-data\antigravproj\japanese`. Berkas ini akan otomatis menyalakan server dan membuka peramban web Anda.

---

## ⌨️ Pintasan Keyboard (Daily Drill)

Untuk latihan cepat tanpa menyentuh mouse:
- **`1`**, **`2`**, **`3`**, **`4`**: Memilih opsi jawaban bacaan.
- **`Spasi`**: Memutar suara kalimat konteks transkrip.
- **`R`**: Mengulang pelafalan audio huruf target.
- **`Enter`**: Melanjutkan ke soal berikutnya setelah menjawab.

---

## 📂 Struktur Berkas

```
c:\my-data\antigravproj\japanese\
│
├── index.html                   # Halaman utama aplikasi (Semantic HTML5)
├── style.css                    # Desain responsif, tema gelap/terang, Furigana CSS
├── server.js                    # Server HTTP statis Node.js ringan (zero-dependency)
├── start.bat                    # Skrip peluncur otomatis 1-klik di Windows
├── package.json                 # Konfigurasi npm
│
├── data/
│   ├── lessons-1-5.js           # Transkrip & fokus kanji Bab 1 s/d Bab 5
│   ├── lessons-6-10.js          # Transkrip & fokus kanji Bab 6 s/d Bab 10
│   ├── lessons-11-14.js         # Transkrip & fokus kanji Bab 11 s/d Bab 14
│   └── kanji-vocabulary.js      # Bank soal drill 56+ kanji & katakana pilihan
│
└── js/
    ├── app.js                   # Inisialisasi dan orkestrator aplikasi
    ├── audio.js                 # Sintesis suara Web Audio API & pelafalan ja-JP
    ├── drills.js                # Mesin drill 10 menit, timer, combo & keyboard
    ├── explorer.js              # Penampil transkrip, mode furigana, modal kanji
    ├── scorecard.js             # Grafik harian & mingguan SVG, SRS breakdown
    └── srs.js                   # Sistem kalkulasi repetisi berkala & streak
```
