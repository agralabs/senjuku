// KiraKira Nihongo - AI Advisor Service (Gemini 3.5 Flash-Lite + 5-Layer Non-Chatbot Guardrails)
// Zero-dependency Node.js v24 ESM (node:crypto + node:sqlite + native fetch)

import crypto from 'node:crypto';
import {
  getUserPrivateProgress,
  getUserSrsCards,
  getRecentActivityLogs,
  getAdvisorCache,
  upsertAdvisorCache,
  getAdvisorDailyUsage,
  incrementAdvisorDailyUsage
} from './db.js';
import { MASTER_DRILL_ITEMS } from '../data/kanji-vocabulary.js';
import { CLOZE_SENTENCE_ITEMS } from '../data/cloze-sentences.js';
import { SENTENCE_ROMAJI_ITEMS } from '../data/sentence-romaji.js';
import { VOCAB_BOOSTER_ITEMS } from '../data/vocab-booster.js';

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const MAX_DAILY_GENERATIONS = 3;
const REFRESH_COOLDOWN_MS = 60 * 1000;
const MAX_ADVICE_WORDS = 300;
const MIN_BULLETS = 3;
const MAX_BULLETS = 5;

const VALID_CATEGORIES = new Set(['strength', 'weakness', 'timing', 'action']);
const ALLOWED_GENERATE_KEYS = new Set(['forceRefresh', 'locale']);

// Per-user cooldown state (in-memory) + persistent daily quota in SQLite
const userLastRefresh = new Map(); // userId -> number (timestamp of last fresh generation)

export function resetAdvisorRateLimits() {
  userLastRefresh.clear();
}

function getUsageDateKey(now = Date.now()) {
  const d = new Date(now);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getAdvisorConfig() {
  const apiKey = String(process.env.GEMINI_API_KEY || '').trim();
  const model = String(process.env.GEMINI_ADVISOR_MODEL || 'gemini-3.5-flash-lite').trim() || 'gemini-3.5-flash-lite';
  const rawThinking = String(process.env.GEMINI_ADVISOR_THINKING_LEVEL || 'low').trim().toLowerCase();
  const thinkingLevel = ['minimal', 'low', 'medium', 'high'].includes(rawThinking) ? rawThinking : 'low';
  const rawTimeout = Number(process.env.GEMINI_ADVISOR_TIMEOUT_MS);
  const timeoutMs = Number.isFinite(rawTimeout) && rawTimeout >= 1000 ? Math.min(rawTimeout, 60000) : 12000;

  return {
    apiKey,
    enabled: Boolean(apiKey),
    model,
    thinkingLevel,
    timeoutMs,
    cacheTtlMs: CACHE_TTL_MS,
    maxDailyGenerations: MAX_DAILY_GENERATIONS,
    refreshCooldownSec: Math.round(REFRESH_COOLDOWN_MS / 1000)
  };
}

// --- Static Curriculum Catalog Index (built once at startup) ---

const CARD_CATALOG = new Map();
const CLOZE_BY_LESSON = new Map();

function initCurriculumCatalog() {
  for (const item of MASTER_DRILL_ITEMS) {
    if (!item?.id) continue;
    CARD_CATALOG.set(item.id, {
      id: item.id,
      lesson: Number(item.lesson) || 1,
      category: item.type === 'katakana' ? 'katakana' : 'kanji',
      term: item.kanji || item.kana || item.id,
      kana: item.kana || '',
      meaningId: item.meaningId || '',
      meaningEn: item.meaningEn || item.meaningId || ''
    });
  }

  for (const item of CLOZE_SENTENCE_ITEMS) {
    if (!item?.id) continue;
    const lesson = Number(item.lesson) || 1;
    CARD_CATALOG.set(item.id, {
      id: item.id,
      lesson,
      category: 'sentence_cloze',
      term: item.targetWord || item.correctKana || item.id,
      kana: item.correctKana || '',
      meaningId: item.pos === 'verb' ? 'Kalimat Rumpang (Kata Kerja)' : 'Kalimat Rumpang (Kata Benda)',
      meaningEn: item.pos === 'verb' ? 'Cloze (Verb)' : 'Cloze (Noun)'
    });
    CLOZE_BY_LESSON.set(lesson, (CLOZE_BY_LESSON.get(lesson) || 0) + 1);
  }

  for (const item of SENTENCE_ROMAJI_ITEMS) {
    if (!item?.id) continue;
    const lesson = Number(item.lesson) || 1;
    CARD_CATALOG.set(item.id, {
      id: item.id,
      lesson,
      category: 'sentence_romaji',
      term: String(item.text || item.id).slice(0, 28),
      kana: String(item.kana || '').slice(0, 28),
      meaningId: `Ketik Kalimat Bab ${lesson}`,
      meaningEn: `Sentence Typing Lesson ${lesson}`
    });
  }

  for (const item of VOCAB_BOOSTER_ITEMS) {
    if (!item?.id) continue;
    const lesson = Number(item.lesson) || 1;
    CARD_CATALOG.set(item.id, {
      id: item.id,
      lesson,
      category: 'vocab_booster',
      term: item.kanji || item.kana || item.id,
      kana: item.kana || '',
      meaningId: item.meaning || '',
      meaningEn: item.meaning || ''
    });
  }
}
initCurriculumCatalog();

const CATEGORY_LABELS = {
  id: {
    kanji: 'Kanji & Kosakata',
    katakana: 'Katakana',
    sentence_cloze: 'Kalimat Rumpang',
    sentence_romaji: 'Ketik Kalimat',
    vocab_booster: 'Vocab Booster',
    other: 'Latihan Umum'
  },
  en: {
    kanji: 'Kanji & Vocabulary',
    katakana: 'Katakana',
    sentence_cloze: 'Cloze Sentences',
    sentence_romaji: 'Sentence Typing',
    vocab_booster: 'Vocab Booster',
    other: 'General Practice'
  }
};

const TIME_BUCKETS = [
  { key: 'pagi', hours: [5, 6, 7, 8, 9, 10, 11], labelId: 'Pagi (05:00–11:59)', labelEn: 'Morning (05:00–11:59)' },
  { key: 'siang', hours: [12, 13, 14, 15, 16], labelId: 'Siang (12:00–16:59)', labelEn: 'Afternoon (12:00–16:59)' },
  { key: 'sore_malam', hours: [17, 18, 19, 20, 21], labelId: 'Sore/Malam (17:00–21:59)', labelEn: 'Evening (17:00–21:59)' },
  { key: 'larut_malam', hours: [22, 23, 0, 1, 2, 3, 4], labelId: 'Larut Malam (22:00–04:59)', labelEn: 'Late Night (22:00–04:59)' }
];

function getBucketKeyForHour(hour) {
  const h = Number(hour);
  if (h >= 5 && h <= 11) return 'pagi';
  if (h >= 12 && h <= 16) return 'siang';
  if (h >= 17 && h <= 21) return 'sore_malam';
  return 'larut_malam';
}

function getBucketLabel(key, locale = 'id') {
  const b = TIME_BUCKETS.find(item => item.key === key);
  if (!b) return locale === 'en' ? 'Morning (05:00–11:59)' : 'Pagi (05:00–11:59)';
  return locale === 'en' ? b.labelEn : b.labelId;
}

function getCategoryLabel(category, locale = 'id') {
  const map = CATEGORY_LABELS[locale === 'en' ? 'en' : 'id'];
  return map[category] || map.other;
}

// --- Layer 1: Strict API Payload Contract ---

export function validateGeneratePayload(body) {
  if (body === null || body === undefined) {
    return { ok: true, forceRefresh: false, locale: 'id' };
  }
  if (typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Payload harus berupa objek JSON.' };
  }
  for (const key of Object.keys(body)) {
    if (!ALLOWED_GENERATE_KEYS.has(key)) {
      return {
        ok: false,
        error: `Field "${key}" tidak diizinkan. AI Advisor bukan chatbot dan tidak menerima prompt bebas.`
      };
    }
  }
  if (body.forceRefresh !== undefined && typeof body.forceRefresh !== 'boolean') {
    return { ok: false, error: 'Field "forceRefresh" harus boolean.' };
  }
  if (body.locale !== undefined && body.locale !== 'id' && body.locale !== 'en') {
    return { ok: false, error: 'Field "locale" hanya mendukung "id" atau "en".' };
  }
  return {
    ok: true,
    forceRefresh: Boolean(body.forceRefresh),
    locale: body.locale === 'en' ? 'en' : 'id'
  };
}

// --- Layer 2: Zero-PII Server-Side Analytics Aggregator ---

export function buildAdvisorContext(db, userId, locale = 'id') {
  const normLocale = locale === 'en' ? 'en' : 'id';
  const progress = getUserPrivateProgress(db, userId);
  const srsCards = getUserSrsCards(db, userId);
  const logs = getRecentActivityLogs(db, userId, 30, 500);
  const nowMs = Date.now();

  // 1. Overview & Mastery Breakdown
  const masteryBreakdown = { unlearned: 0, learning: 0, reviewing: 0, mastered: 0 };
  let dueCardsCount = 0;
  let totalCorrect = 0;
  let totalWrong = 0;

  const categoryStats = new Map();
  const lessonStats = new Map();
  const strugglingCandidates = [];

  for (const row of srsCards) {
    const stage = Number(row.stage) || 0;
    const correct = Number(row.correct) || 0;
    const wrong = Number(row.wrong) || 0;
    totalCorrect += correct;
    totalWrong += wrong;

    if (stage <= 0) masteryBreakdown.unlearned++;
    else if (stage <= 2) masteryBreakdown.learning++;
    else if (stage === 3) masteryBreakdown.reviewing++;
    else masteryBreakdown.mastered++;

    if (!row.next_due || Date.parse(row.next_due) <= nowMs) {
      dueCardsCount++;
    }

    const catalogMeta = CARD_CATALOG.get(row.card_id);
    const meta = catalogMeta || {
      id: null,
      lesson: null,
      category: row.card_id.startsWith('cloze_')
        ? 'sentence_cloze'
        : row.card_id.startsWith('sromaji_')
          ? 'sentence_romaji'
          : row.card_id.startsWith('vb_')
            ? 'vocab_booster'
            : row.card_id.startsWith('kt_')
              ? 'katakana'
              : 'kanji',
      term: '',
      kana: '',
      meaningId: '',
      meaningEn: ''
    };

    const cat = meta.category;
    if (!categoryStats.has(cat)) {
      categoryStats.set(cat, { category: cat, cards: 0, mastered: 0, correct: 0, wrong: 0 });
    }
    const cs = categoryStats.get(cat);
    cs.cards++;
    if (stage >= 3) cs.mastered++;
    cs.correct += correct;
    cs.wrong += wrong;

    if (meta.lesson) {
      if (!lessonStats.has(meta.lesson)) {
        lessonStats.set(meta.lesson, {
          lesson: meta.lesson,
          cards: 0,
          mastered: 0,
          correct: 0,
          wrong: 0,
          clozePracticed: 0,
          clozeTotal: CLOZE_BY_LESSON.get(meta.lesson) || 0
        });
      }
      const ls = lessonStats.get(meta.lesson);
      ls.cards++;
      if (stage >= 3) ls.mastered++;
      ls.correct += correct;
      ls.wrong += wrong;
      if (cat === 'sentence_cloze') ls.clozePracticed++;
    }

    if (wrong > 0 && catalogMeta) {
      const attempts = correct + wrong;
      const accuracyPct = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
      const weaknessScore = wrong * 3 - correct * 0.4 + Math.max(0, 4 - stage) * 1.5;
      strugglingCandidates.push({
        cardId: catalogMeta.id,
        lesson: catalogMeta.lesson,
        category: catalogMeta.category,
        term: catalogMeta.term,
        kana: catalogMeta.kana,
        meaning: normLocale === 'en' ? catalogMeta.meaningEn : catalogMeta.meaningId,
        wrong,
        correct,
        accuracyPct,
        stage,
        weaknessScore
      });
    }
  }

  // Last 7 days 15-min goal count from history_json
  let daysMet15mGoalLast7d = 0;
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if ((progress.history?.[key]?.seconds || 0) >= 900) {
      daysMet15mGoalLast7d++;
    }
  }

  const totalAttempts = totalCorrect + totalWrong;
  const overallAccuracyPct = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : null;

  const categoriesArray = Array.from(categoryStats.values()).map(c => {
    const attempts = c.correct + c.wrong;
    return {
      category: c.category,
      label: getCategoryLabel(c.category, normLocale),
      cards: c.cards,
      mastered: c.mastered,
      correct: c.correct,
      wrong: c.wrong,
      accuracyPct: attempts > 0 ? Math.round((c.correct / attempts) * 100) : null,
      masteryRatePct: c.cards > 0 ? Math.round((c.mastered / c.cards) * 100) : 0
    };
  });

  const lessonsArray = Array.from(lessonStats.values()).map(l => {
    const attempts = l.correct + l.wrong;
    return {
      ...l,
      accuracyPct: attempts > 0 ? Math.round((l.correct / attempts) * 100) : null
    };
  });

  // Strengths
  const strongCategories = categoriesArray
    .filter(c => c.accuracyPct !== null && (c.correct + c.wrong) >= 2)
    .sort((a, b) => (b.accuracyPct - a.accuracyPct) || (b.masteryRatePct - a.masteryRatePct) || (b.cards - a.cards))
    .slice(0, 2);

  const strongLessons = lessonsArray
    .filter(l => l.accuracyPct !== null && (l.correct + l.wrong) >= 2)
    .sort((a, b) => (b.accuracyPct - a.accuracyPct) || (b.cards - a.cards))
    .slice(0, 3);

  // Weaknesses
  const weakCategory = categoriesArray
    .filter(c => c.accuracyPct !== null && (c.correct + c.wrong) >= 2)
    .sort((a, b) => (a.accuracyPct - b.accuracyPct) || (b.wrong - a.wrong))[0] || null;

  const topStrugglingItems = strugglingCandidates
    .sort((a, b) => (b.weaknessScore - a.weaknessScore) || (b.wrong - a.wrong))
    .slice(0, 5)
    .map(({ weaknessScore, ...rest }) => rest);

  // Active 5-lesson block bottleneck
  let activeBlockBottleneck = null;
  if (lessonsArray.length > 0) {
    const maxLesson = Math.max(...lessonsArray.map(l => l.lesson));
    const blockStart = Math.floor((maxLesson - 1) / 5) * 5 + 1;
    const blockEnd = Math.min(25, blockStart + 4);
    let clozeTotal = 0;
    let clozePracticed = 0;
    for (let lNum = blockStart; lNum <= blockEnd; lNum++) {
      clozeTotal += CLOZE_BY_LESSON.get(lNum) || 0;
      clozePracticed += lessonStats.get(lNum)?.clozePracticed || 0;
    }
    if (clozeTotal > clozePracticed) {
      activeBlockBottleneck = {
        blockRange: `Bab ${blockStart}-${blockEnd}`,
        clozePracticed,
        clozeTotal,
        remainingCloze: clozeTotal - clozePracticed
      };
    }
  }

  // 2. Access & Performance Timing Aggregation
  const buckets = {};
  for (const b of TIME_BUCKETS) {
    buckets[b.key] = {
      key: b.key,
      label: normLocale === 'en' ? b.labelEn : b.labelId,
      visits: 0,
      drillSessions: 0,
      totalDurationSec: 0,
      cardsReviewed: 0,
      correct: 0,
      wrong: 0,
      accuracyPct: null,
      avgDurationSec: 0
    };
  }

  const dayTypeStats = {
    weekday: { visits: 0, drillSessions: 0, correct: 0, wrong: 0, accuracyPct: null },
    weekend: { visits: 0, drillSessions: 0, correct: 0, wrong: 0, accuracyPct: null }
  };

  let loggedSessionsCount = 0;
  for (const log of logs) {
    const bKey = getBucketKeyForHour(log.local_hour);
    const bucket = buckets[bKey];
    bucket.visits++;

    const isWeekend = log.local_dow === 0 || log.local_dow === 6;
    const dayGroup = isWeekend ? dayTypeStats.weekend : dayTypeStats.weekday;
    dayGroup.visits++;

    if (log.event_type === 'drill_complete') {
      loggedSessionsCount++;
      bucket.drillSessions++;
      bucket.totalDurationSec += Number(log.duration_sec) || 0;
      bucket.cardsReviewed += Number(log.cards_reviewed) || 0;
      bucket.correct += Number(log.correct_count) || 0;
      bucket.wrong += Number(log.wrong_count) || 0;

      dayGroup.drillSessions++;
      dayGroup.correct += Number(log.correct_count) || 0;
      dayGroup.wrong += Number(log.wrong_count) || 0;
    }
  }

  const bucketList = Object.values(buckets).map(b => {
    const attempts = b.correct + b.wrong;
    return {
      key: b.key,
      label: b.label,
      visits: b.visits,
      drillSessions: b.drillSessions,
      avgDurationSec: b.drillSessions > 0 ? Math.round(b.totalDurationSec / b.drillSessions) : 0,
      cardsReviewed: b.cardsReviewed,
      accuracyPct: attempts > 0 ? Math.round((b.correct / attempts) * 100) : null
    };
  });

  for (const grp of [dayTypeStats.weekday, dayTypeStats.weekend]) {
    const attempts = grp.correct + grp.wrong;
    grp.accuracyPct = attempts > 0 ? Math.round((grp.correct / attempts) * 100) : null;
  }

  const peakAccessBucket = bucketList
    .filter(b => b.visits > 0)
    .sort((a, b) => (b.visits - a.visits) || (b.drillSessions - a.drillSessions))[0] || null;

  const bestAccuracyBucket = bucketList
    .filter(b => b.drillSessions > 0 && b.accuracyPct !== null)
    .sort((a, b) => (b.accuracyPct - a.accuracyPct) || (b.cardsReviewed - a.cardsReviewed))[0] || null;

  const hasEnoughTimingData = loggedSessionsCount >= 3;
  const hasEnoughData = !(srsCards.length < 5 && loggedSessionsCount === 0);

  const overview = {
    level: progress.level,
    xp: progress.xp,
    streakDays: progress.streakDays,
    weeklyMinutes: progress.weeklyMinutes,
    daysMet15mGoalLast7d,
    totalCardsPracticed: srsCards.length,
    overallAccuracyPct,
    dueCardsCount,
    masteryBreakdown
  };

  const strengths = {
    topCategories: strongCategories,
    topLessons: strongLessons
  };

  const weaknesses = {
    lowestCategory: weakCategory,
    topStrugglingItems,
    activeBlockBottleneck
  };

  const timing = {
    loggedEventsCount: logs.length,
    loggedSessionsCount,
    hasEnoughTimingData,
    peakAccessWindow: peakAccessBucket ? peakAccessBucket.label : null,
    peakAccessKey: peakAccessBucket ? peakAccessBucket.key : null,
    bestAccuracyWindow: bestAccuracyBucket ? bestAccuracyBucket.label : null,
    bestAccuracyKey: bestAccuracyBucket ? bestAccuracyBucket.key : null,
    bestAccuracyPct: bestAccuracyBucket ? bestAccuracyBucket.accuracyPct : null,
    buckets: bucketList,
    weekdayVsWeekend: dayTypeStats
  };

  // Deterministic SHA-256 fingerprint (includes locale so ID/EN never collide)
  const fingerprintPayload = JSON.stringify({
    locale: normLocale,
    overview,
    strengths,
    weaknesses,
    timing
  });
  const dataFingerprint = crypto.createHash('sha256').update(fingerprintPayload).digest('hex');

  return {
    locale: normLocale,
    hasEnoughData,
    dataFingerprint,
    overview,
    strengths,
    weaknesses,
    timing
  };
}

// --- Layer 3 & 4: Text Sanitization, Word Count, Post-Validator & Rule-Based Fallback ---

export function stripHtmlAndControlChars(text) {
  return String(text ?? '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function countWords(text) {
  const cleaned = String(text || '').trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

export function countAdviceWords(advice) {
  let total = countWords(advice?.bestStudyWindow || '');
  if (Array.isArray(advice?.bullets)) {
    for (const b of advice.bullets) {
      total += countWords(b?.text || '');
    }
  }
  return total;
}

const CONVERSATIONAL_PATTERNS = [
  /\b(halo|hai|hello|hi there|selamat pagi|selamat siang|selamat malam)\b/i,
  /\b(apakah (anda|kamu) ingin|mau saya bantu|ada yang bisa saya bantu|jika ada pertanyaan)\b/i,
  /\b(would you like|how can i help|let me know if|feel free to ask|anything else i can)\b/i
];

function isConversationalArtifact(text) {
  const s = String(text || '');
  if (s.includes('?')) return true;
  return CONVERSATIONAL_PATTERNS.some(re => re.test(s));
}

function hasDisallowedFormatting(text) {
  const s = String(text || '');
  if (/```/.test(s)) return true;
  if (/(?:^|\s)#{1,6}\s/.test(s)) return true;
  return false;
}

function trimTextToWordBudget(text, maxWords) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(' ');
  if (maxWords <= 0) return '';
  let sliced = words.slice(0, maxWords).join(' ');
  // Clean trailing punctuation artifacts
  sliced = sliced.replace(/[,;:\-]+$/, '').trim();
  if (!/[.!?]$/.test(sliced)) sliced += '.';
  return sliced;
}

export function validateAndSanitizeAdvice(raw, locale = 'id') {
  if (!raw || typeof raw !== 'object') {
    return { valid: false, reason: 'Output bukan objek JSON valid.' };
  }

  let bestStudyWindow = stripHtmlAndControlChars(raw.bestStudyWindow || '');
  if (!bestStudyWindow) {
    return { valid: false, reason: 'bestStudyWindow kosong.' };
  }
  if (isConversationalArtifact(bestStudyWindow)) {
    return { valid: false, reason: 'Terdeteksi pola percakapan/chatbot pada bestStudyWindow.' };
  }
  if (hasDisallowedFormatting(bestStudyWindow)) {
    return { valid: false, reason: 'Terdeteksi format markdown/kode yang tidak diizinkan pada bestStudyWindow.' };
  }
  bestStudyWindow = trimTextToWordBudget(bestStudyWindow, 14).replace(/\.$/, '');

  if (!Array.isArray(raw.bullets)) {
    return { valid: false, reason: 'bullets bukan array.' };
  }

  const sanitizedBullets = [];
  for (const item of raw.bullets) {
    if (!item || typeof item !== 'object') continue;
    const category = VALID_CATEGORIES.has(item.category) ? item.category : 'action';
    const text = stripHtmlAndControlChars(item.text || '');
    if (!text || countWords(text) < 4) continue;
    if (isConversationalArtifact(text)) {
      return { valid: false, reason: 'Terdeteksi pola percakapan/chatbot.' };
    }
    if (hasDisallowedFormatting(text)) {
      return { valid: false, reason: 'Terdeteksi format markdown/kode yang tidak diizinkan.' };
    }
    sanitizedBullets.push({ category, text });
    if (sanitizedBullets.length >= MAX_BULLETS) break;
  }

  if (sanitizedBullets.length < MIN_BULLETS) {
    return { valid: false, reason: `Jumlah poin kurang dari ${MIN_BULLETS}.` };
  }

  // Enforce strict <= 300 words total (MAX_ADVICE_WORDS)
  let advice = { bestStudyWindow, bullets: sanitizedBullets };
  let totalWords = countAdviceWords(advice);

  if (totalWords > MAX_ADVICE_WORDS) {
    // First drop optional bullets beyond 3 if needed
    while (advice.bullets.length > MIN_BULLETS && countAdviceWords(advice) > MAX_ADVICE_WORDS) {
      advice.bullets.pop();
    }
    // If still over MAX_ADVICE_WORDS, deterministically trim proportionally across remaining bullets
    if (countAdviceWords(advice) > MAX_ADVICE_WORDS) {
      const windowWords = countWords(advice.bestStudyWindow);
      const remainingBudget = Math.max(30, MAX_ADVICE_WORDS - windowWords);
      const perBulletMax = Math.floor(remainingBudget / advice.bullets.length);
      advice.bullets = advice.bullets.map(b => ({
        category: b.category,
        text: trimTextToWordBudget(b.text, perBulletMax)
      }));
    }
    totalWords = countAdviceWords(advice);
  }

  if (totalWords > MAX_ADVICE_WORDS || advice.bullets.length < MIN_BULLETS) {
    return { valid: false, reason: `Gagal memenuhi batas maksimal ${MAX_ADVICE_WORDS} kata atau minimal 3 poin.` };
  }

  return {
    valid: true,
    advice: {
      bestStudyWindow: advice.bestStudyWindow,
      bullets: advice.bullets,
      wordCount: totalWords,
      locale: locale === 'en' ? 'en' : 'id'
    }
  };
}

export function buildRuleBasedAdvice(ctx, locale = 'id') {
  const isEn = locale === 'en';
  const { overview, strengths, weaknesses, timing } = ctx;

  // Determine best study window
  let bestStudyWindow;
  if (timing.hasEnoughTimingData && timing.bestAccuracyWindow) {
    bestStudyWindow = timing.bestAccuracyWindow;
  } else if (timing.peakAccessWindow) {
    bestStudyWindow = timing.peakAccessWindow;
  } else {
    bestStudyWindow = isEn ? 'Morning (05:00–11:59)' : 'Pagi (05:00–11:59)';
  }

  const bullets = [];

  // 1. Strength bullet (fluid, natural coaching tone)
  const topCat = strengths.topCategories[0];
  const topLesson = strengths.topLessons[0];
  if (topCat) {
    bullets.push({
      category: 'strength',
      text: isEn
        ? `Your strongest momentum right now is in ${topCat.label}, where you have practiced ${topCat.cards} cards at ${topCat.accuracyPct}% accuracy while reaching Level ${overview.level} (${overview.masteryBreakdown.mastered} cards fully mastered). Keep building on this foundation so these readings turn into effortless reflexes.`
        : `Kemajuan terbaik Anda saat ini ada di kategori ${topCat.label}, dengan ${topCat.cards} kartu yang sudah dilatih pada akurasi ${topCat.accuracyPct}% hingga mencapai Level ${overview.level} (${overview.masteryBreakdown.mastered} kartu dikuasai penuh). Pertahankan ritme ini agar pengenalan bacaannya makin otomatis.`
    });
  } else if (topLesson) {
    bullets.push({
      category: 'strength',
      text: isEn
        ? `You are building solid traction in Lesson ${topLesson.lesson} with ${topLesson.accuracyPct}% accuracy across ${overview.totalCardsPracticed} practiced cards, supported by a ${overview.streakDays}-day streak. Steady daily exposure like this is what locks kana and kanji into long-term memory.`
        : `Anda mulai membangun pondasi yang kuat di Bab ${topLesson.lesson} dengan akurasi ${topLesson.accuracyPct}% dari ${overview.totalCardsPracticed} kartu terlatih, didukung streak ${overview.streakDays} hari. Latihan singkat yang konsisten seperti ini sangat efektif untuk memori jangka panjang.`
    });
  } else {
    const accStr = overview.overallAccuracyPct !== null ? `${overview.overallAccuracyPct}%` : '0%';
    bullets.push({
      category: 'strength',
      text: isEn
        ? `You have already laid an active study base with ${overview.totalCardsPracticed} practiced cards (${accStr} overall accuracy) and ${overview.xp} XP at Level ${overview.level}. Every review session from here will sharpen recognition speed noticeably.`
        : `Anda sudah membangun fondasi belajar yang aktif lewat ${overview.totalCardsPracticed} kartu terlatih (akurasi total ${accStr}) dan ${overview.xp} XP di Level ${overview.level}. Setiap sesi ulasan berikutnya akan membuat refleks membaca Anda terasa jauh lebih lancar.`
    });
  }

  // 2. Weakness bullet
  const topWeakItem = weaknesses.topStrugglingItems[0];
  const lowCat = weaknesses.lowestCategory;
  if (topWeakItem) {
    const secondWeak = weaknesses.topStrugglingItems[1];
    const itemsList = secondWeak
      ? `${topWeakItem.term} (${topWeakItem.wrong}×) and ${secondWeak.term} (${secondWeak.wrong}×)`
      : `${topWeakItem.term} (${topWeakItem.wrong}×, ${topWeakItem.accuracyPct}%)`;
    const itemsListId = secondWeak
      ? `${topWeakItem.term} (${topWeakItem.wrong}×) dan ${secondWeak.term} (${secondWeak.wrong}×)`
      : `${topWeakItem.term} (${topWeakItem.wrong}×, akurasi ${topWeakItem.accuracyPct}%)`;
    bullets.push({
      category: 'weakness',
      text: isEn
        ? `Your biggest opportunity for quick score gains is ${lowCat ? `${lowCat.label} (${lowCat.accuracyPct}% accuracy)` : 'your frequently missed cards'}, especially terms like ${itemsList}. Spending a few focused minutes on these in Weakness Focus will quickly turn repeated slips into reliable wins.`
        : `Peluang tercepat untuk menaikkan skor Anda ada di ${lowCat ? `${lowCat.label} (akurasi ${lowCat.accuracyPct}%)` : 'kartu yang masih sering keliru'}, terutama kosakata seperti ${itemsListId}. Melatihnya secara terfokus di tab Perbaiki Skor Saya akan cepat mengubah kesalahan berulang menjadi hafalan yang mantap.`
    });
  } else if (weaknesses.activeBlockBottleneck) {
    const bn = weaknesses.activeBlockBottleneck;
    bullets.push({
      category: 'weakness',
      text: isEn
        ? `In ${bn.blockRange}, you still have ${bn.remainingCloze} Cloze Sentence items left (${bn.clozePracticed} of ${bn.clozeTotal} completed). Clearing these contextual sentences is the final step to unlocking full mastery for this block.`
        : `Pada blok ${bn.blockRange}, masih ada ${bn.remainingCloze} soal Kalimat Rumpang yang belum tuntas (${bn.clozePracticed} dari ${bn.clozeTotal} selesai). Menuntaskan soal konteks kalimat ini adalah kunci terakhir untuk meraih penguasaan penuh di blok tersebut.`
    });
  } else {
    bullets.push({
      category: 'weakness',
      text: isEn
        ? `You currently have ${overview.dueCardsCount} SRS cards waiting for review, with ${overview.weeklyMinutes} minutes logged this week (${overview.daysMet15mGoalLast7d}/7 days meeting your 15-minute goal). Clearing overdue reviews promptly prevents memory fade.`
        : `Saat ini ada ${overview.dueCardsCount} kartu SRS yang sudah jatuh tempo untuk diulas, dengan total ${overview.weeklyMinutes} menit belajar minggu ini (${overview.daysMet15mGoalLast7d}/7 hari memenuhi target 15 menit). Mengulas kartu jatuh tempo tepat waktu menjaga ingatan tetap tajam.`
    });
  }

  // 3. Timing bullet
  if (timing.hasEnoughTimingData && timing.peakAccessWindow && timing.bestAccuracyWindow) {
    bullets.push({
      category: 'timing',
      text: isEn
        ? `Your study logs show you open the app most often during ${timing.peakAccessWindow}, while your sharpest accuracy (${timing.bestAccuracyPct}%) consistently happens in ${timing.bestAccuracyWindow}. Try reserving ${timing.bestAccuracyWindow} for tougher quizzes and using other windows for light flashcard reviews.`
        : `Log belajar Anda menunjukkan frekuensi akses tertinggi terjadi pada ${timing.peakAccessWindow}, sementara akurasi paling tajam (${timing.bestAccuracyPct}%) muncul di ${timing.bestAccuracyWindow}. Manfaatkan jam ${timing.bestAccuracyWindow} untuk kuis yang lebih menantang, dan gunakan waktu lain untuk flashcard santai.`
    });
  } else if (timing.loggedEventsCount > 0 && timing.peakAccessWindow) {
    bullets.push({
      category: 'timing',
      text: isEn
        ? `So far you have logged ${timing.loggedSessionsCount} completed drill sessions, with most activity taking place in ${timing.peakAccessWindow}. Once you finish 3 or more sessions across different times of day, we can pinpoint the exact window where your reading accuracy peaks.`
        : `Sejauh ini tercatat ${timing.loggedSessionsCount} sesi drill selesai dengan aktivitas terbanyak pada ${timing.peakAccessWindow}. Setelah Anda menyelesaikan minimal 3 sesi di beberapa waktu berbeda, pola jam belajar dengan akurasi terbaik akan terlihat jauh lebih jelas.`
    });
  } else {
    bullets.push({
      category: 'timing',
      text: isEn
        ? `Because only ${timing.loggedSessionsCount} timed drill sessions are recorded so far, there is not yet enough data to compare hourly accuracy. Anchoring a simple 15-minute routine during ${bestStudyWindow} is a great way to build natural consistency.`
        : `Karena baru tercatat ${timing.loggedSessionsCount} sesi drill, data waktu belum cukup untuk membandingkan akurasi per jam. Mengunci jadwal santai selama 15 menit pada ${bestStudyWindow} adalah cara terbaik untuk mulai membentuk kebiasaan belajar.`
    });
  }

  // 4. Action bullet
  bullets.push({
    category: 'action',
    text: isEn
      ? `For your next session, jump into a 15-minute Daily Drill to clear ${Math.min(overview.dueCardsCount || 10, 15)} due cards and warm up with audio playback before switching to quiz mode (${overview.daysMet15mGoalLast7d}/7 daily goals met this week).`
      : `Untuk sesi berikutnya, buka Daily Drill selama 15 menit guna menuntaskan ${Math.min(overview.dueCardsCount || 10, 15)} kartu jatuh tempo, lalu manfaatkan pemutaran audio sebagai pemanasan sebelum masuk ke mode kuis (${overview.daysMet15mGoalLast7d}/7 target harian tercapai minggu ini).`
  });

  const validated = validateAndSanitizeAdvice({ bestStudyWindow, bullets }, locale);
  if (validated.valid) {
    return validated.advice;
  }
  // Safety net (should never hit)
  return {
    bestStudyWindow,
    bullets: bullets.slice(0, 3),
    wordCount: countAdviceWords({ bestStudyWindow, bullets: bullets.slice(0, 3) }),
    locale: isEn ? 'en' : 'id'
  };
}

// --- Gemini 3.5 Flash-Lite REST Call ---

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    bestStudyWindow: { type: 'STRING' },
    bullets: {
      type: 'ARRAY',
      minItems: 3,
      maxItems: 5,
      items: {
        type: 'OBJECT',
        properties: {
          category: { type: 'STRING', enum: ['strength', 'weakness', 'timing', 'action'] },
          text: { type: 'STRING' }
        },
        required: ['category', 'text']
      }
    }
  },
  required: ['bestStudyWindow', 'bullets']
};

function buildSystemInstruction(locale = 'id') {
  const langRule = locale === 'en'
    ? 'Write in smooth, fluid, natural, encouraging English — like a warm, observant Japanese study coach. Avoid choppy or robotic telegraphic fragments.'
    : 'Tulis seluruh saran dalam Bahasa Indonesia yang mengalir alami, hangat, dan suportif — seperti sensei/mentor belajar bahasa Jepang yang perhatian. Hindari gaya bahasa kaku atau terpotong-potong.';

  return [
    'You are the Senjuku Nihongo AI Study Advisor — a one-shot analytical report generator, strictly NOT a chatbot.',
    langRule,
    'Hard rules:',
    '1. NEVER greet the user, NEVER ask follow-up questions, NEVER invite conversation, NEVER use markdown/HTML.',
    '2. Cite ONLY the real numbers, categories, lessons, struggling terms, and time-of-day buckets provided in the JSON input. Never invent statistics.',
    '3. Return 3 to 5 fluid, well-written bullets covering: "strength" (strongest metric/category/lesson), "weakness" (lowest category or top struggling items/bottleneck), "timing" (observed access pattern and best study timing; if hasEnoughTimingData is false, gently explain that timing logs are still limited and recommend building a steady routine without fabricating hourly accuracy), and optionally "action" (one concrete, motivating next drill step).',
    '4. Keep bestStudyWindow short (e.g., "Pagi (05:00–11:59)" or "Morning (05:00–11:59)").',
    '5. Total word count across bestStudyWindow and all bullets should be around 150–260 words (strict ceiling 300 words).'
  ].join('\n');
}

export async function callGeminiAdvisor(ctx, config, fetchImpl = fetch) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent`;

  // Strictly zero-PII structured analytics payload
  const analyticsPayload = {
    locale: ctx.locale,
    overview: ctx.overview,
    strengths: ctx.strengths,
    weaknesses: ctx.weaknesses,
    timing: ctx.timing
  };

  const requestBody = {
    systemInstruction: {
      parts: [{ text: buildSystemInstruction(ctx.locale) }]
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Analyze this learner performance and activity timing JSON and produce the structured study advice:\n${JSON.stringify(analyticsPayload)}`
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.4,
      maxOutputTokens: 900,
      thinkingConfig: {
        thinkingLevel: config.thinkingLevel
      }
    }
  };

  const res = await fetchImpl(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': config.apiKey
    },
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(config.timeoutMs)
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gemini API HTTP ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const textPart =
    parts.find(p => !p?.thought && typeof p?.text === 'string')?.text ||
    parts.find(p => typeof p?.text === 'string')?.text;
  if (!textPart) {
    throw new Error('Gemini API returned empty content.');
  }

  let parsed;
  try {
    parsed = JSON.parse(textPart);
  } catch {
    throw new Error('Gemini API returned non-JSON output.');
  }

  return parsed;
}

// --- Layer 5: Rate Limiting (3x / day per user), Status & Orchestration ---

function getCooldownRemainingSec(userId, now = Date.now()) {
  const last = userLastRefresh.get(userId);
  if (!last) return 0;
  const elapsed = now - last;
  if (elapsed >= REFRESH_COOLDOWN_MS) return 0;
  return Math.ceil((REFRESH_COOLDOWN_MS - elapsed) / 1000);
}

function getSecondsUntilMidnight(now = Date.now()) {
  const d = new Date(now);
  const nextMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0);
  return Math.max(60, Math.ceil((nextMidnight.getTime() - now) / 1000));
}

function getUserDailyQuota(db, userId, now = Date.now()) {
  const dateKey = getUsageDateKey(now);
  const usedToday = getAdvisorDailyUsage(db, userId, dateKey);
  const remainingToday = Math.max(0, MAX_DAILY_GENERATIONS - usedToday);
  return { dateKey, dailyLimit: MAX_DAILY_GENERATIONS, usedToday, remainingToday };
}

function checkAdvisorRateLimit(db, userId, forceRefresh, now = Date.now()) {
  const quota = getUserDailyQuota(db, userId, now);
  if (quota.usedToday >= MAX_DAILY_GENERATIONS) {
    return {
      allowed: false,
      retryAfterSec: getSecondsUntilMidnight(now),
      reason: 'daily_limit',
      quota
    };
  }

  if (forceRefresh) {
    const cooldownSec = getCooldownRemainingSec(userId, now);
    if (cooldownSec > 0) {
      return {
        allowed: false,
        retryAfterSec: cooldownSec,
        reason: 'cooldown',
        quota
      };
    }
  }

  return { allowed: true, retryAfterSec: 0, reason: null, quota };
}

function recordAdvisorCall(db, userId, now = Date.now()) {
  const dateKey = getUsageDateKey(now);
  const usedToday = incrementAdvisorDailyUsage(db, userId, dateKey, new Date(now).toISOString());
  userLastRefresh.set(userId, now);
  return {
    dailyLimit: MAX_DAILY_GENERATIONS,
    usedToday,
    remainingToday: Math.max(0, MAX_DAILY_GENERATIONS - usedToday)
  };
}

export function getAdvisorStatus(db, userId, locale = 'id') {
  const normLocale = locale === 'en' ? 'en' : 'id';
  const config = getAdvisorConfig();
  const ctx = buildAdvisorContext(db, userId, normLocale);
  const cached = getAdvisorCache(db, userId, normLocale);
  const quota = getUserDailyQuota(db, userId);

  let cachedAdvice = null;
  let cachedAt = null;
  let cachedSource = null;
  let cachedModel = null;

  if (cached) {
    try {
      const parsed = JSON.parse(cached.advice_json);
      cachedAdvice = parsed;
      cachedAt = cached.created_at;
      cachedSource = cached.source;
      cachedModel = cached.model;
    } catch {
      cachedAdvice = null;
    }
  }

  return {
    enabled: config.enabled,
    model: config.model,
    locale: normLocale,
    hasEnoughData: ctx.hasEnoughData,
    cachedAdvice,
    cachedAt,
    cachedSource,
    cachedModel,
    cooldownRemainingSec: getCooldownRemainingSec(userId),
    dailyLimit: quota.dailyLimit,
    usedToday: quota.usedToday,
    remainingToday: quota.remainingToday
  };
}

export async function generateAdvisorReport(db, userId, options = {}, deps = {}) {
  const locale = options.locale === 'en' ? 'en' : 'id';
  const forceRefresh = Boolean(options.forceRefresh);
  const fetchImpl = deps.fetchImpl || fetch;
  const now = typeof deps.now === 'number' ? deps.now : Date.now();
  const config = getAdvisorConfig();

  const ctx = buildAdvisorContext(db, userId, locale);

  // Insufficient-data guard: never call Gemini on empty accounts
  if (!ctx.hasEnoughData) {
    const quota = getUserDailyQuota(db, userId, now);
    return {
      httpStatus: 200,
      payload: {
        status: 'insufficient_data',
        locale,
        message: locale === 'en'
          ? 'Complete at least 1 drill session or review 5 cards so AI Advisor can analyze real performance data.'
          : 'Selesaikan minimal 1 sesi drill atau latih 5 kartu agar AI Advisor dapat menganalisis data performa nyata Anda.',
        metricsSummary: {
          totalCardsPracticed: ctx.overview.totalCardsPracticed,
          loggedSessionsCount: ctx.timing.loggedSessionsCount
        },
        dailyLimit: quota.dailyLimit,
        usedToday: quota.usedToday,
        remainingToday: quota.remainingToday
      }
    };
  }

  // Check SQLite cache first (unless forceRefresh)
  if (!forceRefresh) {
    const cached = getAdvisorCache(db, userId, locale);
    if (cached && cached.data_fingerprint === ctx.dataFingerprint) {
      const ageMs = now - Date.parse(cached.created_at);
      if (Number.isFinite(ageMs) && ageMs >= 0 && ageMs < config.cacheTtlMs) {
        try {
          const cachedAdvice = JSON.parse(cached.advice_json);
          const quota = getUserDailyQuota(db, userId, now);
          return {
            httpStatus: 200,
            payload: {
              status: 'ready',
              cached: true,
              source: cached.source,
              model: cached.model,
              generatedAt: cached.created_at,
              locale,
              advice: cachedAdvice,
              cooldownRemainingSec: getCooldownRemainingSec(userId, now),
              dailyLimit: quota.dailyLimit,
              usedToday: quota.usedToday,
              remainingToday: quota.remainingToday
            }
          };
        } catch {
          // Corrupted cache entry; fall through to regenerate
        }
      }
    }
  }

  // Enforce per-user daily limit (3x/day) & refresh cooldown
  const rate = checkAdvisorRateLimit(db, userId, forceRefresh, now);
  if (!rate.allowed) {
    const msg = rate.reason === 'cooldown'
      ? (locale === 'en'
        ? `Please wait ${rate.retryAfterSec}s before refreshing advice again.`
        : `Tunggu ${rate.retryAfterSec} detik sebelum memperbarui saran lagi.`)
      : (locale === 'en'
        ? `Daily AI Advisor limit reached (max ${MAX_DAILY_GENERATIONS}×/day). You can generate fresh advice again tomorrow.`
        : `Batas pembuatan saran AI hari ini tercapai (maks ${MAX_DAILY_GENERATIONS}×/hari). Anda dapat membuat saran baru lagi besok.`);

    return {
      httpStatus: 429,
      payload: {
        status: 'rate_limited',
        error: msg,
        retryAfterSec: rate.retryAfterSec,
        dailyLimit: rate.quota.dailyLimit,
        usedToday: rate.quota.usedToday,
        remainingToday: rate.quota.remainingToday
      }
    };
  }

  // Count this fresh generation against user's 3x/day quota
  const updatedQuota = recordAdvisorCall(db, userId, now);

  let finalAdvice = null;
  let source = 'rule-based-fallback';
  let usedModel = config.model;

  if (config.enabled) {
    // Try Gemini (with 1 automatic retry if post-validator rejects output)
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const raw = await callGeminiAdvisor(ctx, config, fetchImpl);
        const checked = validateAndSanitizeAdvice(raw, locale);
        if (checked.valid) {
          finalAdvice = checked.advice;
          source = 'gemini';
          break;
        }
      } catch (err) {
        console.warn('[AI Advisor] Gemini call failed, using fallback:', err?.message || err);
        // On network/API error, do not hang retrying — fall back immediately
        break;
      }
    }
  }

  if (!finalAdvice) {
    finalAdvice = buildRuleBasedAdvice(ctx, locale);
    source = 'rule-based-fallback';
    usedModel = 'rule-based-v1';
  }

  const generatedAt = new Date(now).toISOString();
  upsertAdvisorCache(db, {
    userId,
    locale,
    dataFingerprint: ctx.dataFingerprint,
    adviceJson: finalAdvice,
    model: usedModel,
    source,
    createdAt: generatedAt
  });

  return {
    httpStatus: 200,
    payload: {
      status: 'ready',
      cached: false,
      source,
      model: usedModel,
      generatedAt,
      locale,
      advice: finalAdvice,
      cooldownRemainingSec: getCooldownRemainingSec(userId, now),
      dailyLimit: updatedQuota.dailyLimit,
      usedToday: updatedQuota.usedToday,
      remainingToday: updatedQuota.remainingToday
    }
  };
}
