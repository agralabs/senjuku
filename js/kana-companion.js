// KiraKira Nihongo — Kana Writing Companion Controller (Hiragana + Katakana, All 92 Kana & 20 Row Lessons)
// Paper-workbook companion: KanjiVG stroke-order animation, audio, 5-step row lessons, and 3-box Leitner review.

import {
  HIRAGANA_STROKES,
  KANA_CHART_ROWS,
  KANA_ROMAJI,
  KANA_TIPS,
  KANA_ROW_LESSONS
} from '../data/kana-strokes.js';
import {
  KATAKANA_STROKES,
  KATAKANA_CHART_ROWS,
  KATAKANA_ROMAJI,
  KATAKANA_TIPS,
  KATAKANA_ROW_LESSONS
} from '../data/katakana-strokes.js';
import { sound } from './audio.js';
import { progress } from './srs.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

const ICONS = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>',
  step: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h11M12 6l6 6-6 6"/></svg>',
  say: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>'
};

const STEP_LABELS = [
  'Lihat & Dengar',
  'Tulis di Buku',
  'Dengar & Pilih',
  'Baca & Pilih',
  'Baca Kata'
];

const SCRIPT_DATASETS = {
  hiragana: {
    key: 'hiragana',
    name: 'Hiragana',
    defaultChar: 'あ',
    strokes: HIRAGANA_STROKES,
    chartRows: KANA_CHART_ROWS,
    romaji: KANA_ROMAJI,
    tips: KANA_TIPS,
    rowLessons: KANA_ROW_LESSONS,
    defaultDeck: { 'あ': 1, 'い': 1, 'う': 1, 'え': 1, 'お': 1 },
    chartKey: 'chartKana',
    rowIdxKey: 'activeRowIndex',
    rowsDoneKey: 'rowsDone',
    paperKey: 'paper',
    deckKey: 'deck'
  },
  katakana: {
    key: 'katakana',
    name: 'Katakana',
    defaultChar: 'ア',
    strokes: KATAKANA_STROKES,
    chartRows: KATAKANA_CHART_ROWS,
    romaji: KATAKANA_ROMAJI,
    tips: KATAKANA_TIPS,
    rowLessons: KATAKANA_ROW_LESSONS,
    defaultDeck: { 'ア': 1, 'イ': 1, 'ウ': 1, 'エ': 1, 'オ': 1 },
    chartKey: 'katakanaChartKana',
    rowIdxKey: 'katakanaActiveRowIndex',
    rowsDoneKey: 'katakanaRowsDone',
    paperKey: 'katakanaPaper',
    deckKey: 'katakanaDeck'
  }
};

function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

class KanaCompanionController {
  constructor() {
    this.root = null;
    this.initialized = false;
    this.activeScript = 'hiragana'; // 'hiragana' | 'katakana'
    this.subView = 'chart';         // 'chart' | 'lesson' | 'review'
    this.chartKana = 'あ';
    this.showRomaji = true;
    this.chartState = null;

    this.activeRowIndex = 0;
    this.activeStep = 0;
    this.meetIndex = 0;
    this.lessonState = null;

    this.reviewKana = null;
    this.reviewShown = false;
  }

  getDataset() {
    return SCRIPT_DATASETS[this.activeScript] || SCRIPT_DATASETS.hiragana;
  }

  getState() {
    return progress.getKanaCompanionState();
  }

  saveState(patch) {
    progress.saveKanaCompanionState(patch);
  }

  syncFieldsFromState() {
    const saved = this.getState();
    this.activeScript = saved.activeScript === 'katakana' ? 'katakana' : 'hiragana';
    const ds = this.getDataset();
    const storedKana = saved[ds.chartKey];
    this.chartKana = (storedKana && ds.strokes[storedKana]) ? storedKana : ds.defaultChar;
    this.showRomaji = saved.showRomaji !== false;
    const storedRow = saved[ds.rowIdxKey];
    this.activeRowIndex = Number.isInteger(storedRow) && storedRow >= 0 && storedRow < ds.rowLessons.length ? storedRow : 0;
  }

  init(containerEl) {
    if (!containerEl) return;
    this.root = containerEl;
    this.syncFieldsFromState();

    if (!this.initialized) {
      this.renderShell();
      this.initialized = true;
    }
    this.updateScriptSwitcherUI();
    this.switchSubView(this.subView);
  }

  refreshForUser() {
    if (!this.root) return;
    this.syncFieldsFromState();
    this.reviewKana = null;
    this.reviewShown = false;
    if (this.initialized) {
      this.updateScriptSwitcherUI();
      this.renderChartGrid();
      this.switchSubView(this.subView);
    }
  }

  switchScript(scriptName) {
    const next = scriptName === 'katakana' ? 'katakana' : 'hiragana';
    if (next === this.activeScript && this.initialized) return;
    this.activeScript = next;
    this.saveState({ activeScript: next });
    const ds = this.getDataset();
    const saved = this.getState();
    const storedKana = saved[ds.chartKey];
    this.chartKana = (storedKana && ds.strokes[storedKana]) ? storedKana : ds.defaultChar;
    const storedRow = saved[ds.rowIdxKey];
    this.activeRowIndex = Number.isInteger(storedRow) && storedRow >= 0 && storedRow < ds.rowLessons.length ? storedRow : 0;
    this.activeStep = 0;
    this.meetIndex = 0;
    this.reviewKana = null;
    this.reviewShown = false;

    this.updateScriptSwitcherUI();
    this.switchSubView(this.subView);
  }

  updateScriptSwitcherUI() {
    if (!this.root) return;
    const ds = this.getDataset();
    this.root.querySelectorAll('.kc-script-btn').forEach(btn => {
      const isAct = btn.dataset.script === this.activeScript;
      btn.classList.toggle('active', isAct);
      btn.setAttribute('aria-pressed', String(isAct));
    });
    const titleEl = this.root.querySelector('#kcHeroTitle');
    if (titleEl) {
      titleEl.textContent = `✍️ ${ds.name} Writing Companion`;
    }
    const chartTabBtn = this.root.querySelector('[data-subview="chart"]');
    if (chartTabBtn) {
      chartTabBtn.textContent = `Peta ${ds.name} (46)`;
    }
  }

  speak(text, noteEl) {
    try {
      if (sound && typeof sound.speakJapanese === 'function') {
        sound.speakJapanese(text, null, { rate: 0.78 });
        return;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'ja-JP';
        u.rate = 0.78;
        window.speechSynthesis.speak(u);
      }
    } catch (e) {
      if (noteEl) noteEl.textContent = 'Browser ini tidak mendukung pemutaran suara.';
    }
  }

  renderPracticeSquare(el, kana, opts = {}) {
    if (!el) return null;
    const ds = this.getDataset();
    const paths = ds.strokes[kana] || [];
    el.innerHTML = '';
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 109 109');
    svg.innerHTML =
      '<path d="M54.5 0V109M0 54.5H109" stroke="var(--kc-guide)" stroke-width="0.7" stroke-dasharray="3 3"/>' +
      paths.map(d => `<path d="${d}" fill="none" stroke="var(--kc-ghost)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`).join('') +
      paths.map((d, i) => `<path class="kc-ink-stroke" data-i="${i}" d="${d}" fill="none" stroke="var(--kc-ink)" stroke-width="${opts.thin ? 4.5 : 4}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');

    if (opts.numbers !== false) {
      paths.forEach((d, i) => {
        const m = d.match(/^M\s*([\d.]+)[ ,]([\d.]+)/);
        if (!m) return;
        const x = Number(m[1]);
        const y = Number(m[2]);
        const cx = Math.min(102, Math.max(7, x - 5));
        const cy = Math.min(102, Math.max(7, y - 5));
        const g = document.createElementNS(SVG_NS, 'g');
        g.innerHTML = `<circle cx="${cx}" cy="${cy}" r="4.8" fill="var(--kc-shu)"/><text x="${cx}" y="${cy + 1.8}" text-anchor="middle" font-size="5.6" font-weight="700" fill="#ffffff" font-family="sans-serif">${i + 1}</text>`;
        svg.appendChild(g);
      });
    }

    el.appendChild(svg);
    const inks = [...svg.querySelectorAll('.kc-ink-stroke')];
    inks.forEach(p => {
      const len = typeof p.getTotalLength === 'function' ? p.getTotalLength() : 120;
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = opts.full ? '0' : String(len);
      p._L = len;
    });
    return { inks, shown: opts.full ? inks.length : 0, anims: [] };
  }

  animateStroke(pathEl, delayMs) {
    const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof pathEl.animate !== 'function') {
      pathEl.style.strokeDashoffset = '0';
      return null;
    }
    return pathEl.animate(
      [{ strokeDashoffset: pathEl._L }, { strokeDashoffset: 0 }],
      { duration: Math.max(380, pathEl._L * 11), delay: delayMs, easing: 'ease-in-out', fill: 'forwards' }
    );
  }

  playAllStrokes(st) {
    if (!st) return;
    st.anims.forEach(a => a && a.cancel());
    st.inks.forEach(p => { p.style.strokeDashoffset = String(p._L); });
    let t = 140;
    st.anims = [];
    st.inks.forEach(p => {
      st.anims.push(this.animateStroke(p, t));
      t += Math.max(380, p._L * 11) + 240;
    });
    st.shown = st.inks.length;
  }

  stepNextStroke(st) {
    if (!st || !st.inks.length) return;
    if (st.shown >= st.inks.length) {
      st.anims.forEach(a => a && a.cancel());
      st.anims = [];
      st.inks.forEach(p => { p.style.strokeDashoffset = String(p._L); });
      st.shown = 0;
    }
    st.anims.push(this.animateStroke(st.inks[st.shown], 0));
    st.shown++;
  }

  renderShell() {
    this.root.innerHTML = `
      <div class="kc-shell">
        <div class="kc-hero">
          <div class="kc-hero-top">
            <div>
              <h2 id="kcHeroTitle">✍️ Hiragana Writing Companion</h2>
              <p>Pendamping buku latihan menulis Hiragana &amp; Katakana Anda. Perhatikan urutan goresan &amp; pelafalannya di sini, tulis di buku tulis Anda, lalu uji ingatan Anda.</p>
            </div>
            <div class="kc-script-switcher" role="group" aria-label="Pilih Aksara Kana">
              <button type="button" class="kc-script-btn active" data-script="hiragana" aria-pressed="true">
                <span class="kc-jp">あ</span> Hiragana
              </button>
              <button type="button" class="kc-script-btn" data-script="katakana" aria-pressed="false">
                <span class="kc-jp">ア</span> Katakana
              </button>
            </div>
          </div>
          <div class="kc-subnav" role="tablist" aria-label="Bagian Pendamping Tulis Kana">
            <button type="button" class="kc-subnav-btn" data-subview="chart">Peta Hiragana (46)</button>
            <button type="button" class="kc-subnav-btn" data-subview="lesson">Pelajaran Baris (10 Baris)</button>
            <button type="button" class="kc-subnav-btn" data-subview="review">Kotak Review (Leitner)</button>
          </div>
        </div>

        <!-- VIEW 1: CHART -->
        <section class="kc-view" id="kcViewChart" aria-label="Peta Kana">
          <div class="kc-two">
            <div class="kc-left kc-stick">
              <div class="kc-sq" id="kcChartSq"></div>
              <div class="kc-meta">
                <span class="kc-ro" id="kcChartRo"></span>
                <span class="kc-sc" id="kcChartSc"></span>
              </div>
              <div class="kc-btns">
                <button type="button" class="kc-btn pri" id="kcChartPlay">${ICONS.play}Tulis</button>
                <button type="button" class="kc-btn" id="kcChartStep">${ICONS.step}Per Goresan</button>
                <button type="button" class="kc-btn" id="kcChartSay">${ICONS.say}Dengar</button>
              </div>
              <p class="kc-note" id="kcChartNote">Angka merah menandai titik awal setiap goresan.</p>
            </div>
            <div>
              <div class="kc-tools">
                <h3>Ketuk huruf untuk melihat urutan goresan &amp; suara</h3>
                <label class="kc-tg">
                  <input type="checkbox" id="kcRomajiToggle" ${this.showRomaji ? 'checked' : ''}>
                  Tampilkan Romaji
                </label>
              </div>
              <div class="kc-grid" id="kcChartGrid"></div>
              <p class="kc-note">Garis bawah hijau menandakan huruf dari baris yang sudah selesai Anda pelajari.</p>
            </div>
          </div>
        </section>

        <!-- VIEW 2: ROW LESSONS -->
        <section class="kc-view" id="kcViewLesson" aria-label="Pelajaran Baris Kana">
          <div class="kc-row-picker" id="kcRowPicker"></div>
          <div class="kc-steps" id="kcStepsBar" role="list"></div>
          <div id="kcStepBody"></div>
        </section>

        <!-- VIEW 3: LEITNER REVIEW -->
        <section class="kc-view" id="kcViewReview" aria-label="Kotak Review Kana">
          <div class="kc-rv">
            <div class="kc-flash" id="kcReviewFlash"></div>
            <div>
              <h3 style="margin:0 0 0.35rem" id="kcReviewHeading">Kotak Review (Sistem Leitner)</h3>
              <p class="kc-note" style="margin:0 0 0.85rem">Huruf yang sudah Anda hafal naik kotak dan muncul lebih jarang. Huruf yang lupa kembali ke Kotak 1.</p>
              <div class="kc-boxes" id="kcReviewBoxes"></div>
              <p class="kc-note" style="margin-top:0.9rem">
                <button type="button" class="kc-btn" id="kcReviewReset" style="min-height:38px;font-size:0.8rem">Reset Progress Aksara Ini</button>
              </p>
            </div>
          </div>
        </section>

        <p class="kc-attrib">
          Data urutan goresan Hiragana &amp; Katakana dari <a href="https://kanjivg.tagaini.net/" target="_blank" rel="noopener">KanjiVG</a> oleh Ulrich Apel (<a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener">CC BY-SA 3.0</a>).
        </p>
      </div>
    `;

    // Bind Hiragana / Katakana script toggle
    this.root.querySelectorAll('.kc-script-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchScript(btn.dataset.script));
    });

    // Bind sub-nav tabs
    this.root.querySelectorAll('.kc-subnav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchSubView(btn.dataset.subview));
    });

    // Chart controls
    this.root.querySelector('#kcChartPlay').addEventListener('click', () => this.playAllStrokes(this.chartState));
    this.root.querySelector('#kcChartStep').addEventListener('click', () => this.stepNextStroke(this.chartState));
    this.root.querySelector('#kcChartSay').addEventListener('click', () => this.speak(this.chartKana, this.root.querySelector('#kcChartNote')));

    const roToggle = this.root.querySelector('#kcRomajiToggle');
    roToggle.addEventListener('change', () => {
      this.showRomaji = roToggle.checked;
      this.saveState({ showRomaji: this.showRomaji });
      this.root.querySelector('#kcChartGrid').classList.toggle('hide-ro', !this.showRomaji);
    });

    this.root.querySelector('#kcChartGrid').addEventListener('click', e => {
      const btn = e.target.closest('.kc-k');
      if (!btn) return;
      this.showChartKana(btn.dataset.k, true);
      this.speak(btn.dataset.k, this.root.querySelector('#kcChartNote'));
    });

    this.root.querySelector('#kcReviewReset').addEventListener('click', () => {
      const ds = this.getDataset();
      this.saveState({
        [ds.deckKey]: { ...ds.defaultDeck },
        [ds.rowsDoneKey]: {},
        [ds.paperKey]: {}
      });
      this.reviewKana = null;
      this.reviewShown = false;
      this.renderChartGrid();
      this.renderReview(true);
    });

    this.renderChartGrid();
  }

  switchSubView(viewName) {
    this.subView = ['chart', 'lesson', 'review'].includes(viewName) ? viewName : 'chart';
    this.root.querySelectorAll('.kc-subnav-btn').forEach(btn => {
      if (btn.dataset.subview === this.subView) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
    this.root.querySelector('#kcViewChart').classList.toggle('on', this.subView === 'chart');
    this.root.querySelector('#kcViewLesson').classList.toggle('on', this.subView === 'lesson');
    this.root.querySelector('#kcViewReview').classList.toggle('on', this.subView === 'review');

    if (this.subView === 'chart') {
      this.renderChartGrid();
      this.showChartKana(this.chartKana, false);
    } else if (this.subView === 'lesson') {
      this.renderRowPicker();
      this.renderLessonStep();
    } else if (this.subView === 'review') {
      this.renderReview(false);
    }
  }

  renderChartGrid() {
    const gridEl = this.root.querySelector('#kcChartGrid');
    if (!gridEl) return;
    const ds = this.getDataset();
    const saved = this.getState();
    const rowsDoneMap = saved[ds.rowsDoneKey] || {};
    const completedChars = new Set();
    ds.rowLessons.forEach(row => {
      const stepsDone = rowsDoneMap[row.id];
      if (Array.isArray(stepsDone) && stepsDone[4]) {
        row.kana.forEach(k => completedChars.add(k));
      }
    });

    const head = '<span></span>' + ['a', 'i', 'u', 'e', 'o'].map(h => `<span class="kc-h">${h}</span>`).join('');
    gridEl.innerHTML = head + ds.chartRows.map(([c, ks]) =>
      `<span class="kc-rl">${c || '&nbsp;'}</span>` +
      [...ks].map(k => {
        if (k === '・') return '<span class="kc-gap"></span>';
        const sel = k === this.chartKana ? ' sel' : '';
        const doneCls = completedChars.has(k) ? ' row-done' : '';
        return `<button type="button" class="kc-k${sel}${doneCls}" data-k="${k}" aria-label="${k} ${ds.romaji[k]}"><b>${k}</b><small>${ds.romaji[k]}</small></button>`;
      }).join('')
    ).join('');
    gridEl.classList.toggle('hide-ro', !this.showRomaji);
  }

  showChartKana(kana, shouldPlay) {
    const ds = this.getDataset();
    this.chartKana = ds.strokes[kana] ? kana : ds.defaultChar;
    this.saveState({ [ds.chartKey]: this.chartKana });
    const sqEl = this.root.querySelector('#kcChartSq');
    this.chartState = this.renderPracticeSquare(sqEl, this.chartKana, { full: !shouldPlay });
    this.root.querySelector('#kcChartRo').innerHTML = `<span class="kc-jp">${this.chartKana}</span> ${ds.romaji[this.chartKana] || ''}`;
    const count = (ds.strokes[this.chartKana] || []).length;
    this.root.querySelector('#kcChartSc').textContent = `${count} goresan`;
    this.root.querySelectorAll('#kcChartGrid .kc-k').forEach(b => b.classList.toggle('sel', b.dataset.k === this.chartKana));
    if (shouldPlay) this.playAllStrokes(this.chartState);
  }

  /* ---------- 10 GUIDED ROW LESSONS (HIRAGANA OR KATAKANA) ---------- */
  getCurrentRow() {
    const ds = this.getDataset();
    return ds.rowLessons[this.activeRowIndex] || ds.rowLessons[0];
  }

  getRowStepsDone(rowId) {
    const ds = this.getDataset();
    const saved = this.getState();
    const arr = saved[ds.rowsDoneKey]?.[rowId];
    return Array.isArray(arr) && arr.length === 5 ? arr.slice() : [false, false, false, false, false];
  }

  markStepDone(stepIdx) {
    const ds = this.getDataset();
    const row = this.getCurrentRow();
    const saved = this.getState();
    const rowsDone = { ...(saved[ds.rowsDoneKey] || {}) };
    const arr = this.getRowStepsDone(row.id);
    const wasAlreadyDone = arr[stepIdx];
    arr[stepIdx] = true;
    rowsDone[row.id] = arr;

    const deck = { ...(saved[ds.deckKey] || ds.defaultDeck) };
    if (stepIdx === 4) {
      row.kana.forEach(k => { if (!deck[k]) deck[k] = 1; });
    }
    this.saveState({ [ds.rowsDoneKey]: rowsDone, [ds.deckKey]: deck });

    if (!wasAlreadyDone) {
      progress.addXP(stepIdx === 4 ? 15 : 5);
    }
    this.renderRowPicker();
    this.renderStepsBar();
  }

  renderRowPicker() {
    const picker = this.root.querySelector('#kcRowPicker');
    if (!picker) return;
    const ds = this.getDataset();
    picker.innerHTML = ds.rowLessons.map((row, idx) => {
      const doneArr = this.getRowStepsDone(row.id);
      const isRowDone = doneArr.every(Boolean);
      return `<button type="button" class="kc-row-pill${idx === this.activeRowIndex ? ' active' : ''}${isRowDone ? ' done' : ''}" data-row-idx="${idx}">${idx + 1}. ${row.shortLabel}</button>`;
    }).join('');

    picker.onclick = e => {
      const btn = e.target.closest('.kc-row-pill');
      if (!btn) return;
      this.activeRowIndex = Number(btn.dataset.rowIdx);
      this.activeStep = 0;
      this.meetIndex = 0;
      this.saveState({ [ds.rowIdxKey]: this.activeRowIndex });
      this.renderRowPicker();
      this.renderLessonStep();
    };
  }

  renderStepsBar() {
    const bar = this.root.querySelector('#kcStepsBar');
    if (!bar) return;
    const row = this.getCurrentRow();
    const doneArr = this.getRowStepsDone(row.id);
    bar.innerHTML = STEP_LABELS.map((label, i) =>
      `<button type="button" role="listitem" class="kc-step-btn${doneArr[i] ? ' done' : ''}" data-step="${i}" ${i === this.activeStep ? 'aria-current="step"' : ''}>${i + 1}. ${label}</button>`
    ).join('');
    bar.onclick = e => {
      const btn = e.target.closest('.kc-step-btn');
      if (!btn) return;
      this.activeStep = Number(btn.dataset.step);
      this.renderLessonStep();
    };
  }

  renderLessonStep() {
    this.renderStepsBar();
    const ds = this.getDataset();
    const body = this.root.querySelector('#kcStepBody');
    const row = this.getCurrentRow();
    const rowKana = row.kana;
    if (this.meetIndex >= rowKana.length) this.meetIndex = 0;

    const nextBtnHtml = (label = 'Langkah Berikutnya') => `<button type="button" class="kc-btn pri" id="kcNextStepBtn">${label}${ICONS.step}</button>`;
    const bindNext = (customFn) => {
      const btn = body.querySelector('#kcNextStepBtn');
      if (!btn) return;
      btn.onclick = () => {
        this.markStepDone(this.activeStep);
        if (customFn) customFn();
        else {
          this.activeStep = Math.min(4, this.activeStep + 1);
          this.renderLessonStep();
        }
      };
    };

    if (this.activeStep === 0) {
      const k = rowKana[this.meetIndex];
      body.innerHTML = `
        <div class="kc-two">
          <div class="kc-left">
            <div class="kc-sq" id="kcLessonSq"></div>
            <div class="kc-dots">
              ${rowKana.map((x, i) => `<button type="button" data-i="${i}" class="${i === this.meetIndex ? 'on' : ''}" aria-label="${x} ${ds.romaji[x]}"><b class="kc-jp">${x}</b></button>`).join('')}
            </div>
          </div>
          <div class="kc-card">
            <h3 style="margin:0;font-size:1.6rem"><span class="kc-jp" style="font-size:2.6rem">${k}</span> ${ds.romaji[k]}</h3>
            <p class="kc-tip">${ds.tips[k] || 'Perhatikan arah dan urutan setiap goresan.'}</p>
            <div class="kc-btns">
              <button type="button" class="kc-btn pri" id="kcLessonPlay">${ICONS.play}Tulis</button>
              <button type="button" class="kc-btn" id="kcLessonStep">${ICONS.step}Per Goresan</button>
              <button type="button" class="kc-btn" id="kcLessonSay">${ICONS.say}Dengar</button>
            </div>
            <p class="kc-note" id="kcLessonNote">Ikuti arah goresan di udara sambil diucapkan lantang.</p>
            <div class="kc-btns" style="margin-top:1rem">
              ${this.meetIndex < rowKana.length - 1
                ? `<button type="button" class="kc-btn" id="kcNextKanaBtn">Huruf berikutnya: <span class="kc-jp">${rowKana[this.meetIndex + 1]}</span></button>`
                : nextBtnHtml('Lanjut: Tulis di Buku')}
            </div>
          </div>
        </div>
      `;
      this.lessonState = this.renderPracticeSquare(body.querySelector('#kcLessonSq'), k);
      this.playAllStrokes(this.lessonState);
      body.querySelector('#kcLessonPlay').onclick = () => this.playAllStrokes(this.lessonState);
      body.querySelector('#kcLessonStep').onclick = () => this.stepNextStroke(this.lessonState);
      body.querySelector('#kcLessonSay').onclick = () => this.speak(k, body.querySelector('#kcLessonNote'));
      body.querySelector('.kc-dots').onclick = e => {
        const b = e.target.closest('button');
        if (!b) return;
        this.meetIndex = Number(b.dataset.i);
        this.renderLessonStep();
        this.speak(rowKana[this.meetIndex], body.querySelector('#kcLessonNote'));
      };
      const nextKanaBtn = body.querySelector('#kcNextKanaBtn');
      if (nextKanaBtn) {
        nextKanaBtn.onclick = () => {
          this.meetIndex++;
          this.renderLessonStep();
          this.speak(rowKana[this.meetIndex], body.querySelector('#kcLessonNote'));
        };
      }
      bindNext();
      return;
    }

    if (this.activeStep === 1) {
      const saved = this.getState();
      const paper = { ...(saved[ds.paperKey] || {}) };
      body.innerHTML = `
        <div class="kc-card">
          <h3 style="margin:0 0 0.35rem">Tulis setiap huruf 5 kali di buku tulis Anda (${row.label})</h3>
          <p class="kc-tip">Ucapkan keras-keras setiap kali menulis. Ikuti urutan nomor merah, lalu bandingkan tulisan Anda dengan model di bawah. Centang jika sudah rapi.</p>
          <div class="kc-five">
            ${rowKana.map(k => `<div><div class="kc-sq" data-k="${k}"></div></div>`).join('')}
          </div>
          <div class="kc-chk">
            ${rowKana.map(k => `<label class="kc-tg"><input type="checkbox" data-k="${k}" ${paper[k] ? 'checked' : ''}> <span class="kc-jp" style="font-size:1.4rem">${k}</span> selesai ditulis</label>`).join('')}
          </div>
          <p class="kc-note">${row.slipNote}</p>
          <div class="kc-btns" style="margin-top:1rem">${nextBtnHtml()}</div>
        </div>
      `;
      body.querySelectorAll('.kc-five .kc-sq').forEach(el => this.renderPracticeSquare(el, el.dataset.k, { full: true, thin: true }));
      body.querySelectorAll('.kc-chk input').forEach(chk => {
        chk.onchange = () => {
          paper[chk.dataset.k] = chk.checked;
          this.saveState({ [ds.paperKey]: paper });
        };
      });
      bindNext();
      return;
    }

    if (this.activeStep === 2 || this.activeStep === 3) {
      this.renderStepQuiz(body, rowKana, this.activeStep === 2, nextBtnHtml, bindNext);
      return;
    }

    // Step 4: Words
    body.innerHTML = `
      <div class="kc-card">
        <h3 style="margin:0 0 0.35rem">Baca kata-kata ${ds.name} ini (${row.label})</h3>
        <p class="kc-tip">Coba baca dulu setiap kata di bawah, lalu ketuk kartu untuk mendengar suara dan membuka artinya.</p>
        <div class="kc-words">
          ${row.words.map(([w, r, m], i) => `
            <button type="button" class="kc-word" data-i="${i}">
              <span class="kc-w">${w}</span>
              <span style="font-weight:700;font-size:0.92rem">${r}</span>
              <span class="kc-m hid">${m}</span>
            </button>
          `).join('')}
        </div>
        <p class="kc-note" id="kcWordsNote"></p>
        <div class="kc-btns" style="margin-top:1rem">${nextBtnHtml('Selesaikan Baris & Masuk Review')}</div>
      </div>
    `;
    body.querySelector('.kc-words').onclick = e => {
      const btn = e.target.closest('.kc-word');
      if (!btn) return;
      btn.querySelector('.kc-m').classList.remove('hid');
      const idx = Number(btn.dataset.i);
      this.speak(row.words[idx][0], body.querySelector('#kcWordsNote'));
    };
    bindNext(() => this.switchSubView('review'));
  }

  renderStepQuiz(body, rowKana, isListen, nextBtnHtml, bindNext) {
    const ds = this.getDataset();
    const pool = rowKana.length >= 4 ? [...rowKana, ...rowKana] : [...rowKana, ...rowKana, ...rowKana];
    const qs = shuffle(pool).slice(0, 8);
    let qi = 0;
    let score = 0;

    const draw = () => {
      if (qi >= qs.length) {
        const pass = score >= 6;
        body.innerHTML = `
          <div class="kc-card">
            <h3 style="margin:0 0 0.4rem">Skor Anda: ${score} dari ${qs.length} benar</h3>
            <p class="kc-tip">${pass ? 'Mantap! Anda siap lanjut ke langkah berikutnya.' : 'Coba ulangi Langkah 1 untuk huruf yang masih tertukar, lalu coba lagi.'}</p>
            <div class="kc-btns">
              <button type="button" class="kc-btn" id="kcQuizRetry">Coba Lagi</button>
              ${pass ? nextBtnHtml() : ''}
            </div>
          </div>
        `;
        body.querySelector('#kcQuizRetry').onclick = () => this.renderStepQuiz(body, rowKana, isListen, nextBtnHtml, bindNext);
        bindNext();
        return;
      }

      const target = qs[qi];
      const opts = shuffle(rowKana);
      body.innerHTML = `
        <div class="kc-card">
          <div class="kc-qhead">
            <h3 style="margin:0">${isListen ? `Huruf ${ds.name} mana yang Anda dengar?` : 'Bagaimana cara membaca huruf ini?'}</h3>
            <span class="kc-score">Soal ${qi + 1} / ${qs.length}</span>
          </div>
          ${isListen
            ? `<div class="kc-btns" style="margin:0.85rem 0"><button type="button" class="kc-btn pri" id="kcQuizSay">${ICONS.say}Putar Suara</button></div>`
            : `<div class="kc-big kc-jp">${target}</div>`}
          <div class="kc-opts${isListen ? '' : ' ro'}">
            ${opts.map(o => `<button type="button" data-o="${o}" class="${isListen ? 'kc-jp' : ''}">${isListen ? o : ds.romaji[o]}</button>`).join('')}
          </div>
          <div class="kc-fb" id="kcQuizFb" aria-live="polite"></div>
          <p class="kc-note" id="kcQuizNote"></p>
        </div>
      `;

      if (isListen) {
        const sayBtn = body.querySelector('#kcQuizSay');
        sayBtn.onclick = () => this.speak(target, body.querySelector('#kcQuizNote'));
        this.speak(target, body.querySelector('#kcQuizNote'));
      }

      body.querySelector('.kc-opts').onclick = e => {
        const btn = e.target.closest('button');
        if (!btn || btn.disabled) return;
        const ok = btn.dataset.o === target;
        body.querySelectorAll('.kc-opts button').forEach(x => {
          x.disabled = true;
          if (x.dataset.o === target) x.classList.add('right');
        });
        if (!ok) btn.classList.add('wrong');
        else score++;
        const fb = body.querySelector('#kcQuizFb');
        fb.className = `kc-fb ${ok ? 'ok' : 'no'}`;
        fb.textContent = ok ? 'Benar!' : `Jawaban yang tepat: ${target} (${ds.romaji[target]}).`;
        if (!isListen) this.speak(target);
        setTimeout(() => { qi++; draw(); }, ok ? 850 : 1650);
      };
    };

    draw();
  }

  /* ---------- LEITNER 3-BOX REVIEW (SEPARATE PER SCRIPT) ---------- */
  pickReviewCard(deck) {
    const keys = Object.keys(deck);
    if (!keys.length) return null;
    const weights = keys.map(k => ({ 1: 6, 2: 3, 3: 1 }[deck[k]] || 3));
    let r = Math.random() * weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < keys.length; i++) {
      r -= weights[i];
      if (r <= 0 && keys[i] !== this.reviewKana) return keys[i];
    }
    return keys.find(k => k !== this.reviewKana) || keys[0];
  }

  renderReview(pickNext) {
    const ds = this.getDataset();
    const saved = this.getState();
    const deck = { ...(saved[ds.deckKey] || ds.defaultDeck) };
    const heading = this.root.querySelector('#kcReviewHeading');
    if (heading) heading.textContent = `Kotak Review ${ds.name} (Sistem Leitner)`;

    if (pickNext || !this.reviewKana || !deck[this.reviewKana]) {
      this.reviewKana = this.pickReviewCard(deck);
      this.reviewShown = false;
    }

    const flashEl = this.root.querySelector('#kcReviewFlash');
    if (!this.reviewKana) {
      flashEl.innerHTML = '<h3>Belum ada kartu</h3><p class="kc-note">Selesaikan 1 pelajaran baris untuk menambahkan huruf ke kotak review.</p>';
    } else {
      flashEl.innerHTML = `
        <p class="kc-note" style="margin:0">Ucapkan bunyinya sebelum menekan Periksa.</p>
        <div class="kc-big kc-jp">${this.reviewKana}</div>
        <div class="kc-ans">${this.reviewShown ? ds.romaji[this.reviewKana] : ''}</div>
        <div class="kc-btns" style="justify-content:center;margin-top:0.75rem">
          ${this.reviewShown
            ? `<button type="button" class="kc-btn" id="kcRevNo">Belum Hafal</button><button type="button" class="kc-btn pri" id="kcRevYes">Sudah Hafal</button>`
            : `<button type="button" class="kc-btn pri" id="kcRevShow">Periksa</button>`}
        </div>
        <p class="kc-note" id="kcRevNote"></p>
      `;

      if (this.reviewShown) {
        flashEl.querySelector('#kcRevYes').onclick = () => {
          deck[this.reviewKana] = Math.min(3, (deck[this.reviewKana] || 1) + 1);
          this.saveState({ [ds.deckKey]: deck });
          this.renderReview(true);
        };
        flashEl.querySelector('#kcRevNo').onclick = () => {
          deck[this.reviewKana] = 1;
          this.saveState({ [ds.deckKey]: deck });
          this.renderReview(true);
        };
      } else {
        flashEl.querySelector('#kcRevShow').onclick = () => {
          this.reviewShown = true;
          this.renderReview(false);
          this.speak(this.reviewKana, flashEl.querySelector('#kcRevNote'));
        };
      }
    }

    const total = Object.keys(deck).length || 1;
    const boxesEl = this.root.querySelector('#kcReviewBoxes');
    boxesEl.innerHTML = [
      [1, 'Kotak 1: Baru'],
      [2, 'Kotak 2: Mulai Hafal'],
      [3, 'Kotak 3: Hafal']
    ].map(([boxNum, label]) => {
      const ks = Object.keys(deck).filter(k => deck[k] === boxNum);
      return `
        <div>
          <div class="kc-bx">
            <span>${label}</span>
            <span class="kc-bar"><i style="width:${(ks.length / total) * 100}%"></i></span>
            <strong>${ks.length}</strong>
          </div>
          <div class="kc-chips">${ks.map(k => `<span>${k}</span>`).join('')}</div>
        </div>
      `;
    }).join('');
  }
}

export const kanaCompanion = new KanaCompanionController();
