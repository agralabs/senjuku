// 15-Minute Daily Bite-Sized Reading Drill & Learning Engine (MCQ + Direct Typing)

import { MASTER_DRILL_ITEMS } from '../data/kanji-vocabulary.js';
import { CLOZE_SENTENCE_ITEMS, getContextSvg } from '../data/cloze-sentences.js';
import { SENTENCE_ROMAJI_ITEMS, checkSentenceRomajiMatch, checkSentenceKanaMatch } from '../data/sentence-romaji.js';
import { buildVocabBoosterQuestions } from '../data/vocab-booster.js';
import { buildSpeakAloudQueue } from '../data/speak-aloud.js';
import { progress } from './srs.js';
import { sound, PLAYBACK_LIMITS, PlaybackLimiter, getVoicePlaybackLimit } from './audio.js';
import { checkKanaOnlyMatch } from './kana-converter.js';
import { renderKanaKeyboardHtml, attachKanaKeyboard } from './kana-keyboard.js';
import { SpeakAloudRecognizer, isSpeechRecognitionSupported, checkSpokenJapaneseMatch } from './speech.js';

export const SESSION_BYTE_SIZE = 8;
export const WORD_TYPING_LIMIT_SEC = 30;
export const FULL_SENTENCE_TYPING_LIMIT_SEC = 50;
export const QUIZ_NON_TYPING_LIMIT_SEC = 30;
export const SPEAK_WORD_LIMIT_SEC = 25;

const CHEER_MASCOT_SVG = `
  <svg class="correct-cheer-svg" viewBox="0 0 40 40" width="28" height="28" aria-hidden="true">
    <polygon points="20,3 25,13 36,14.5 28,22 30,33 20,27.5 10,33 12,22 4,14.5 15,13" fill="#fde047" stroke="#10131a" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M12.5 14.5h15v4h-15z" fill="#b3202f"/>
    <circle cx="16.5" cy="20.5" r="1.8" fill="#10131a"/>
    <circle cx="23.5" cy="20.5" r="1.8" fill="#10131a"/>
    <ellipse cx="13.5" cy="23.5" rx="2.2" ry="1.2" fill="#fb7185"/>
    <ellipse cx="26.5" cy="23.5" rx="2.2" ry="1.2" fill="#fb7185"/>
    <path d="M17.5 23.5 Q20 26.8 22.5 23.5" fill="none" stroke="#10131a" stroke-width="1.8" stroke-linecap="round"/>
  </svg>
`;

function renderCorrectBannerHtml(earnedXP, leadText = 'Hebat', suffixHtml = '') {
  return `<span class="correct-cheer-wrap"><span class="icon-success">✔</span> <strong>${leadText}, nambah</strong> <span class="xp-tag">+${earnedXP} XP</span>${CHEER_MASCOT_SVG}${suffixHtml}</span>`;
}

/**
 * Unbiased Fisher-Yates (Knuth) array shuffle.
 * Guarantees uniform 1/N! distribution across all permutations.
 */
export function fisherYatesShuffle(array) {
  if (!Array.isArray(array)) return [];
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export class DrillEngine {
  constructor() {
    this.sessionActive = false;
    this.byteSize = SESSION_BYTE_SIZE;
    this.timerSeconds = 900; // 15 minutes (900s)
    this.initialSeconds = 900;
    this.elapsedSeconds = 0;
    this.timerInterval = null;
    this.questionTimerInterval = null;
    this.questionTimeRemaining = 0;
    this.isPaused = false;

    // Session Type: 'quiz' (graded) or 'learning' (flashcard/practice, non-graded)
    this.sessionType = 'quiz';
    // Input format: 'mcq' (multiple choice / flip card) or 'typing' (direct character typing)
    this.inputFormat = 'mcq';
    this.autoRomajiConvert = true;
    this.currentMode = 'kanji_match'; // 'kanji_match', 'sentence_reading', 'katakana_blitz'
    this.selectedLessons = ['all'];
    this.drillQueue = [];
    this.currentIndex = 0;
    this.currentCard = null;

    // Flashcard State (Learning Mode)
    this.isFlashcardRevealed = false;
    this.viewedCardIds = new Set();

    // Manual Voice Audio Playback Limit State (keyed by currentIndex)
    this.cardAudioLimiters = new Map();
    this.autoRevealedIndices = new Set();
    this.autoPlayedIndices = new Set();

    // Session Metrics (Quiz Mode)
    this.cardsReviewed = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.xpEarned = 0;

    // DOM cache
    this.elements = {};
    this.speechRecognizer = new SpeakAloudRecognizer();
  }

  init(domElements) {
    this.elements = domElements;
    this.bindEvents();
  }

  bindEvents() {
    // Keyboard shortcuts for lightning fast 15-min drills and navigation
    window.addEventListener('keydown', (e) => {
      if (!this.sessionActive || this.isPaused) return;

      const activeEl = document.activeElement;
      const isInputActive = activeEl && ['INPUT', 'TEXTAREA'].includes(activeEl.tagName);

      // If user is currently typing in an input field:
      if (isInputActive) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (this.sessionType === 'learning') {
            const checkBtn = this.elements.cardContainer?.querySelector('#btnCheckTyping');
            const nextBtn = this.elements.cardContainer?.querySelector('#btnNextLearning');
            if (nextBtn && !nextBtn.hidden) {
              nextBtn.click();
            } else if (checkBtn) {
              checkBtn.click();
            }
          } else {
            const nextBtn = this.elements.cardContainer?.querySelector('#nextCardBtn');
            const submitBtn = this.elements.cardContainer?.querySelector('#submitTypingBtn');
            if (nextBtn && !nextBtn.hidden) {
              nextBtn.click();
            } else if (submitBtn && !submitBtn.disabled) {
              submitBtn.click();
            }
          }
        } else if (e.key === 'Escape') {
          activeEl.blur();
        }
        // Do NOT trigger single-key hotkeys (1-4, Space, M, T, R) while typing
        return;
      }

      if (this.sessionType === 'learning') {
        if (this.inputFormat === 'typing') {
          if (e.key === 'Enter' || e.key === 'ArrowRight') {
            e.preventDefault();
            this.nextFlashcard();
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.prevFlashcard();
          } else if (e.key.toLowerCase() === 'r') {
            e.preventDefault();
            const audioText = this.getPrimaryAudioTextForCurrentCard();
            if (audioText) {
              this.playManualAudio(audioText);
            }
          }
        } else {
          // Classic Flashcard & Non-Typing Learning Mode Shortcuts
          if (e.code === 'Space') {
            e.preventDefault();
            if (
              this.currentMode !== 'sentence_romaji' &&
              this.currentMode !== 'sentence_cloze' &&
              !this.currentMode.startsWith('vocab_booster_')
            ) {
              this.toggleFlashcardReveal();
            }
          } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
            e.preventDefault();
            this.nextFlashcard();
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.prevFlashcard();
          } else if (e.key.toLowerCase() === 'r') {
            e.preventDefault();
            const audioText = this.getPrimaryAudioTextForCurrentCard();
            if (audioText) {
              this.playManualAudio(audioText);
            }
          }
        }
      } else {
        // Quiz Mode Shortcuts
        if (this.currentMode === 'sentence_romaji') {
          if (e.key === 'Enter') {
            const nextBtn = this.elements.cardContainer?.querySelector('#btnNextSRomaji')
              || this.elements.cardContainer?.querySelector('#nextCardBtn');
            if (nextBtn && !nextBtn.hidden) {
              nextBtn.click();
            }
          } else if (e.key.toLowerCase() === 'r') {
            e.preventDefault();
            const audioText = this.getPrimaryAudioTextForCurrentCard();
            if (audioText) {
              this.playManualAudio(audioText);
            }
          } else if (e.code === 'Space') {
            e.preventDefault();
          }
          return;
        }

        if (this.inputFormat === 'typing') {
          if (e.key === 'Enter') {
            const nextBtn = this.elements.cardContainer?.querySelector('#nextCardBtn');
            if (nextBtn && !nextBtn.hidden) {
              nextBtn.click();
            }
          } else if (e.key.toLowerCase() === 'r') {
            if (this.currentCard) {
              sound.speakJapanese(this.currentCard.kana || this.currentCard.kanji);
            }
          }
        } else {
          // MCQ & Cloze Mode
          if (['1', '2', '3', '4'].includes(e.key)) {
            const idx = parseInt(e.key, 10) - 1;
            const clozeBtns = this.elements.cardContainer?.querySelectorAll('.cloze-opt-btn');
            if (clozeBtns && clozeBtns.length > 0) {
              if (clozeBtns[idx] && !clozeBtns[idx].disabled) {
                clozeBtns[idx].click();
              }
              return;
            }
            const buttons = this.elements.optionsGrid?.querySelectorAll('.option-btn');
            if (buttons && buttons[idx] && !buttons[idx].disabled) {
              buttons[idx].click();
            }
          } else if (e.code === 'Space') {
            e.preventDefault();
            if (this.currentCard) {
              sound.speakJapanese(this.currentCard.fullSentence || this.currentCard.sentence || this.currentCard.kanji);
            }
          } else if (e.key.toLowerCase() === 'r') {
            if (this.currentCard) {
              sound.speakJapanese(this.currentCard.audioSentence || this.currentCard.kana || this.currentCard.kanji);
            }
          } else if (e.key === 'Enter') {
            const nextClozeBtn = this.elements.cardContainer?.querySelector('#nextClozeBtn');
            if (nextClozeBtn && !nextClozeBtn.hidden) {
              nextClozeBtn.click();
              return;
            }
            const nextBtn = this.elements.cardContainer?.querySelector('#nextCardBtn');
            if (nextBtn && !nextBtn.hidden) {
              nextBtn.click();
            }
          }
        }
      }
    });
  }

  startSession(options = {}) {
    // Support both object arguments or legacy parameters
    let sessionType = 'quiz';
    let inputFormat = 'mcq';
    let mode = 'kanji_match';
    let selectedLessons = ['all'];

    if (typeof options === 'string') {
      mode = options;
      selectedLessons = arguments[1] ? [arguments[1]] : ['all'];
    } else {
      sessionType = options.sessionType || 'quiz';
      inputFormat = options.inputFormat || options.format || 'mcq';
      mode = options.mode || 'kanji_match';
      selectedLessons = options.selectedLessons || ['all'];
    }

    this.sessionType = sessionType;
    this.inputFormat = inputFormat;
    this.currentMode = mode;
    this.selectedLessons = Array.isArray(selectedLessons) ? selectedLessons : [selectedLessons];

    this.clearQuestionTimer();
    clearTimeout(this.autoAdvanceTimeout);

    this.sessionActive = true;
    this.isPaused = false;
    this.timerSeconds = 900; // 15 minutes target
    this.initialSeconds = 900;
    this.elapsedSeconds = 0;
    this.cardsReviewed = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.xpEarned = 0;
    this.isFlashcardRevealed = false;
    this.viewedCardIds = new Set();
    this.cardAudioLimiters = new Map();
    this.autoRevealedIndices = new Set();
    this.autoPlayedIndices = new Set();

    // Prepare queue based on selected lessons and modes
    let items = [];

    if (mode === 'speak_aloud' || inputFormat === 'speak') {
      this.drillQueue = buildSpeakAloudQueue(this.selectedLessons);
    } else if (mode === 'vocab_booster_kana' || mode === 'vocab_booster_kanji') {
      const scriptType = (mode === 'vocab_booster_kanji') ? 'kanji' : 'kana';
      this.drillQueue = buildVocabBoosterQuestions(this.selectedLessons, scriptType, SESSION_BYTE_SIZE);
    } else if (mode === 'sentence_romaji') {
      items = [...SENTENCE_ROMAJI_ITEMS];
      const isAll = this.selectedLessons.includes('all') || this.selectedLessons.length === 0;
      if (!isAll) {
        const lessonNums = this.selectedLessons.map(l => parseInt(l, 10)).filter(n => !isNaN(n));
        if (lessonNums.length > 0) {
          const filtered = items.filter(it => lessonNums.includes(it.lesson));
          if (filtered.length > 0) items = filtered;
        }
      }
      if (items.length === 0) {
        items = [...SENTENCE_ROMAJI_ITEMS];
      }
      this.drillQueue = this.buildByteQueue(items, SESSION_BYTE_SIZE);
    } else if (mode === 'sentence_cloze') {
      items = [...CLOZE_SENTENCE_ITEMS];
      // Multi-lesson filtering
      const isAll = this.selectedLessons.includes('all') || this.selectedLessons.length === 0;
      if (!isAll) {
        const lessonNums = this.selectedLessons.map(l => parseInt(l, 10)).filter(n => !isNaN(n));
        if (lessonNums.length > 0) {
          const filtered = items.filter(it => lessonNums.includes(it.lesson));
          if (filtered.length > 0) items = filtered;
        }
      }
      if (items.length === 0) {
        items = [...CLOZE_SENTENCE_ITEMS];
      }
      this.drillQueue = this.buildByteQueue(items, SESSION_BYTE_SIZE);
    } else if (mode === 'weakness_focus') {
      // Pull weak cards based on frequent mistakes in the last 1 week
      const weakItems = progress.getWeakestItems(MASTER_DRILL_ITEMS, 25);
      const isAll = this.selectedLessons.includes('all') || this.selectedLessons.length === 0;
      if (!isAll) {
        const lessonNums = this.selectedLessons.map(l => parseInt(l, 10)).filter(n => !isNaN(n));
        const filtered = weakItems.filter(it => lessonNums.includes(it.lesson));
        items = filtered.length > 0 ? filtered : weakItems;
      } else {
        items = weakItems;
      }
      this.drillQueue = this.buildByteQueue(items, SESSION_BYTE_SIZE);
    } else {
      items = [...MASTER_DRILL_ITEMS];

      // Multi-lesson filtering
      const isAll = this.selectedLessons.includes('all') || this.selectedLessons.length === 0;
      if (!isAll) {
        const lessonNums = this.selectedLessons.map(l => parseInt(l, 10)).filter(n => !isNaN(n));
        if (lessonNums.length > 0) {
          const filtered = items.filter(it => lessonNums.includes(it.lesson));
          if (filtered.length > 0) items = filtered;
        }
      }

      // Sub-mode filtering for quiz
      // Note: 'kanji_match' uses full Bab bank (Kanji & Katakana) so users can reach >=80% coverage per Bab
      if (this.sessionType === 'quiz' && mode === 'katakana_blitz') {
        const katakanaItems = items.filter(it => it.type === 'katakana');
        if (katakanaItems.length > 0) items = katakanaItems;
      }

      // Fallback if filter yielded empty
      if (items.length === 0) {
        items = [...MASTER_DRILL_ITEMS];
      }

      this.drillQueue = this.buildByteQueue(items, SESSION_BYTE_SIZE);
    }

    this.currentIndex = 0;

    this.startTimer();
    this.renderCurrentView();
    this.updateStatsUI();
  }

  // Pulls exactly `byteSize` (8) questions from the question bank, prioritizing uncovered questions first
  // so multiple sessions naturally achieve >= 80% coverage of each Bab's question bank.
  buildByteQueue(items, byteSize = SESSION_BYTE_SIZE) {
    if (!items || items.length === 0) return [];

    const neverSeen = fisherYatesShuffle(items.filter(it => progress.getCardCoverageCredit(it.id) === 0));
    const learningOnly = fisherYatesShuffle(items.filter(it => {
      const c = progress.getCardCoverageCredit(it.id);
      return c > 0 && c < 1.0;
    }));
    const covered = this.prioritizeQueue(items.filter(it => progress.getCardCoverageCredit(it.id) >= 1.0));

    const ordered = [...neverSeen, ...learningOnly, ...covered];

    let selected;
    if (ordered.length >= byteSize) {
      selected = ordered.slice(0, byteSize);
    } else {
      // If selected bank has fewer than 8 unique items, pad with shuffled items from the pool to form a full 8-question byte
      const padded = [...ordered];
      while (padded.length < byteSize) {
        const refill = fisherYatesShuffle(items);
        for (const item of refill) {
          if (padded.length >= byteSize) break;
          padded.push(item);
        }
      }
      selected = padded;
    }

    // Full Presentation Order Randomization: Shuffle selected 8 cards
    // so new cards, learning cards, and review cards are interleaved uniformly
    return fisherYatesShuffle(selected);
  }

  prioritizeQueue(items) {
    const due = progress.getDueCards(items);
    const shuffledDue = fisherYatesShuffle(due);
    const nonDue = fisherYatesShuffle(items.filter(it => !due.some(d => d.id === it.id)));
    return [...shuffledDue, ...nonDue];
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;

      this.timerSeconds--;
      this.elapsedSeconds++;

      if (this.timerSeconds <= 30 && this.timerSeconds > 0 && this.timerSeconds % 5 === 0) {
        sound.playTick();
      }

      this.updateTimerUI();

      if (this.timerSeconds <= 0) {
        this.finishSession();
      }
    }, 1000);
    this.updateTimerUI();
  }

  pauseTimer() {
    this.isPaused = true;
  }

  resumeTimer() {
    this.isPaused = false;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  clearQuestionTimer() {
    if (this.questionTimerInterval) {
      clearInterval(this.questionTimerInterval);
      this.questionTimerInterval = null;
    }
  }

  startQuestionTimer(limitSeconds, onTimeout) {
    this.clearQuestionTimer();
    this.questionTimeRemaining = limitSeconds;

    const updateBar = () => {
      const secEl = this.elements.cardContainer?.querySelector('#qTimerSec');
      const fillEl = this.elements.cardContainer?.querySelector('#qTimerFill');
      const wrapEl = this.elements.cardContainer?.querySelector('#qTimerWrap');
      const rem = Math.max(0, this.questionTimeRemaining);
      const pct = limitSeconds > 0 ? Math.max(0, (rem / limitSeconds) * 100) : 0;

      if (secEl) secEl.textContent = `${rem} dtk`;
      if (fillEl) fillEl.style.width = `${pct}%`;
      if (wrapEl) {
        wrapEl.classList.toggle('q-timer-warn', rem <= 10 && rem > 5);
        wrapEl.classList.toggle('q-timer-danger', rem <= 5);
      }
    };

    updateBar();

    this.questionTimerInterval = setInterval(() => {
      if (this.isPaused || !this.sessionActive) return;

      this.questionTimeRemaining--;
      updateBar();

      if (this.questionTimeRemaining <= 5 && this.questionTimeRemaining > 0) {
        sound.playTick();
      }

      if (this.questionTimeRemaining <= 0) {
        this.clearQuestionTimer();
        if (typeof onTimeout === 'function') {
          onTimeout();
        }
      }
    }, 1000);
  }

  finishSession() {
    clearInterval(this.timerInterval);
    this.clearQuestionTimer();
    clearTimeout(this.autoAdvanceTimeout);
    this.speechRecognizer?.stop();
    this.sessionActive = false;

    const isGraded = (this.sessionType === 'quiz');

    // Early Exit Penalization: Any unanswered question in byte queue counts as wrong
    const totalByte = (this.drillQueue && this.drillQueue.length > 0) ? this.drillQueue.length : (SESSION_BYTE_SIZE || 8);
    const answeredCount = Math.min(this.cardsReviewed, totalByte);
    const unansweredCount = Math.max(0, totalByte - answeredCount);

    if (unansweredCount > 0) {
      this.wrongCount += unansweredCount;
      const unansweredCards = this.drillQueue.slice(answeredCount);
      if (isGraded) {
        unansweredCards.forEach(card => {
          if (card && card.id) {
            progress.recordCardReview(card.id, false);
          }
        });
      }
      this.cardsReviewed = totalByte;
    }

    const sessionScore = totalByte > 0 ? Math.round((this.correctCount / totalByte) * 100) : 0;

    // Bonus XP (Only awarded if session completed without quitting early; Learning mode is 10% compared to Quiz mode)
    const quizBonus = this.elapsedSeconds >= 810 ? 50 : 15;
    const baseCompletionBonus = isGraded ? quizBonus : Math.max(1, Math.round(quizBonus * 0.1));
    const completionBonus = (unansweredCount === 0) ? baseCompletionBonus : 0;
    this.xpEarned += completionBonus;

    // Record session in SRS progress manager
    progress.addSessionRecord(
      this.elapsedSeconds,
      this.cardsReviewed,
      this.correctCount,
      this.wrongCount,
      this.xpEarned,
      isGraded
    );

    // Fire-and-forget server activity log for AI Advisor timing/performance analysis
    if (typeof fetch === 'function') {
      const now = new Date();
      let timezone = 'UTC';
      try {
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      } catch {}
      try {
        fetch('/api/activity/log', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'drill_complete',
            sessionType: this.sessionType || null,
            drillMode: this.currentMode || null,
            inputFormat: this.inputFormat || null,
            lessons: Array.isArray(this.selectedLessons) ? this.selectedLessons : [],
            durationSec: Math.max(0, Math.round(this.elapsedSeconds || 0)),
            cardsReviewed: this.cardsReviewed || 0,
            correctCount: this.correctCount || 0,
            wrongCount: this.wrongCount || 0,
            xpEarned: this.xpEarned || 0,
            localHour: now.getHours(),
            localDow: now.getDay(),
            timezone
          })
        }).catch(() => {});
      } catch {}
    }

    sound.playCompleteFanfare();

    if (this.elements.onSessionComplete) {
      this.elements.onSessionComplete({
        sessionType: this.sessionType,
        elapsedSeconds: this.elapsedSeconds,
        cardsReviewed: this.cardsReviewed,
        answeredCount,
        unansweredCount,
        byteSize: totalByte,
        selectedLessons: this.selectedLessons,
        correctCount: this.correctCount,
        wrongCount: this.wrongCount,
        accuracy: sessionScore,
        score: sessionScore,
        maxCombo: this.maxCombo,
        xpEarned: this.xpEarned
      });
    }
  }

  updateTimerUI() {
    if (!this.elements.timerDisplay) return;
    const mins = Math.floor(Math.max(0, this.timerSeconds) / 60);
    const secs = Math.max(0, this.timerSeconds) % 60;
    this.elements.timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Progress circle fill
    if (this.elements.timerRing) {
      const percent = (this.timerSeconds / this.initialSeconds);
      const circumference = 2 * Math.PI * 44; // r=44
      this.elements.timerRing.style.strokeDashoffset = (1 - percent) * circumference;
    }
  }

  updateStatsUI() {
    if (this.sessionType === 'learning') {
      // In Learning Mode: Show non-graded informative indicators
      if (this.elements.comboDisplay) {
        this.elements.comboDisplay.textContent = '💡 Belajar';
        this.elements.comboDisplay.classList.remove('active');
        const comboWrap = this.elements.comboDisplay.closest('.hud-combo-wrap');
        if (comboWrap) {
          comboWrap.querySelector('.combo-label').textContent = 'Mode:';
        }
      }
      if (this.elements.xpDisplay) {
        this.elements.xpDisplay.textContent = `+${this.xpEarned} XP`;
      }
      if (this.elements.progressCount) {
        this.elements.progressCount.textContent = `Kartu ${this.currentIndex + 1} / ${this.drillQueue.length}`;
      }
    } else {
      // In Quiz Mode
      if (this.elements.comboDisplay) {
        this.elements.comboDisplay.textContent = `${this.combo}x`;
        this.elements.comboDisplay.classList.toggle('active', this.combo >= 3);
        const comboWrap = this.elements.comboDisplay.closest('.hud-combo-wrap');
        if (comboWrap) {
          comboWrap.querySelector('.combo-label').textContent = 'Combo:';
        }
      }
      if (this.elements.xpDisplay) {
        this.elements.xpDisplay.textContent = `+${this.xpEarned} XP`;
      }
      if (this.elements.progressCount) {
        const displayIdx = Math.min(this.currentIndex + 1, this.drillQueue.length);
        this.elements.progressCount.textContent = `Soal ${displayIdx} / ${this.drillQueue.length}`;
      }
    }

    const lessonInfo = document.getElementById('drillActiveLessonInfo');
    if (lessonInfo) {
      const isAll = this.selectedLessons.includes('all') || this.selectedLessons.length >= 14 || this.selectedLessons.length === 0;
      if (isAll) {
        lessonInfo.textContent = 'Bab 1-14';
      } else if (this.selectedLessons.length === 1) {
        lessonInfo.textContent = `Bab ${this.selectedLessons[0]}`;
      } else {
        lessonInfo.textContent = `Bab ${this.selectedLessons.join(', ')}`;
      }
    }
  }

  getCurrentAudioLimiter(index = this.currentIndex) {
    const expectedLimit = getVoicePlaybackLimit(this.sessionType, this.currentMode);
    let limiter = this.cardAudioLimiters.get(index);
    if (!limiter || limiter.maxPlays !== expectedLimit) {
      limiter = new PlaybackLimiter(expectedLimit);
      this.cardAudioLimiters.set(index, limiter);
    }
    return limiter;
  }

  getManualAudioLimit(index = this.currentIndex) {
    return this.getCurrentAudioLimiter(index).maxPlays;
  }

  getRemainingManualAudioPlays(index = this.currentIndex) {
    return this.getCurrentAudioLimiter(index).getRemaining();
  }

  getUsedManualAudioPlays(index = this.currentIndex) {
    return this.getCurrentAudioLimiter(index).getUsed();
  }

  getPrimaryAudioTextForCurrentCard() {
    const card = this.currentCard;
    if (!card) return null;
    if (this.currentMode === 'vocab_booster_kana' || this.currentMode === 'vocab_booster_kanji') {
      return null;
    }
    if (this.currentMode === 'sentence_romaji') {
      return card.text || null;
    }
    if (this.currentMode === 'sentence_cloze') {
      return card.fullSentence || card.audioSentence || null;
    }
    return card.kana || card.kanji || null;
  }

  playManualAudio(text) {
    if (!text || this.isPaused) return false;
    const limiter = this.getCurrentAudioLimiter();
    const speaker = this.currentCard?.speaker || '';
    const played = sound.speakJapaneseManual(text, limiter, null, { speaker });
    this.updateAudioLimitUI();
    return played;
  }

  /**
   * Plays initial automatic audio once per question index.
   * - Quiz Mode: counts toward the 3x total playback limit (inclusive of original autoplay).
   * - Learning Mode: exempt from the 5x manual replay limit.
   */
  playInitialAutoAudio(text) {
    if (!text || this.autoPlayedIndices.has(this.currentIndex)) return false;
    this.autoPlayedIndices.add(this.currentIndex);
    if (this.sessionType === 'quiz') {
      return this.playManualAudio(text);
    }
    const speaker = this.currentCard?.speaker || '';
    sound.speakJapanese(text, null, { speaker });
    this.updateAudioLimitUI();
    return true;
  }

  updateAudioLimitUI(container = this.elements.cardContainer) {
    if (!container) return;
    const limiter = this.getCurrentAudioLimiter();
    const hasLimit = limiter.hasLimit();
    const limit = limiter.maxPlays;
    const used = limiter.getUsed();
    const remaining = limiter.getRemaining();
    const isExhausted = limiter.isExhausted();

    const limitBtns = container.querySelectorAll('[data-audio-limit-btn]');
    limitBtns.forEach((btn) => {
      if (!btn) return;
      if (hasLimit) {
        btn.disabled = isExhausted;
        btn.setAttribute('aria-disabled', String(isExhausted));
        btn.setAttribute('data-plays-used', String(used));
        btn.setAttribute('data-plays-remaining', String(remaining));
        btn.setAttribute('data-plays-limit', String(limit));
        btn.classList.toggle('audio-limit-reached', isExhausted);
      } else {
        btn.disabled = false;
        btn.removeAttribute('aria-disabled');
        btn.removeAttribute('data-plays-used');
        btn.removeAttribute('data-plays-remaining');
        btn.removeAttribute('data-plays-limit');
        btn.classList.remove('audio-limit-reached');
      }
    });

    const countEls = container.querySelectorAll('[data-audio-count]');
    countEls.forEach((el) => {
      if (!el) return;
      if (hasLimit) {
        el.textContent = `${remaining}/${limit}`;
        el.hidden = false;
        el.classList.toggle('exhausted', isExhausted);
        el.classList.toggle('audio-count-exhausted', isExhausted);
      } else {
        el.textContent = '';
        el.hidden = true;
        el.classList.remove('exhausted');
        el.classList.remove('audio-count-exhausted');
      }
    });
  }

  renderCurrentView() {
    this.clearQuestionTimer();
    clearTimeout(this.autoAdvanceTimeout);
    this.speechRecognizer?.stop();

    if (this.drillQueue.length === 0 || this.currentIndex >= this.drillQueue.length) {
      this.finishSession();
      return;
    }

    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }

    this.currentCard = this.drillQueue[this.currentIndex];
    this.updateStatsUI();

    // Speak Aloud Mode (5 Words + 3 Short Sentences, 50/50 Kana & Kanji)
    if (this.currentMode === 'speak_aloud' || this.inputFormat === 'speak') {
      this.renderSpeakAloudCard(this.currentCard);
      return;
    }

    // Vocabulary Booster 3-Pair Matching Mode (Kana or Kanji, 1-shot all-or-nothing)
    if (this.currentMode === 'vocab_booster_kana' || this.currentMode === 'vocab_booster_kanji') {
      this.renderVocabBoosterCard(this.currentCard);
      return;
    }

    // Full-Sentence Romaji Typing Mode (from Audio List, 30s/45s countdown timer)
    if (this.currentMode === 'sentence_romaji') {
      this.renderSentenceRomajiCard(this.currentCard);
      return;
    }

    // Cloze Mode Handler (Strict Kana/Kanji only, with context SVG)
    if (this.currentMode === 'sentence_cloze') {
      if (this.sessionType === 'learning') {
        this.renderLearningClozeCard(this.currentCard);
      } else {
        this.renderQuizClozeCard(this.currentCard);
      }
      return;
    }

    if (this.sessionType === 'learning') {
      if (this.inputFormat === 'typing') {
        this.renderTypingLearningCard(this.currentCard);
      } else {
        this.renderFlashcard(this.currentCard);
      }
    } else {
      if (this.inputFormat === 'typing') {
        this.renderTypingQuizCard(this.currentCard);
      } else {
        this.renderQuizCard(this.currentCard);
      }
    }
  }

  /* =========================================================
     LEARNING MODE: FLASHCARD STYLE (NON-GRADED)
     ========================================================= */
  renderFlashcard(card) {
    if (!this.elements.cardContainer) return;

    this.isFlashcardRevealed = false;

    // Track cards viewed in learning mode: 10% score weight vs Quiz Mode
    if (!this.viewedCardIds.has(card.id)) {
      this.viewedCardIds.add(card.id);
      this.cardsReviewed++;
      this.xpEarned += 1; // 10% of Quiz base XP (10 XP)
      progress.recordLearningCardCoverage(card.id); // 0.1 credit (10% of Quiz 1.0)
      this.updateStatsUI();
    }

    const isLastInByte = (this.currentIndex === this.drillQueue.length - 1);

    const html = `
      <div class="drill-card-inner learning-card-inner animate-in" id="flashcardElement">
        <!-- Top Flashcard Header -->
        <div class="drill-card-header">
          <div class="header-badges">
            <span class="badge lesson-badge">Bab ${card.lesson}</span>
            <span class="badge badge-learning-mode">💡 Mode Belajar (Flashcard)</span>
            <span class="badge type-badge">${card.type === 'katakana' ? 'Katakana' : 'Kanji & Kosakata'}</span>
          </div>
          <button type="button" class="audio-btn" id="flashcardAudioBtn" data-audio-limit-btn="true" title="Dengarkan Suara (R)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span>Dengarkan</span>
            <span class="audio-play-count" data-audio-count></span>
          </button>
        </div>

        <!-- Interactive Flip Card Container -->
        <div class="flashcard-interactive-box" id="flashcardInteractiveBox" title="Klik kartu atau tekan Spasi untuk membalik">
          <!-- FRONT: Large Kanji / Katakana -->
          <div class="flashcard-face flashcard-front">
            <div class="large-kanji flashcard-kanji-target">${card.kanji}</div>
          </div>

          <!-- BACK: Kana, Romaji, Meaning, Context Sentence (Revealed) -->
          <div class="flashcard-face flashcard-back" id="flashcardBack" hidden>
            <div class="flashcard-reading-row">
              <span class="flashcard-kana">${card.kana}</span>
              <span class="flashcard-romaji disp-romaji">(${card.romaji})</span>
            </div>
            
            <div class="flashcard-meaning-row disp-translation">
              <span class="flashcard-meaning-text">${card.meaningId}</span>
            </div>

            <div class="flashcard-context-box">
              <div class="fc-sentence-header">
                <span>Contoh dalam Kalimat:</span>
                <button type="button" class="btn-text-audio" id="speakFcSentenceBtn" data-audio-limit-btn="true" title="Dengarkan Kalimat Lengkap">
                  🔊 Putar Kalimat <span class="audio-play-count" data-audio-count></span>
                </button>
              </div>
              <p class="fc-sentence-ja">${card.sentence}</p>
              <p class="fc-sentence-id disp-translation">"${card.sentenceId}"</p>
            </div>
          </div>
        </div>

        <!-- Flashcard Control Bar -->
        <div class="flashcard-controls-row">
          <button type="button" class="btn btn-secondary btn-fc-nav" id="prevCardBtn" title="Kartu Sebelumnya (Panah Kiri)">
            <span>&larr; Sebelumnya</span>
          </button>

          <button type="button" class="btn btn-primary btn-fc-reveal" id="toggleRevealBtn">
            <span class="reveal-btn-icon">👁️</span>
            <span class="reveal-btn-text">Tampilkan Kartu (tekan spasi)</span>
          </button>

          <button type="button" class="btn ${isLastInByte ? 'btn-primary' : 'btn-secondary'} btn-fc-nav" id="nextCardBtn" title="Kartu Selanjutnya (Panah Kanan / Enter)">
            <span>${isLastInByte ? `Selesai (${this.drillQueue.length}/${this.drillQueue.length}) ✔` : 'Selanjutnya &rarr;'}</span>
          </button>
        </div>

        <div class="flashcard-tips-bottom">
          <span>Pintasan: <kbd>Spasi</kbd> Buka Kartu &bull; <kbd>&rarr;</kbd> atau <kbd>Enter</kbd> Lanjut &bull; <kbd>&larr;</kbd> Kembali &bull; <kbd>R</kbd> Ulang Suara</span>
        </div>
      </div>
    `;

    this.elements.cardContainer.innerHTML = html;

    // Auto pronunciation of the target kanji/kana (once per card per session)
    if (!this.autoPlayedIndices.has(this.currentIndex)) {
      this.autoPlayedIndices.add(this.currentIndex);
      sound.speakJapanese(card.kanji);
    }

    // Bind event handlers
    const interactiveBox = this.elements.cardContainer.querySelector('#flashcardInteractiveBox');
    const toggleBtn = this.elements.cardContainer.querySelector('#toggleRevealBtn');
    const prevBtn = this.elements.cardContainer.querySelector('#prevCardBtn');
    const nextBtn = this.elements.cardContainer.querySelector('#nextCardBtn');
    const audioBtn = this.elements.cardContainer.querySelector('#flashcardAudioBtn');
    const speakSentenceBtn = this.elements.cardContainer.querySelector('#speakFcSentenceBtn');

    if (interactiveBox) {
      interactiveBox.onclick = () => this.toggleFlashcardReveal();
    }
    if (toggleBtn) {
      toggleBtn.onclick = (e) => {
        e.stopPropagation();
        this.toggleFlashcardReveal();
      };
    }
    if (prevBtn) {
      prevBtn.onclick = () => this.prevFlashcard();
    }
    if (nextBtn) {
      nextBtn.onclick = () => this.nextFlashcard();
    }
    if (audioBtn) {
      audioBtn.onclick = (e) => {
        e.stopPropagation();
        this.playManualAudio(card.kana || card.kanji);
      };
    }
    if (speakSentenceBtn) {
      speakSentenceBtn.onclick = (e) => {
        e.stopPropagation();
        this.playManualAudio(card.sentence || card.kanji);
      };
    }

    this.updateAudioLimitUI();
  }

  toggleFlashcardReveal() {
    if (this.sessionType !== 'learning') return;
    this.isFlashcardRevealed = !this.isFlashcardRevealed;

    const back = this.elements.cardContainer.querySelector('#flashcardBack');
    const frontHint = this.elements.cardContainer.querySelector('.flashcard-front-hint');
    const toggleBtnText = this.elements.cardContainer.querySelector('.reveal-btn-text');
    const interactiveBox = this.elements.cardContainer.querySelector('#flashcardInteractiveBox');

    if (back) {
      back.hidden = !this.isFlashcardRevealed;
    }
    if (frontHint) {
      frontHint.style.display = this.isFlashcardRevealed ? 'none' : 'block';
    }
    if (interactiveBox) {
      interactiveBox.classList.toggle('revealed', this.isFlashcardRevealed);
    }
    if (toggleBtnText) {
      toggleBtnText.textContent = this.isFlashcardRevealed ? 'Tutup Kartu' : 'Tampilkan Kartu (tekan spasi)';
    }

    if (this.isFlashcardRevealed && this.currentCard && !this.autoRevealedIndices.has(this.currentIndex)) {
      this.autoRevealedIndices.add(this.currentIndex);
      sound.speakJapanese(this.currentCard.kana);
    }
  }

  nextFlashcard() {
    if (!this.sessionActive) return;
    this.currentIndex++;
    if (this.currentIndex >= this.drillQueue.length) {
      this.finishSession();
      return;
    }
    this.renderCurrentView();
    this.updateStatsUI();
  }

  prevFlashcard() {
    if (!this.sessionActive) return;
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderCurrentView();
      this.updateStatsUI();
    }
  }

  /* =========================================================
     QUIZ MODE: 4-CHOICE MULTIPLE CHOICE (GRADED WITH SRS)
     ========================================================= */
  renderQuizCard(card) {
    if (!this.elements.cardContainer) return;

    const options = this.generateOptions(card);

    const weaknessTitleHtml = this.currentMode === 'weakness_focus'
      ? `<div class="drill-mode-banner weakness-focus-banner">🎯 Fokus perbaikan skor Kamu</div>`
      : '';

    let html = `
      <div class="drill-card-inner animate-in">
        ${weaknessTitleHtml}
        <div class="drill-card-header">
          <div class="header-badges">
            <span class="badge lesson-badge">Bab ${card.lesson}</span>
            <span class="badge type-badge">${card.type === 'katakana' ? 'Katakana' : 'Kanji Reading'}</span>
            <span class="badge badge-timer-type">⏱️ ${QUIZ_NON_TYPING_LIMIT_SEC} dtk</span>
          </div>
          <button type="button" class="audio-btn" id="cardSpeechBtn" data-audio-limit-btn="true" title="Dengarkan Pengucapan (R / Space)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span>Dengarkan</span>
            <span class="audio-play-count" data-audio-count></span>
          </button>
        </div>

        <!-- Per-Question Countdown Timer Bar (25s Quiz Non-Typing) -->
        <div class="q-timer-wrap" id="qTimerWrap">
          <div class="q-timer-header">
            <span class="q-timer-label">⏳ Waktu Tersisa Soal Ini</span>
            <strong class="q-timer-sec" id="qTimerSec">${QUIZ_NON_TYPING_LIMIT_SEC} dtk</strong>
          </div>
          <div class="q-timer-track">
            <div class="q-timer-fill" id="qTimerFill" style="width: 100%;"></div>
          </div>
        </div>

        <div class="drill-kanji-target" id="targetWord">
          <span class="large-kanji">${card.kanji}</span>
        </div>

        <div class="drill-context-box">
          <p class="drill-sentence-hint">Konteks kalimat di transkrip:</p>
          <p class="drill-sentence-ja">${card.sentence}</p>
          <p class="drill-sentence-id disp-translation">"${card.sentenceId}"</p>
        </div>

        <div class="drill-prompt-text">
          Pilih cara membaca (Hiragana/Katakana) yang benar:
        </div>

        <div class="options-grid" id="optionsGrid">
          ${options.map((opt, i) => `
            <button type="button" class="option-btn" data-answer="${opt}" data-index="${i}">
              <span class="opt-key-tag">${i + 1}</span>
              <span class="opt-text">${opt}</span>
            </button>
          `).join('')}
        </div>

        <div class="drill-feedback-drawer" id="feedbackDrawer" hidden>
          <div class="feedback-content">
            <div class="feedback-status" id="feedbackStatus"></div>
            <div class="feedback-details">
              <p><strong>Bacaan:</strong> <span class="badge-reading">${card.kana}</span> <span class="quiz-romaji disp-romaji">(${card.romaji})</span></p>
              <p class="quiz-meaning-row disp-translation">${card.meaningId}</p>
            </div>
            <button type="button" class="btn btn-primary" id="nextCardBtn">Lanjut (Enter / Spasi) &rarr;</button>
          </div>
        </div>
      </div>
    `;

    this.elements.cardContainer.innerHTML = html;

    // Bind card speech (counts toward Quiz 3x total audio limit)
    const speechBtn = this.elements.cardContainer.querySelector('#cardSpeechBtn');
    if (speechBtn) {
      speechBtn.onclick = () => this.playManualAudio(card.sentence || card.kanji);
    }

    // Auto-pronounce (inclusive in Quiz Mode 3x limit)
    this.playInitialAutoAudio(card.kanji);
    this.updateAudioLimitUI();

    // Bind option buttons
    const optButtons = this.elements.cardContainer.querySelectorAll('.option-btn');
    optButtons.forEach(btn => {
      btn.onclick = () => this.handleAnswer(btn.dataset.answer, btn, card, false);
    });

    // Re-cache optionsGrid
    this.elements.optionsGrid = this.elements.cardContainer.querySelector('#optionsGrid');

    // Start 25s per-question countdown timer for Quiz MCQ
    this.startQuestionTimer(QUIZ_NON_TYPING_LIMIT_SEC, () => {
      this.handleAnswer(null, null, card, true);
    });
  }

  generateOptions(card) {
    const correct = card.kana;
    const rawDists = card.distractors || [];
    let uniqueDists = [...new Set(rawDists.filter(d => d && d !== correct))];

    // If card has more than 3 distractors, randomly sample 3 using Fisher-Yates
    if (uniqueDists.length > 3) {
      uniqueDists = fisherYatesShuffle(uniqueDists).slice(0, 3);
    }

    // Defensive fallback: If card has fewer than 3 distractors, sample distinct kana from master bank
    if (uniqueDists.length < 3 && Array.isArray(MASTER_DRILL_ITEMS)) {
      const candidates = MASTER_DRILL_ITEMS
        .filter(it => it && it.kana && it.kana !== correct && !uniqueDists.includes(it.kana))
        .map(it => it.kana);
      const shuffledPool = fisherYatesShuffle(candidates);
      for (const d of shuffledPool) {
        if (uniqueDists.length >= 3) break;
        if (!uniqueDists.includes(d)) {
          uniqueDists.push(d);
        }
      }
    }

    const chosenDists = uniqueDists.slice(0, 3);
    const combined = [correct, ...chosenDists];
    return fisherYatesShuffle(combined);
  }

  handleAnswer(selectedKana, buttonElement, card, isTimeout = false) {
    const allBtns = this.elements.cardContainer.querySelectorAll('.option-btn');
    if (allBtns.length > 0 && allBtns[0].disabled) return;

    this.clearQuestionTimer();
    const isCorrect = !isTimeout && (selectedKana === card.kana);
    this.cardsReviewed++;

    // Disable all options; in Quiz Mode do NOT reveal the correct answer when wrong
    allBtns.forEach(btn => {
      btn.disabled = true;
      if (isCorrect && btn.dataset.answer === card.kana) {
        btn.classList.add('correct');
      } else if (btn === buttonElement && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    const drawer = this.elements.cardContainer.querySelector('#feedbackDrawer');
    const status = this.elements.cardContainer.querySelector('#feedbackStatus');
    const details = drawer?.querySelector('.feedback-details');
    const nextBtn = this.elements.cardContainer.querySelector('#nextCardBtn');

    if (details) {
      details.hidden = !isCorrect;
    }

    if (isCorrect) {
      this.correctCount++;
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;

      const earnedXP = 10 + (this.combo > 1 ? Math.min(15, this.combo * 2) : 0);
      this.xpEarned += earnedXP;

      sound.playCorrect(this.combo);
      progress.recordCardReview(card.id, true);

      if (status) {
        status.innerHTML = renderCorrectBannerHtml(earnedXP, 'Hebat');
        status.className = 'feedback-status success';
      }
    } else {
      this.wrongCount++;
      this.combo = 0;
      sound.playWrong();
      progress.recordCardReview(card.id, false);

      if (status) {
        status.innerHTML = `<span class="icon-error">✖</span> <strong>Masih salah 💪</strong>`;
        status.className = 'feedback-status error';
      }
    }

    this.updateStatsUI();

    if (drawer) {
      drawer.hidden = false;
      drawer.classList.add('slide-up');
    }

    const isLastInByte = (this.currentIndex === this.drillQueue.length - 1);
    const advance = () => {
      clearTimeout(this.autoAdvanceTimeout);
      this.currentIndex++;
      this.renderCurrentView();
    };

    if (nextBtn) {
      if (isLastInByte) nextBtn.textContent = `Lihat Hasil (${this.drillQueue.length}/${this.drillQueue.length}) ✔`;
      nextBtn.focus();
      nextBtn.onclick = advance;
    }

    // Auto-advance on correct answer after 1.2s if user doesn't click next
    if (isCorrect) {
      this.autoAdvanceTimeout = setTimeout(() => {
        if (this.sessionActive) advance();
      }, 1200);
    }
  }

  /* =========================================================
     HARDEST MODE: FILL-IN-THE-BLANK (CLOZE SENTENCES)
     Strict Kana/Kanji ONLY (No Romaji, No Translations)
     With situational SVG vector illustration
     ========================================================= */
  renderQuizClozeCard(card) {
    if (!this.elements.cardContainer) return;

    // Shuffle options with Fisher-Yates so correct answer is uniformly distributed
    const shuffledOptions = fisherYatesShuffle(card.options || []);

    const html = `
      <div class="drill-card-inner cloze-card-inner animate-in">
        <div class="drill-card-header">
          <div class="header-badges">
            <span class="badge lesson-badge">第${card.lesson}課 (Bab ${card.lesson})</span>
            <span class="badge badge-hardest-cloze">🔥 Mode Paling Sulit</span>
            <span class="badge pos-badge">${card.posLabelJa}</span>
            <span class="badge badge-timer-type">⏱️ ${QUIZ_NON_TYPING_LIMIT_SEC} dtk</span>
          </div>
          <button type="button" class="audio-btn" id="clozeSpeechBtn" data-audio-limit-btn="true" title="Dengarkan Pengucapan (R / Spasi)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span>Dengarkan</span>
            <span class="audio-play-count" data-audio-count></span>
          </button>
        </div>

        <!-- Per-Question Countdown Timer Bar (25s Quiz Non-Typing) -->
        <div class="q-timer-wrap" id="qTimerWrap">
          <div class="q-timer-header">
            <span class="q-timer-label">⏳ Waktu Tersisa Soal Ini</span>
            <strong class="q-timer-sec" id="qTimerSec">${QUIZ_NON_TYPING_LIMIT_SEC} dtk</strong>
          </div>
          <div class="q-timer-track">
            <div class="q-timer-fill" id="qTimerFill" style="width: 100%;"></div>
          </div>
        </div>

        <!-- Situational Context Visual (Simple Vector SVG) -->
        <div class="cloze-context-visual-wrap">
          <div class="cloze-illustration-card" title="Konteks Situasi Kalimat">
            <div class="cloze-svg-container">
              ${getContextSvg(card.svgType)}
            </div>
            <span class="cloze-context-tag">Konteks Situasi</span>
          </div>
        </div>

        <!-- Target Japanese Sentence (Strict Kana/Kanji Only) -->
        <div class="cloze-sentence-display">
          <div class="cloze-sentence-text" id="clozeSentenceText">
            ${card.sentenceWithBlank.replace('〔 ＿＿＿ 〕', '<span class="cloze-blank-highlight" id="clozeBlankSlot">〔 ＿＿＿ 〕</span>')}
          </div>
        </div>

        <!-- Kana Options Grid (Choose from available Kana, 1-4 shortcuts) -->
        <div class="cloze-options-grid" id="clozeOptionsGrid">
          ${shuffledOptions.map((opt, idx) => `
            <button type="button" class="cloze-opt-btn" data-kana="${opt}" data-index="${idx}">
              <span class="opt-num-badge">${idx + 1}</span>
              <span class="opt-kana-reading">${opt}</span>
            </button>
          `).join('')}
        </div>

        <!-- Feedback Drawer (Strict Kana/Kanji Only) -->
        <div class="drill-feedback-drawer" id="clozeFeedbackDrawer" hidden>
          <div class="feedback-content">
            <div class="feedback-status" id="clozeFeedbackStatus"></div>
            <div class="feedback-details">
              <p><strong>正解 (Target):</strong> <span class="badge-reading">${card.targetWord} (${card.correctKana})</span></p>
            </div>
            <button type="button" class="btn btn-primary btn-large" id="nextClozeBtn">Lanjut (Enter / Spasi) &rarr;</button>
          </div>
        </div>
      </div>
    `;

    this.elements.cardContainer.innerHTML = html;

    const speechBtn = this.elements.cardContainer.querySelector('#clozeSpeechBtn');
    if (speechBtn) {
      speechBtn.onclick = () => this.playManualAudio(card.fullSentence || card.audioSentence);
    }
    this.updateAudioLimitUI();

    const optBtns = this.elements.cardContainer.querySelectorAll('.cloze-opt-btn');
    optBtns.forEach(btn => {
      btn.onclick = () => this.handleClozeAnswer(btn.dataset.kana, btn, card, false);
    });

    // Start 25s per-question countdown timer for Quiz Cloze
    this.startQuestionTimer(QUIZ_NON_TYPING_LIMIT_SEC, () => {
      this.handleClozeAnswer(null, null, card, true);
    });
  }

  handleClozeAnswer(chosenKana, buttonElement, card, isTimeout = false) {
    const allBtns = this.elements.cardContainer.querySelectorAll('.cloze-opt-btn');
    if (allBtns.length > 0 && allBtns[0].disabled) return;

    this.clearQuestionTimer();
    const isCorrect = !isTimeout && (chosenKana === card.correctKana);
    this.cardsReviewed++;

    allBtns.forEach(btn => {
      btn.disabled = true;
      if (isCorrect && btn.dataset.kana === card.correctKana) {
        btn.classList.add('correct');
      } else if (btn === buttonElement && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    const blankSlot = this.elements.cardContainer.querySelector('#clozeBlankSlot');
    if (blankSlot && isCorrect) {
      blankSlot.innerHTML = `<span class="filled-cloze-target correct">${card.targetWord} (${card.correctKana})</span>`;
    } else if (blankSlot && !isCorrect) {
      blankSlot.classList.add('wrong');
    }

    const drawer = this.elements.cardContainer.querySelector('#clozeFeedbackDrawer');
    const status = this.elements.cardContainer.querySelector('#clozeFeedbackStatus');
    const details = drawer?.querySelector('.feedback-details');
    const nextBtn = this.elements.cardContainer.querySelector('#nextClozeBtn');

    if (details) {
      details.hidden = !isCorrect;
    }

    if (isCorrect) {
      this.correctCount++;
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;

      const earnedXP = 20 + (this.combo > 1 ? Math.min(20, this.combo * 2) : 0);
      this.xpEarned += earnedXP;

      sound.playCorrect(this.combo);
      progress.recordCardReview(card.id, true);

      if (status) {
        status.innerHTML = renderCorrectBannerHtml(earnedXP, '正解！ Hebat');
        status.className = 'feedback-status success';
      }

      sound.speakJapanese(card.fullSentence || card.audioSentence);
    } else {
      this.wrongCount++;
      this.combo = 0;
      sound.playWrong();
      progress.recordCardReview(card.id, false);

      if (status) {
        status.innerHTML = `<span class="icon-error">✖</span> <strong>残念！ Belum tepat.</strong>`;
        status.className = 'feedback-status error';
      }
    }

    this.updateStatsUI();

    if (drawer) {
      drawer.hidden = false;
      drawer.classList.add('slide-up');
    }

    const isLastInByte = (this.currentIndex === this.drillQueue.length - 1);
    const advance = () => {
      clearTimeout(this.autoAdvanceTimeout);
      this.currentIndex++;
      this.renderCurrentView();
    };

    if (nextBtn) {
      if (isLastInByte) nextBtn.textContent = `Lihat Hasil (${this.drillQueue.length}/${this.drillQueue.length}) ✔`;
      nextBtn.focus();
      nextBtn.onclick = advance;
    }

    if (isCorrect) {
      this.autoAdvanceTimeout = setTimeout(() => {
        if (this.sessionActive) advance();
      }, 1600);
    }
  }

  renderLearningClozeCard(card) {
    if (!this.elements.cardContainer) return;

    if (!this.viewedCardIds.has(card.id)) {
      this.viewedCardIds.add(card.id);
      this.cardsReviewed++;
      this.xpEarned += 2; // 10% of Cloze Quiz base XP (20 XP)
      progress.recordLearningCardCoverage(card.id); // 0.1 credit (10% of Quiz 1.0)
      this.updateStatsUI();
    }

    const isLastInByte = (this.currentIndex === this.drillQueue.length - 1);
    const shuffledOptions = fisherYatesShuffle(card.options || []);

    const html = `
      <div class="drill-card-inner cloze-card-inner learning-card-inner animate-in">
        <div class="drill-card-header">
          <div class="header-badges">
            <span class="badge lesson-badge">第${card.lesson}課 (Bab ${card.lesson})</span>
            <span class="badge badge-learning-mode">💡 Mode Belajar (Kalimat Rumpang)</span>
            <span class="badge pos-badge">${card.posLabelJa}</span>
          </div>
          <button type="button" class="audio-btn" id="learningClozeSpeechBtn" data-audio-limit-btn="true" title="Dengarkan Pengucapan (R)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span>Dengarkan</span>
            <span class="audio-play-count" data-audio-count></span>
          </button>
        </div>

        <div class="cloze-context-visual-wrap">
          <div class="cloze-illustration-card" title="Konteks Situasi Kalimat">
            <div class="cloze-svg-container">
              ${getContextSvg(card.svgType)}
            </div>
            <span class="cloze-context-tag">Konteks Situasi</span>
          </div>
        </div>

        <div class="cloze-sentence-display">
          <div class="cloze-sentence-text" id="clozeSentenceText">
            ${card.sentenceWithBlank.replace('〔 ＿＿＿ 〕', '<span class="cloze-blank-highlight" id="clozeBlankSlot">〔 ＿＿＿ 〕</span>')}
          </div>
        </div>

        <div class="cloze-options-grid" id="clozeOptionsGrid">
          ${shuffledOptions.map((opt, idx) => `
            <button type="button" class="cloze-opt-btn" data-kana="${opt}" data-index="${idx}">
              <span class="opt-num-badge">${idx + 1}</span>
              <span class="opt-kana-reading">${opt}</span>
            </button>
          `).join('')}
        </div>

        <div class="learning-feedback-banner" id="learningClozeBanner" hidden></div>

        <div class="flashcard-controls-row">
          <button type="button" class="btn btn-secondary btn-fc-nav" id="btnPrevCloze">
            <span>&larr; Sebelumnya</span>
          </button>
          <button type="button" class="btn btn-secondary" id="btnRevealCloze">
            <span>👁️ Buka Kunci Jawaban</span>
          </button>
          <button type="button" class="btn btn-primary btn-fc-nav" id="btnNextCloze">
            <span>${isLastInByte ? `Selesai (${this.drillQueue.length}/${this.drillQueue.length}) ✔` : 'Selanjutnya &rarr;'}</span>
          </button>
        </div>
      </div>
    `;

    this.elements.cardContainer.innerHTML = html;

    const speechBtn = this.elements.cardContainer.querySelector('#learningClozeSpeechBtn');
    if (speechBtn) {
      speechBtn.onclick = () => this.playManualAudio(card.fullSentence || card.audioSentence);
    }

    const blankSlot = this.elements.cardContainer.querySelector('#clozeBlankSlot');
    const banner = this.elements.cardContainer.querySelector('#learningClozeBanner');
    const optBtns = this.elements.cardContainer.querySelectorAll('.cloze-opt-btn');
    const revealBtn = this.elements.cardContainer.querySelector('#btnRevealCloze');
    const prevBtn = this.elements.cardContainer.querySelector('#btnPrevCloze');
    const nextBtn = this.elements.cardContainer.querySelector('#btnNextCloze');

    const revealAnswer = (chosenOpt = null) => {
      optBtns.forEach(btn => {
        if (btn.dataset.kana === card.correctKana) {
          btn.classList.add('correct');
        } else if (chosenOpt && btn.dataset.kana === chosenOpt && chosenOpt !== card.correctKana) {
          btn.classList.add('wrong');
        }
      });
      if (blankSlot) {
        blankSlot.innerHTML = `<span class="filled-cloze-target correct">${card.targetWord} (${card.correctKana})</span>`;
      }
      if (banner) {
        banner.hidden = false;
        banner.className = 'learning-feedback-banner success';
        const isCorrectPick = chosenOpt && chosenOpt === card.correctKana;
        banner.innerHTML = isCorrectPick
          ? renderCorrectBannerHtml(5, 'Hebat', ` <span style="font-weight:600;">(${card.targetWord}・${card.correctKana})</span>`)
          : `✔ <strong>Jawaban: ${card.targetWord}（${card.correctKana}）</strong>`;
      }
      if (!this.autoRevealedIndices.has(this.currentIndex)) {
        this.autoRevealedIndices.add(this.currentIndex);
        sound.speakJapanese(card.fullSentence || card.audioSentence);
      }
    };

    optBtns.forEach(btn => {
      btn.onclick = () => {
        const isRight = (btn.dataset.kana === card.correctKana);
        if (isRight) {
          sound.playCorrect(1);
          this.xpEarned += 5;
          this.updateStatsUI();
        }
        revealAnswer(btn.dataset.kana);
      };
    });

    if (revealBtn) revealBtn.onclick = () => revealAnswer();
    if (prevBtn) prevBtn.onclick = () => this.prevFlashcard();
    if (nextBtn) nextBtn.onclick = () => this.nextFlashcard();

    this.updateAudioLimitUI();
  }

  /* =========================================================
     QUIZ MODE: DIRECT TYPING KANJI / KANA CHARACTER DRILL
     ========================================================= */
  renderTypingQuizCard(card) {
    if (!this.elements.cardContainer) return;

    const isKatakana = (card.type === 'katakana');

    const html = `
      <div class="drill-card-inner animate-in typing-card-inner">
        <!-- Top Card Header -->
        <div class="drill-card-header">
          <div class="header-badges">
            <span class="badge lesson-badge">Bab ${card.lesson}</span>
            <span class="badge badge-typing-mode">⌨️ Ketik Langsung (Quiz)</span>
            <span class="badge type-badge">${isKatakana ? 'Katakana' : 'Kanji & Kosakata'}</span>
            <span class="badge badge-timer-type">⏱️ ${WORD_TYPING_LIMIT_SEC} dtk</span>
          </div>
          <button type="button" class="audio-btn" id="cardSpeechBtn" data-audio-limit-btn="true" title="Dengarkan Suara (R)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span>Dengarkan</span>
            <span class="audio-play-count" data-audio-count></span>
          </button>
        </div>

        <!-- Per-Question Countdown Timer Bar (25s) -->
        <div class="q-timer-wrap" id="qTimerWrap">
          <div class="q-timer-header">
            <span class="q-timer-label">⏳ Waktu Tersisa Soal Ini</span>
            <strong class="q-timer-sec" id="qTimerSec">${WORD_TYPING_LIMIT_SEC} dtk</strong>
          </div>
          <div class="q-timer-track">
            <div class="q-timer-fill" id="qTimerFill" style="width: 100%;"></div>
          </div>
        </div>

        <!-- Target Kanji / Word -->
        <div class="drill-kanji-target" id="targetWord">
          <span class="large-kanji">${card.kanji}</span>
        </div>

        <!-- Sentence Context -->
        <div class="drill-context-box">
          <p class="drill-sentence-hint">Konteks kalimat di transkrip:</p>
          <p class="drill-sentence-ja">${card.sentence}</p>
          <p class="drill-sentence-id disp-translation">"${card.sentenceId}"</p>
        </div>

        <!-- Prompt Text -->
        <div class="drill-prompt-text">
          Tulis bacaan <strong>Kana (${isKatakana ? 'Katakana' : 'Hiragana'})</strong> menggunakan Keyboard Kana di bawah:
        </div>

        <!-- Interactive Kana Typing Field + On-Screen Japanese Kana Keyboard -->
        <div class="typing-box-container">
          <div class="typing-input-row">
            <input type="text"
              id="drillTypingInput"
              class="japanese-typing-input"
              placeholder="Gunakan Keyboard Kana di bawah (tanpa Romaji)..."
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              autofocus />
            <button type="button" class="btn btn-primary btn-submit-typing" id="submitTypingBtn">
              <span>Kirim ⏎</span>
            </button>
          </div>

          <div class="kana-only-notice" id="wordRomajiNotice" hidden>
            ⌨️ Mode uji menulis Kana: gunakan <strong>Keyboard Kana</strong> di bawah (huruf Romaji tidak diterima).
          </div>

          ${renderKanaKeyboardHtml(isKatakana ? 'katakana' : 'hiragana')}
        </div>

        <!-- Feedback Drawer -->
        <div class="drill-feedback-drawer" id="feedbackDrawer" hidden>
          <div class="feedback-content">
            <div class="feedback-status" id="feedbackStatus"></div>
            <div class="feedback-details">
              <p><strong>Jawaban Benar:</strong> <span class="badge-reading">${card.kana}</span> <span class="quiz-romaji disp-romaji">(${card.romaji})</span></p>
              <p class="quiz-meaning-row disp-translation">${card.meaningId}</p>
            </div>
            <button type="button" class="btn btn-primary" id="nextCardBtn">Lanjut (Enter) &rarr;</button>
          </div>
        </div>
      </div>
    `;

    this.elements.cardContainer.innerHTML = html;

    // Auto-pronounce (inclusive in Quiz Mode 3x limit)
    this.playInitialAutoAudio(card.kanji);

    const speechBtn = this.elements.cardContainer.querySelector('#cardSpeechBtn');
    if (speechBtn) {
      speechBtn.onclick = () => this.playManualAudio(card.sentence || card.kanji);
    }
    this.updateAudioLimitUI();

    const input = this.elements.cardContainer.querySelector('#drillTypingInput');
    const submitBtn = this.elements.cardContainer.querySelector('#submitTypingBtn');
    const romajiNotice = this.elements.cardContainer.querySelector('#wordRomajiNotice');

    if (input) {
      input.focus();
      input.addEventListener('input', () => {
        if (romajiNotice) {
          romajiNotice.hidden = !/[a-zA-Z]/.test(input.value);
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleTypingAnswer(input.value, card);
        }
      });

      attachKanaKeyboard(this.elements.cardContainer, input, {
        onUpdate: (val) => {
          if (romajiNotice) romajiNotice.hidden = !/[a-zA-Z]/.test(val);
        }
      });
    }

    if (submitBtn) {
      submitBtn.onclick = () => {
        if (input) this.handleTypingAnswer(input.value, card, false);
      };
    }

    // Start 25s per-question countdown timer for Word Typing (Quiz Mode)
    this.startQuestionTimer(WORD_TYPING_LIMIT_SEC, () => {
      this.handleTypingAnswer('', card, true);
    });
  }

  handleTypingAnswer(typedVal, card, isTimeout = false) {
    const input = this.elements.cardContainer.querySelector('#drillTypingInput');
    const submitBtn = this.elements.cardContainer.querySelector('#submitTypingBtn');
    const drawer = this.elements.cardContainer.querySelector('#feedbackDrawer');
    const status = this.elements.cardContainer.querySelector('#feedbackStatus');
    const details = drawer?.querySelector('.feedback-details');
    const nextBtn = this.elements.cardContainer.querySelector('#nextCardBtn');

    if (input && input.disabled) return;

    const check = isTimeout ? { isCorrect: false, rejectedRomaji: false } : checkKanaOnlyMatch(typedVal, card);
    if (!isTimeout && check.rejectedRomaji) {
      const romajiNotice = this.elements.cardContainer.querySelector('#wordRomajiNotice');
      if (romajiNotice) romajiNotice.hidden = false;
      if (input) input.focus();
      return;
    }

    this.clearQuestionTimer();
    if (input) input.disabled = true;
    if (submitBtn) submitBtn.disabled = true;

    this.cardsReviewed++;
    const isCorrect = !isTimeout && check.isCorrect;

    if (isCorrect) {
      this.correctCount++;
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;

      // Higher XP bonus for typing: +15 XP base + combo bonus
      const earnedXP = 15 + (this.combo > 1 ? Math.min(20, this.combo * 3) : 0);
      this.xpEarned += earnedXP;

      sound.playCorrect(this.combo);
      progress.recordCardReview(card.id, true);

      if (input) input.classList.add('correct');
      if (status) {
        status.innerHTML = renderCorrectBannerHtml(earnedXP, 'Hebat');
        status.className = 'feedback-status success';
      }
    } else {
      this.wrongCount++;
      this.combo = 0;
      sound.playWrong();
      progress.recordCardReview(card.id, false);

      if (input) input.classList.add('wrong');

      if (status) {
        status.innerHTML = isTimeout
          ? `<span class="icon-error">⏰</span> <strong>Waktu Habis (${WORD_TYPING_LIMIT_SEC} dtk)! Pindah ke soal berikutnya...</strong>`
          : `<span class="icon-error">✖</span> <strong>Masih salah 💪</strong>`;
        status.className = 'feedback-status error';
      }
    }

    if (details) {
      details.hidden = !isCorrect;
    }

    this.updateStatsUI();

    if (drawer) {
      drawer.hidden = false;
      drawer.classList.add('slide-up');
    }

    const isLastInByte = (this.currentIndex === this.drillQueue.length - 1);
    const advance = () => {
      this.clearQuestionTimer();
      clearTimeout(this.autoAdvanceTimeout);
      if (!this.sessionActive) return;
      this.currentIndex++;
      this.renderCurrentView();
    };

    if (nextBtn) {
      if (isLastInByte) nextBtn.textContent = `Lihat Hasil (${this.drillQueue.length}/${this.drillQueue.length}) ✔`;
      nextBtn.focus();
      nextBtn.onclick = advance;
    }

    if (isTimeout) {
      this.autoAdvanceTimeout = setTimeout(() => {
        if (this.sessionActive) advance();
      }, 1500);
    } else if (isCorrect) {
      this.autoAdvanceTimeout = setTimeout(() => {
        if (this.sessionActive) advance();
      }, 1300);
    }
  }

  /* =========================================================
     LEARNING MODE: DIRECT TYPING PRACTICE (NON-GRADED)
     ========================================================= */
  renderTypingLearningCard(card) {
    if (!this.elements.cardContainer) return;

    if (!this.viewedCardIds.has(card.id)) {
      this.viewedCardIds.add(card.id);
      this.cardsReviewed++;
      this.xpEarned += 2; // ~10% of Typing Quiz base XP (15 XP)
      progress.recordLearningCardCoverage(card.id); // 0.1 credit (10% of Quiz 1.0)
      this.updateStatsUI();
    }

    const isLastInByte = (this.currentIndex === this.drillQueue.length - 1);
    const isKatakana = (card.type === 'katakana');

    const html = `
      <div class="drill-card-inner learning-card-inner animate-in typing-learning-inner">
        <!-- Top Card Header -->
        <div class="drill-card-header">
          <div class="header-badges">
            <span class="badge lesson-badge">Bab ${card.lesson}</span>
            <span class="badge badge-learning-mode">💡 Mode Belajar (Latihan Ketik)</span>
            <span class="badge type-badge">${isKatakana ? 'Katakana' : 'Kanji & Kosakata'}</span>
            <span class="badge badge-timer-type">⏱️ ${WORD_TYPING_LIMIT_SEC} dtk</span>
          </div>
          <button type="button" class="audio-btn" id="learningAudioBtn" data-audio-limit-btn="true" title="Dengarkan Suara (R)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span>Dengarkan</span>
            <span class="audio-play-count" data-audio-count></span>
          </button>
        </div>

        <!-- Per-Question Countdown Timer Bar (25s) -->
        <div class="q-timer-wrap" id="qTimerWrap">
          <div class="q-timer-header">
            <span class="q-timer-label">⏳ Waktu Tersisa Soal Ini</span>
            <strong class="q-timer-sec" id="qTimerSec">${WORD_TYPING_LIMIT_SEC} dtk</strong>
          </div>
          <div class="q-timer-track">
            <div class="q-timer-fill" id="qTimerFill" style="width: 100%;"></div>
          </div>
        </div>

        <!-- Target Word Display -->
        <div class="drill-kanji-target" id="targetWord">
          <span class="large-kanji">${card.kanji}</span>
        </div>

        <!-- Hints & Context Bar -->
        <div class="learning-hints-bar">
          <span class="learning-hint-item disp-romaji">
            Bacaan: <strong class="hint-kana">${card.kana}</strong> <span class="hint-romaji">(${card.romaji})</span>
          </span>
          <span class="learning-hint-item disp-translation">
            <strong class="hint-meaning">${card.meaningId}</strong>
          </span>
        </div>

        <!-- Sentence Context -->
        <div class="flashcard-context-box">
          <div class="fc-sentence-header">
            <span>Contoh dalam Kalimat:</span>
            <button type="button" class="btn-text-audio" id="speakLearningSentenceBtn" data-audio-limit-btn="true">🔊 Putar Kalimat <span class="audio-play-count" data-audio-count></span></button>
          </div>
          <p class="fc-sentence-ja">${card.sentence}</p>
          <p class="fc-sentence-id disp-translation">"${card.sentenceId}"</p>
        </div>

        <!-- Typing Practice Input + Japanese Kana On-Screen Keyboard -->
        <div class="typing-box-container">
          <div class="typing-input-row">
            <input type="text"
              id="learningTypingInput"
              class="japanese-typing-input"
              placeholder="Tulis dengan Keyboard Kana di bawah..."
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              autofocus />
            <button type="button" class="btn btn-primary" id="btnCheckTyping">
              <span>Periksa & Suara ⏎</span>
            </button>
          </div>

          <div class="kana-only-notice" id="learningRomajiNotice" hidden>
            ⌨️ Gunakan <strong>Keyboard Kana</strong> di bawah untuk melatih penulisan Kana (tanpa Romaji).
          </div>

          ${renderKanaKeyboardHtml(isKatakana ? 'katakana' : 'hiragana')}
        </div>

        <!-- Learning Feedback Notice -->
        <div class="learning-feedback-banner" id="learningFeedbackBanner" hidden></div>

        <!-- Controls Row -->
        <div class="flashcard-controls-row">
          <button type="button" class="btn btn-secondary btn-fc-nav" id="btnPrevLearning">
            <span>&larr; Sebelumnya</span>
          </button>
          <button type="button" class="btn btn-secondary" id="btnRevealLearning">
            <span>👁️ Buka Kunci Jawaban</span>
          </button>
          <button type="button" class="btn btn-primary btn-fc-nav" id="btnNextLearning">
            <span>${isLastInByte ? `Selesai (${this.drillQueue.length}/${this.drillQueue.length}) ✔` : 'Selanjutnya &rarr;'}</span>
          </button>
        </div>
      </div>
    `;

    this.elements.cardContainer.innerHTML = html;

    if (!this.autoPlayedIndices.has(this.currentIndex)) {
      this.autoPlayedIndices.add(this.currentIndex);
      sound.speakJapanese(card.kanji);
    }

    const input = this.elements.cardContainer.querySelector('#learningTypingInput');
    const checkBtn = this.elements.cardContainer.querySelector('#btnCheckTyping');
    const revealBtn = this.elements.cardContainer.querySelector('#btnRevealLearning');
    const prevBtn = this.elements.cardContainer.querySelector('#btnPrevLearning');
    const nextBtn = this.elements.cardContainer.querySelector('#btnNextLearning');
    const audioBtn = this.elements.cardContainer.querySelector('#learningAudioBtn');
    const sentenceAudioBtn = this.elements.cardContainer.querySelector('#speakLearningSentenceBtn');
    const banner = this.elements.cardContainer.querySelector('#learningFeedbackBanner');
    const romajiNotice = this.elements.cardContainer.querySelector('#learningRomajiNotice');

    if (input) {
      input.focus();
      input.addEventListener('input', () => {
        if (romajiNotice) romajiNotice.hidden = !/[a-zA-Z]/.test(input.value);
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          checkAnswer();
        }
      });

      attachKanaKeyboard(this.elements.cardContainer, input, {
        onUpdate: (val) => {
          if (romajiNotice) romajiNotice.hidden = !/[a-zA-Z]/.test(val);
        }
      });
    }

    const checkAnswer = () => {
      if (!input) return;
      const val = input.value.trim();
      const check = checkKanaOnlyMatch(val, card);

      if (check.rejectedRomaji) {
        if (romajiNotice) romajiNotice.hidden = false;
        input.focus();
        return;
      }

      if (check.isCorrect) {
        sound.playCorrect(1);
        if (!this.autoRevealedIndices.has(this.currentIndex)) {
          this.autoRevealedIndices.add(this.currentIndex);
          sound.speakJapanese(card.kana || card.kanji);
        }
        input.classList.remove('wrong');
        input.classList.add('correct');
        if (banner) {
          banner.hidden = false;
          banner.className = 'learning-feedback-banner success';
          banner.innerHTML = `✔ <strong>Tepat sekali!</strong> Pelafalan: <em>${card.kana}</em> (${card.romaji}). Tekan Selanjutnya untuk kata berikutnya!`;
        }
      } else {
        if (!this.autoRevealedIndices.has(this.currentIndex)) {
          this.autoRevealedIndices.add(this.currentIndex);
          sound.speakJapanese(card.kana || card.kanji);
        }
        input.classList.add('wrong');
        if (banner) {
          banner.hidden = false;
          banner.className = 'learning-feedback-banner info';
          banner.innerHTML = `💡 Jawaban yang benar: <strong>${card.kana}</strong> (${card.romaji}) &mdash; ${card.meaningId}`;
        }
      }
    };

    if (checkBtn) checkBtn.onclick = checkAnswer;

    if (revealBtn) {
      revealBtn.onclick = () => {
        if (!input) return;
        input.value = card.kana;
        checkAnswer();
      };
    }

    if (prevBtn) prevBtn.onclick = () => this.prevFlashcard();
    if (nextBtn) nextBtn.onclick = () => this.nextFlashcard();

    if (audioBtn) {
      audioBtn.onclick = (e) => {
        e.stopPropagation();
        this.playManualAudio(card.kana || card.kanji);
      };
    }

    if (sentenceAudioBtn) {
      sentenceAudioBtn.onclick = (e) => {
        e.stopPropagation();
        this.playManualAudio(card.sentence || card.kanji);
      };
    }

    this.updateAudioLimitUI();

    // Start 25s per-question countdown timer for Word Typing (Learning Mode)
    this.startQuestionTimer(WORD_TYPING_LIMIT_SEC, () => {
      if (!this.sessionActive) return;
      if (input) input.disabled = true;
      if (checkBtn) checkBtn.disabled = true;
      sound.playWrong();
      if (banner) {
        banner.hidden = false;
        banner.className = 'learning-feedback-banner hint';
        banner.innerHTML = `⏰ <strong>Waktu Habis (${WORD_TYPING_LIMIT_SEC} dtk)!</strong> Kunci: <strong>${card.kana}</strong> — pindah ke soal berikutnya...`;
      }
      this.autoAdvanceTimeout = setTimeout(() => {
        if (this.sessionActive) this.nextFlashcard();
      }, 1500);
    });
  }

  /* =========================================================
     FULL-SENTENCE ROMAJI TYPING (FROM AUDIO LIST • 30s / 45s)
     ========================================================= */
  renderSentenceRomajiCard(card) {
    if (!this.elements.cardContainer) return;

    const isLearning = (this.sessionType === 'learning');
    const isLastInByte = (this.currentIndex === this.drillQueue.length - 1);
    const limitSec = FULL_SENTENCE_TYPING_LIMIT_SEC;

    if (isLearning && !this.viewedCardIds.has(card.id)) {
      this.viewedCardIds.add(card.id);
      this.cardsReviewed++;
      this.xpEarned += 2; // 10% of Quiz base XP
      progress.recordLearningCardCoverage(card.id); // 0.1 credit (10% of Quiz 1.0)
      this.updateStatsUI();
    }

    const learningHintHtml = isLearning ? `
      <div class="sentence-romaji-learning-hints">
        <span class="learning-hint-item disp-romaji"><strong>Romaji:</strong> ${card.romaji}</span>
        <span class="learning-hint-item disp-translation">${card.translation}</span>
      </div>
    ` : '';

    const html = `
      <div class="drill-card-inner sentence-romaji-card animate-in">
        <div class="drill-card-header">
          <div class="header-badges">
            <span class="badge lesson-badge">Bab ${card.lesson}</span>
            <span class="badge ${isLearning ? 'badge-learning-mode' : 'badge-romaji-mode'}">
              ${isLearning ? '💡 Mode Belajar (Ketik Romaji)' : '✍️ Ketik Romaji Kalimat'}
            </span>
            <span class="badge badge-timer-type">⏱️ ${limitSec} dtk${card.isLongSentence ? ' • Kalimat Panjang' : ''}</span>
          </div>
          <button type="button" class="audio-btn" id="sRomajiAudioBtn" data-audio-limit-btn="true" title="Putar Ulang Audio Kalimat (R)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span>Dengarkan</span>
            <span class="audio-play-count" id="sRomajiAudioCount" data-audio-count></span>
          </button>
        </div>

        <!-- Per-Question Countdown Timer Bar (30s / 45s) -->
        <div class="q-timer-wrap" id="qTimerWrap">
          <div class="q-timer-header">
            <span class="q-timer-label">⏳ Waktu Tersisa Soal Ini</span>
            <strong class="q-timer-sec" id="qTimerSec">${limitSec} dtk</strong>
          </div>
          <div class="q-timer-track">
            <div class="q-timer-fill" id="qTimerFill" style="width: 100%;"></div>
          </div>
        </div>

        <!-- Full Japanese Sentence from Audio Transcript -->
        <div class="sentence-romaji-prompt-box">
          ${card.speaker ? `<span class="sromaji-speaker-tag">🎙️ ${card.speaker}${card.track ? ` • ${card.track}` : ''}</span>` : ''}
          <div class="sromaji-jp-text">${card.text}</div>
          ${learningHintHtml}
        </div>

        <!-- Kana Textarea Input Form + Japanese Kana On-Screen Keyboard -->
        <div class="sromaji-input-section">
          <div class="sromaji-label-row">
            <label for="sentenceRomajiInput" class="sromaji-input-label">Tulis bacaan <strong>Kana (Hiragana/Katakana)</strong> kalimat di atas:</label>
            <span class="sromaji-kbd-hint">Tekan <kbd>Enter</kbd> untuk kirim</span>
          </div>
          <textarea
            id="sentenceRomajiInput"
            class="sromaji-textarea"
            rows="2"
            placeholder="Gunakan Keyboard Kana di bawah untuk menulis kalimat..."
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          ></textarea>
          <div class="kana-only-notice" id="sRomajiLatinNotice" hidden>
            ⌨️ Mode uji menulis Kana: gunakan <strong>Keyboard Kana</strong> di bawah (huruf Romaji tidak diterima).
          </div>
          ${renderKanaKeyboardHtml('hiragana')}
          <div class="sromaji-actions-bar">
            ${isLearning ? `
              <button type="button" class="btn btn-secondary btn-sm" id="btnRevealSRomaji">
                <span>👁️ Lihat Kunci Kana</span>
              </button>
            ` : '<span></span>'}
            <button type="button" class="btn btn-primary btn-sromaji-submit" id="btnSubmitSRomaji">
              <span>Periksa Jawaban ✔</span>
            </button>
          </div>
        </div>

        <!-- Feedback Drawer -->
        <div class="feedback-drawer" id="sRomajiFeedback" hidden>
          <div class="feedback-status" id="sRomajiStatus"></div>
          <div class="feedback-details">
            <p><strong>Kana:</strong> <span class="badge-reading">${card.kana || card.text}</span></p>
            <p class="disp-romaji"><strong>Romaji:</strong> ${card.romaji}</p>
            <p class="disp-translation">${card.translation}</p>
          </div>
          <button type="button" class="btn btn-primary btn-next-card" id="btnNextSRomaji">
            ${isLastInByte ? `Lihat Hasil (${this.drillQueue.length}/${this.drillQueue.length}) ✔` : 'Lanjut Soal Berikutnya &rarr;'}
          </button>
        </div>
      </div>
    `;

    this.elements.cardContainer.innerHTML = html;

    // Auto-play full Japanese sentence audio (counts toward 3x limit in Quiz Mode; exempt in Learning Mode)
    this.playInitialAutoAudio(card.text);

    const input = this.elements.cardContainer.querySelector('#sentenceRomajiInput');
    const submitBtn = this.elements.cardContainer.querySelector('#btnSubmitSRomaji');
    const audioBtn = this.elements.cardContainer.querySelector('#sRomajiAudioBtn');
    const drawer = this.elements.cardContainer.querySelector('#sRomajiFeedback');
    const status = this.elements.cardContainer.querySelector('#sRomajiStatus');
    const nextBtn = this.elements.cardContainer.querySelector('#btnNextSRomaji');

    let isHandled = false;

    const advance = () => {
      this.clearQuestionTimer();
      clearTimeout(this.autoAdvanceTimeout);
      if (!this.sessionActive) return;
      this.currentIndex++;
      this.renderCurrentView();
    };

    const finalizeQuestion = (isCorrect, isTimeout = false) => {
      if (isHandled) return;
      isHandled = true;
      this.clearQuestionTimer();

      if (input) input.disabled = true;
      if (submitBtn) submitBtn.disabled = true;

      if (!isLearning) {
        this.cardsReviewed++;
        if (isCorrect) {
          this.correctCount++;
          this.combo++;
          if (this.combo > this.maxCombo) this.maxCombo = this.combo;
          const earnedXP = 15 + (this.combo > 1 ? Math.min(20, this.combo * 3) : 0);
          this.xpEarned += earnedXP;
          sound.playCorrect(this.combo);
          progress.recordCardReview(card.id, true);

          if (input) input.classList.add('correct');
          if (status) {
            status.innerHTML = renderCorrectBannerHtml(earnedXP, 'Hebat');
            status.className = 'feedback-status success';
          }
        } else {
          this.wrongCount++;
          this.combo = 0;
          sound.playWrong();
          progress.recordCardReview(card.id, false);

          if (input) input.classList.add('wrong');
          if (status) {
            status.innerHTML = isTimeout
              ? `<span class="icon-error">⏰</span> <strong>Waktu Habis (${limitSec} dtk)! Pindah ke soal berikutnya...</strong>`
              : `<span class="icon-error">✖</span> <strong>Belum tepat!</strong>`;
            status.className = 'feedback-status error';
          }
        }
        const details = drawer?.querySelector('.feedback-details');
        if (details) {
          details.hidden = !isCorrect;
        }
        this.updateStatsUI();
      } else {
        // Learning mode feedback
        if (isCorrect) {
          sound.playCorrect(1);
          if (input) input.classList.add('correct');
          if (status) {
            status.innerHTML = `<span class="icon-success">✔</span> <strong>Tepat sekali!</strong>`;
            status.className = 'feedback-status success';
          }
        } else {
          sound.playWrong();
          if (input) input.classList.add('wrong');
          if (status) {
            status.innerHTML = isTimeout
              ? `<span class="icon-error">⏰</span> <strong>Waktu Habis (${limitSec} dtk)! Pindah ke soal berikutnya...</strong>`
              : `<span class="icon-error">💡</span> <strong>Perhatikan bacaan Romaji yang benar:</strong>`;
            status.className = 'feedback-status error';
          }
        }
      }

      if (drawer) {
        drawer.hidden = false;
        drawer.classList.add('slide-up');
      }

      if (nextBtn) {
        nextBtn.focus();
        nextBtn.onclick = advance;
      }

      // Auto-advance on timeout (immediately after brief 1.5s answer glance) or correct answer (1.3s)
      if (isTimeout) {
        this.autoAdvanceTimeout = setTimeout(() => {
          if (this.sessionActive) advance();
        }, 1500);
      } else if (isCorrect) {
        this.autoAdvanceTimeout = setTimeout(() => {
          if (this.sessionActive) advance();
        }, 1300);
      }
    };

    const latinNotice = this.elements.cardContainer.querySelector('#sRomajiLatinNotice');

    const handleSubmit = () => {
      if (isHandled || !input) return;
      const val = input.value.trim();
      if (!val) {
        input.focus();
        return;
      }
      const res = checkSentenceKanaMatch(val, card);
      if (res.rejectedRomaji) {
        if (latinNotice) latinNotice.hidden = false;
        input.focus();
        return;
      }
      finalizeQuestion(res.isCorrect, false);
    };

    const revealBtn = this.elements.cardContainer.querySelector('#btnRevealSRomaji');

    if (input) {
      input.focus();
      input.addEventListener('input', () => {
        if (latinNotice) latinNotice.hidden = !/[a-zA-Z]/.test(input.value);
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
      });
      attachKanaKeyboard(this.elements.cardContainer, input, {
        onUpdate: (val) => {
          if (latinNotice) latinNotice.hidden = !/[a-zA-Z]/.test(val);
        }
      });
    }

    if (submitBtn) submitBtn.onclick = handleSubmit;

    if (revealBtn) {
      revealBtn.onclick = () => {
        if (isHandled || !input) return;
        input.value = card.kana || card.text;
        if (!this.autoRevealedIndices.has(this.currentIndex)) {
          this.autoRevealedIndices.add(this.currentIndex);
          sound.speakJapanese(card.text);
        }
        finalizeQuestion(false, false);
      };
    }

    if (audioBtn) {
      audioBtn.onclick = (e) => {
        e.stopPropagation();
        this.playManualAudio(card.text);
      };
    }

    this.updateAudioLimitUI();

    // Start per-question 30s / 45s countdown timer -> auto-advances when finished!
    this.startQuestionTimer(limitSec, () => {
      finalizeQuestion(false, true);
    });
  }

  /* =========================================================
     VOCABULARY BOOSTER: 3-PAIR MATCHING (KANA OR KANJI)
     1-Shot Opportunity • Full Score Only If All 3 Pairs Match
     ========================================================= */
  renderVocabBoosterCard(question) {
    if (!this.elements.cardContainer || !question) return;

    const isLearning = (this.sessionType === 'learning');
    const isKanjiMode = (question.scriptType === 'kanji');
    const isLastInByte = (this.currentIndex === this.drillQueue.length - 1);

    const leftItems = question.leftItems;
    const rightOrder = question.initialRightItems.map(it => ({ ...it }));
    let selectedSlot = null;
    let isSubmitted = false;
    let dragFromSlot = null;

    const renderBoard = () => {
      const rowsHtml = leftItems.map((left, idx) => {
        const right = rightOrder[idx];
        const isSelected = (selectedSlot === idx);
        const readingSub = (isLearning && isKanjiMode)
          ? `<span class="vb-kana-hint disp-romaji">${right.kana}</span>`
          : '';
        const audioBtnHtml = isLearning
          ? `<button type="button" class="vb-audio-mini" data-audio-limit-btn="true" data-audio-kana="${right.kana}" title="Dengarkan pelafalan">🔊</button>`
          : '';

        const isTextbookExtra = left.sourceTag === 'Textbook Extra';
        const sourceTagHtml = isTextbookExtra
          ? `<span class="vb-source-tag vb-source-extra" title="Kosakata tambahan dari materi pelajaran (tidak diucapkan di transkrip audio)">📘 Kosakata Tambahan</span>`
          : `<span class="vb-source-tag vb-source-transcript" title="Muncul langsung di transkrip audio Bab ${left.lesson}">🎧 Transcript</span>`;

        return `
          <div class="vb-pair-row" data-row="${idx}">
            <div class="vb-left-card">
              <span class="vb-row-num">${idx + 1}</span>
              <div class="vb-left-content">
                <span class="vb-meaning-text">${left.meaning}</span>
                <div class="vb-meta-row">
                  <span class="vb-bab-mini">Bab ${left.lesson}</span>
                  ${sourceTagHtml}
                </div>
              </div>
            </div>

            <div class="vb-connector" id="vbConn_${idx}">⇄</div>

            <div class="vb-right-card ${isSelected ? 'swap-selected' : ''}" draggable="${!isSubmitted}" data-slot="${idx}" tabindex="0" title="Klik untuk tukar posisi atau seret (drag & drop)">
              <span class="vb-drag-grip" aria-hidden="true">⠿</span>
              <div class="vb-jp-wrap">
                <span class="vb-jp-target ${isKanjiMode ? 'vb-kanji-font' : 'vb-kana-font'}">${right.target}</span>
                ${readingSub}
              </div>
              <div class="vb-right-controls">
                ${audioBtnHtml}
                <div class="vb-move-btns">
                  <button type="button" class="vb-move-btn" data-move="up" data-slot="${idx}" ${idx === 0 || isSubmitted ? 'disabled' : ''} title="Geser ke atas">▲</button>
                  <button type="button" class="vb-move-btn" data-move="down" data-slot="${idx}" ${idx === 2 || isSubmitted ? 'disabled' : ''} title="Geser ke bawah">▼</button>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      const boardEl = this.elements.cardContainer.querySelector('#vbPairingBoard');
      if (boardEl) {
        boardEl.innerHTML = rowsHtml;
        bindBoardEvents();
      }
      if (isLearning) {
        this.updateAudioLimitUI();
      }
    };

    const swapSlots = (a, b) => {
      if (isSubmitted || a === b || a < 0 || b < 0 || a >= 3 || b >= 3) return;
      const tmp = rightOrder[a];
      rightOrder[a] = rightOrder[b];
      rightOrder[b] = tmp;
      selectedSlot = null;
      renderBoard();
    };

    const bindBoardEvents = () => {
      if (isSubmitted) return;
      const rightCards = this.elements.cardContainer.querySelectorAll('.vb-right-card');
      const moveBtns = this.elements.cardContainer.querySelectorAll('.vb-move-btn');
      const audioBtns = this.elements.cardContainer.querySelectorAll('.vb-audio-mini');

      audioBtns.forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          this.playManualAudio(btn.dataset.audioKana);
        };
      });

      moveBtns.forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const slot = parseInt(btn.dataset.slot, 10);
          const dir = btn.dataset.move;
          if (dir === 'up' && slot > 0) swapSlots(slot, slot - 1);
          if (dir === 'down' && slot < 2) swapSlots(slot, slot + 1);
        };
      });

      rightCards.forEach(cardEl => {
        const slot = parseInt(cardEl.dataset.slot, 10);

        // Click-to-swap
        cardEl.onclick = () => {
          if (isSubmitted) return;
          if (selectedSlot === null) {
            selectedSlot = slot;
            renderBoard();
          } else if (selectedSlot === slot) {
            selectedSlot = null;
            renderBoard();
          } else {
            swapSlots(selectedSlot, slot);
          }
        };

        // Drag-and-drop swap
        cardEl.addEventListener('dragstart', (e) => {
          dragFromSlot = slot;
          cardEl.classList.add('dragging');
          if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', String(slot));
          }
        });

        cardEl.addEventListener('dragend', () => {
          cardEl.classList.remove('dragging');
          dragFromSlot = null;
        });

        cardEl.addEventListener('dragover', (e) => {
          e.preventDefault();
          cardEl.classList.add('drag-over');
        });

        cardEl.addEventListener('dragleave', () => {
          cardEl.classList.remove('drag-over');
        });

        cardEl.addEventListener('drop', (e) => {
          e.preventDefault();
          cardEl.classList.remove('drag-over');
          const from = dragFromSlot !== null ? dragFromSlot : parseInt(e.dataTransfer?.getData('text/plain'), 10);
          if (!isNaN(from) && from !== slot) {
            swapSlots(from, slot);
          }
        });
      });
    };

    const html = `
      <div class="drill-card-inner vocab-booster-card animate-in">
        <div class="drill-card-header">
          <div class="header-badges">
            <span class="badge lesson-badge">Bab ${question.lesson}</span>
            <span class="badge ${isKanjiMode ? 'badge-booster-kanji' : 'badge-booster-kana'}">
              ${isKanjiMode ? '🈳 Vocab Booster • Kanji' : '🔗 Vocab Booster • Kana'}
            </span>
            <span class="badge ${isLearning ? 'badge-learning-mode' : 'badge-oneshot'}">
              ${isLearning ? '💡 Mode Belajar (1× Kirim)' : '🎯 1× Kesempatan • Wajib 3/3 Benar'}
            </span>
            ${!isLearning ? `<span class="badge badge-timer-type">⏱️ ${QUIZ_NON_TYPING_LIMIT_SEC} dtk</span>` : ''}
          </div>
          ${isLearning ? `
            <span class="badge audio-quota-badge" id="vbAudioQuotaBadge" title="Sisa pemutaran suara soal ini">
              🔊 Sisa <span class="audio-play-count" data-audio-count></span>
            </span>
          ` : ''}
        </div>

        ${!isLearning ? `
        <!-- Per-Question Countdown Timer Bar (25s Quiz Non-Typing) -->
        <div class="q-timer-wrap" id="qTimerWrap">
          <div class="q-timer-header">
            <span class="q-timer-label">⏳ Waktu Tersisa Soal Ini</span>
            <strong class="q-timer-sec" id="qTimerSec">${QUIZ_NON_TYPING_LIMIT_SEC} dtk</strong>
          </div>
          <div class="q-timer-track">
            <div class="q-timer-fill" id="qTimerFill" style="width: 100%;"></div>
          </div>
        </div>
        ` : ''}

        <p class="vb-instructions">
          Pasangkan <strong>3 kata Indonesia (kiri)</strong> dengan <strong>3 ${isKanjiMode ? 'Kanji' : 'Kana'} (kanan)</strong>.
          Gunakan tombol <strong>▲/▼</strong>, atau seret (drag) untuk memindahkan.
        </p>

        <div class="vb-col-headers">
          <span>🇮🇩 Arti (Indonesia)</span>
          <span></span>
          <span>🇯🇵 ${isKanjiMode ? 'Kanji (Susun Posisi)' : 'Kana (Susun Posisi)'}</span>
        </div>

        <div class="vb-pairing-board" id="vbPairingBoard"></div>

        <div class="vb-submit-row" id="vbSubmitRow">
          <button type="button" class="btn btn-primary btn-vb-submit" id="btnSubmitVocabBooster">
            <span>✔ Kunci & Kirim Jawaban (1× Kesempatan)</span>
          </button>
        </div>

        <div class="feedback-drawer" id="vbFeedbackDrawer" hidden>
          <div class="feedback-status" id="vbFeedbackStatus"></div>
          <div class="vb-answer-key" id="vbAnswerKey"></div>
          <button type="button" class="btn btn-primary btn-next-card" id="btnNextVocabBooster">
            ${isLastInByte ? `Lihat Hasil (${this.drillQueue.length}/${this.drillQueue.length}) ✔` : 'Lanjut Soal Berikutnya &rarr;'}
          </button>
        </div>
      </div>
    `;

    this.elements.cardContainer.innerHTML = html;
    renderBoard();

    const submitBtn = this.elements.cardContainer.querySelector('#btnSubmitVocabBooster');
    const drawer = this.elements.cardContainer.querySelector('#vbFeedbackDrawer');
    const status = this.elements.cardContainer.querySelector('#vbFeedbackStatus');
    const keyBox = this.elements.cardContainer.querySelector('#vbAnswerKey');
    const nextBtn = this.elements.cardContainer.querySelector('#btnNextVocabBooster');

    const advance = () => {
      this.clearQuestionTimer();
      clearTimeout(this.autoAdvanceTimeout);
      if (!this.sessionActive) return;
      this.currentIndex++;
      this.renderCurrentView();
    };

    const submitVocabBooster = (isTimeout = false) => {
      if (isSubmitted) return;
      isSubmitted = true;
      this.clearQuestionTimer();
      selectedSlot = null;
      if (submitBtn) submitBtn.disabled = true;

      // Re-render locked board, then mark each row correct / wrong
      renderBoard();

        let correctPairs = 0;
        const rows = this.elements.cardContainer.querySelectorAll('.vb-pair-row');

        leftItems.forEach((left, idx) => {
          const right = rightOrder[idx];
          const isMatch = (right.id === left.id);
          if (isMatch) correctPairs++;

          const rowEl = rows[idx];
          const connEl = this.elements.cardContainer.querySelector(`#vbConn_${idx}`);
          if (rowEl) {
            rowEl.classList.add(isMatch ? 'vb-row-correct' : 'vb-row-wrong');
          }
          if (connEl) {
            connEl.textContent = isMatch ? '✔' : '✖';
          }
        });

        const isAllCorrect = (correctPairs === 3);
        this.cardsReviewed++;

        if (!isLearning) {
          if (isAllCorrect) {
            this.correctCount++;
            this.combo++;
            if (this.combo > this.maxCombo) this.maxCombo = this.combo;
            const earnedXP = 15 + (this.combo > 1 ? Math.min(20, this.combo * 3) : 0);
            this.xpEarned += earnedXP;
            sound.playCorrect(this.combo);

            // Full credit (1.0) for all 3 items only when all 3 pairs match altogether!
            leftItems.forEach(item => progress.recordCardReview(item.id, true));

            if (status) {
              status.innerHTML = renderCorrectBannerHtml(earnedXP, 'Sempurna');
              status.className = 'feedback-status success';
            }
          } else {
            this.wrongCount++;
            this.combo = 0;
            sound.playWrong();

            // Record wrong items (no full score because not all 3 matched)
            leftItems.forEach((left, idx) => {
              if (rightOrder[idx].id !== left.id) {
                progress.recordCardReview(left.id, false);
              }
            });

            if (status) {
              status.innerHTML = `<span class="icon-error">✖</span> <strong>${correctPairs}/3 Benar — Belum Skor Penuh!</strong> (Wajib 3/3 benar sekaligus dalam 1× kesempatan)`;
              status.className = 'feedback-status error';
            }
          }
        } else {
          // Learning Mode: 10% weight compared to Quiz Mode
          const earnedXP = isAllCorrect ? 2 : 1;
          this.xpEarned += earnedXP;
          leftItems.forEach(item => progress.recordLearningCardCoverage(item.id));

          if (isAllCorrect) {
            sound.playCorrect(1);
            if (status) {
              status.innerHTML = renderCorrectBannerHtml(earnedXP, 'Hebat');
              status.className = 'feedback-status success';
            }
          } else {
            sound.playWrong();
            if (status) {
              status.innerHTML = `<span class="icon-error">💡</span> <strong>${correctPairs}/3 Benar</strong> — Perhatikan kunci pasangan yang tepat di bawah:`;
              status.className = 'feedback-status error';
            }
          }
        }

        // Show full answer key only in Learning Mode or when all 3 pairs are correct in Quiz Mode
        if (keyBox) {
          if (!isLearning && !isAllCorrect) {
            keyBox.innerHTML = '';
            keyBox.hidden = true;
          } else {
            keyBox.hidden = false;
            keyBox.innerHTML = leftItems.map((left, idx) => {
              const matched = (rightOrder[idx].id === left.id);
              const kanjiDisplay = left.kanji ? `<strong>${left.kanji}</strong> (${left.kana})` : `<strong>${left.kana}</strong>`;
              return `
                <div class="vb-key-item ${matched ? 'ok' : 'miss'}">
                  <span><span class="vb-key-icon ${matched ? 'ok' : 'miss'}">${matched ? '✔' : '✖'}</span> ${left.meaning}</span>
                  <span>&rarr; ${kanjiDisplay}</span>
                </div>
              `;
            }).join('');
          }
        }

        this.updateStatsUI();

        if (drawer) {
          drawer.hidden = false;
          drawer.classList.add('slide-up');
        }

        if (nextBtn) {
          nextBtn.focus();
          nextBtn.onclick = advance;
        }

        if (isAllCorrect && !isLearning) {
          this.autoAdvanceTimeout = setTimeout(() => {
            if (this.sessionActive) advance();
          }, 1500);
        }
      };

    if (submitBtn) {
      submitBtn.onclick = () => submitVocabBooster(false);
    }

    // Start 25s per-question countdown timer ONLY in Quiz Mode (Learning Mode Vocab Booster is untimed)
    if (!isLearning) {
      this.startQuestionTimer(QUIZ_NON_TYPING_LIMIT_SEC, () => submitVocabBooster(true));
    }
  }

  /* =========================================================
     SPEAK ALOUD MODE (LIVE READING: 5 WORDS + 3 SHORT SENTENCES)
     Learning Mode: immediate feedback + full answer reveal
     Quiz Mode: correct/incorrect feedback ONLY (no answer reveal)
     ========================================================= */
  renderSpeakAloudCard(card) {
    if (!this.elements.cardContainer) return;

    const isLearning = (this.sessionType === 'learning');
    const isSentence = (card.speakKind === 'sentence');
    const scriptLabel = card.displayScript === 'kanji' ? 'Kanji' : 'Kana';
    const supported = isSpeechRecognitionSupported();
    const totalCount = this.drillQueue.length || SESSION_BYTE_SIZE;
    const isLast = (this.currentIndex >= totalCount - 1);

    if (isLearning && card.id && !this.viewedCardIds.has(card.id)) {
      this.viewedCardIds.add(card.id);
      this.cardsReviewed++;
      this.xpEarned += isSentence ? 5 : 3;
      progress.recordLearningCardCoverage(card.id);
      this.updateStatsUI();
    }

    const dotsHtml = Array.from({ length: 16 }, () => `<span class="speak-dot"></span>`).join('');
    const audioText = card.expectedKana || card.promptText;
    const speakLimitSec = isSentence ? FULL_SENTENCE_TYPING_LIMIT_SEC : SPEAK_WORD_LIMIT_SEC;

    this.elements.cardContainer.innerHTML = `
      <div class="drill-card-inner animate-in ${isLearning ? 'learning-card' : ''}">
        <div class="drill-card-header">
          <div class="speak-meta-row">
            <span class="badge">${isLearning ? '💡 Learning' : '⚡ Quiz'} • Bab ${card.lesson || 1}</span>
            <span class="speak-pos-badge">${card.posLabel || (isSentence ? 'Kalimat Pendek' : 'Kosakata')}</span>
            <span class="speak-script-badge">${scriptLabel}</span>
            <span class="badge badge-multiplier">${isSentence ? '3.5× Skor Tertinggi' : '2.5× Skor'}</span>
            ${!isLearning ? `<span class="badge badge-timer-type">⏱️ ${speakLimitSec} dtk</span>` : ''}
          </div>
          <span class="card-counter">Soal ${this.currentIndex + 1} / ${totalCount}</span>
        </div>

        ${!isLearning ? `
          <div class="q-timer-wrap" id="qTimerWrap">
            <div class="q-timer-header">
              <span class="q-timer-label">⏳ Waktu Tersisa Soal Ini</span>
              <strong class="q-timer-sec" id="qTimerSec">${speakLimitSec} dtk</strong>
            </div>
            <div class="q-timer-track">
              <div class="q-timer-fill" id="qTimerFill" style="width: 100%;"></div>
            </div>
          </div>
        ` : ''}

        <div class="speak-prompt-card">
          <div class="speak-hero-text ${isSentence ? 'is-sentence' : ''}">${card.promptText}</div>
          ${isLearning ? `
            ${card.expectedKana ? `<div class="speak-reading-sub">${card.expectedKana}</div>` : ''}
            ${card.expectedRomaji ? `<div class="speak-romaji-sub">${card.expectedRomaji}</div>` : ''}
            <hr class="speak-divider" />
            ${card.meaningText ? `<div class="speak-meaning-sub">${card.meaningText}</div>` : ''}
            <div class="speak-audio-row">
              <button type="button" class="speak-audio-pill is-primary" id="speakPlayNormalBtn">
                🔊 Play Normal
              </button>
              <button type="button" class="speak-audio-pill" id="speakPlaySlowBtn">
                ↺ Play Slow (0.7×)
              </button>
            </div>
          ` : `
            <div class="speak-quiz-hint">Baca frasa/kalimat diatas</div>
          `}
        </div>

        <div class="speak-aloud-stage">
          ${!supported ? `
            <div class="speak-unsupported-note">
              ⚠️ Pengenalan suara browser tidak tersedia di browser ini. Gunakan <strong>Chrome</strong>, <strong>Edge</strong>, atau <strong>Safari (HTTPS)</strong>.
            </div>
          ` : ''}

          <button type="button" class="speak-mic-btn" id="speakMicBtn" ${!supported ? 'disabled' : ''}>
            <span id="speakMicIcon">🎙️</span>
            <span id="speakMicLabel">Tekan &amp; Ucapkan</span>
          </button>

          <div class="speak-dots-bar" id="speakDotsBar" aria-hidden="true">${dotsHtml}</div>
          <div class="speak-interim-line" id="speakTranscriptBox"></div>
        </div>

        <div class="speak-feedback-wrap" id="feedbackDrawer" hidden>
          <div class="speak-result-card" id="speakResultCard">
            <div class="speak-result-left">
              <div class="speak-result-eyebrow">Pronunciation Result</div>
              <div class="speak-result-title" id="speakResultTitle"></div>
              <div class="speak-result-heard" id="speakResultHeard"></div>
              <div class="speak-result-desc" id="speakResultDesc"></div>
            </div>
            <div class="speak-result-score" id="speakResultScore"></div>
          </div>

          <div class="speak-footer-bar">
            <div class="speak-footer-status" id="feedbackBanner"></div>
            <button type="button" class="btn btn-primary" id="speakNextBtn">
              ${isLast ? 'Lihat Ringkasan →' : 'Soal Berikutnya →'}
            </button>
          </div>
        </div>
      </div>
    `;

    const micBtn = document.getElementById('speakMicBtn');
    const micIcon = document.getElementById('speakMicIcon');
    const micLabel = document.getElementById('speakMicLabel');
    const dotsBar = document.getElementById('speakDotsBar');
    const transcriptBox = document.getElementById('speakTranscriptBox');
    const drawer = document.getElementById('feedbackDrawer');
    const resultCard = document.getElementById('speakResultCard');
    const resultTitle = document.getElementById('speakResultTitle');
    const resultHeard = document.getElementById('speakResultHeard');
    const resultDesc = document.getElementById('speakResultDesc');
    const resultScore = document.getElementById('speakResultScore');
    const banner = document.getElementById('feedbackBanner');
    const playNormalBtn = document.getElementById('speakPlayNormalBtn');
    const playSlowBtn = document.getElementById('speakPlaySlowBtn');
    const nextBtn = document.getElementById('speakNextBtn');

    let isAnswered = false;

    const advance = () => {
      this.speechRecognizer?.stop();
      sound.stopSpeech();
      this.currentIndex++;
      this.renderCurrentView();
    };

    if (nextBtn) {
      nextBtn.onclick = advance;
    }

    if (playNormalBtn) {
      playNormalBtn.onclick = () => {
        this.speechRecognizer?.stop();
        sound.speakJapanese(audioText, null, { rate: 1.0 });
      };
    }

    if (playSlowBtn) {
      playSlowBtn.onclick = () => {
        this.speechRecognizer?.stop();
        sound.speakJapanese(audioText, null, { rate: 0.7 });
      };
    }

    const setListeningUI = (listening) => {
      if (micBtn) micBtn.classList.toggle('is-listening', listening);
      if (dotsBar) dotsBar.classList.toggle('is-listening', listening);
      if (micIcon) micIcon.textContent = listening ? '⏹️' : '🎙️';
      if (micLabel) micLabel.textContent = listening ? 'Mendengarkan... (Ketuk Stop)' : 'Tekan & Ucapkan';
    };

    const renderResultUI = ({ isCorrect, matchedTranscript, score, earnedXP = 0, isTimeout = false }) => {
      if (resultCard) {
        resultCard.className = `speak-result-card ${isCorrect ? 'is-correct' : 'is-wrong'}`;
      }
      if (resultTitle) {
        resultTitle.textContent = isTimeout
          ? '⏱️ Waktu Habis'
          : (isCorrect ? (score >= 95 ? 'Excellent' : 'Bagus!') : '💪 Belum benar');
      }
      if (resultHeard) {
        resultHeard.textContent = matchedTranscript ? `Heard: ${matchedTranscript}` : (isTimeout ? 'Tidak ada suara terdeteksi' : '');
      }
      if (resultDesc) {
        const descText = isCorrect
          ? 'Ritme jelas dan pengucapan Bahasa Jepang sesuai.'
          : (isLearning
            ? 'Coba dengarkan audio di atas lalu ucapkan ulang, atau lanjut ke soal berikutnya.'
            : '');
        resultDesc.textContent = descText;
        resultDesc.hidden = !descText;
      }
      if (resultScore) {
        resultScore.textContent = `${score}%`;
      }
      if (banner) {
        const meaningSpan = card.meaningText ? `<span class="speak-footer-meaning"> — ${card.meaningText}</span>` : '';
        if (isCorrect) {
          banner.innerHTML = isLearning
            ? `<span class="speak-status-ok">✔ Correct</span> <span><strong>${card.promptText}</strong>${meaningSpan}</span>`
            : renderCorrectBannerHtml(earnedXP, 'Hebat');
        } else {
          banner.innerHTML = isLearning
            ? `<span class="speak-status-err">✖ Belum Tepat</span> <span><strong>${card.promptText}</strong>${meaningSpan}</span>`
            : `<span class="speak-status-err">✖ Kurang Tepat</span>`;
        }
      }
      if (drawer) {
        drawer.hidden = false;
        drawer.classList.add('slide-up');
      }
    };

    const handleEvaluated = (alternatives) => {
      const { isCorrect, matchedTranscript, score } = checkSpokenJapaneseMatch(alternatives, card);
      if (transcriptBox) transcriptBox.textContent = '';

      if (isLearning) {
        renderResultUI({ isCorrect, matchedTranscript, score });
        return;
      }

      // Quiz Mode: show correct/not ONLY — DO NOT reveal the answer
      if (isAnswered) return;
      isAnswered = true;
      this.clearQuestionTimer();
      if (micBtn) micBtn.disabled = true;

      this.cardsReviewed++;
      const speakMult = isSentence ? 3.5 : 2.5;
      if (card.id) {
        progress.recordCardReview(card.id, isCorrect, speakMult);
      }

      let earnedXP = 0;
      if (isCorrect) {
        this.correctCount++;
        this.combo++;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;
        earnedXP = isSentence
          ? 35 + Math.min(this.combo * 3, 25)
          : 25 + Math.min(this.combo * 2, 20);
        this.xpEarned += earnedXP;
      } else {
        this.wrongCount++;
        this.combo = 0;
      }

      this.updateStatsUI();
      renderResultUI({ isCorrect, matchedTranscript, score, earnedXP });
      if (nextBtn) nextBtn.focus();
    };

    if (micBtn && supported) {
      micBtn.onclick = () => {
        if (this.speechRecognizer.isListening) {
          this.speechRecognizer.stop();
          setListeningUI(false);
          return;
        }
        if (!isLearning && isAnswered) return;

        this.speechRecognizer.start({
          onStart: () => {
            setListeningUI(true);
            if (transcriptBox) {
              transcriptBox.textContent = 'Mendengarkan... silakan ucapkan sekarang';
            }
          },
          onInterim: (text) => {
            if (transcriptBox) {
              transcriptBox.textContent = `"${text}"`;
            }
          },
          onResult: (alternatives) => {
            setListeningUI(false);
            handleEvaluated(alternatives);
          },
          onError: (_code, friendlyMsg) => {
            setListeningUI(false);
            if (transcriptBox) {
              transcriptBox.textContent = friendlyMsg;
            }
          },
          onEnd: () => {
            setListeningUI(false);
          }
        });
      };
    }

    if (!isLearning) {
      this.startQuestionTimer(speakLimitSec, () => {
        if (isAnswered) return;
        this.speechRecognizer?.stop();
        isAnswered = true;
        if (micBtn) micBtn.disabled = true;
        this.cardsReviewed++;
        this.wrongCount++;
        this.combo = 0;
        if (card.id) {
          progress.recordCardReview(card.id, false);
        }
        this.updateStatsUI();
        renderResultUI({ isCorrect: false, matchedTranscript: '', score: 0, isTimeout: true });
      });
    }
  }
}

export const drillEngine = new DrillEngine();
