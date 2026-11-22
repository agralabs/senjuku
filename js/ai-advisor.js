// KiraKira Nihongo - AI Advisor Frontend View (One-Shot Analytical Report Card)
// Strictly NOT a chatbot: zero <input>, zero <textarea>, zero chat bubbles.

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const COPY = {
  id: {
    tag: '✨ AI STUDY ADVISOR',
    title: 'Analisis & Saran Belajar',
    generateBtn: '✨ Buat Saran AI',
    refreshBtn: '🔄 Perbarui Saran',
    loadingBtn: 'Menganalisis log belajar...',
    idleDesc: 'Dapatkan saran belajar yang mengalir dan personal berdasarkan kekuatan, kelemahan, dan pola jam belajar nyata Anda (hingga 3×/hari).',
    guestTitle: 'Masuk untuk Menggunakan AI Advisor',
    guestDesc: 'AI Advisor menganalisis kartu SRS dan log waktu belajar di akun cloud Anda untuk menentukan kekuatan, kelemahan, dan jam belajar terbaik.',
    guestCta: '🔐 Masuk / Daftar',
    insufficientTitle: 'Data Belajar Belum Cukup',
    insufficientDefault: 'Selesaikan minimal 1 sesi drill atau latih 5 kartu agar AI Advisor dapat menganalisis performa nyata Anda.',
    startDrillCta: '⚡ Mulai Daily Drill',
    bestWindowLabel: 'Waktu Belajar Terbaik',
    updatedLabel: 'Terakhir diperbarui',
    wordsUnit: 'kata',
    cachedBadge: 'Cache',
    quotaLeftLabel: 'Sisa hari ini',
    limitReachedBtn: 'Batas 3×/Hari Tercapai',
    sourceGemini: 'Gemini 3.5 Flash-Lite',
    sourceFallback: 'Analisis Lokal',
    categories: {
      strength: { icon: '💪', label: 'Kekuatan' },
      weakness: { icon: '🎯', label: 'Perlu Diperbaiki' },
      timing: { icon: '⏰', label: 'Waktu Terbaik' },
      action: { icon: '🚀', label: 'Langkah Berikutnya' }
    }
  },
  en: {
    tag: '✨ AI STUDY ADVISOR',
    title: 'Data-Backed Study Advice',
    generateBtn: '✨ Generate AI Advice',
    refreshBtn: '🔄 Refresh Advice',
    loadingBtn: 'Analyzing study logs...',
    idleDesc: 'Get clear, fluid study advice tailored to your strengths, weaknesses, and real study timing patterns (up to 3×/day).',
    guestTitle: 'Sign In to Activate AI Advisor',
    guestDesc: 'AI Advisor analyzes your cloud SRS cards and activity timing logs to spot strengths, weaknesses, and your peak study window.',
    guestCta: '🔐 Sign In / Register',
    insufficientTitle: 'Not Enough Study Data Yet',
    insufficientDefault: 'Complete at least 1 drill session or review 5 cards so AI Advisor can analyze your real performance.',
    startDrillCta: '⚡ Start Daily Drill',
    bestWindowLabel: 'Best Study Window',
    updatedLabel: 'Last updated',
    wordsUnit: 'words',
    cachedBadge: 'Cached',
    quotaLeftLabel: 'Left today',
    limitReachedBtn: 'Daily Limit (3/3) Reached',
    sourceGemini: 'Gemini 3.5 Flash-Lite',
    sourceFallback: 'Local Analytics',
    categories: {
      strength: { icon: '💪', label: 'Strength' },
      weakness: { icon: '🎯', label: 'Needs Work' },
      timing: { icon: '⏰', label: 'Best Timing' },
      action: { icon: '🚀', label: 'Next Step' }
    }
  }
};

function formatTimestamp(iso, locale) {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleString(locale === 'en' ? 'en-US' : 'id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return String(iso).slice(0, 16);
  }
}

export class AiAdvisorView {
  constructor() {
    this.container = null;
    this.fetchImpl = (...args) => globalThis.fetch(...args);
    this.onOpenLogin = null;
    this.onLaunchDrill = null;

    this.locale = this.loadSavedLocale();
    this.state = 'idle'; // 'unauthenticated' | 'idle' | 'loading' | 'ready' | 'insufficient_data' | 'error'
    this.advice = null;
    this.generatedAt = null;
    this.source = null;
    this.model = null;
    this.cached = false;
    this.errorMessage = null;
    this.insufficientMessage = null;
    this.cooldownRemainingSec = 0;
    this.dailyLimit = 3;
    this.remainingToday = 3;
    this._statusSeq = 0;
  }

  loadSavedLocale() {
    try {
      const saved = globalThis.localStorage?.getItem('kk_ai_advisor_locale');
      return saved === 'en' ? 'en' : 'id';
    } catch {
      return 'id';
    }
  }

  init(container, options = {}) {
    this.container = container;
    if (typeof options.fetchImpl === 'function') {
      this.fetchImpl = options.fetchImpl;
    }
    this.onOpenLogin = typeof options.onOpenLogin === 'function' ? options.onOpenLogin : null;
    this.onLaunchDrill = typeof options.onLaunchDrill === 'function' ? options.onLaunchDrill : null;
    this.render();
  }

  setLocale(nextLocale) {
    const norm = nextLocale === 'en' ? 'en' : 'id';
    if (norm === this.locale) return Promise.resolve();
    this.locale = norm;
    try {
      globalThis.localStorage?.setItem('kk_ai_advisor_locale', norm);
    } catch {}
    this.state = 'idle';
    this.errorMessage = null;
    this.advice = null;
    this.generatedAt = null;
    this.render();
    return this.loadStatus();
  }

  clearLocalState() {
    this._statusSeq = (this._statusSeq || 0) + 1;
    this.advice = null;
    this.generatedAt = null;
    this.source = null;
    this.model = null;
    this.cached = false;
    this.errorMessage = null;
    this.insufficientMessage = null;
    this.cooldownRemainingSec = 0;
    this.dailyLimit = 3;
    this.remainingToday = 3;
    this.state = 'idle';
    this.render();
  }

  resetForAuthChange() {
    this.clearLocalState();
    return this.loadStatus();
  }

  async loadStatus() {
    if (!this.container || this.state === 'loading') return;
    const seq = (this._statusSeq || 0) + 1;
    this._statusSeq = seq;
    const requestedLocale = this.locale;
    const isStale = () => seq !== this._statusSeq || requestedLocale !== this.locale || this.state === 'loading';

    try {
      const res = await this.fetchImpl(`/api/advisor/status?locale=${encodeURIComponent(requestedLocale)}`, {
        method: 'GET',
        credentials: 'same-origin'
      });
      if (isStale()) return;

      if (res.status === 401) {
        this.state = 'unauthenticated';
        this.advice = null;
        this.errorMessage = null;
        this.render();
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (isStale()) return;

      if (!res.ok) {
        this.state = this.advice ? 'ready' : 'error';
        this.errorMessage = data.error || (this.locale === 'en' ? 'Failed to load AI Advisor status.' : 'Gagal memuat status AI Advisor.');
        this.render();
        return;
      }

      this.cooldownRemainingSec = Number(data.cooldownRemainingSec) || 0;
      if (data.dailyLimit !== null && data.dailyLimit !== '' && Number.isFinite(Number(data.dailyLimit))) this.dailyLimit = Number(data.dailyLimit);
      if (data.remainingToday !== null && data.remainingToday !== '' && Number.isFinite(Number(data.remainingToday))) this.remainingToday = Math.max(0, Number(data.remainingToday));
      this.errorMessage = null;

      if (!data.hasEnoughData) {
        this.state = 'insufficient_data';
        this.advice = null;
        this.insufficientMessage = null;
      } else if (data.cachedAdvice) {
        this.state = 'ready';
        this.advice = data.cachedAdvice;
        this.generatedAt = data.cachedAt || null;
        this.source = data.cachedSource || 'gemini';
        this.model = data.cachedModel || data.model || null;
        this.cached = true;
      } else {
        this.state = 'idle';
        this.advice = null;
        this.generatedAt = null;
      }
      this.render();
    } catch {
      if (isStale()) return;
      this.state = this.advice ? 'ready' : 'error';
      this.errorMessage = this.locale === 'en'
        ? 'Could not connect to AI Advisor service.'
        : 'Tidak dapat terhubung ke layanan AI Advisor.';
      this.render();
    }
  }

  async generate({ forceRefresh = false } = {}) {
    if (!this.container || this.state === 'loading') return;
    const seq = (this._statusSeq || 0) + 1;
    this._statusSeq = seq;
    const requestedLocale = this.locale;
    const isStale = () => seq !== this._statusSeq || requestedLocale !== this.locale;
    const prevAdvice = this.advice;
    this.state = 'loading';
    this.errorMessage = null;
    this.render();

    try {
      const res = await this.fetchImpl('/api/advisor/generate', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          forceRefresh: Boolean(forceRefresh),
          locale: requestedLocale
        })
      });
      if (isStale()) return;

      if (res.status === 401) {
        this.state = 'unauthenticated';
        this.advice = null;
        this.render();
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (isStale()) return;

      if (res.status === 429) {
        this.cooldownRemainingSec = Number(data.retryAfterSec) || 60;
        if (data.dailyLimit !== null && data.dailyLimit !== '' && Number.isFinite(Number(data.dailyLimit))) this.dailyLimit = Number(data.dailyLimit);
        if (data.remainingToday !== null && data.remainingToday !== '' && Number.isFinite(Number(data.remainingToday))) this.remainingToday = Math.max(0, Number(data.remainingToday));
        this.errorMessage = data.error || (this.locale === 'en'
          ? `Rate limit reached. Please wait ${this.cooldownRemainingSec}s.`
          : `Batas permintaan tercapai. Tunggu ${this.cooldownRemainingSec} detik.`);
        this.advice = prevAdvice;
        this.state = prevAdvice ? 'ready' : 'error';
        this.render();
        return;
      }

      if (!res.ok) {
        this.errorMessage = data.error || (this.locale === 'en'
          ? 'Failed to generate AI advice. Please try again.'
          : 'Gagal membuat saran AI. Silakan coba lagi.');
        this.advice = prevAdvice;
        this.state = prevAdvice ? 'ready' : 'error';
        this.render();
        return;
      }

      if (data.status === 'insufficient_data') {
        this.state = 'insufficient_data';
        this.advice = null;
        this.insufficientMessage = data.message || null;
        this.render();
        return;
      }

      if (data.status === 'ready' && data.advice) {
        this.state = 'ready';
        this.advice = data.advice;
        this.generatedAt = data.generatedAt || new Date().toISOString();
        this.source = data.source || 'gemini';
        this.model = data.model || null;
        this.cached = Boolean(data.cached);
        this.cooldownRemainingSec = Number(data.cooldownRemainingSec) || 0;
        if (data.dailyLimit !== null && data.dailyLimit !== '' && Number.isFinite(Number(data.dailyLimit))) this.dailyLimit = Number(data.dailyLimit);
        if (data.remainingToday !== null && data.remainingToday !== '' && Number.isFinite(Number(data.remainingToday))) this.remainingToday = Math.max(0, Number(data.remainingToday));
        this.errorMessage = null;
        this.render();
        return;
      }

      this.advice = prevAdvice;
      this.state = prevAdvice ? 'ready' : 'error';
      this.errorMessage = this.locale === 'en' ? 'Unexpected response from AI Advisor.' : 'Respon AI Advisor tidak dikenali.';
      this.render();
    } catch {
      if (isStale()) return;
      this.advice = prevAdvice;
      this.state = prevAdvice ? 'ready' : 'error';
      this.errorMessage = this.locale === 'en'
        ? 'Network error while contacting AI Advisor.'
        : 'Gagal menghubungi server AI Advisor.';
      this.render();
    }
  }

  render() {
    if (!this.container) return;
    const t = COPY[this.locale === 'en' ? 'en' : 'id'];
    const isLoading = this.state === 'loading';
    const hasAdvice = Boolean(this.advice && Array.isArray(this.advice.bullets) && this.advice.bullets.length > 0);
    const showActionBtn = this.state !== 'unauthenticated' && this.state !== 'insufficient_data';

    const limitReached = this.remainingToday <= 0;
    const actionLabel = isLoading
      ? t.loadingBtn
      : (limitReached ? t.limitReachedBtn : (hasAdvice ? t.refreshBtn : t.generateBtn));

    let bodyHtml = '';

    if (this.state === 'unauthenticated') {
      bodyHtml = `
        <div class="ai-advisor-empty-state">
          <div class="ai-advisor-empty-icon">🔒</div>
          <h3 class="ai-advisor-empty-title">${escapeHtml(t.guestTitle)}</h3>
          <p class="card-desc">${escapeHtml(t.guestDesc)}</p>
          <button type="button" class="btn btn-primary btn-sm" id="btnAdvisorOpenLogin">${escapeHtml(t.guestCta)}</button>
        </div>
      `;
    } else if (isLoading) {
      bodyHtml = `
        <div class="ai-advisor-skeleton" aria-busy="true" aria-live="polite">
          <div class="ai-skeleton-pill"></div>
          <div class="ai-skeleton-line"></div>
          <div class="ai-skeleton-line short"></div>
          <div class="ai-skeleton-line"></div>
          <div class="ai-skeleton-line medium"></div>
        </div>
      `;
    } else if (this.state === 'insufficient_data') {
      bodyHtml = `
        <div class="empty-weak-state ai-advisor-empty-state">
          <div class="ai-advisor-empty-icon">📊</div>
          <h3 class="ai-advisor-empty-title">${escapeHtml(t.insufficientTitle)}</h3>
          <p class="card-desc">${escapeHtml(this.insufficientMessage || t.insufficientDefault)}</p>
          <button type="button" class="btn btn-primary btn-sm" id="btnAdvisorStartDrill">${escapeHtml(t.startDrillCta)}</button>
        </div>
      `;
    } else if (this.state === 'ready' && hasAdvice) {
      const errorBanner = this.errorMessage
        ? `<div class="auth-feedback error ai-advisor-banner" role="alert">${escapeHtml(this.errorMessage)}</div>`
        : '';

      const bulletsHtml = this.advice.bullets.map(b => {
        const cat = Object.hasOwn(t.categories, b.category) ? t.categories[b.category] : t.categories.action;
        const catClass = ['strength', 'weakness', 'timing', 'action'].includes(b.category) ? b.category : 'action';
        return `
          <li class="ai-advisor-bullet-item cat-${catClass}">
            <span class="ai-bullet-badge cat-${catClass}">${cat.icon} ${escapeHtml(cat.label)}</span>
            <p class="ai-bullet-text">${escapeHtml(b.text)}</p>
          </li>
        `;
      }).join('');

      const sourceLabel = this.source === 'gemini' ? t.sourceGemini : t.sourceFallback;
      const wordCount = Number(this.advice.wordCount) || 0;
      const cachedPill = this.cached ? `<span class="badge ai-meta-badge">${escapeHtml(t.cachedBadge)}</span>` : '';

      bodyHtml = `
        ${errorBanner}
        <div class="ai-best-window-pill">
          <span class="ai-best-window-label">⏰ ${escapeHtml(t.bestWindowLabel)}:</span>
          <strong class="ai-best-window-value">${escapeHtml(this.advice.bestStudyWindow)}</strong>
        </div>
        <ul class="ai-advisor-bullets">
          ${bulletsHtml}
        </ul>
        <div class="ai-advisor-meta-row">
          <span class="ai-meta-time">${escapeHtml(t.updatedLabel)}: ${escapeHtml(formatTimestamp(this.generatedAt, this.locale))}</span>
          <div class="ai-meta-badges">
            <span class="badge ai-meta-badge">${escapeHtml(t.quotaLeftLabel)}: ${this.remainingToday}/${this.dailyLimit}</span>
            <span class="badge ai-meta-badge">${wordCount} ${escapeHtml(t.wordsUnit)}</span>
            <span class="badge badge-info ai-meta-badge">${escapeHtml(sourceLabel)}</span>
            ${cachedPill}
          </div>
        </div>
      `;
    } else if (this.state === 'error') {
      const fallbackErr = this.locale === 'en' ? 'An error occurred.' : 'Terjadi kesalahan.';
      bodyHtml = `
        <div class="auth-feedback error ai-advisor-banner" role="alert">${escapeHtml(this.errorMessage || fallbackErr)}</div>
        <p class="card-desc">${escapeHtml(t.idleDesc)}</p>
      `;
    } else {
      // idle
      bodyHtml = `
        <p class="card-desc ai-advisor-idle-desc">${escapeHtml(t.idleDesc)}</p>
      `;
    }

    this.container.innerHTML = `
      <div class="card ai-advisor-card" data-advisor-state="${escapeHtml(this.state)}">
        <div class="card-header ai-advisor-header">
          <div class="ai-advisor-title-group">
            <span class="subheading-tag">${escapeHtml(t.tag)}</span>
            <h2 class="card-title">${escapeHtml(t.title)}</h2>
          </div>
          <div class="ai-advisor-controls">
            <div class="ai-locale-toggle" role="group" aria-label="Advice language">
              <button type="button" class="ai-locale-btn ${this.locale === 'id' ? 'active' : ''}" id="btnAdvisorLocaleId" aria-pressed="${this.locale === 'id'}" ${isLoading ? 'disabled' : ''}>ID</button>
              <button type="button" class="ai-locale-btn ${this.locale === 'en' ? 'active' : ''}" id="btnAdvisorLocaleEn" aria-pressed="${this.locale === 'en'}" ${isLoading ? 'disabled' : ''}>EN</button>
            </div>
            ${showActionBtn ? `
              <button type="button" class="btn btn-primary btn-sm" id="btnGenerateAiAdvice" ${isLoading || limitReached ? 'disabled' : ''}>
                ${escapeHtml(actionLabel)}
              </button>
            ` : ''}
          </div>
        </div>
        <div class="ai-advisor-body">
          ${bodyHtml}
        </div>
      </div>
    `;

    this.bindEvents(hasAdvice);
  }

  bindEvents(hasAdvice) {
    if (!this.container) return;

    this.container.querySelector('#btnAdvisorLocaleId')?.addEventListener('click', () => this.setLocale('id'));
    this.container.querySelector('#btnAdvisorLocaleEn')?.addEventListener('click', () => this.setLocale('en'));
    this.container.querySelector('#btnGenerateAiAdvice')?.addEventListener('click', () => this.generate({ forceRefresh: hasAdvice }));
    this.container.querySelector('#btnAdvisorOpenLogin')?.addEventListener('click', () => {
      if (this.onOpenLogin) this.onOpenLogin();
    });
    this.container.querySelector('#btnAdvisorStartDrill')?.addEventListener('click', () => {
      if (this.onLaunchDrill) this.onLaunchDrill();
    });
  }
}

export const aiAdvisorView = new AiAdvisorView();
