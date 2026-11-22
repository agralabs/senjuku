// KiraKira Nihongo - Main Application Orchestrator

import { drillEngine } from './drills.js';
import { transcriptExplorer } from './explorer.js';
import { scorecardView } from './scorecard.js';
import { aiAdvisorView } from './ai-advisor.js';
import { weaknessView } from './weakness.js';
import { kanaCompanion } from './kana-companion.js';
import { authUI } from './auth-ui.js';
import {
  showLockedLessonPopup,
  showLessonClearStars,
  showBlockUnlockCelebration,
  notifyAchievementEmail
} from './progression.js';
import { progress, TOTAL_LESSONS } from './srs.js';
import { sound } from './audio.js';
import { MASTER_DRILL_ITEMS } from '../data/kanji-vocabulary.js';
import { CLOZE_SENTENCE_ITEMS } from '../data/cloze-sentences.js';
import { SENTENCE_ROMAJI_ITEMS } from '../data/sentence-romaji.js';

export class JapaneseApp {
  constructor() {
    this.currentTab = 'drill';
    this.currentSessionType = null; // null until user picks 'quiz' or 'learning' (cascading menu)
    this.activeSessionType = null;  // active running drill session type ('quiz' or 'learning')
    this.currentInputFormat = null; // reset whenever Step 1 changes; 'mcq', 'typing', or 'booster'
    this.learningTypingSubtype = null; // 'word' or 'sentence' when Learning Mode -> Typing is selected
    this.learningBoosterSubtype = null; // 'kana' or 'kanji' when Learning Mode -> Vocab Booster is selected
    this.isClozeActive = false;
    this.displayTogglesAllowed = false;
    this.dom = {};
  }

  init() {
    window.japaneseApp = this;
    this.cacheDom();
    this.applyTheme();
    this.initReadingPreferences();
    this.bindEvents();
    this.initLessonTiles();
    this.initComponents();
    this.updateHeaderStats();
    this.syncDisplayTogglesForContext();
  }

  cacheDom() {
    this.dom = {
      navTabs: document.querySelectorAll('.nav-tab-btn'),
      tabPanels: document.querySelectorAll('.tab-panel'),
      // Header stats
      headerHomeBtn: document.getElementById('headerHomeBtn'),
      streakDisplay: document.getElementById('headerStreakCount'),
      levelDisplay: document.getElementById('headerLevelDisplay'),
      soundToggleBtn: document.getElementById('soundToggleBtn'),
      themeToggleBtn: document.getElementById('themeToggleBtn'),
      speechRateSelect: document.getElementById('speechRateSelect'),

      // Reading Display Toggles (Global, HUD)
      headerDisplayToggleGroup: document.getElementById('headerDisplayToggleGroup'),
      drillDisplayBar: document.getElementById('drillDisplayBar'),
      headerToggleRomajiBtn: document.getElementById('headerToggleRomajiBtn'),
      headerToggleTransBtn: document.getElementById('headerToggleTransBtn'),
      drillHudToggleRomajiBtn: document.getElementById('drillHudToggleRomajiBtn'),
      drillHudToggleTransBtn: document.getElementById('drillHudToggleTransBtn'),
      setupToggleRomajiCheckbox: document.getElementById('setupToggleRomajiCheckbox'),
      setupToggleTransCheckbox: document.getElementById('setupToggleTransCheckbox'),

      // Drill / Learning elements
      drillSetupCard: document.getElementById('drillSetupCard'),
      drillActiveArea: document.getElementById('drillActiveArea'),
      btnTypeQuiz: document.getElementById('btnTypeQuiz'),
      btnTypeLearning: document.getElementById('btnTypeLearning'),
      formatToggleContainer: document.getElementById('formatToggleContainer'),
      formatPillsGrid: document.getElementById('formatPillsGrid'),
      btnFormatMcq: document.getElementById('btnFormatMcq'),
      btnFormatTyping: document.getElementById('btnFormatTyping'),
      btnFormatBooster: document.getElementById('btnFormatBooster'),
      learningTypingSubContainer: document.getElementById('learningTypingSubContainer'),
      btnLearnTypingWord: document.getElementById('btnLearnTypingWord'),
      btnLearnTypingSentence: document.getElementById('btnLearnTypingSentence'),
      learningBoosterSubContainer: document.getElementById('learningBoosterSubContainer'),
      btnLearnBoosterKana: document.getElementById('btnLearnBoosterKana'),
      btnLearnBoosterKanji: document.getElementById('btnLearnBoosterKanji'),
      quizSubconfigBox: document.getElementById('quizSubconfigBox'),
      quizCategoryCardsGrid: document.getElementById('quizCategoryCardsGrid'),
      drillModeSelect: document.getElementById('drillModeSelect'),
      selectedLessonsCount: document.getElementById('selectedLessonsCount'),
      lessonsSelectionWrapper: document.getElementById('lessonsSelectionWrapper'),
      presetBtns: document.querySelectorAll('.preset-btn'),
      lessonDropdown: document.getElementById('lessonDropdown'),
      lessonDropdownTrigger: document.getElementById('lessonDropdownTrigger'),
      lessonDropdownText: document.getElementById('lessonDropdownText'),
      lessonDropdownMenu: document.getElementById('lessonDropdownMenu'),
      selectedLessonsTagCloud: document.getElementById('selectedLessonsTagCloud'),
      startDrillBtn: document.getElementById('startDrillBtn'),
      startBtnLabel: document.getElementById('startBtnLabel'),
      startBoosterKanaBtn: document.getElementById('startBoosterKanaBtn'),
      startBoosterKanjiBtn: document.getElementById('startBoosterKanjiBtn'),
      startSentenceRomajiBtn: document.getElementById('startSentenceRomajiBtn'),
      startClozeDrillBtn: document.getElementById('startClozeDrillBtn'),
      startWeaknessDrillBtn: document.getElementById('startWeaknessDrillBtn'),
      startLearningModeBtn: document.getElementById('startLearningModeBtn'),
      startTypingDrillBtn: document.getElementById('startTypingDrillBtn'),
      typingBtnLabel: document.getElementById('typingBtnLabel'),
      startKatakanaDrillBtn: document.getElementById('startKatakanaDrillBtn'),

      // Active arena HUD & cards
      cardContainer: document.getElementById('drillCardContainer'),
      timerDisplay: document.getElementById('drillTimerText'),
      timerRing: document.getElementById('drillTimerRingBar'),
      pauseDrillBtn: document.getElementById('pauseDrillBtn'),
      finishDrillBtn: document.getElementById('finishDrillBtn'),
      comboDisplay: document.getElementById('drillComboText'),
      xpDisplay: document.getElementById('drillXpText'),
      progressCount: document.getElementById('drillQuestionNum'),

      // Session Wrap-up Modal
      sessionCompleteModal: document.getElementById('sessionCompleteModal'),
      sessionDurationLabel: document.getElementById('sessionDurationLabel'),
      sessionDurationResult: document.getElementById('sessionDurationResult'),
      sessionCardsLabel: document.getElementById('sessionCardsLabel'),
      sessionCardsResult: document.getElementById('sessionCardsResult'),
      sessionCoverageSummary: document.getElementById('sessionCoverageSummary'),
      sessionScoreLabel: document.getElementById('sessionScoreLabel'),
      sessionAccuracyResult: document.getElementById('sessionAccuracyResult'),
      sessionXpResult: document.getElementById('sessionXpResult'),
      closeSessionModalBtn: document.getElementById('closeSessionModalBtn'),
      viewScorecardFromModalBtn: document.getElementById('viewScorecardFromModalBtn'),

      // Containers
      explorerContainer: document.getElementById('explorerContainer'),
      aiAdvisorContainer: document.getElementById('aiAdvisorContainer'),
      scorecardContainer: document.getElementById('scorecardContainer'),
      weaknessContainer: document.getElementById('weaknessContainer')
    };
  }

  bindEvents() {
    // Top-left Home button -> cleanly return to main home screen
    if (this.dom.headerHomeBtn) {
      this.dom.headerHomeBtn.addEventListener('click', () => this.goHome());
    }

    // Nav tab switching
    this.dom.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        this.switchTab(targetTab);
      });
    });

    // Sound toggle
    if (this.dom.soundToggleBtn) {
      this.dom.soundToggleBtn.addEventListener('click', () => {
        const isMuted = sound.isMuted();
        sound.setMuted(!isMuted);
        this.dom.soundToggleBtn.classList.toggle('muted', !isMuted);
        this.dom.soundToggleBtn.title = !isMuted ? "Suara Dimatikan" : "Suara Aktif";
        this.dom.soundToggleBtn.querySelector('.sound-label').textContent = !isMuted ? "Muted" : "Sound On";
      });
    }

    // Speech rate select
    if (this.dom.speechRateSelect) {
      this.dom.speechRateSelect.addEventListener('change', (e) => {
        sound.setSpeechRate(parseFloat(e.target.value));
      });
    }

    // Theme toggle (properly toggles both light-theme & dark-theme classes)
    if (this.dom.themeToggleBtn) {
      this.dom.themeToggleBtn.addEventListener('click', () => {
        const nextIsLight = !document.body.classList.contains('light-theme');
        localStorage.setItem('kirakira_theme', nextIsLight ? 'light' : 'dark');
        this.applyTheme();
      });
    }

    // Session Type Switching (Quiz Mode vs Learning Mode)
    if (this.dom.btnTypeQuiz && this.dom.btnTypeLearning) {
      this.dom.btnTypeQuiz.addEventListener('click', () => this.setSessionType('quiz'));
      this.dom.btnTypeLearning.addEventListener('click', () => this.setSessionType('learning'));
    }

    // Input Format Switching (MCQ vs Typing vs Vocab Booster)
    if (this.dom.btnFormatMcq && this.dom.btnFormatTyping) {
      this.dom.btnFormatMcq.addEventListener('click', () => this.setInputFormat('mcq'));
      this.dom.btnFormatTyping.addEventListener('click', () => this.setInputFormat('typing'));
    }
    if (this.dom.btnFormatBooster) {
      this.dom.btnFormatBooster.addEventListener('click', () => this.setInputFormat('booster'));
    }

    // Learning Mode -> Latihan Ketik Santai Sub-Options (Word Typing vs Full Sentence Typing)
    if (this.dom.btnLearnTypingWord && this.dom.btnLearnTypingSentence) {
      this.dom.btnLearnTypingWord.addEventListener('click', () => this.setLearningTypingSubtype('word'));
      this.dom.btnLearnTypingSentence.addEventListener('click', () => this.setLearningTypingSubtype('sentence'));
    }

    // Learning Mode -> Vocab Booster Sub-Options (Kana vs Kanji)
    if (this.dom.btnLearnBoosterKana && this.dom.btnLearnBoosterKanji) {
      this.dom.btnLearnBoosterKana.addEventListener('click', () => this.setLearningBoosterSubtype('kana'));
      this.dom.btnLearnBoosterKanji.addEventListener('click', () => this.setLearningBoosterSubtype('kanji'));
    }

    // Quiz Mode -> Compact Kategori Materi Small Cards
    if (this.dom.quizCategoryCardsGrid) {
      this.dom.quizCategoryCardsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.quiz-cat-card');
        if (!card) return;
        this.selectQuizCategory(card.dataset.mode, card.dataset.format || 'mcq');
      });
    }

    // Lesson multi-select preset filter buttons
    this.dom.presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.dataset.preset;
        this.applyLessonPreset(preset);
      });
    });

    // Start Drill / Quiz Trigger (requires minimum 1 Bab selected)
    if (this.dom.startDrillBtn) {
      this.dom.startDrillBtn.addEventListener('click', () => {
        const selected = this.getSelectedLessons();
        if (selected.length === 0) {
          this.promptLessonSelection();
          return;
        }
        if (!this.currentSessionType) {
          this.setSessionType('quiz');
        }
        let mode = this.dom.drillModeSelect?.value || 'kanji_match';
        if (this.currentSessionType === 'learning') {
          if (this.currentInputFormat === 'booster') {
            mode = (this.learningBoosterSubtype === 'kanji') ? 'vocab_booster_kanji' : 'vocab_booster_kana';
          } else if (this.currentInputFormat === 'typing' && this.learningTypingSubtype === 'sentence') {
            mode = 'sentence_romaji';
          } else {
            mode = 'kanji_match';
          }
        }
        this.launchDrill(this.currentSessionType, mode, selected, this.currentInputFormat);
      });
    }

    // Direct Typing Mode Drill Button
    if (this.dom.startTypingDrillBtn) {
      this.dom.startTypingDrillBtn.addEventListener('click', () => {
        const selected = this.getSelectedLessons();
        if (selected.length === 0) {
          this.promptLessonSelection();
          return;
        }
        if (!this.currentSessionType) {
          this.setSessionType('quiz');
        }
        this.setInputFormat('typing');
        const mode = this.dom.drillModeSelect?.value || 'kanji_match';
        this.launchDrill(this.currentSessionType, mode, selected, 'typing');
      });
    }

    // Secondary / Learning Mode Button
    if (this.dom.startLearningModeBtn) {
      this.dom.startLearningModeBtn.addEventListener('click', () => {
        if (this.currentSessionType === 'learning') {
          this.setSessionType('quiz');
        } else {
          const selected = this.getSelectedLessons();
          if (selected.length === 0) {
            this.promptLessonSelection();
            return;
          }
          this.setSessionType('learning');
          this.launchDrill('learning', 'kanji_match', selected);
        }
      });
    }

    // Special Katakana Blitz Drill Button
    if (this.dom.startKatakanaDrillBtn) {
      this.dom.startKatakanaDrillBtn.addEventListener('click', () => {
        const selected = this.getSelectedLessons();
        if (selected.length === 0) {
          this.promptLessonSelection();
          return;
        }
        this.setSessionType('quiz');
        if (this.dom.drillModeSelect) this.dom.drillModeSelect.value = 'katakana_blitz';
        this.launchDrill('quiz', 'katakana_blitz', selected, this.currentInputFormat);
      });
    }

    // Vocab Booster Quick Launch Buttons (Kana & Kanji separately)
    if (this.dom.startBoosterKanaBtn) {
      this.dom.startBoosterKanaBtn.addEventListener('click', () => {
        const selected = this.getSelectedLessons();
        if (selected.length === 0) {
          this.promptLessonSelection();
          return;
        }
        if (this.dom.drillModeSelect) this.dom.drillModeSelect.value = 'vocab_booster_kana';
        this.launchDrill(this.currentSessionType || 'quiz', 'vocab_booster_kana', selected, 'booster');
      });
    }

    if (this.dom.startBoosterKanjiBtn) {
      this.dom.startBoosterKanjiBtn.addEventListener('click', () => {
        const selected = this.getSelectedLessons();
        if (selected.length === 0) {
          this.promptLessonSelection();
          return;
        }
        if (this.dom.drillModeSelect) this.dom.drillModeSelect.value = 'vocab_booster_kanji';
        this.launchDrill(this.currentSessionType || 'quiz', 'vocab_booster_kanji', selected, 'booster');
      });
    }

    // Full-Sentence Romaji Typing (Audio List • 30s/45s countdown) Button
    if (this.dom.startSentenceRomajiBtn) {
      this.dom.startSentenceRomajiBtn.addEventListener('click', () => {
        const selected = this.getSelectedLessons();
        if (selected.length === 0) {
          this.promptLessonSelection();
          return;
        }
        if (this.dom.drillModeSelect) this.dom.drillModeSelect.value = 'sentence_romaji';
        this.launchDrill(this.currentSessionType || 'quiz', 'sentence_romaji', selected, 'typing');
      });
    }

    // Hardest Mode: Cloze Sentence (Isi Kalimat Rumpang) Button
    if (this.dom.startClozeDrillBtn) {
      this.dom.startClozeDrillBtn.addEventListener('click', () => {
        const selected = this.getSelectedLessons();
        if (selected.length === 0) {
          this.promptLessonSelection();
          return;
        }
        if (this.dom.drillModeSelect) this.dom.drillModeSelect.value = 'sentence_cloze';
        this.launchDrill(this.currentSessionType || 'quiz', 'sentence_cloze', selected, 'mcq');
      });
    }

    // Weakness Repetition Drill Button (runs on selected lessons, or all weak words if none selected)
    if (this.dom.startWeaknessDrillBtn) {
      this.dom.startWeaknessDrillBtn.addEventListener('click', () => {
        const selected = this.getSelectedLessons();
        if (this.dom.drillModeSelect) this.dom.drillModeSelect.value = 'weakness_focus';
        this.launchDrill(this.currentSessionType || 'quiz', 'weakness_focus', selected.length > 0 ? selected : ['all'], 'mcq');
      });
    }

    // Drill control buttons
    if (this.dom.pauseDrillBtn) {
      this.dom.pauseDrillBtn.addEventListener('click', () => {
        const paused = drillEngine.togglePause();
        this.dom.pauseDrillBtn.innerHTML = paused ? 
          `<span>▶ Lanjut</span>` : 
          `<span>⏸ Jeda</span>`;
      });
    }

    if (this.dom.finishDrillBtn) {
      this.dom.finishDrillBtn.addEventListener('click', () => {
        if (confirm("Akhiri sesi sekarang? Soal yang belum dijawab akan dihitung sebagai salah.")) {
          drillEngine.finishSession();
        }
      });
    }

    // Session Modal actions
    if (this.dom.closeSessionModalBtn) {
      this.dom.closeSessionModalBtn.addEventListener('click', () => {
        this.dom.sessionCompleteModal.close();
        this.resetDrillArea();
      });
    }

    if (this.dom.viewScorecardFromModalBtn) {
      this.dom.viewScorecardFromModalBtn.addEventListener('click', () => {
        this.dom.sessionCompleteModal.close();
        this.resetDrillArea();
        this.switchTab('scorecard');
      });
    }

    // Reading Display Toggles: Header buttons
    if (this.dom.headerToggleRomajiBtn) {
      this.dom.headerToggleRomajiBtn.addEventListener('click', () => {
        this.toggleReadingPreference('showRomaji');
      });
    }
    if (this.dom.headerToggleTransBtn) {
      this.dom.headerToggleTransBtn.addEventListener('click', () => {
        this.toggleReadingPreference('showTranslation');
      });
    }

    // Reading Display Toggles: In-Drill HUD buttons
    if (this.dom.drillHudToggleRomajiBtn) {
      this.dom.drillHudToggleRomajiBtn.addEventListener('click', () => {
        this.toggleReadingPreference('showRomaji');
      });
    }
    if (this.dom.drillHudToggleTransBtn) {
      this.dom.drillHudToggleTransBtn.addEventListener('click', () => {
        this.toggleReadingPreference('showTranslation');
      });
    }

    // Reading Display Toggles: Setup checkboxes
    if (this.dom.setupToggleRomajiCheckbox) {
      this.dom.setupToggleRomajiCheckbox.addEventListener('change', (e) => {
        this.setReadingPreference('showRomaji', e.target.checked);
      });
    }
    if (this.dom.setupToggleTransCheckbox) {
      this.dom.setupToggleTransCheckbox.addEventListener('change', (e) => {
        this.setReadingPreference('showTranslation', e.target.checked);
      });
    }

    // Global keyboard shortcuts (M = Romaji, T = Terjemahan/Arti)
    window.addEventListener('keydown', (e) => {
      if (!this.displayTogglesAllowed) return; // Disabled in Quiz Mode & Kalimat Rumpang
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      if (e.key === 'm' || e.key === 'M') {
        this.toggleReadingPreference('showRomaji');
      } else if (e.key === 't' || e.key === 'T') {
        this.toggleReadingPreference('showTranslation');
      }
    });
  }

  /* =========================================================
     READING PREFERENCES (ROMAJI & TRANSLATION VISIBILITY)
     ========================================================= */
  initReadingPreferences() {
    let prefs = { showRomaji: true, showTranslation: true };
    const saved = localStorage.getItem('kirakira_reading_prefs');
    if (saved) {
      try {
        prefs = { ...prefs, ...JSON.parse(saved) };
      } catch (e) {
        console.warn('Failed to parse reading preferences:', e);
      }
    }
    this.readingPrefs = prefs;
    this.applyReadingPreferences();
  }

  setReadingPreference(key, val) {
    if (!this.readingPrefs) {
      this.readingPrefs = { showRomaji: true, showTranslation: true };
    }
    this.readingPrefs[key] = !!val;
    localStorage.setItem('kirakira_reading_prefs', JSON.stringify(this.readingPrefs));
    this.applyReadingPreferences();
  }

  toggleReadingPreference(key) {
    if (!this.readingPrefs) {
      this.readingPrefs = { showRomaji: true, showTranslation: true };
    }
    this.setReadingPreference(key, !this.readingPrefs[key]);
  }

  applyReadingPreferences() {
    if (!this.readingPrefs) return;
    const showRomaji = !!this.readingPrefs.showRomaji;
    const showTrans = !!this.readingPrefs.showTranslation;

    document.body.classList.toggle('hide-romaji', !showRomaji);
    document.body.classList.toggle('hide-translation', !showTrans);

    // Update Header buttons
    this.updateToggleBtnUI(this.dom.headerToggleRomajiBtn, showRomaji);
    this.updateToggleBtnUI(this.dom.headerToggleTransBtn, showTrans);

    // Update In-Drill HUD buttons
    this.updateToggleBtnUI(this.dom.drillHudToggleRomajiBtn, showRomaji);
    this.updateToggleBtnUI(this.dom.drillHudToggleTransBtn, showTrans);

    // Update Setup checkboxes
    if (this.dom.setupToggleRomajiCheckbox) {
      this.dom.setupToggleRomajiCheckbox.checked = showRomaji;
    }
    if (this.dom.setupToggleTransCheckbox) {
      this.dom.setupToggleTransCheckbox.checked = showTrans;
    }

    // Update Explorer controls if initialized
    if (window.transcriptExplorer && typeof window.transcriptExplorer.updateDisplayToggles === 'function') {
      window.transcriptExplorer.updateDisplayToggles(showRomaji, showTrans);
    }
  }

  updateToggleBtnUI(btn, isActive) {
    if (!btn) return;
    btn.classList.toggle('active', isActive);
    btn.classList.toggle('off', !isActive);
    const badge = btn.querySelector('.toggle-badge, .state-txt, strong');
    if (badge) {
      badge.textContent = isActive ? 'ON' : 'OFF';
    }
  }

  setInputFormat(format) {
    if (format === 'booster') {
      this.currentInputFormat = 'booster';
    } else if (format === 'typing') {
      this.currentInputFormat = 'typing';
    } else {
      this.currentInputFormat = 'mcq';
    }

    const isMcq = (this.currentInputFormat === 'mcq');
    const isTyping = (this.currentInputFormat === 'typing');
    const isBooster = (this.currentInputFormat === 'booster');

    if (this.dom.btnFormatMcq) this.dom.btnFormatMcq.classList.toggle('active', isMcq);
    if (this.dom.btnFormatTyping) this.dom.btnFormatTyping.classList.toggle('active', isTyping);
    if (this.dom.btnFormatBooster) this.dom.btnFormatBooster.classList.toggle('active', isBooster);

    // Show Step 2b (Word Typing vs Full Sentence Typing) ONLY for Learning Mode -> Latihan Ketik Santai
    const showLearningTypingSub = (this.currentSessionType === 'learning' && isTyping);
    if (this.dom.learningTypingSubContainer) {
      this.dom.learningTypingSubContainer.hidden = !showLearningTypingSub;
    }
    if (!showLearningTypingSub) {
      this.learningTypingSubtype = null;
      if (this.dom.btnLearnTypingWord) this.dom.btnLearnTypingWord.classList.remove('active');
      if (this.dom.btnLearnTypingSentence) this.dom.btnLearnTypingSentence.classList.remove('active');
    }

    // Show Step 2c (Vocab Booster Kana vs Kanji) ONLY for Learning Mode -> Vocab Booster
    const showLearningBoosterSub = (this.currentSessionType === 'learning' && isBooster);
    if (this.dom.learningBoosterSubContainer) {
      this.dom.learningBoosterSubContainer.hidden = !showLearningBoosterSub;
    }
    if (!showLearningBoosterSub) {
      this.learningBoosterSubtype = null;
      if (this.dom.btnLearnBoosterKana) this.dom.btnLearnBoosterKana.classList.remove('active');
      if (this.dom.btnLearnBoosterKanji) this.dom.btnLearnBoosterKanji.classList.remove('active');
    }

    this.updateStartButtonLabels();
  }

  setLearningTypingSubtype(subtype) {
    this.learningTypingSubtype = subtype === 'sentence' ? 'sentence' : 'word';
    const isSentence = (this.learningTypingSubtype === 'sentence');
    if (this.dom.btnLearnTypingWord) this.dom.btnLearnTypingWord.classList.toggle('active', !isSentence);
    if (this.dom.btnLearnTypingSentence) this.dom.btnLearnTypingSentence.classList.toggle('active', isSentence);
  }

  setLearningBoosterSubtype(subtype) {
    this.learningBoosterSubtype = subtype === 'kanji' ? 'kanji' : 'kana';
    const isKanji = (this.learningBoosterSubtype === 'kanji');
    if (this.dom.btnLearnBoosterKana) this.dom.btnLearnBoosterKana.classList.toggle('active', !isKanji);
    if (this.dom.btnLearnBoosterKanji) this.dom.btnLearnBoosterKanji.classList.toggle('active', isKanji);
  }

  resetInputFormat() {
    this.currentInputFormat = null;
    this.learningTypingSubtype = null;
    this.learningBoosterSubtype = null;
    if (this.dom.btnFormatMcq) this.dom.btnFormatMcq.classList.remove('active');
    if (this.dom.btnFormatTyping) this.dom.btnFormatTyping.classList.remove('active');
    if (this.dom.btnFormatBooster) this.dom.btnFormatBooster.classList.remove('active');
    if (this.dom.learningTypingSubContainer) this.dom.learningTypingSubContainer.hidden = true;
    if (this.dom.btnLearnTypingWord) this.dom.btnLearnTypingWord.classList.remove('active');
    if (this.dom.btnLearnTypingSentence) this.dom.btnLearnTypingSentence.classList.remove('active');
    if (this.dom.learningBoosterSubContainer) this.dom.learningBoosterSubContainer.hidden = true;
    if (this.dom.btnLearnBoosterKana) this.dom.btnLearnBoosterKana.classList.remove('active');
    if (this.dom.btnLearnBoosterKanji) this.dom.btnLearnBoosterKanji.classList.remove('active');
  }

  selectQuizCategory(mode, format = 'mcq') {
    if (this.dom.drillModeSelect && mode) {
      this.dom.drillModeSelect.value = mode;
    }
    this.currentInputFormat = format || 'mcq';

    if (this.dom.quizCategoryCardsGrid) {
      const cards = this.dom.quizCategoryCardsGrid.querySelectorAll('.quiz-cat-card');
      cards.forEach(card => {
        const isMatch = card.dataset.mode === mode && (card.dataset.format || 'mcq') === this.currentInputFormat;
        card.classList.toggle('active', isMatch);
        card.setAttribute('aria-checked', isMatch ? 'true' : 'false');
      });
    }

    this.updateStartButtonLabels();
  }

  setSessionType(type) {
    this.currentSessionType = type;
    const isQuiz = (type === 'quiz');

    if (this.dom.btnTypeQuiz) this.dom.btnTypeQuiz.classList.toggle('active', isQuiz);
    if (this.dom.btnTypeLearning) this.dom.btnTypeLearning.classList.toggle('active', !isQuiz);

    // Reset Step 2 (Format Latihan) selection every time Step 1 changes
    this.resetInputFormat();

    // Show 3rd card (Vocab Booster) in Step 2 for Learning Mode
    if (this.dom.btnFormatBooster) {
      this.dom.btnFormatBooster.hidden = isQuiz;
    }
    if (this.dom.formatPillsGrid) {
      this.dom.formatPillsGrid.classList.toggle('cols-3', !isQuiz);
    }

    // Update Step 2 copy for Learning Mode
    const mcqTitle = document.getElementById('mcqFormatTitle');
    const mcqDesc = document.getElementById('mcqFormatDesc');
    const typingTitle = document.getElementById('typingFormatTitle');
    const typingDesc = document.getElementById('typingFormatDesc');
    if (mcqTitle) mcqTitle.textContent = isQuiz ? 'Pilihan Ganda (MCQ)' : 'Kartu Bacaan (Flashcard)';
    if (mcqDesc) mcqDesc.textContent = isQuiz
      ? '4 opsi bacaan cepat untuk melatih refleks mengenali'
      : 'Buka kartu, dengarkan audio, dan hafalkan bacaan santai';
    if (typingTitle) typingTitle.textContent = isQuiz ? 'Ketik Langsung (Typing)' : 'Latihan Ketik Santai (Typing)';
    if (typingDesc) typingDesc.textContent = isQuiz
      ? 'Ketik kata/bacaan Kana & Kanji secara langsung'
      : 'Latihan mengetik kosakata Kana & Kanji tanpa nilai';

    // Option 1: In Quiz Mode, hide Step 2 format sub-card (Kategori Materi small cards drive everything);
    // in Learning Mode, show Step 2 (Flashcard / Ketik Santai / Vocab Booster) and hide Quiz categories.
    if (this.dom.formatToggleContainer) {
      this.dom.formatToggleContainer.hidden = isQuiz;
    }

    if (this.dom.quizSubconfigBox) {
      this.dom.quizSubconfigBox.hidden = !isQuiz;
    }

    if (isQuiz && this.dom.quizCategoryCardsGrid) {
      const activeCard = this.dom.quizCategoryCardsGrid.querySelector('.quiz-cat-card.active')
        || this.dom.quizCategoryCardsGrid.querySelector('.quiz-cat-card');
      if (activeCard) {
        this.selectQuizCategory(activeCard.dataset.mode, activeCard.dataset.format || 'mcq');
      }
    }

    this.syncDisplayTogglesForContext();
    this.updateStartButtonLabels();

    const startBtnIcon = this.dom.startDrillBtn?.querySelector('.btn-icon');
    if (startBtnIcon) {
      startBtnIcon.textContent = '▶';
    }

    const secLabel = document.getElementById('secondaryBtnLabel');
    const secIcon = document.getElementById('secondaryBtnIcon');
    if (secLabel) {
      secLabel.textContent = isQuiz ? 'Mode Belajar (Flashcard)' : 'Beralih ke Quiz Mode';
    }
    if (secIcon) {
      secIcon.textContent = isQuiz ? '💡' : '⚡';
    }
  }

  updateStartButtonLabels() {
    const isQuiz = (this.currentSessionType === 'quiz');

    if (this.dom.startBtnLabel) {
      this.dom.startBtnLabel.textContent = 'START';
    }

    if (this.dom.typingBtnLabel) {
      this.dom.typingBtnLabel.textContent = isQuiz ?
        'Mode Ketik Langsung (15 Mnt)' :
        'Latihan Ketik Santai (15 Mnt)';
    }
  }

  initLessonTiles() {
    // Dropdown trigger toggle
    if (this.dom.lessonDropdownTrigger && this.dom.lessonDropdownMenu) {
      this.dom.lessonDropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !this.dom.lessonDropdownMenu.hidden;
        this.dom.lessonDropdownMenu.hidden = isOpen;
        this.dom.lessonDropdownTrigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (this.dom.lessonDropdown && typeof this.dom.lessonDropdown.contains === 'function') {
          if (!this.dom.lessonDropdown.contains(e.target)) {
            this.dom.lessonDropdownMenu.hidden = true;
            this.dom.lessonDropdownTrigger.setAttribute('aria-expanded', 'false');
          }
        }
      });

      // Close dropdown on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !this.dom.lessonDropdownMenu.hidden) {
          this.dom.lessonDropdownMenu.hidden = true;
          this.dom.lessonDropdownTrigger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Delegated click handler on Tag Cloud for removing tags
    if (this.dom.selectedLessonsTagCloud) {
      this.dom.selectedLessonsTagCloud.addEventListener('click', (e) => {
        const removeBtn = e.target.closest ? e.target.closest('.lesson-tag-remove') : null;
        if (!removeBtn) return;
        const lessonNum = removeBtn.dataset.lesson;
        const tiles = document.querySelectorAll('.lesson-tile');
        tiles.forEach(tile => {
          if (String(tile.dataset.lesson) === String(lessonNum)) {
            const cb = tile.querySelector('input[type="checkbox"]');
            if (cb) cb.checked = false;
            tile.classList.remove('selected');
            tile.setAttribute('aria-selected', 'false');
          }
        });
        this.updateSelectedLessonsCount();
      });
    }

    // Multiselect option rows inside dropdown (with 5-lesson block lock enforcement)
    const tiles = document.querySelectorAll('.lesson-tile');
    tiles.forEach(tile => {
      tile.addEventListener('click', (e) => {
        e.stopPropagation();
        const lessonNum = parseInt(tile.dataset.lesson, 10);
        const coverage = progress.getAllLessonsCoverage(MASTER_DRILL_ITEMS, CLOZE_SENTENCE_ITEMS, SENTENCE_ROMAJI_ITEMS);
        const lockInfo = progress.getLockReason(lessonNum, coverage);
        if (lockInfo.locked) {
          showLockedLessonPopup(lessonNum, lockInfo);
          return;
        }
        const cb = tile.querySelector('input[type="checkbox"]');
        if (cb) {
          cb.checked = !cb.checked;
          tile.classList.toggle('selected', cb.checked);
          tile.setAttribute('aria-selected', cb.checked ? 'true' : 'false');
          this.updateSelectedLessonsCount();
        }
      });

      // Keyboard support: Space / Enter
      tile.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          tile.click();
        }
      });
    });
    this.refreshLessonLockStates();
    this.updateSelectedLessonsCount();
  }

  refreshLessonLockStates() {
    const coverage = progress.getAllLessonsCoverage(MASTER_DRILL_ITEMS, CLOZE_SENTENCE_ITEMS, SENTENCE_ROMAJI_ITEMS);
    const tiles = document.querySelectorAll('.lesson-tile');
    tiles.forEach(tile => {
      const lessonNum = parseInt(tile.dataset.lesson, 10);
      const isUnlocked = progress.isLessonUnlocked(lessonNum, coverage);
      const isCleared = progress.isLessonCleared(lessonNum, coverage);
      const cb = tile.querySelector('input[type="checkbox"]');

      tile.classList.toggle('locked', !isUnlocked);
      tile.classList.toggle('lesson-cleared', isCleared);
      tile.setAttribute('aria-disabled', isUnlocked ? 'false' : 'true');

      if (!isUnlocked && cb && cb.checked) {
        cb.checked = false;
        tile.classList.remove('selected');
        tile.setAttribute('aria-selected', 'false');
      }

      let statusBadge = tile.querySelector ? tile.querySelector('.lesson-lock-badge') : null;
      if (!statusBadge && typeof document.createElement === 'function' && typeof tile.appendChild === 'function') {
        statusBadge = document.createElement('span');
        statusBadge.className = 'lesson-lock-badge';
        tile.appendChild(statusBadge);
      }
      if (statusBadge) {
        if (!isUnlocked) {
          statusBadge.textContent = '🔒';
          statusBadge.title = 'Terkunci — selesaikan blok 5 bab sebelumnya';
        } else if (isCleared) {
          statusBadge.textContent = '⭐';
          statusBadge.title = 'Lulus Scorecard (100)';
        } else {
          statusBadge.textContent = '';
          statusBadge.title = '';
        }
      }
    });
  }

  applyLessonPreset(preset) {
    const coverage = progress.getAllLessonsCoverage(MASTER_DRILL_ITEMS, CLOZE_SENTENCE_ITEMS, SENTENCE_ROMAJI_ITEMS);

    // Block locked presets with pop-up warning
    if (preset === '6-10') {
      const lockInfo = progress.getLockReason(6, coverage);
      if (lockInfo.locked) {
        showLockedLessonPopup('Blok Bab 6–10', lockInfo);
        return;
      }
    } else if (preset === '11-15') {
      const lockInfo = progress.getLockReason(11, coverage);
      if (lockInfo.locked) {
        showLockedLessonPopup('Blok Bab 11–15', lockInfo);
        return;
      }
    } else if (preset === '16-20') {
      const lockInfo = progress.getLockReason(16, coverage);
      if (lockInfo.locked) {
        showLockedLessonPopup('Blok Bab 16–20', lockInfo);
        return;
      }
    } else if (preset === '21-25') {
      const lockInfo = progress.getLockReason(21, coverage);
      if (lockInfo.locked) {
        showLockedLessonPopup('Blok Bab 21–25', lockInfo);
        return;
      }
    }

    const tiles = document.querySelectorAll('.lesson-tile');
    tiles.forEach(tile => {
      const lessonNum = parseInt(tile.dataset.lesson, 10);
      const isUnlocked = progress.isLessonUnlocked(lessonNum, coverage);
      const cb = tile.querySelector('input[type="checkbox"]');
      let shouldSelect = false;

      if (preset === 'all') {
        shouldSelect = isUnlocked;
      } else if (preset === '1-5') {
        shouldSelect = (lessonNum >= 1 && lessonNum <= 5) && isUnlocked;
      } else if (preset === '6-10') {
        shouldSelect = (lessonNum >= 6 && lessonNum <= 10) && isUnlocked;
      } else if (preset === '11-15') {
        shouldSelect = (lessonNum >= 11 && lessonNum <= 15) && isUnlocked;
      } else if (preset === '16-20') {
        shouldSelect = (lessonNum >= 16 && lessonNum <= 20) && isUnlocked;
      } else if (preset === '21-25') {
        shouldSelect = (lessonNum >= 21 && lessonNum <= 25) && isUnlocked;
      } else if (preset === 'clear') {
        shouldSelect = false;
      }

      if (cb) cb.checked = shouldSelect;
      tile.classList.toggle('selected', shouldSelect);
      tile.setAttribute('aria-selected', shouldSelect ? 'true' : 'false');
    });

    this.updateSelectedLessonsCount();
  }

  getSelectedLessons() {
    const checked = document.querySelectorAll('.lesson-tile input[type="checkbox"]:checked');
    return Array.from(checked).map(cb => parseInt(cb.value, 10)).filter(n => !isNaN(n));
  }

  promptLessonSelection() {
    if (this.dom.lessonDropdownMenu && this.dom.lessonDropdownTrigger) {
      this.dom.lessonDropdownMenu.hidden = false;
      this.dom.lessonDropdownTrigger.setAttribute('aria-expanded', 'true');
    }
    if (this.dom.lessonsSelectionWrapper) {
      this.dom.lessonsSelectionWrapper.classList.remove('needs-selection-shake');
      // Force reflow for repeated shake animation
      void this.dom.lessonsSelectionWrapper.offsetWidth;
      this.dom.lessonsSelectionWrapper.classList.add('needs-selection-shake');
    }
  }

  updateSelectedLessonsCount() {
    const selected = this.getSelectedLessons();
    const hasSelection = selected.length > 0;

    if (this.dom.selectedLessonsCount) {
      if (selected.length === TOTAL_LESSONS) {
        this.dom.selectedLessonsCount.textContent = `${TOTAL_LESSONS}/${TOTAL_LESSONS} Bab`;
        this.dom.selectedLessonsCount.className = 'badge';
      } else if (selected.length === 0) {
        this.dom.selectedLessonsCount.textContent = `0/${TOTAL_LESSONS} Bab (Min. 1)`;
        this.dom.selectedLessonsCount.className = 'badge badge-warn';
      } else {
        this.dom.selectedLessonsCount.textContent = `${selected.length}/${TOTAL_LESSONS} Bab`;
        this.dom.selectedLessonsCount.className = 'badge badge-info';
      }
    }

    if (this.dom.lessonDropdownText) {
      if (selected.length === TOTAL_LESSONS) {
        this.dom.lessonDropdownText.textContent = `Semua Bab Dipilih (1–${TOTAL_LESSONS}) — Klik untuk ubah`;
      } else if (selected.length === 0) {
        this.dom.lessonDropdownText.textContent = 'Pilih Bab... (minimal pilih 1 bab)';
      } else {
        this.dom.lessonDropdownText.textContent = `${selected.length} Bab Dipilih — Klik untuk tambah/ubah`;
      }
    }

    // Require minimum 1 Bab selected to click START
    if (this.dom.startDrillBtn) {
      this.dom.startDrillBtn.disabled = !hasSelection;
      this.dom.startDrillBtn.classList.toggle('pulse-glow', hasSelection);
      this.dom.startDrillBtn.title = hasSelection
        ? 'Mulai latihan (8 soal per sesi)'
        : 'Pilih minimal 1 Bab terlebih dahulu untuk memulai';
    }

    this.renderLessonTagCloud();
  }

  renderLessonTagCloud() {
    if (!this.dom.selectedLessonsTagCloud) return;

    const tiles = Array.from(document.querySelectorAll('.lesson-tile'));
    const selectedTiles = tiles.filter(tile => {
      const cb = tile.querySelector('input[type="checkbox"]');
      return cb && cb.checked;
    });

    if (selectedTiles.length === 0) {
      this.dom.selectedLessonsTagCloud.innerHTML = `<span class="tag-cloud-empty">Pilih minimal 1 bab di atas untuk mengaktifkan tombol START.</span>`;
      return;
    }

    const showShortDesc = selectedTiles.length <= 5;
    this.dom.selectedLessonsTagCloud.innerHTML = selectedTiles.map(tile => {
      const num = tile.dataset.lesson;
      const desc = tile.dataset.desc || '';
      const descHtml = (showShortDesc && desc)
        ? `<span class="tag-desc-sep">·</span><span class="tag-desc-text">${desc}</span>`
        : '';
      return `
        <span class="lesson-tag-chip" title="Bab ${num}: ${desc}">
          <span>Bab ${num}</span>${descHtml}
          <button type="button" class="lesson-tag-remove" data-lesson="${num}" aria-label="Hapus Bab ${num}">&times;</button>
        </span>
      `;
    }).join('');
  }

  selectSingleLesson(lessonNum, launchType = null) {
    const targetNum = parseInt(lessonNum, 10);
    const coverage = progress.getAllLessonsCoverage(MASTER_DRILL_ITEMS, CLOZE_SENTENCE_ITEMS, SENTENCE_ROMAJI_ITEMS);
    const lockInfo = progress.getLockReason(targetNum, coverage);
    if (lockInfo.locked) {
      showLockedLessonPopup(targetNum, lockInfo);
      return;
    }
    const tiles = document.querySelectorAll('.lesson-tile');
    tiles.forEach(tile => {
      const num = parseInt(tile.dataset.lesson, 10);
      const cb = tile.querySelector('input[type="checkbox"]');
      const matches = (num === targetNum);
      if (cb) cb.checked = matches;
      tile.classList.toggle('selected', matches);
      tile.setAttribute('aria-checked', matches ? 'true' : 'false');
    });

    this.updateSelectedLessonsCount();
    this.switchTab('drill');

    if (launchType) {
      this.setSessionType(launchType);
      const mode = (launchType === 'quiz' && this.dom.drillModeSelect) ? this.dom.drillModeSelect.value : 'kanji_match';
      this.launchDrill(launchType, mode, [targetNum]);
    }
  }

  applyTheme() {
    const savedTheme = localStorage.getItem('kirakira_theme') || 'dark';
    const isLight = savedTheme === 'light';
    document.body.classList.toggle('light-theme', isLight);
    document.body.classList.toggle('dark-theme', !isLight);
    if (document.documentElement) {
      document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
    }
    if (this.dom.themeToggleBtn) {
      const iconEl = this.dom.themeToggleBtn.querySelector('.theme-icon');
      if (iconEl) iconEl.textContent = isLight ? '☀️' : '🌙';
      this.dom.themeToggleBtn.title = isLight ? 'Mode Terang aktif — klik untuk Mode Gelap' : 'Mode Gelap aktif — klik untuk Mode Terang';
    }
  }

  updateHeaderStats() {
    if (this.dom.streakDisplay) {
      this.dom.streakDisplay.textContent = `${progress.data.streakDays} Hari`;
    }
    if (this.dom.levelDisplay) {
      this.dom.levelDisplay.textContent = `Lv.${progress.data.level} (${progress.data.xp} XP)`;
    }
  }

  initComponents() {
    // Init Drill Engine
    drillEngine.init({
      cardContainer: this.dom.cardContainer,
      timerDisplay: this.dom.timerDisplay,
      timerRing: this.dom.timerRing,
      comboDisplay: this.dom.comboDisplay,
      xpDisplay: this.dom.xpDisplay,
      progressCount: this.dom.progressCount,
      onSessionComplete: (results) => this.handleSessionComplete(results)
    });

    // Init Transcript Explorer
    transcriptExplorer.init(this.dom.explorerContainer);

    // Init AI Advisor (One-Shot Report Card)
    aiAdvisorView.init(this.dom.aiAdvisorContainer, {
      onOpenLogin: () => authUI.openAuthModal('login'),
      onLaunchDrill: () => this.switchTab('drill')
    });

    // Init Scorecard
    scorecardView.init(this.dom.scorecardContainer);

    // Init Weakness Focus View
    weaknessView.init(this.dom.weaknessContainer, {
      onLaunchDrill: (sessionType, mode, lessons) => {
        this.switchTab('drill');
        this.setSessionType(sessionType);
        if (this.dom.drillModeSelect) this.dom.drillModeSelect.value = mode || 'weakness_focus';
        this.launchDrill(sessionType, mode || 'weakness_focus', lessons || ['all'], 'mcq');
      }
    });

    // Init Multi-User Auth, Profile, Membership & Leaderboard
    authUI.init({
      onProgressUpdated: () => {
        sound.refreshServerTtsStatus();
        this.updateHeaderStats();
        this.refreshLessonLockStates();
        this.updateSelectedLessonsCount();
        aiAdvisorView.clearLocalState();
        if (this.currentTab === 'scorecard') {
          scorecardView.render();
          aiAdvisorView.loadStatus();
        } else if (this.currentTab === 'weakness') {
          weaknessView.render();
        } else if (this.currentTab === 'kana') {
          kanaCompanion.refreshForUser();
        }
      }
    });
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    this.dom.navTabs.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    this.dom.tabPanels.forEach(panel => {
      const isTarget = panel.id === `tab-${tabName}`;
      panel.classList.toggle('active', isTarget);
    });

    if (tabName === 'scorecard') {
      scorecardView.render();
      aiAdvisorView.loadStatus();
    } else if (tabName === 'weakness') {
      weaknessView.render();
    } else if (tabName === 'explorer') {
      transcriptExplorer.renderContent();
    } else if (tabName === 'kana') {
      kanaCompanion.init(document.getElementById('kanaCompanionRoot'));
    } else if (tabName === 'leaderboard') {
      authUI.loadLeaderboard();
    } else if (tabName === 'admin') {
      authUI.loadAdminDashboard();
    }

    this.syncDisplayTogglesForContext();
    this.updateHeaderStats();
  }

  syncDisplayTogglesForContext() {
    const isDrillTab = (this.currentTab === 'drill');
    const isExplorerTab = (this.currentTab === 'explorer');
    const isDrillActive = !!(this.dom.drillActiveArea && !this.dom.drillActiveArea.hidden);

    let allowToggles = false;
    let isActiveQuiz = false;

    if (isExplorerTab) {
      allowToggles = true;
    } else if (isDrillTab) {
      if (isDrillActive) {
        // Active drill: ONLY allow Romaji/Arti toggles in Learning Mode AND never in Kalimat Rumpang
        allowToggles = (this.activeSessionType === 'learning') && !this.isClozeActive;
        isActiveQuiz = (this.activeSessionType === 'quiz');
      } else {
        // Setup menu: ONLY show Romaji/Arti toggles when Learning Mode is chosen
        allowToggles = (this.currentSessionType === 'learning');
      }
    }

    this.displayTogglesAllowed = allowToggles;
    this.setDisplayTogglesVisibility(allowToggles);
    if (document.body && document.body.classList) {
      document.body.classList.toggle('quiz-mode-strict', isActiveQuiz);
      document.body.classList.toggle('drill-active-mobile', isDrillTab && isDrillActive);
    }
  }

  setDisplayTogglesVisibility(visible) {
    if (this.dom.drillDisplayBar) {
      this.dom.drillDisplayBar.hidden = !visible;
    }
    if (this.dom.headerDisplayToggleGroup) {
      this.dom.headerDisplayToggleGroup.hidden = !visible;
    }
  }

  launchDrill(sessionType, mode, selectedLessons, inputFormat = null) {
    const format = inputFormat || this.currentInputFormat || 'mcq';
    const isCloze = (mode === 'sentence_cloze');
    this.activeSessionType = sessionType || 'quiz';
    this.isClozeActive = isCloze;

    this.dom.drillSetupCard.hidden = true;
    this.dom.drillActiveArea.hidden = false;

    // Enforce display toggle availability:
    // - Quiz Mode: NO Romaji/Translation switches
    // - Kalimat Rumpang: NO Romaji/Translation switches
    // - Learning Mode (non-cloze): Romaji/Translation switches available
    this.syncDisplayTogglesForContext();

    drillEngine.startSession({
      sessionType: this.activeSessionType,
      inputFormat: format,
      mode: mode,
      selectedLessons: selectedLessons
    });
  }

  goHome() {
    if (drillEngine.sessionActive) {
      if (typeof drillEngine.stopTimer === 'function') drillEngine.stopTimer();
      if (typeof drillEngine.stopQuestionTimer === 'function') drillEngine.stopQuestionTimer();
      drillEngine.sessionActive = false;
    }
    this.resetDrillArea();
    this.switchTab('drill');
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  resetDrillArea() {
    this.activeSessionType = null;
    this.isClozeActive = false;
    this.dom.drillSetupCard.hidden = false;
    this.dom.drillActiveArea.hidden = true;
    this.syncDisplayTogglesForContext();
    this.updateHeaderStats();
  }

  handleSessionComplete(results) {
    const mins = Math.floor(results.elapsedSeconds / 60);
    const secs = results.elapsedSeconds % 60;
    const isLearning = (results.sessionType === 'learning');

    // Customise modal for learning mode vs quiz mode
    const modalTitle = this.dom.sessionCompleteModal?.querySelector('.modal-title');
    const modalSub = this.dom.sessionCompleteModal?.querySelector('.modal-sub');
    const celebrationBadge = this.dom.sessionCompleteModal?.querySelector('.celebration-badge');

    if (isLearning) {
      if (celebrationBadge) celebrationBadge.textContent = 'よくできました！ (Byte 8 Soal Selesai)';
      if (modalTitle) modalTitle.textContent = 'Sesi Belajar (8 Soal) Selesai! 💡';
      if (modalSub) modalSub.textContent = 'Mode Belajar berkontribusi 10% skor cakupan per soal dibanding Mode Kuis. Ambil Mode Kuis untuk meraih Skor Penuh (≥80% bank soal)!';
    } else {
      if (celebrationBadge) celebrationBadge.textContent = 'お疲れ様でした！ (Byte 8 Soal Selesai)';
      if (modalTitle) modalTitle.textContent = 'Sesi Kuis (8 Soal) Selesai! 🎉';
      if (modalSub) modalSub.textContent = 'Kerja luar biasa! Setiap jawaban benar menambah cakupan bank soal bab menuju target ≥80% Skor Penuh.';
    }

    if (this.dom.sessionDurationLabel) {
      this.dom.sessionDurationLabel.textContent = isLearning ? 'Durasi Belajar:' : 'Durasi Kuis:';
    }
    if (this.dom.sessionDurationResult) {
      this.dom.sessionDurationResult.textContent = `${mins} menit ${secs} detik`;
    }

    const totalByte = results.byteSize || 8;
    const correct = results.correctCount ?? 0;
    const unanswered = results.unansweredCount ?? 0;

    if (this.dom.sessionCardsLabel) {
      this.dom.sessionCardsLabel.textContent = 'Jawaban Benar:';
    }
    if (this.dom.sessionCardsResult) {
      if (unanswered > 0) {
        this.dom.sessionCardsResult.innerHTML = `${correct} / ${totalByte} Soal Benar<br><small style="font-size:0.75rem; color:#dc2626; font-weight:600; display:inline-block; margin-top:0.2rem;">(${unanswered} belum dijawab = salah)</small>`;
      } else {
        this.dom.sessionCardsResult.textContent = `${correct} / ${totalByte} Soal Benar`;
      }
    }

    const scoreVal = (typeof results.score === 'number') ? results.score : (results.accuracy ?? 0);
    const scoreColorClass = scoreVal >= 80 ? 'res-val highlight-green' : (scoreVal >= 50 ? 'res-val highlight-gold' : 'res-val highlight-red');

    if (this.dom.sessionScoreLabel) {
      this.dom.sessionScoreLabel.textContent = 'Skor Sesi:';
    }
    if (this.dom.sessionAccuracyResult) {
      if (isLearning) {
        this.dom.sessionAccuracyResult.innerHTML = `${scoreVal} / 100 <span style="display:block; font-size:0.72rem; color:var(--text-muted); font-weight:normal; margin-top:0.15rem;">(Bobot 10% Belajar)</span>`;
        this.dom.sessionAccuracyResult.className = scoreColorClass;
      } else {
        this.dom.sessionAccuracyResult.innerHTML = `${scoreVal} / 100`;
        this.dom.sessionAccuracyResult.className = scoreColorClass;
      }
    }
    if (this.dom.sessionXpResult) {
      this.dom.sessionXpResult.textContent = `+${results.xpEarned} XP`;
    }

    // Render updated per-lesson bank coverage & score summary inside modal
    if (this.dom.sessionCoverageSummary) {
      const sel = results.selectedLessons || [];
      const lessonNums = sel.includes('all') || sel.length === 0
        ? Array.from({ length: 14 }, (_, i) => i + 1)
        : sel.map(n => parseInt(n, 10)).filter(n => !isNaN(n)).sort((a, b) => a - b);

      const rowsHtml = lessonNums.slice(0, 6).map(num => {
        const st = progress.getLessonCoverageStats(num, MASTER_DRILL_ITEMS, CLOZE_SENTENCE_ITEMS, SENTENCE_ROMAJI_ITEMS);
        const rumpangTag = st.isClozeComplete
          ? `<span class="rumpang-pill ok">🔥 ${st.clozeQuizCovered}/${st.clozeTotal} ✔</span>`
          : `<span class="rumpang-pill pending">🔥 ${st.clozeQuizCovered}/${st.clozeTotal}</span>`;
        return `
          <div class="modal-cov-row">
            <span class="modal-cov-bab">Bab ${num}</span>
            <div class="modal-cov-bar-wrap">
              <div class="modal-cov-bar ${st.isFullScore ? 'bar-full' : ''}" style="width: ${Math.min(100, st.coveragePercent)}%"></div>
              <div class="sc-threshold-marker" style="left: 80%;"></div>
            </div>
            ${rumpangTag}
            <span class="modal-cov-meta"><strong>${st.isFullScore ? '100 🏆' : `${st.score}/100`}</strong></span>
          </div>
        `;
      }).join('');

      const moreNote = lessonNums.length > 6 ? `<p class="modal-cov-more">+ ${lessonNums.length - 6} bab lainnya (lihat lengkap di Scorecard)</p>` : '';
      this.dom.sessionCoverageSummary.innerHTML = `
        <div class="modal-cov-title">📊 Cakupan Bank Soal & Skor Bab (Target Penuh: ≥80% Total + 100% Rumpang)</div>
        ${rowsHtml}
        ${moreNote}
      `;
    }

    // Evaluate newly cleared lessons & 5-lesson block unlocks (stars + celebration + emails + badges)
    const progEval = progress.evaluateProgression(MASTER_DRILL_ITEMS, CLOZE_SENTENCE_ITEMS, SENTENCE_ROMAJI_ITEMS);
    this.refreshLessonLockStates();

    if (progEval.newlyClearedLessons.length > 0) {
      progEval.newlyClearedLessons.forEach((lessonNum, i) => {
        setTimeout(() => showLessonClearStars(lessonNum), i * 600);
        notifyAchievementEmail({ type: 'lesson_clear', lessonNum });
      });
    }

    if (progEval.newlyClearedBlocks.length > 0) {
      const delayMs = progEval.newlyClearedLessons.length > 0 ? 1500 : 350;
      progEval.newlyClearedBlocks.forEach((block, i) => {
        setTimeout(() => showBlockUnlockCelebration(block), delayMs + i * 900);
        notifyAchievementEmail({ type: 'block_unlock', blockNum: block.id });
      });
    }

    this.updateHeaderStats();
    if (this.dom.sessionCompleteModal) {
      if (typeof this.dom.sessionCompleteModal.showModal === 'function') {
        this.dom.sessionCompleteModal.showModal();
      } else {
        this.dom.sessionCompleteModal.setAttribute('open', '');
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new JapaneseApp();
  app.init();
});
