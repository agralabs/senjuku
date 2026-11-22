// Daily & Weekly Scorecard Component with Visual SVG Charts and SRS Retention Metrics

import { progress, LESSON_BLOCKS } from './srs.js';
import { MASTER_DRILL_ITEMS } from '../data/kanji-vocabulary.js';
import { CLOZE_SENTENCE_ITEMS } from '../data/cloze-sentences.js';
import { SENTENCE_ROMAJI_ITEMS } from '../data/sentence-romaji.js';

export class ScorecardView {
  constructor() {
    this.container = null;
  }

  init(containerElement) {
    this.container = containerElement;
    this.render();
  }

  render() {
    if (!this.container) return;

    const todayStats = progress.getTodayStats();
    const weeklyData = progress.getWeeklyData();
    const mastery = progress.getMasteryBreakdown(MASTER_DRILL_ITEMS);

    const todayMins = Math.round((todayStats.seconds / 60) * 10) / 10;
    const dailyTargetPercent = Math.min(100, Math.round((todayMins / 15) * 100));
    const totalCardsToday = (todayStats.cards || 0) + (todayStats.learningCards || 0);
    const accuracy = todayStats.cards > 0 ? Math.round((todayStats.correct / todayStats.cards) * 100) : (todayStats.learningCards > 0 ? 100 : 0);

    // Weak cards: cards answered wrongly more than correctly or wrong > 0 and streak == 0
    const weakCards = MASTER_DRILL_ITEMS.filter(it => {
      const c = progress.data.cards[it.id];
      return c && c.wrong > 0 && c.streak <= 1;
    }).slice(0, 5);

    this.container.innerHTML = `
      <div class="scorecard-container">
        <!-- TOP ROW: TODAY'S DAILY SCORECARD -->
        <section class="card daily-scorecard-card">
          <div class="card-header">
            <div>
              <span class="subheading-tag">Kartu Hasil Hari Ini</span>
              <h2 class="card-title">Daily Scorecard (Target 15 Menit)</h2>
            </div>
            <div class="streak-badge-container">
              <span class="fire-icon">🔥</span>
              <span class="streak-count">${progress.data.streakDays}</span>
              <span class="streak-label">Hari Berturut</span>
            </div>
          </div>

          <div class="daily-metrics-grid">
            <div class="metric-box ring-box">
              <div class="progress-ring-wrap">
                <svg width="120" height="120" viewBox="0 0 100 100" class="circle-svg">
                  <circle class="ring-bg" cx="50" cy="50" r="40"></circle>
                  <circle class="ring-bar" cx="50" cy="50" r="40" style="stroke-dasharray: 251.2; stroke-dashoffset: ${251.2 * (1 - dailyTargetPercent / 100)};"></circle>
                </svg>
                <div class="ring-center-content">
                  <span class="ring-val">${todayMins}</span>
                  <span class="ring-sub">/ 15 mnt</span>
                </div>
              </div>
              <p class="metric-caption">${todayMins >= 15 ? '🎉 Target Tercapai!' : `${Math.round(15 - todayMins)} mnt lagi`}</p>
            </div>

            <div class="metric-box">
              <span class="metric-label">Kartu Terbaca Hari Ini</span>
              <div class="metric-value-row">
                <span class="big-metric-num">${totalCardsToday}</span>
                <span class="unit-text">kartu</span>
              </div>
              <div class="metric-bar-wrap">
                <div class="metric-fill-bar" style="width: ${Math.min(100, (totalCardsToday / 30) * 100)}%"></div>
              </div>
              <span class="metric-sub-note">${todayStats.learningCards ? `${todayStats.cards} kuis + ${todayStats.learningCards} kartu belajar` : 'Rekomendasi: 20-35 kartu per 15 menit'}</span>
            </div>

            <div class="metric-box">
              <span class="metric-label">Akurasi Kuis Membaca</span>
              <div class="metric-value-row">
                <span class="big-metric-num">${accuracy}%</span>
                <span class="unit-badge ${accuracy >= 80 ? 'good' : 'warn'}">${accuracy >= 80 ? 'Sangat Baik' : 'Terus Asah'}</span>
              </div>
              <p class="metric-sub-note">${todayStats.cards > 0 ? `${todayStats.correct} benar dari ${todayStats.cards} kuis` : (todayStats.learningCards > 0 ? `${todayStats.learningCards} kartu belajar (tidak dinilai)` : 'Belum ada sesi kuis hari ini')}</p>
            </div>

            <div class="metric-box">
              <span class="metric-label">Level & Total XP</span>
              <div class="metric-value-row">
                <span class="big-metric-num">Lv. ${progress.data.level}</span>
                <span class="unit-text">(${progress.data.xp} XP)</span>
              </div>
              <p class="metric-sub-note">+${todayStats.xp} XP terkumpul hari ini</p>
            </div>
          </div>
        </section>

        <!-- MIDDLE ROW: WEEKLY SCORECARD & ACTIVITY CHART -->
        <section class="card weekly-scorecard-card">
          <div class="card-header">
            <div>
              <span class="subheading-tag">Rekap 7 Hari Terakhir</span>
              <h2 class="card-title">Weekly Scorecard</h2>
            </div>
            <div class="weekly-summary-pill">
              <span>Total Minggu Ini: <strong>${weeklyData.totalMinutes} mnt</strong></span>
              <span>Hari Sukses (≥15m): <strong>${weeklyData.daysCompleted}/7 hari</strong></span>
            </div>
          </div>

          <!-- SVG Visual Bar Chart for 7 Days -->
          <div class="chart-container">
            <div class="chart-legend">
              <span class="legend-item"><span class="legend-dot green"></span> Capai Target 15 Menit</span>
              <span class="legend-item"><span class="legend-dot yellow"></span> Di bawah 15 Menit</span>
              <span class="legend-item"><span class="legend-line red"></span> Garis Target 15 Mnt</span>
            </div>

            <div class="svg-chart-wrap">
              ${this.generateWeeklySvgChart(weeklyData.days)}
            </div>
          </div>
        </section>

        <!-- BOTTOM ROW: SRS RETENTION & WEAK ITEMS REPETITION -->
        <div class="scorecard-split-row">
          <section class="card mastery-breakdown-card">
            <h3 class="card-title">Retensi Membaca Kanji & Kosakata (SRS)</h3>
            <p class="card-desc">Tingkat penguasaan membaca berdasarkan sistem pengulangan berkala:</p>

            <div class="mastery-stacked-bar">
              <div class="seg seg-mastered" style="width: ${(mastery.mastered / mastery.total) * 100}%" title="Hafal Kuat (14 hari): ${mastery.mastered}"></div>
              <div class="seg seg-reviewing" style="width: ${(mastery.reviewing / mastery.total) * 100}%" title="Mulai Hafal (7 hari): ${mastery.reviewing}"></div>
              <div class="seg seg-learning" style="width: ${(mastery.learning / mastery.total) * 100}%" title="Sedang Dipelajari: ${mastery.learning}"></div>
              <div class="seg seg-unlearned" style="width: ${(mastery.unlearned / mastery.total) * 100}%" title="Belum Dilatih: ${mastery.unlearned}"></div>
            </div>

            <div class="mastery-legend-list">
              <div class="m-legend-item"><span class="color-badge green"></span> <strong>Hafal Melekat (14 Hari):</strong> ${mastery.mastered} kata</div>
              <div class="m-legend-item"><span class="color-badge blue"></span> <strong>Mulai Lancar (7 Hari):</strong> ${mastery.reviewing} kata</div>
              <div class="m-legend-item"><span class="color-badge orange"></span> <strong>Tahap Latihan Awal:</strong> ${mastery.learning} kata</div>
              <div class="m-legend-item"><span class="color-badge gray"></span> <strong>Belum Diulang:</strong> ${mastery.unlearned} kata</div>
            </div>
          </section>

          <section class="card weak-items-card">
            <h3 class="card-title">Perbaiki Skor Saya</h3>
            <p class="card-desc">Kata-kata yang paling sering salah saat latihan membaca:</p>

            ${weakCards.length > 0 ? `
              <div class="weak-items-list">
                ${weakCards.map(w => `
                  <div class="weak-item-row">
                    <span class="w-kanji">${w.kanji}</span>
                    <span class="w-kana">${w.kana}</span>
                    <span class="w-id">${w.meaningId}</span>
                    <span class="w-stats">${progress.data.cards[w.id]?.wrong || 0}x salah</span>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="empty-weak-state">
                <span class="check-large">✔</span>
                <p>Luar biasa! Tidak ada kata yang bermasalah saat ini. Semua bacaan kanji terjawab dengan lancar.</p>
              </div>
            `}
          </section>
        </div>

        <!-- TOTAL SCORE ACHIEVEMENT VS MAX SCORE + PATH CLUE & NEXT UNLOCK -->
        ${this.generatePathAchievementCardHtml()}

        <!-- PER-LESSON PROGRESSION & QUESTION BANK COVERAGE (BAB 1 - 14) -->
        <section class="card scorecard-lessons-card">
          <div class="card-header">
            <div>
              <span class="subheading-tag">Cakupan Bank Soal & Skor Tiap Bab</span>
              <h3 class="card-title">Skor Penguasaan per Bab (Bab 1 - 25)</h3>
            </div>
            <span class="badge badge-coverage-summary">${(() => {
              const allCov = progress.getAllLessonsCoverage(MASTER_DRILL_ITEMS, CLOZE_SENTENCE_ITEMS, SENTENCE_ROMAJI_ITEMS);
              const totalScore = Object.values(allCov.lessons).reduce((s, st) => s + st.score, 0);
              return `🏆 ${totalScore.toLocaleString('id-ID')} / 2.500 Skor • ${allCov.fullScoreCount}/25 Bab Lulus`;
            })()}</span>
          </div>
          <p class="card-desc">
            Setiap sesi menarik <strong>8 soal</strong> dari bank soal. <strong>Skor Penuh (100 🏆)</strong> diraih dengan <strong>≥80% cakupan seluruh tipe soal</strong> (Kosakata/Kanji, Ketik Romaji Kalimat, & Kalimat Rumpang) <strong>serta 100% benar pada Kalimat Rumpang</strong> (bobot nilai tertinggi <strong>2×</strong>).
            <span class="scoring-weight-note">Mode Belajar bernilai <strong>10%</strong> dibanding Mode Kuis.</span>
          </p>
          <div class="scorecard-lessons-grid sc-lessons-grid-fixed">
            ${this.generateLessonBreakdownHtml()}
          </div>
        </section>

        <!-- EXPORT / RESET BACKUP CONTROLS -->
        <div class="data-mgmt-bar">
          <button type="button" class="btn btn-secondary btn-sm" id="exportProgressBtn">Ekspor Cadangan Progres (JSON)</button>
          <label class="btn btn-secondary btn-sm import-label">
            Impor Cadangan
            <input type="file" id="importProgressFile" accept=".json" style="display:none;" />
          </label>
          <button type="button" class="btn btn-danger-outline btn-sm" id="resetProgressBtn">Reset Ulang Progres</button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  generateWeeklySvgChart(days) {
    const chartHeight = 160;
    const chartWidth = 560;
    const barWidth = 44;
    const gap = (chartWidth - (barWidth * 7)) / 8;
    const maxMins = Math.max(20, ...days.map(d => d.minutes));

    // Target 15 mins y-coordinate
    const targetY = chartHeight - 25 - ((15 / maxMins) * (chartHeight - 45));

    let barsSvg = '';
    days.forEach((d, i) => {
      const x = gap + i * (barWidth + gap);
      const h = Math.max(4, (d.minutes / maxMins) * (chartHeight - 45));
      const y = (chartHeight - 25) - h;
      const isTargetMet = d.minutes >= 15;
      const barColor = isTargetMet ? '#10b981' : (d.minutes > 0 ? '#f59e0b' : '#334155');

      barsSvg += `
        <g class="chart-col ${d.isToday ? 'today-col' : ''}">
          <!-- Bar -->
          <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="6" fill="${barColor}" class="bar-rect"></rect>
          <!-- Value top -->
          <text x="${x + barWidth / 2}" y="${y - 6}" text-anchor="middle" class="bar-val-text">${d.minutes}m</text>
          <!-- Day Label -->
          <text x="${x + barWidth / 2}" y="${chartHeight - 8}" text-anchor="middle" class="bar-day-label ${d.isToday ? 'today-label' : ''}">${d.dayLabel}</text>
        </g>
      `;
    });

    return `
      <svg width="100%" height="100%" viewBox="0 0 ${chartWidth} ${chartHeight}" preserveAspectRatio="xMidYMid meet" class="weekly-svg">
        <!-- Target Line -->
        <line x1="10" y1="${targetY}" x2="${chartWidth - 10}" y2="${targetY}" stroke="#ef4444" stroke-dasharray="4" stroke-width="1.5"></line>
        <text x="${chartWidth - 15}" y="${targetY - 4}" text-anchor="end" class="target-line-text">Target 15 mnt</text>
        <!-- Bars -->
        ${barsSvg}
      </svg>
    `;
  }

  generatePathAchievementCardHtml() {
    const allCov = progress.getAllLessonsCoverage(MASTER_DRILL_ITEMS, CLOZE_SENTENCE_ITEMS, SENTENCE_ROMAJI_ITEMS);
    const maxTotalScore = 2500; // 25 Bab x 100
    const totalScore = Object.values(allCov.lessons).reduce((sum, st) => sum + st.score, 0);
    const totalPct = Math.round((totalScore / maxTotalScore) * 1000) / 10;

    // Determine active block (first block not yet 100% cleared)
    let activeBlock = LESSON_BLOCKS.find(b => !progress.isBlockCleared(b.id, allCov)) || LESSON_BLOCKS[LESSON_BLOCKS.length - 1];
    const allCleared = LESSON_BLOCKS.every(b => progress.isBlockCleared(b.id, allCov));

    const activeBlockScore = activeBlock.lessons.reduce((s, n) => s + (allCov.lessons[n]?.score || 0), 0);
    const activeBlockMax = activeBlock.lessons.length * 100;
    const activeBlockClearedCount = activeBlock.lessons.filter(n => progress.isLessonCleared(n, allCov)).length;

    // Pick next recommended lesson in active block (highest partial progress first, else lowest un-cleared)
    const incompleteInBlock = activeBlock.lessons.filter(n => !progress.isLessonCleared(n, allCov));
    const nextLesson = incompleteInBlock.length > 0
      ? [...incompleteInBlock].sort((a, b) => (allCov.lessons[b]?.score || 0) - (allCov.lessons[a]?.score || 0) || a - b)[0]
      : null;

    let clueHtml = '';
    if (allCleared) {
      clueHtml = `
        <div class="path-clue-box path-clue-master">
          <div class="path-clue-text">
            <strong>👑 Selamat! Anda telah menaklukkan seluruh jalur Bab 1–14 (${totalScore}/${maxTotalScore})!</strong>
            <p>Pertahankan ketajaman membaca dengan <strong>Perbaiki Skor Saya</strong> dan raih peringkat #1 di Papan Peringkat!</p>
          </div>
        </div>
      `;
    } else if (nextLesson) {
      const st = allCov.lessons[nextLesson];
      const missingRumpang = Math.max(0, st.clozeTotal - st.clozeQuizCovered);
      const needsCov = Math.max(0, Math.round((80 - st.coveragePercent) * 10) / 10);
      const stepParts = [];
      if (missingRumpang > 0) stepParts.push(`selesaikan <strong>${missingRumpang} soal Kalimat Rumpang</strong> (bobot 2×)`);
      if (needsCov > 0) stepParts.push(`tambah <strong>+${needsCov}% cakupan</strong> lewat <strong>Quiz Mode</strong>`);
      const clueDetail = stepParts.length > 0
        ? `Untuk menuntaskan <strong>Bab ${nextLesson}</strong> (saat ini ${st.score}/100): ${stepParts.join(' dan ')}.`
        : `Anda hampir tuntas di <strong>Bab ${nextLesson}</strong>!`;

      const nextUnlockHint = activeBlock.unlocksNext
        ? `Tuntaskan sisa <strong>${incompleteInBlock.length} bab</strong> di ${activeBlock.rangeLabel} untuk membuka <strong>🔓 ${activeBlock.unlocksNext}</strong> + lencana baru di Leaderboard!`
        : `Tuntaskan sisa <strong>${incompleteInBlock.length} bab</strong> terakhir untuk meraih gelar <strong>🥇 Grade 3 Master</strong>!`;

      clueHtml = `
        <div class="path-clue-box">
          <div class="path-clue-text">
            <strong>💡 Petunjuk &amp; Semangat Jalur Aktif (${activeBlock.title})</strong>
            <p>${clueDetail} ${nextUnlockHint}</p>
          </div>
          <button type="button" class="btn btn-primary btn-sm sc-btn-quiz" data-lesson="${nextLesson}">
            ⚡ Lanjut Kuis Bab ${nextLesson}
          </button>
        </div>
      `;
    }

    const blockCardsHtml = LESSON_BLOCKS.map(b => {
      const bScore = b.lessons.reduce((s, n) => s + (allCov.lessons[n]?.score || 0), 0);
      const bMax = b.lessons.length * 100;
      const bCleared = progress.isBlockCleared(b.id, allCov);
      const bUnlocked = progress.isLessonUnlocked(b.lessons[0], allCov);
      const bDoneCount = b.lessons.filter(n => progress.isLessonCleared(n, allCov)).length;
      const medal = b.id === 1 ? '🥉' : b.id === 2 ? '🥈' : b.id === 3 ? '🥇' : b.id === 4 ? '💎' : '👑';
      const statusLabel = bCleared
        ? '<span class="path-status-pill done">✅ Lulus</span>'
        : bUnlocked
          ? '<span class="path-status-pill active">🚀 Aktif</span>'
          : '<span class="path-status-pill locked">🔒 Terkunci</span>';
      const bPct = Math.round((bScore / bMax) * 100);

      return `
        <div class="path-block-mini ${bCleared ? 'is-done' : bUnlocked ? 'is-active' : 'is-locked'}">
          <div class="path-block-top">
            <span class="path-block-name">${medal} ${b.title}</span>
            ${statusLabel}
          </div>
          <div class="path-block-score-row">
            <span>Skor: <strong>${bScore} / ${bMax}</strong></span>
            <span>${bDoneCount}/${b.lessons.length} Bab</span>
          </div>
          <div class="path-mini-bar-wrap">
            <div class="path-mini-bar" style="width: ${bPct}%"></div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <section class="card path-achievement-card">
        <div class="path-total-header">
          <div>
            <span class="subheading-tag">Pencapaian Total &amp; Jalur Buka Bertahap (Per 5 Bab)</span>
            <h3 class="card-title">Total Skor: <span class="path-score-highlight">${totalScore.toLocaleString('id-ID')}</span> / ${maxTotalScore.toLocaleString('id-ID')} <small class="path-score-pct">(${totalPct}%)</small></h3>
          </div>
          <div class="path-active-pill">
            Blok Aktif: <strong>${activeBlock.rangeLabel}</strong> (${activeBlockScore}/${activeBlockMax} • ${activeBlockClearedCount}/${activeBlock.lessons.length} Bab)
          </div>
        </div>

        <div class="path-total-bar-wrap" title="Total Skor ${totalScore} dari maksimal ${maxTotalScore}">
          <div class="path-total-bar-fill" style="width: ${Math.max(1, totalPct)}%"></div>
        </div>

        ${clueHtml}

        <div class="path-blocks-roadmap">
          ${blockCardsHtml}
        </div>
      </section>
    `;
  }

  generateLessonBreakdownHtml() {
    const allCoverage = progress.getAllLessonsCoverage(MASTER_DRILL_ITEMS, CLOZE_SENTENCE_ITEMS, SENTENCE_ROMAJI_ITEMS);

    return Object.keys(allCoverage.lessons).map(lessonNum => {
      const num = parseInt(lessonNum, 10);
      const stat = allCoverage.lessons[lessonNum];
      const isUnlocked = progress.isLessonUnlocked(num, allCoverage);
      const barWidth = Math.min(100, stat.coveragePercent);
      const scoreBadgeClass = stat.isFullScore ? 'sc-score-full' : (stat.score >= 50 ? 'sc-score-mid' : 'sc-score-low');
      const tooltip = `Bab ${lessonNum}: Cakupan Total ${stat.coveragePercent}% (Kosakata ${stat.vocabQuizCovered}/${stat.vocabTotal} • Kalimat Romaji ${stat.sentenceQuizCovered}/${stat.sentenceTotal} • Kalimat Rumpang 2×: ${stat.clozeQuizCovered}/${stat.clozeTotal}). Syarat Skor Penuh: ≥80% total + 100% Kalimat Rumpang.`;
      const rumpangBadge = stat.isClozeComplete
        ? `<span class="rumpang-pill ok" title="Kalimat Rumpang 100% tuntas!">🔥 Rumpang ${stat.clozeQuizCovered}/${stat.clozeTotal} ✔</span>`
        : `<span class="rumpang-pill pending" title="Wajib 100% benar pada Kalimat Rumpang untuk Skor Penuh">🔥 Rumpang ${stat.clozeQuizCovered}/${stat.clozeTotal}</span>`;
      const stateIcon = !isUnlocked ? '🔒' : (stat.isFullScore ? '⭐' : '');

      return `
        <div class="scorecard-lesson-row sc-lesson-card-fixed ${stat.isFullScore ? 'lesson-full-score' : ''} ${!isUnlocked ? 'lesson-locked' : ''}">
          <div class="sc-card-top-row">
            <div class="sc-card-title-group">
              <span class="sc-lesson-badge">Bab ${lessonNum} ${stateIcon}</span>
              <span class="sc-lesson-count">${stat.bankTotal} soal</span>
            </div>
            <span class="sc-lesson-percent ${scoreBadgeClass}" title="Skor Bab ${lessonNum} (${stat.score}/100)">
              ${stat.isFullScore ? '100 🏆' : `${stat.score}/100`}
            </span>
          </div>

          <div class="sc-lesson-bar-wrap" title="${tooltip}">
            <div class="sc-lesson-bar ${stat.isFullScore ? 'bar-full' : ''}" style="width: ${barWidth}%"></div>
            <div class="sc-threshold-marker" style="left: 80%;" title="Target Minimal 80% untuk Skor Penuh (100)"></div>
          </div>

          <div class="sc-card-bottom-row">
            <div class="sc-lesson-cov-meta">
              <span>Total: <strong>${stat.coveragePercent}%</strong></span>
              ${rumpangBadge}
            </div>
            <div class="sc-lesson-actions">
              <button type="button" class="btn btn-primary btn-xs sc-btn-quiz" data-lesson="${lessonNum}" title="${isUnlocked ? `Mulai Kuis 8 Soal Bab ${lessonNum}` : `Terkunci — selesaikan blok sebelumnya`}">${isUnlocked ? '⚡ Kuis' : '🔒 Kuis'}</button>
              <button type="button" class="btn btn-secondary btn-xs sc-btn-learn" data-lesson="${lessonNum}" title="${isUnlocked ? `Mode Belajar 8 Soal Bab ${lessonNum}` : `Terkunci — selesaikan blok sebelumnya`}">💡 Belajar</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  bindEvents() {
    // Quick action buttons for per-lesson drill from scorecard
    const quizBtns = this.container.querySelectorAll('.sc-btn-quiz');
    quizBtns.forEach(btn => {
      btn.onclick = () => window.japaneseApp?.selectSingleLesson(btn.dataset.lesson, 'quiz');
    });

    const learnBtns = this.container.querySelectorAll('.sc-btn-learn');
    learnBtns.forEach(btn => {
      btn.onclick = () => window.japaneseApp?.selectSingleLesson(btn.dataset.lesson, 'learning');
    });
    const exportBtn = this.container.querySelector('#exportProgressBtn');
    if (exportBtn) {
      exportBtn.onclick = () => {
        const json = progress.exportDataJson();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kirakira_japanese_scorecard_${progress.getTodayKey()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      };
    }

    const importInput = this.container.querySelector('#importProgressFile');
    if (importInput) {
      importInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (re) => {
          if (progress.importDataJson(re.target.result)) {
            alert("Data kemajuan berhasil dipulihkan!");
            this.render();
          } else {
            alert("Format berkas cadangan tidak valid.");
          }
        };
        reader.readAsText(file);
      };
    }

    const resetBtn = this.container.querySelector('#resetProgressBtn');
    if (resetBtn) {
      resetBtn.onclick = () => {
        if (confirm("Apakah Anda yakin ingin mereset seluruh histori dan capaian belajar? Tindakan ini tidak dapat dibatalkan.")) {
          progress.resetProgress();
          this.render();
        }
      };
    }
  }
}

export const scorecardView = new ScorecardView();
