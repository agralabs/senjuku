// Transcript Explorer & Dialogue Shadowing Component

import { LESSONS_1_5 } from '../data/lessons-1-5.js';
import { LESSONS_6_10 } from '../data/lessons-6-10.js';
import { LESSONS_11_14 } from '../data/lessons-11-14.js';
import { LESSONS_15_20 } from '../data/lessons-15-20.js';
import { LESSONS_21_25 } from '../data/lessons-21-25.js';
import { BOOK_LESSON_MAP, getSectionBookLabel } from '../data/book-mapping.js';
import { sound } from './audio.js';

export const ALL_LESSONS = [...LESSONS_1_5, ...LESSONS_6_10, ...LESSONS_11_14, ...LESSONS_15_20, ...LESSONS_21_25];

export class TranscriptExplorer {
  constructor() {
    this.currentLessonId = 1;
    this.furiganaMode = 'all'; // 'all', 'hover', 'none'
    this.showTranslations = true;
    this.showRomaji = true;
    this.searchQuery = '';
    this.autoPlayActive = false;
    this.currentPlayIndex = -1;
    this.playList = [];
    this.container = null;
  }

  init(containerElement) {
    window.transcriptExplorer = this;
    this.container = containerElement;
    this.render();
  }

  setFuriganaMode(mode) {
    this.furiganaMode = mode;
    if (this.container) {
      this.container.dataset.furigana = mode;
    }
  }

  setShowRomaji(show) {
    this.showRomaji = !!show;
    const rCheck = this.container?.querySelector('#toggleRomajiCheckbox');
    if (rCheck) rCheck.checked = this.showRomaji;
    document.body.classList.toggle('hide-romaji', !this.showRomaji);
  }

  setShowTranslations(show) {
    this.showTranslations = !!show;
    const tCheck = this.container?.querySelector('#toggleTransCheckbox');
    if (tCheck) tCheck.checked = this.showTranslations;
    document.body.classList.toggle('hide-translation', !this.showTranslations);
  }

  updateDisplayToggles(showRomaji, showTranslations) {
    this.showRomaji = !!showRomaji;
    this.showTranslations = !!showTranslations;
    const rCheck = this.container?.querySelector('#toggleRomajiCheckbox');
    if (rCheck) rCheck.checked = this.showRomaji;
    const tCheck = this.container?.querySelector('#toggleTransCheckbox');
    if (tCheck) tCheck.checked = this.showTranslations;
  }

  setLesson(lessonId) {
    this.currentLessonId = parseInt(lessonId, 10);
    this.stopAutoPlay();
    this.renderContent();
  }

  setSearchQuery(q) {
    this.searchQuery = (q || '').trim().toLowerCase();
    this.renderContent();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="explorer-layout">
        <aside class="explorer-sidebar">
          <div class="sidebar-header">
            <h3>Daftar Bab (Pelajaran)</h3>
            <span class="badge">Bab 1 - 25</span>
          </div>
          <div class="lesson-picker-list" id="lessonPickerList">
            ${ALL_LESSONS.map(l => `
              <button type="button" class="lesson-nav-btn ${l.id === this.currentLessonId ? 'active' : ''}" data-id="${l.id}">
                <span class="lesson-num">${l.lessonNum}</span>
                <span class="lesson-theme">${l.theme}</span>
              </button>
            `).join('')}
          </div>
        </aside>

        <section class="explorer-main">
          <div class="explorer-controls-bar">
            <div class="control-group">
              <label for="furiganaSelect">Furigana:</label>
              <select id="furiganaSelect" class="select-input">
                <option value="all">Tampilkan Semua (Selalu Terlihat)</option>
                <option value="hover">Sembunyikan (Muncul saat Disentuh/Hover)</option>
                <option value="none">Tanpa Furigana (Uji Membaca Kanji Murni)</option>
              </select>
            </div>

            <div class="control-group">
              <label class="switch-label" title="Tampilkan atau sembunyikan ejaan Romaji">
                <input type="checkbox" id="toggleRomajiCheckbox" ${this.showRomaji ? 'checked' : ''}>
                <span>🔤 Romaji</span>
              </label>
            </div>

            <div class="control-group">
              <label class="switch-label" title="Tampilkan atau sembunyikan terjemahan">
                <input type="checkbox" id="toggleTransCheckbox" ${this.showTranslations ? 'checked' : ''}>
                <span>🌐 Arti Terjemahan</span>
              </label>
            </div>

            <div class="control-group search-box">
              <input type="text" id="transcriptSearch" placeholder="Cari kata (Jepang / Indonesia)..." class="text-input" />
            </div>

            <div class="control-group actions-box">
              <button type="button" class="btn btn-secondary btn-sm" id="voiceSettingsToggleBtn" title="Atur & Tes Suara Pria / Wanita Jepang">
                <span>🎙️ Suara</span>
              </button>
              <button type="button" class="btn btn-secondary btn-sm" id="autoPlayBtn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Putar Otomatis (Shadowing)</span>
              </button>
            </div>
          </div>

          <div id="voiceSettingsPanel" class="voice-settings-panel" hidden></div>

          <div class="transcript-content-scroll" id="transcriptContent">
            <!-- Rendered dialogue content -->
          </div>
        </section>
      </div>

      <!-- Kanji Detail Popup Modal -->
      <dialog id="kanjiDetailModal" class="app-modal">
        <div class="modal-card">
          <div class="modal-header">
            <h3 id="modalKanjiChar" class="modal-large-kanji"></h3>
            <button type="button" class="modal-close" id="closeKanjiModalBtn">&times;</button>
          </div>
          <div class="modal-body" id="modalKanjiBody"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="modalSpeakBtn">Dengarkan Pengucapan</button>
          </div>
        </div>
      </dialog>
    `;

    this.bindEvents();
    this.renderContent();
  }

  bindEvents() {
    // Lesson nav buttons
    const navBtns = this.container.querySelectorAll('.lesson-nav-btn');
    navBtns.forEach(btn => {
      btn.onclick = () => {
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setLesson(btn.dataset.id);
      };
    });

    // Furigana select
    const fSelect = this.container.querySelector('#furiganaSelect');
    if (fSelect) {
      fSelect.onchange = (e) => this.setFuriganaMode(e.target.value);
    }

    // Toggle Romaji
    const rCheck = this.container.querySelector('#toggleRomajiCheckbox');
    if (rCheck) {
      rCheck.onchange = (e) => {
        if (window.japaneseApp) {
          window.japaneseApp.setReadingPreference('showRomaji', e.target.checked);
        } else {
          this.setShowRomaji(e.target.checked);
        }
      };
    }

    // Toggle translations
    const tCheck = this.container.querySelector('#toggleTransCheckbox');
    if (tCheck) {
      tCheck.onchange = (e) => {
        if (window.japaneseApp) {
          window.japaneseApp.setReadingPreference('showTranslation', e.target.checked);
        } else {
          this.setShowTranslations(e.target.checked);
        }
      };
    }

    // Search input
    const sInput = this.container.querySelector('#transcriptSearch');
    if (sInput) {
      sInput.oninput = (e) => this.setSearchQuery(e.target.value);
    }

    // Auto play / shadowing button
    const autoPlayBtn = this.container.querySelector('#autoPlayBtn');
    if (autoPlayBtn) {
      autoPlayBtn.onclick = () => this.toggleAutoPlay();
    }

    // Voice settings panel toggle
    const voiceBtn = this.container.querySelector('#voiceSettingsToggleBtn');
    const voicePanel = this.container.querySelector('#voiceSettingsPanel');
    if (voiceBtn && voicePanel) {
      voiceBtn.onclick = () => {
        voicePanel.hidden = !voicePanel.hidden;
        if (!voicePanel.hidden) this.renderVoiceSettingsPanel();
      };
    }

    // Modal close
    const modal = this.container.querySelector('#kanjiDetailModal');
    const closeBtn = this.container.querySelector('#closeKanjiModalBtn');
    if (closeBtn && modal) {
      closeBtn.onclick = () => modal.close();
    }
  }

  renderContent() {
    const contentArea = this.container.querySelector('#transcriptContent');
    if (!contentArea) return;

    const lesson = ALL_LESSONS.find(l => l.id === this.currentLessonId);
    if (!lesson) {
      contentArea.innerHTML = `<p class="empty-state">Pelajaran tidak ditemukan.</p>`;
      return;
    }

    let filterQuery = this.searchQuery;
    const bookMeta = BOOK_LESSON_MAP[lesson.id];
    const bookMapBarHtml = bookMeta ? `
      <div class="book-mapping-bar">
        <span class="book-map-chip">📘 <strong>Tracks ${bookMeta.tracks}</strong> (${bookMeta.trackCount} track)</span>
        <span class="book-map-chip">💬 会話: <strong>${bookMeta.conversation}</strong></span>
        <span class="book-map-chip">📝 問題 1番: <strong>${bookMeta.exercise1}</strong></span>
        <span class="book-map-chip">📚 Lainnya: <strong>${bookMeta.otherExercises}</strong></span>
      </div>
    ` : '';

    let html = `
      <div class="lesson-detail-header">
        <div class="lesson-meta">
          <span class="badge lesson-num-tag">${lesson.lessonNum} • Tracks ${bookMeta ? bookMeta.tracks : ''}</span>
          <h2 class="lesson-title-ja">${bookMeta ? `${lesson.lessonNum} ${bookMeta.titleJa}` : lesson.titleJa}</h2>
          <p class="lesson-title-id">${bookMeta ? `Pelajaran ${lesson.id}: ${bookMeta.titleId}` : lesson.titleId}</p>
          ${bookMapBarHtml}
        </div>
        <div class="lesson-kanji-chips">
          <span class="chips-label">Kanji Fokus Bab Ini (Klik untuk rincian):</span>
          <div class="chips-container">
            ${lesson.kanjiFocus.map(kf => `
              <button type="button" class="kanji-chip" data-char="${kf.char}" data-on="${kf.on}" data-kun="${kf.kun}" data-meaning="${kf.meaning}" data-words="${kf.words ? kf.words.join(', ') : ''}">
                <span class="chip-char">${kf.char}</span>
                <span class="chip-meaning">${kf.meaning.split('/')[0]}</span>
              </button>
            `).join('')}
          </div>
        </div>
        <div class="lesson-quick-actions">
          <button type="button" class="btn btn-primary btn-sm" id="btnExploreQuizThisLesson">
            <span>⚡ Kuis Bab Ini (15 Mnt)</span>
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="btnExploreLearnThisLesson">
            <span>💡 Flashcard Bab Ini</span>
          </button>
        </div>
      </div>

      <div class="dialogue-sections">
    `;

    this.playList = [];

    lesson.sections.forEach((sec, sIdx) => {
      let filteredDialogues = sec.dialogues;
      if (filterQuery) {
        filteredDialogues = filteredDialogues.filter(d => 
          d.text.toLowerCase().includes(filterQuery) ||
          d.translation.toLowerCase().includes(filterQuery) ||
          d.romaji.toLowerCase().includes(filterQuery)
        );
      }

      if (filteredDialogues.length === 0 && filterQuery) return;

      const bookLabel = getSectionBookLabel(lesson.id, sec.track);
      const trackNumClean = bookLabel?.trackNum || String(sec.track || '').replace(/^.*?(\d+)(?:\.mp3)?$/i, '$1');
      const bookBadgeHtml = bookLabel
        ? `<span class="book-cat-pill ${bookLabel.badgeClass}">🎧 Track ${bookLabel.trackNum} • ${bookLabel.category}</span>`
        : `<span class="audio-track-tag">🎧 Track ${trackNumClean}</span>`;

      html += `
        <div class="dialogue-section-card">
          <div class="section-card-header">
            <h4 class="section-title">
              ${bookBadgeHtml}
              ${sec.title}
            </h4>
          </div>
          <div class="dialogue-lines">
            ${filteredDialogues.map((dia, dIdx) => {
              const lineId = `line_${sIdx}_${dIdx}`;
              this.playList.push({ id: lineId, text: dia.text, speaker: dia.speaker });

              return `
                <div class="dialogue-bubble ${dia.speakerType}" id="${lineId}">
                  <div class="bubble-header">
                    <span class="speaker-name">${dia.speaker}</span>
                    <button type="button" class="play-line-btn" data-text="${dia.text}" data-speaker="${dia.speaker}" title="Dengarkan Baris Ini">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      <span>Dengarkan</span>
                    </button>
                  </div>
                  <div class="bubble-japanese furigana-text" data-furigana="${this.furiganaMode}">
                    ${dia.furigana}
                  </div>
                  <div class="bubble-romaji disp-romaji">${dia.romaji}</div>
                  <div class="bubble-translation disp-translation">${dia.translation}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });

    html += `</div>`;
    contentArea.innerHTML = html;

    // Attach play line events (passing speaker so Male/Female voice is selected)
    const playBtns = contentArea.querySelectorAll('.play-line-btn');
    playBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const text = btn.dataset.text;
        const speaker = btn.dataset.speaker || '';
        sound.speakJapanese(text, null, { speaker });
      };
    });

    // Attach kanji chips modal events
    const chips = contentArea.querySelectorAll('.kanji-chip');
    chips.forEach(chip => {
      chip.onclick = () => this.showKanjiDetail(chip.dataset);
    });

    // Attach quick drill / flashcard actions for this lesson
    const quizBtn = contentArea.querySelector('#btnExploreQuizThisLesson');
    if (quizBtn) {
      quizBtn.onclick = () => {
        window.japaneseApp?.selectSingleLesson(lesson.id, 'quiz');
      };
    }

    const learnBtn = contentArea.querySelector('#btnExploreLearnThisLesson');
    if (learnBtn) {
      learnBtn.onclick = () => {
        window.japaneseApp?.selectSingleLesson(lesson.id, 'learning');
      };
    }
  }

  showKanjiDetail(data) {
    const modal = this.container.querySelector('#kanjiDetailModal');
    const modalChar = this.container.querySelector('#modalKanjiChar');
    const modalBody = this.container.querySelector('#modalKanjiBody');
    const modalSpeak = this.container.querySelector('#modalSpeakBtn');

    if (!modal) return;

    modalChar.textContent = data.char;
    modalBody.innerHTML = `
      <div class="kanji-info-row">
        <strong>Arti (Indonesia):</strong> <span>${data.meaning}</span>
      </div>
      <div class="kanji-info-row">
        <strong>Onyomi (Kompak/Tionghoa):</strong> <code>${data.on}</code>
      </div>
      <div class="kanji-info-row">
        <strong>Kunyomi (Asli Jepang):</strong> <code>${data.kun}</code>
      </div>
      <div class="kanji-info-row">
        <strong>Contoh Kosakata di Transkrip:</strong>
        <p class="vocab-examples">${data.words}</p>
      </div>
    `;

    modalSpeak.onclick = () => sound.speakJapanese(data.char + '。' + data.words);
    modal.showModal();
  }

  toggleAutoPlay() {
    if (this.autoPlayActive) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  startAutoPlay() {
    if (this.playList.length === 0) return;
    this.autoPlayActive = true;
    this.currentPlayIndex = 0;

    const btn = this.container.querySelector('#autoPlayBtn');
    if (btn) {
      btn.classList.add('playing');
      btn.innerHTML = `<span>■ Berhenti Putar</span>`;
    }

    this.playNextInQueue();
  }

  renderVoiceSettingsPanel() {
    const panel = this.container?.querySelector('#voiceSettingsPanel');
    if (!panel || typeof sound.getVoiceDiagnostics !== 'function') return;
    const diag = sound.getVoiceDiagnostics();
    const voiceOptions = (selected) =>
      `<option value="">Otomatis (Rekomendasi)</option>` +
      diag.jaVoices.map(v => `<option value="${v.name.replace(/"/g, '&quot;')}" ${selected === v.name ? 'selected' : ''}>${v.name}</option>`).join('');

    const statusLine = diag.serverTts.enabled
      ? `✅ <strong>Suara Native Jepang Aktif:</strong> ${diag.serverTts.label} — Pria: <code>${diag.serverTts.maleVoice}</code>, Wanita: <code>${diag.serverTts.femaleVoice}</code>`
      : (diag.hasNativeMale
        ? `✅ <strong>Suara Pria Jepang Terdeteksi di Browser:</strong> <code>${diag.maleVoiceName}</code>`
        : `⚠️ <strong>Browser ini tidak memiliki suara pria Jepang bawaan</strong> (hanya ditemukan: ${diag.jaVoices.map(v => v.name).join(', ') || 'tidak ada suara ja-JP'}; Google Chrome <code>Google 日本語</code> mengabaikan perubahan pitch).<br>
           <strong>Cara mendapatkan suara Pria Jepang asli yang natural:</strong><br>
           1) <strong>Gratis &amp; Instan:</strong> Buka di <strong>Microsoft Edge</strong> (otomatis tersedia <code>Microsoft Keita Online (Natural)</code> pria Jepang asli + <code>Nanami</code> wanita).<br>
           2) <strong>Semua Browser (Chrome/HP/Cloud):</strong> Tambahkan <code>GOOGLE_TTS_API_KEY=...</code> di file <code>.env</code> (gratis 1 juta karakter/bulan — suara <code>ja-JP-Neural2-C</code> pria Tokyo asli) atau jalankan <strong>VOICEVOX</strong> lokal (<code>VOICEVOX_URL=http://127.0.0.1:50021</code>).`);

    panel.innerHTML = `
      <div class="voice-notice-box">${statusLine}</div>
      ${diag.serverTts.enabled ? '' : `
        <div class="voice-settings-row">
          <label for="voiceMaleSelect" style="font-size:0.82rem;font-weight:700;min-width:95px;">Suara Pria:</label>
          <select id="voiceMaleSelect" class="voice-settings-select">${voiceOptions(diag.prefs.male)}</select>
          <button type="button" class="btn btn-secondary btn-sm" id="btnTestMaleVoice">▶ Tes Pria</button>
        </div>
        <div class="voice-settings-row">
          <label for="voiceFemaleSelect" style="font-size:0.82rem;font-weight:700;min-width:95px;">Suara Wanita:</label>
          <select id="voiceFemaleSelect" class="voice-settings-select">${voiceOptions(diag.prefs.female)}</select>
          <button type="button" class="btn btn-secondary btn-sm" id="btnTestFemaleVoice">▶ Tes Wanita</button>
        </div>
      `}
      ${diag.serverTts.enabled ? `
        <div class="voice-settings-row">
          <button type="button" class="btn btn-secondary btn-sm" id="btnTestMaleVoice">▶ Tes Pria (Native JP)</button>
          <button type="button" class="btn btn-secondary btn-sm" id="btnTestFemaleVoice">▶ Tes Wanita (Native JP)</button>
        </div>
      ` : ''}
    `;

    const maleSel = panel.querySelector('#voiceMaleSelect');
    const femaleSel = panel.querySelector('#voiceFemaleSelect');
    if (maleSel) maleSel.onchange = () => sound.setPreferredVoices({ male: maleSel.value });
    if (femaleSel) femaleSel.onchange = () => sound.setPreferredVoices({ female: femaleSel.value });
    const testMale = panel.querySelector('#btnTestMaleVoice');
    const testFemale = panel.querySelector('#btnTestFemaleVoice');
    if (testMale) testMale.onclick = () => sound.speakJapanese('こんにちは、ミラーです。よろしくお願いします。', null, { gender: 'male' });
    if (testFemale) testFemale.onclick = () => sound.speakJapanese('はじめまして、木村です。どうぞよろしくお願いします。', null, { gender: 'female' });
  }

  stopAutoPlay() {
    this.autoPlayActive = false;
    sound.stopSpeech();

    // Remove active highlight
    const bubbles = this.container.querySelectorAll('.dialogue-bubble');
    bubbles.forEach(b => b.classList.remove('speaking-highlight'));

    const btn = this.container.querySelector('#autoPlayBtn');
    if (btn) {
      btn.classList.remove('playing');
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span>Putar Otomatis (Shadowing)</span>
      `;
    }
  }

  playNextInQueue() {
    if (!this.autoPlayActive) return;
    if (this.currentPlayIndex >= this.playList.length) {
      this.stopAutoPlay();
      return;
    }

    const item = this.playList[this.currentPlayIndex];
    const el = document.getElementById(item.id);

    // Highlight line
    const bubbles = this.container.querySelectorAll('.dialogue-bubble');
    bubbles.forEach(b => b.classList.remove('speaking-highlight'));
    if (el) {
      el.classList.add('speaking-highlight');
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    sound.speakJapanese(item.text, () => {
      if (!this.autoPlayActive) return;
      this.currentPlayIndex++;
      setTimeout(() => this.playNextInQueue(), 700); // 700ms breathing pause between speakers
    }, { speaker: item.speaker || '' });
  }
}

export const transcriptExplorer = new TranscriptExplorer();
