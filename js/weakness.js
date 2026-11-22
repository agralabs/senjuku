// Fokus Repetisi Kata Lemah (Weakness Focus Engine & View)
// Measures frequent reading mistakes in the last 1 week (7 days)
// Powers randomized targeted drills with intensive repetition

import { progress } from './srs.js';
import { MASTER_DRILL_ITEMS } from '../data/kanji-vocabulary.js';
import { sound } from './audio.js';

export class WeaknessView {
  constructor() {
    this.container = null;
    this.callbacks = {};
  }

  init(containerElement, callbacks = {}) {
    this.container = containerElement;
    this.callbacks = callbacks;
    this.render();
  }

  render() {
    if (!this.container) return;

    // Retrieve weak cards measured in the last 7 days
    const weakEntries = progress.getWeakCards(MASTER_DRILL_ITEMS, 40);
    const totalWeakWords = weakEntries.length;
    const totalWeeklyMistakes = weakEntries.reduce((sum, w) => sum + (w.weeklyMistakes || 0), 0);
    const avgAccuracy = totalWeakWords > 0 
      ? Math.round(weakEntries.reduce((sum, w) => sum + (w.accuracy || 0), 0) / totalWeakWords) 
      : 0;

    const html = `
      <div class="weakness-view-container animate-in">
        <!-- Top Banner / Hero -->
        <div class="card weakness-hero-card">
          <div class="weakness-header-row">
            <div>
              <div class="badge-row">
                <span class="subheading-tag">🎯 Fokus Repetisi Terarah</span>
                <span class="badge badge-accent">Periode: 7 Hari Terakhir</span>
              </div>
              <h2 class="card-title">Perbaiki Skor Saya</h2>
              <p class="card-desc">
                Kata-kata yang paling sering salah saat latihan membaca dalam <strong>1 minggu terakhir</strong>. 
                Kuis acak ini mengutamakan pengulangan (repetisi) intensif hingga kelemahan berubah menjadi refleks membaca instan!
              </p>
            </div>
          </div>

          <!-- Summary Metric Cards -->
          <div class="weakness-stats-grid">
            <div class="weak-stat-card">
              <span class="stat-icon">⚠️</span>
              <div class="stat-info">
                <strong class="stat-number">${totalWeakWords}</strong>
                <span class="stat-label">Kata Perlu Penguatan</span>
              </div>
            </div>
            <div class="weak-stat-card">
              <span class="stat-icon">❌</span>
              <div class="stat-info">
                <strong class="stat-number">${totalWeeklyMistakes}</strong>
                <span class="stat-label">Total Salah (7 Hari)</span>
              </div>
            </div>
            <div class="weak-stat-card">
              <span class="stat-icon">📊</span>
              <div class="stat-info">
                <strong class="stat-number">${totalWeakWords > 0 ? avgAccuracy + '%' : '100%'}</strong>
                <span class="stat-label">Rata-rata Akurasi</span>
              </div>
            </div>
            <div class="weak-stat-card">
              <span class="stat-icon">🔄</span>
              <div class="stat-info">
                <strong class="stat-number">Repetisi Acak</strong>
                <span class="stat-label">Metode Latihan</span>
              </div>
            </div>
          </div>

          <!-- Main Launch Action Buttons -->
          <div class="weakness-actions-row">
            <button type="button" class="btn btn-primary btn-large pulse-glow" id="btnWeaknessStartQuiz">
              <span class="btn-icon">⚡</span>
              <span>Mulai Kuis Acak Repetisi (15 Menit)</span>
            </button>
            <button type="button" class="btn btn-secondary btn-large" id="btnWeaknessStartLearning">
              <span class="btn-icon">💡</span>
              <span>Mode Belajar Santai (Flashcard)</span>
            </button>
          </div>
        </div>

        <!-- Weakness Words List Section -->
        <div class="card weakness-list-card">
          <div class="card-header">
            <div>
              <span class="subheading-tag">Daftar Kata yang Sering Salah</span>
              <h3 class="card-title">Inventaris Kata Lemah (7 Hari Terakhir)</h3>
            </div>
            <span class="badge badge-accent">${totalWeakWords} Kata Terdaftar</span>
          </div>

          ${totalWeakWords > 0 ? `
            <div class="weakness-items-grid" id="weaknessItemsGrid">
              ${weakEntries.map(w => `
                <div class="weak-item-card" data-id="${w.item.id}">
                  <div class="weak-item-top">
                    <span class="badge lesson-badge">Bab ${w.item.lesson}</span>
                    <span class="badge mistake-pill">❌ ${w.weeklyMistakes > 0 ? `${w.weeklyMistakes}x Salah (7 Hari)` : `${w.totalMistakes}x Total Salah`}</span>
                    <span class="badge accuracy-pill">Akurasi: ${w.accuracy}%</span>
                  </div>

                  <div class="weak-item-body">
                    <div class="weak-kanji-target">${w.item.kanji}</div>
                    <div class="weak-reading-row">
                      <span class="weak-kana-reading">${w.item.kana}</span>
                      <span class="weak-romaji disp-romaji">(${w.item.romaji})</span>
                    </div>
                    <div class="weak-meaning disp-translation">${w.item.meaningId}</div>
                  </div>

                  <div class="weak-item-actions">
                    <button type="button" class="btn-weak-audio" data-speech="${w.item.kana || w.item.kanji}" title="Dengarkan Suara">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      </svg>
                      <span>Suara</span>
                    </button>
                    <button type="button" class="btn-weak-drill" data-lesson="${w.item.lesson}">
                      <span>⚡ Latih Kata Ini</span>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="weakness-empty-state">
              <div class="empty-celebrate-icon">🎉</div>
              <h4>Belum Ada Kata yang Sering Salah!</h4>
              <p>
                Refleks membaca Anda saat ini sangat bagus! Belum ada kesalahan tercatat dalam 7 hari terakhir.<br>
                Anda dapat memulai kuis harian, atau langsung menguji kata-kata paling menantang dari Bab 1 sampai 14 dengan tombol di bawah.
              </p>
              <button type="button" class="btn btn-primary btn-large" id="btnWeaknessTrickyDrill">
                <span class="btn-icon">⚡</span>
                <span>Uji Kata Menantang (Bab 1-14)</span>
              </button>
            </div>
          `}
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.bindEvents();
  }

  bindEvents() {
    if (!this.container) return;

    // Launch Random Quiz focusing on Weakness
    const quizBtn = this.container.querySelector('#btnWeaknessStartQuiz');
    if (quizBtn) {
      quizBtn.onclick = () => {
        if (this.callbacks.onLaunchDrill) {
          this.callbacks.onLaunchDrill('quiz', 'weakness_focus', ['all']);
        }
      };
    }

    // Launch Learning Mode focusing on Weakness
    const learningBtn = this.container.querySelector('#btnWeaknessStartLearning');
    if (learningBtn) {
      learningBtn.onclick = () => {
        if (this.callbacks.onLaunchDrill) {
          this.callbacks.onLaunchDrill('learning', 'weakness_focus', ['all']);
        }
      };
    }

    // Tricky words drill (empty state fallback)
    const trickyBtn = this.container.querySelector('#btnWeaknessTrickyDrill');
    if (trickyBtn) {
      trickyBtn.onclick = () => {
        if (this.callbacks.onLaunchDrill) {
          this.callbacks.onLaunchDrill('quiz', 'weakness_focus', ['all']);
        }
      };
    }

    // Audio buttons
    const audioBtns = this.container.querySelectorAll('.btn-weak-audio');
    audioBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const text = btn.dataset.speech;
        if (text) sound.speakJapanese(text);
      };
    });

    // Individual word drill buttons
    const drillBtns = this.container.querySelectorAll('.btn-weak-drill');
    drillBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const lesson = btn.dataset.lesson;
        if (this.callbacks.onLaunchDrill) {
          this.callbacks.onLaunchDrill('quiz', 'weakness_focus', [lesson]);
        }
      };
    });
  }
}

export const weaknessView = new WeaknessView();
