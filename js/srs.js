// Spaced Repetition System (SRS) & Progress Persistence Engine

const STORAGE_KEY = 'kirakira_nihongo_v1';

export const TOTAL_LESSONS = 25;

// Gradual 5-Lesson Block Unlock Progression (Bab 1–25: 5 blocks of 5 lessons)
export const LESSON_BLOCKS = [
  { id: 1, title: 'Grade 1: Dasar (Bab 1–5)', rangeLabel: 'Bab 1–5', lessons: [1, 2, 3, 4, 5], badgeId: 'block_1_clear', unlocksNext: 'Bab 6–10' },
  { id: 2, title: 'Grade 2: Dasar Lanjut (Bab 6–10)', rangeLabel: 'Bab 6–10', lessons: [6, 7, 8, 9, 10], badgeId: 'block_2_clear', unlocksNext: 'Bab 11–15' },
  { id: 3, title: 'Grade 3: Menengah Awal (Bab 11–15)', rangeLabel: 'Bab 11–15', lessons: [11, 12, 13, 14, 15], badgeId: 'block_3_clear', unlocksNext: 'Bab 16–20' },
  { id: 4, title: 'Grade 4: Menengah (Bab 16–20)', rangeLabel: 'Bab 16–20', lessons: [16, 17, 18, 19, 20], badgeId: 'block_4_clear', unlocksNext: 'Bab 21–25' },
  { id: 5, title: 'Grade 5: Master (Bab 21–25)', rangeLabel: 'Bab 21–25', lessons: [21, 22, 23, 24, 25], badgeId: 'block_5_clear', unlocksNext: null }
];

// Public Achievement Badges Catalog (visible in Scorecard & Leaderboard)
export const BADGE_CATALOG = {
  first_step: { emoji: '🌱', label: 'Langkah Pertama', desc: 'Mulai hari pertama belajar' },
  streak_3: { emoji: '🔥', label: 'Streak 3 Hari', desc: 'Belajar 3 hari berturut-turut' },
  streak_7: { emoji: '⚡', label: 'Streak 7 Hari', desc: 'Belajar 7 hari berturut-turut' },
  drill_15m: { emoji: '⏱️', label: 'Target 15 Mnt', desc: 'Capai target 15 menit dalam 1 hari' },
  xp_500: { emoji: '✨', label: '500 XP', desc: 'Kumpulkan 500 XP' },
  xp_1500: { emoji: '🌟', label: '1.500 XP', desc: 'Kumpulkan 1.500 XP' },
  lesson_first: { emoji: '⭐', label: 'Bab Pertama Lulus', desc: 'Selesaikan Scorecard 1 Bab dengan nilai 100' },
  lesson_3: { emoji: '🌠', label: '3 Bab Lulus', desc: 'Selesaikan Scorecard 3 Bab' },
  block_1_clear: { emoji: '🥉', label: 'Grade 1 (Bab 1–5)', desc: 'Lulus seluruh Blok Bab 1–5' },
  block_2_clear: { emoji: '🥈', label: 'Grade 2 (Bab 6–10)', desc: 'Lulus seluruh Blok Bab 6–10' },
  block_3_clear: { emoji: '🥇', label: 'Grade 3 (Bab 11–15)', desc: 'Lulus seluruh Blok Bab 11–15' },
  block_4_clear: { emoji: '💎', label: 'Grade 4 (Bab 16–20)', desc: 'Lulus seluruh Blok Bab 16–20' },
  block_5_clear: { emoji: '👑', label: 'Grade 5 Master', desc: 'Lulus seluruh 25 Bab Senjuku Nihongo' }
};

export class ProgressManager {
  constructor() {
    this.storageKey = STORAGE_KEY;
    this.data = this.loadData();
    this._cloudSyncHandler = null;
  }

  setStorageScope(userId = null) {
    this.storageKey = userId ? `kirakira_nihongo_user_${userId}` : STORAGE_KEY;
    this.data = this.loadData();
  }

  setCloudSyncHandler(fn) {
    this._cloudSyncHandler = typeof fn === 'function' ? fn : null;
  }

  saveDataLocalOnly() {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.error("Failed to save progress to localStorage:", e);
    }
  }

  getDefaultData() {
    return {
      xp: 0,
      level: 1,
      streakDays: 0,
      lastActiveDate: null,
      history: {}, // keyed by 'YYYY-MM-DD': { seconds: 0, cards: 0, correct: 0, wrong: 0, xp: 0 }
      cards: {},   // keyed by item.id: { stage: 0, streak: 0, correct: 0, wrong: 0, nextDue: null }
      weeklyGoalMinutes: 105, // 15 mins x 7 days
      dailyGoalMinutes: 15,
      badges: [],
      clearedLessons: [],
      clearedBlocks: [],
      kanaCompanion: {
        activeScript: 'hiragana',
        chartKana: 'あ',
        katakanaChartKana: 'ア',
        showRomaji: true,
        activeRowIndex: 0,
        katakanaActiveRowIndex: 0,
        rowsDone: {},
        katakanaRowsDone: {},
        paper: {},
        katakanaPaper: {},
        deck: { 'あ': 1, 'い': 1, 'う': 1, 'え': 1, 'お': 1 },
        katakanaDeck: { 'ア': 1, 'イ': 1, 'ウ': 1, 'エ': 1, 'オ': 1 }
      }
    };
  }

  getKanaCompanionState() {
    if (!this.data.kanaCompanion || typeof this.data.kanaCompanion !== 'object') {
      this.data.kanaCompanion = this.getDefaultData().kanaCompanion;
    }
    return this.data.kanaCompanion;
  }

  saveKanaCompanionState(patch = {}) {
    const current = this.getKanaCompanionState();
    this.data.kanaCompanion = { ...current, ...patch };
    this.saveData();
  }

  addXP(amount = 0) {
    const pts = Math.max(0, Number(amount) || 0);
    if (!pts) return;
    this.data.xp = (this.data.xp || 0) + pts;
    this.data.level = Math.floor(this.data.xp / 200) + 1;
    const today = this.getTodayStats();
    today.xp = (today.xp || 0) + pts;
    this.saveData();
  }

  loadData() {
    if (typeof localStorage === 'undefined') return this.getDefaultData();
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...this.getDefaultData(), ...parsed };
      }
    } catch (e) {
      console.error("Failed to parse stored progress, initializing fresh:", e);
    }
    return this.getDefaultData();
  }

  saveData() {
    this.saveDataLocalOnly();
    if (this._cloudSyncHandler) {
      try {
        this._cloudSyncHandler(this.data);
      } catch (e) {
        console.error("Cloud sync hook error:", e);
      }
    }
  }

  getTodayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  getTodayStats() {
    const key = this.getTodayKey();
    if (!this.data.history[key]) {
      this.data.history[key] = {
        seconds: 0,
        cards: 0,
        correct: 0,
        wrong: 0,
        xp: 0,
        learningCards: 0
      };
    }
    return this.data.history[key];
  }

  updateStreak() {
    const today = this.getTodayKey();
    if (!this.data.lastActiveDate) {
      this.data.streakDays = 1;
      this.data.lastActiveDate = today;
      return;
    }

    if (this.data.lastActiveDate === today) {
      return; // Already counted today
    }

    const last = new Date(this.data.lastActiveDate);
    const now = new Date(today);
    const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      this.data.streakDays += 1;
    } else if (diffDays > 1) {
      this.data.streakDays = 1; // streak reset
    }
    this.data.lastActiveDate = today;
    this.saveData();
  }

  addSessionRecord(secondsStudied, cardsReviewed, correctCount, wrongCount, xpEarned, isGraded = true) {
    this.updateStreak();
    const today = this.getTodayStats();
    today.seconds += secondsStudied;

    if (isGraded) {
      today.cards += cardsReviewed;
      today.correct += correctCount;
      today.wrong += wrongCount;
    } else {
      today.learningCards = (today.learningCards || 0) + cardsReviewed;
    }
    today.xp += xpEarned;

    this.data.xp += xpEarned;
    this.data.level = Math.floor(Math.sqrt(this.data.xp / 100)) + 1;

    this.checkBadges();
    this.saveData();
  }

  // SRS Interval steps (in days) based on stage:
  // 0: 0 days (due now/today)
  // 1: 1 day (tomorrow)
  // 2: 3 days
  // 3: 7 days
  // 4: 14 days (mastered)
  recordCardReview(cardId, isCorrect) {
    if (!this.data.cards[cardId]) {
      this.data.cards[cardId] = {
        stage: 0,
        streak: 0,
        correct: 0,
        wrong: 0,
        nextDue: null,
        mistakeTimestamps: [],
        coverageCredit: 0,
        learningViews: 0
      };
    }

    const c = this.data.cards[cardId];
    if (!c.mistakeTimestamps) {
      c.mistakeTimestamps = [];
    }
    const now = new Date();

    if (isCorrect) {
      c.correct += 1;
      c.streak += 1;
      c.stage = Math.min(4, c.stage + 1);
      // Full 100% (1.0) question credit when answered correctly in Quiz Mode
      c.coverageCredit = 1.0;

      const intervals = [1, 2, 4, 7, 14];
      const daysToAdd = intervals[c.stage] || 1;
      const due = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      c.nextDue = due.toISOString();
    } else {
      c.wrong += 1;
      c.streak = 0;
      c.stage = Math.max(0, c.stage - 1);
      c.mistakeTimestamps.push(Date.now());
      // Keep last 50 timestamps to keep storage clean
      if (c.mistakeTimestamps.length > 50) {
        c.mistakeTimestamps = c.mistakeTimestamps.slice(-50);
      }
      // Immediately due for repeat
      c.nextDue = now.toISOString();
    }

    this.saveData();
  }

  // Learning Mode credit: strictly 10% (0.1) compared to Quiz Mode (1.0) for the same question
  recordLearningCardCoverage(cardId) {
    if (!this.data.cards[cardId]) {
      this.data.cards[cardId] = {
        stage: 0,
        streak: 0,
        correct: 0,
        wrong: 0,
        nextDue: null,
        mistakeTimestamps: [],
        coverageCredit: 0,
        learningViews: 0
      };
    }

    const c = this.data.cards[cardId];
    const currentCredit = this.getCardCoverageCredit(cardId);
    c.coverageCredit = Math.max(currentCredit, 0.1);
    c.learningViews = (c.learningViews || 0) + 1;
    this.saveData();
  }

  getCardCoverageCredit(cardId) {
    const c = this.data.cards[cardId];
    if (!c) return 0;
    if (typeof c.coverageCredit === 'number') {
      return Math.max(0, Math.min(1, c.coverageCredit));
    }
    // Backward compatibility for cards answered correctly before coverageCredit existed
    return c.correct > 0 ? 1.0 : 0;
  }

  // Per-lesson question bank coverage & score across ALL question types:
  // - Vocab/Kanji: weight 1.0 (Quiz = 1.0, Learning = 0.1)
  // - Audio Sentence Romaji: weight 1.0 (Quiz = 1.0, Learning = 0.1)
  // - Kalimat Rumpang (Cloze): HIGHEST weight 2.0 (Quiz = 2.0, Learning = 0.2) AND 100% required for Full Score!
  // - Full Score (100) requires: >= 80% weighted coverage across all question types AND 100% correct on Kalimat Rumpang.
  getLessonCoverageStats(lessonNum, vocabItems, clozeItems = [], sentenceRomajiItems = []) {
    const num = parseInt(lessonNum, 10);
    const lessonVocab = (vocabItems || []).filter(it => it.lesson === num);
    const lessonSentence = (sentenceRomajiItems || []).filter(it => it.lesson === num);
    const lessonCloze = (clozeItems || []).filter(it => it.lesson === num);

    const CLOZE_WEIGHT = 2.0; // Kalimat Rumpang has the highest score weight
    const bankTotal = lessonVocab.length + lessonSentence.length + lessonCloze.length;
    const maxWeight = (lessonVocab.length * 1.0) + (lessonSentence.length * 1.0) + (lessonCloze.length * CLOZE_WEIGHT);

    let earnedWeight = 0;
    let quizCoveredCount = 0;
    let learningOnlyCount = 0;

    let vocabQuizCovered = 0;
    let sentenceQuizCovered = 0;
    let clozeQuizCovered = 0;

    lessonVocab.forEach(it => {
      const credit = this.getCardCoverageCredit(it.id);
      earnedWeight += credit * 1.0;
      if (credit >= 1.0) { quizCoveredCount++; vocabQuizCovered++; }
      else if (credit > 0) learningOnlyCount++;
    });

    lessonSentence.forEach(it => {
      const credit = this.getCardCoverageCredit(it.id);
      earnedWeight += credit * 1.0;
      if (credit >= 1.0) { quizCoveredCount++; sentenceQuizCovered++; }
      else if (credit > 0) learningOnlyCount++;
    });

    lessonCloze.forEach(it => {
      const credit = this.getCardCoverageCredit(it.id);
      earnedWeight += credit * CLOZE_WEIGHT;
      if (credit >= 1.0) { quizCoveredCount++; clozeQuizCovered++; }
      else if (credit > 0) learningOnlyCount++;
    });

    const effectiveCredit = Math.round(earnedWeight * 100) / 100;
    const coverageRatio = maxWeight > 0 ? Math.min(1, effectiveCredit / maxWeight) : 0;
    const coveragePercent = Math.round(coverageRatio * 1000) / 10;

    const clozeTotal = lessonCloze.length;
    const clozePercent = clozeTotal > 0 ? Math.round((clozeQuizCovered / clozeTotal) * 100) : 100;
    const isClozeComplete = (clozeTotal === 0) || (clozeQuizCovered >= clozeTotal);

    const rawScore = maxWeight > 0 ? Math.min(100, Math.round((coverageRatio / 0.8) * 100)) : 0;
    const isFullScore = (coverageRatio >= 0.8) && isClozeComplete;
    // Cap score below 100 (max 89) if Kalimat Rumpang is not yet 100% mastered
    const score = isFullScore ? 100 : (isClozeComplete ? rawScore : Math.min(89, rawScore));

    return {
      lesson: num,
      bankTotal,
      maxWeight,
      effectiveCredit,
      quizCoveredCount,
      learningOnlyCount,
      vocabTotal: lessonVocab.length,
      vocabQuizCovered,
      sentenceTotal: lessonSentence.length,
      sentenceQuizCovered,
      clozeTotal,
      clozeQuizCovered,
      clozePercent,
      isClozeComplete,
      coveragePercent,
      requiredQuestions: Math.ceil(bankTotal * 0.8),
      score,
      isFullScore
    };
  }

  getAllLessonsCoverage(vocabItems, clozeItems = [], sentenceRomajiItems = []) {
    const lessons = {};
    let fullScoreCount = 0;
    let totalScoreSum = 0;

    for (let i = 1; i <= TOTAL_LESSONS; i++) {
      const stat = this.getLessonCoverageStats(i, vocabItems, clozeItems, sentenceRomajiItems);
      lessons[i] = stat;
      if (stat.isFullScore) fullScoreCount++;
      totalScoreSum += stat.score;
    }

    return {
      lessons,
      fullScoreCount,
      averageScore: Math.round(totalScoreSum / TOTAL_LESSONS)
    };
  }

  // Get weak cards based on frequent mistakes in the last 1 week (7 days)
  getWeakCards(allItems, maxCount = 30) {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    const scored = allItems.map(item => {
      const c = this.data.cards[item.id];
      if (!c) {
        return {
          item,
          weeklyMistakes: 0,
          totalMistakes: 0,
          totalCorrect: 0,
          stage: 0,
          accuracy: 0,
          score: 0
        };
      }

      const timestamps = c.mistakeTimestamps || [];
      const recentTimestamps = timestamps.filter(t => t >= oneWeekAgo);
      let weeklyMistakes = recentTimestamps.length;

      // Fallback for cards reviewed before timestamp tracking: if stage <= 1 and c.wrong > 0
      if (weeklyMistakes === 0 && c.wrong > 0 && c.stage <= 1) {
        weeklyMistakes = c.wrong;
      }

      const totalReviews = (c.correct || 0) + (c.wrong || 0);
      const accuracy = totalReviews > 0 ? Math.round((c.correct / totalReviews) * 100) : 0;
      
      // Higher score = weaker card (needs more repetition)
      const score = (weeklyMistakes * 10) + ((c.wrong || 0) * 3) - ((c.streak || 0) * 2) + (4 - (c.stage || 0));

      return {
        item,
        weeklyMistakes,
        totalMistakes: c.wrong || 0,
        totalCorrect: c.correct || 0,
        stage: c.stage || 0,
        accuracy,
        score
      };
    });

    // Filter items with mistakes
    let weak = scored.filter(s => s.weeklyMistakes > 0 || s.totalMistakes > 0);

    // Sort by weekly mistakes descending, then total score descending
    weak.sort((a, b) => (b.weeklyMistakes - a.weeklyMistakes) || (b.score - a.score));

    return weak.slice(0, maxCount);
  }

  // Returns array of items for drill queue focusing on weakness with repetition
  getWeakestItems(allItems, maxCount = 20) {
    const weakEntries = this.getWeakCards(allItems, maxCount);
    if (weakEntries.length > 0) {
      return weakEntries.map(e => e.item);
    }

    // Fallback: If user hasn't made mistakes yet, return lowest stage cards or tricky items
    const unmastered = allItems.filter(item => {
      const stage = this.getCardStage(item.id);
      return stage <= 1;
    });

    const shuffle = (arr) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    if (unmastered.length > 0) {
      return shuffle(unmastered).slice(0, maxCount);
    }

    return shuffle(allItems).slice(0, maxCount);
  }

  getDueCards(allItems) {
    const now = new Date();
    return allItems.filter(item => {
      const c = this.data.cards[item.id];
      if (!c) return true; // new card is due
      if (!c.nextDue) return true;
      return new Date(c.nextDue) <= now;
    });
  }

  getCardStage(cardId) {
    return this.data.cards[cardId]?.stage ?? 0;
  }

  getMasteryBreakdown(allItems) {
    let unlearned = 0;
    let learning = 0;
    let reviewing = 0;
    let mastered = 0;

    allItems.forEach(item => {
      const stage = this.getCardStage(item.id);
      if (stage === 0) unlearned++;
      else if (stage <= 2) learning++;
      else if (stage === 3) reviewing++;
      else mastered++;
    });

    return { unlearned, learning, reviewing, mastered, total: allItems.length };
  }

  getWeeklyData() {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${day}`;
      const stats = this.data.history[key] || { seconds: 0, cards: 0, correct: 0, wrong: 0, xp: 0 };

      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      days.push({
        dateKey: key,
        dayLabel: dayNames[d.getDay()],
        minutes: Math.round((stats.seconds / 60) * 10) / 10,
        cards: stats.cards,
        correct: stats.correct,
        accuracy: stats.cards > 0 ? Math.round((stats.correct / stats.cards) * 100) : 0,
        isToday: i === 0
      });
    }

    const totalMinutes = days.reduce((sum, d) => sum + d.minutes, 0);
    const totalCards = days.reduce((sum, d) => sum + d.cards, 0);
    const daysCompleted = days.filter(d => d.minutes >= 15).length;

    return { days, totalMinutes, totalCards, daysCompleted };
  }

  checkBadges() {
    const b = new Set(this.data.badges || []);
    const today = this.getTodayStats();
    const clearedLessons = Array.isArray(this.data.clearedLessons) ? this.data.clearedLessons : [];
    const clearedBlocks = Array.isArray(this.data.clearedBlocks) ? this.data.clearedBlocks : [];

    if (this.data.streakDays >= 1) b.add('first_step');
    if (this.data.streakDays >= 3) b.add('streak_3');
    if (this.data.streakDays >= 7) b.add('streak_7');
    if (today.seconds >= 900) b.add('drill_15m');
    if (this.data.xp >= 500) b.add('xp_500');
    if (this.data.xp >= 1500) b.add('xp_1500');
    if (clearedLessons.length >= 1) b.add('lesson_first');
    if (clearedLessons.length >= 3) b.add('lesson_3');
    if (clearedBlocks.includes(1)) b.add('block_1_clear');
    if (clearedBlocks.includes(2)) b.add('block_2_clear');
    if (clearedBlocks.includes(3)) b.add('block_3_clear');
    if (clearedBlocks.includes(4)) b.add('block_4_clear');
    if (clearedBlocks.includes(5)) b.add('block_5_clear');

    this.data.badges = Array.from(b);
  }

  getBlockForLesson(lessonNum) {
    const num = parseInt(lessonNum, 10);
    return LESSON_BLOCKS.find(b => b.lessons.includes(num)) || LESSON_BLOCKS[0];
  }

  isLessonCleared(lessonNum, coverageData = null) {
    const num = parseInt(lessonNum, 10);
    const saved = Array.isArray(this.data.clearedLessons) ? this.data.clearedLessons : [];
    if (saved.includes(num)) return true;
    return Boolean(coverageData?.lessons?.[num]?.isFullScore);
  }

  isBlockCleared(blockId, coverageData = null) {
    const block = LESSON_BLOCKS.find(b => b.id === blockId);
    if (!block) return false;
    return block.lessons.every(num => this.isLessonCleared(num, coverageData));
  }

  isLessonUnlocked(lessonNum, coverageData = null) {
    const block = this.getBlockForLesson(lessonNum);
    if (!block || block.id === 1) return true;
    // All previous 5-lesson blocks must be cleared
    for (let prevId = 1; prevId < block.id; prevId++) {
      if (!this.isBlockCleared(prevId, coverageData)) return false;
    }
    return true;
  }

  getLockReason(lessonNum, coverageData = null) {
    const targetBlock = this.getBlockForLesson(lessonNum);
    if (!targetBlock || targetBlock.id === 1) {
      return { locked: false, targetBlock, blockingBlock: null, remainingLessons: [] };
    }
    for (let prevId = 1; prevId < targetBlock.id; prevId++) {
      const prevBlock = LESSON_BLOCKS.find(b => b.id === prevId);
      const remaining = prevBlock.lessons.filter(num => !this.isLessonCleared(num, coverageData));
      if (remaining.length > 0) {
        return {
          locked: true,
          targetBlock,
          blockingBlock: prevBlock,
          remainingLessons: remaining
        };
      }
    }
    return { locked: false, targetBlock, blockingBlock: null, remainingLessons: [] };
  }

  evaluateProgression(vocabItems, clozeItems = [], sentenceRomajiItems = []) {
    const coverage = this.getAllLessonsCoverage(vocabItems, clozeItems, sentenceRomajiItems);
    const prevLessons = new Set(Array.isArray(this.data.clearedLessons) ? this.data.clearedLessons : []);
    const prevBlocks = new Set(Array.isArray(this.data.clearedBlocks) ? this.data.clearedBlocks : []);

    const newlyClearedLessons = [];
    for (let i = 1; i <= TOTAL_LESSONS; i++) {
      if (coverage.lessons[i]?.isFullScore && !prevLessons.has(i)) {
        prevLessons.add(i);
        newlyClearedLessons.push(i);
      }
    }

    const newlyClearedBlocks = [];
    for (const block of LESSON_BLOCKS) {
      const allCleared = block.lessons.every(n => prevLessons.has(n));
      if (allCleared && !prevBlocks.has(block.id)) {
        prevBlocks.add(block.id);
        newlyClearedBlocks.push(block);
      }
    }

    if (newlyClearedLessons.length > 0 || newlyClearedBlocks.length > 0) {
      this.data.clearedLessons = Array.from(prevLessons).sort((a, b) => a - b);
      this.data.clearedBlocks = Array.from(prevBlocks).sort((a, b) => a - b);
      this.checkBadges();
      this.saveData();
    }

    return { newlyClearedLessons, newlyClearedBlocks, coverage };
  }

  exportDataJson() {
    return JSON.stringify(this.data, null, 2);
  }

  importDataJson(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed === 'object' && parsed !== null) {
        this.data = { ...this.getDefaultData(), ...parsed };
        this.saveData();
        return true;
      }
    } catch (e) {
      console.error("Invalid import JSON:", e);
    }
    return false;
  }

  resetProgress() {
    this.data = this.getDefaultData();
    this.saveData();
  }
}

export const progress = new ProgressManager();
