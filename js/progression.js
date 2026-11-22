// KiraKira Nihongo — Gradual 5-Lesson Block Unlock UI, Star Animations, Block Celebrations & Achievement Emails
import { BADGE_CATALOG } from './srs.js';

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function showLockedLessonPopup(lessonNumOrLabel, lockInfo) {
  if (typeof document === 'undefined' || !document.body) return;

  let backdrop = document.getElementById('lockedLessonModalBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'lockedLessonModalBackdrop';
    backdrop.className = 'auth-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.innerHTML = `
      <div class="auth-modal-card locked-popup-card">
        <button type="button" class="auth-modal-close" id="btnCloseLockedModal" aria-label="Tutup">&times;</button>
        <div class="locked-popup-icon">🔒</div>
        <h2 id="lockedPopupTitle" style="margin:0 0 0.5rem;font-size:1.22rem;">Bab Masih Terkunci</h2>
        <p id="lockedPopupBody" class="locked-popup-body"></p>
        <div id="lockedRemainingChips" class="locked-remaining-chips"></div>
        <button type="button" class="btn btn-primary btn-full" id="btnOkLockedModal" style="margin-top:1rem;">
          Mengerti, Selesaikan Blok Sebelumnya
        </button>
      </div>
    `;
    document.body.appendChild(backdrop);

    const close = () => { backdrop.hidden = true; };
    backdrop.querySelector('#btnCloseLockedModal')?.addEventListener('click', close);
    backdrop.querySelector('#btnOkLockedModal')?.addEventListener('click', close);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  }

  const label = typeof lessonNumOrLabel === 'number' ? `Bab ${lessonNumOrLabel}` : String(lessonNumOrLabel);
  const reqBlock = lockInfo?.blockingBlock?.rangeLabel || 'Bab 1–5';
  const remaining = lockInfo?.remainingLessons || [];

  backdrop.querySelector('#lockedPopupTitle').textContent = `🔒 ${label} Belum Terbuka`;
  backdrop.querySelector('#lockedPopupBody').innerHTML = `
    Sistem buka bertahap per <strong>5 Bab</strong> aktif! Untuk mengakses <strong>${escapeHtml(label)}</strong>,
    Anda harus menyelesaikan Scorecard (Skor 100) seluruh blok <strong>${escapeHtml(reqBlock)}</strong> terlebih dahulu.
  `;

  const chipsEl = backdrop.querySelector('#lockedRemainingChips');
  if (chipsEl) {
    chipsEl.innerHTML = remaining.length > 0
      ? `<span class="locked-chip-label">Belum lulus:</span> ` + remaining.map(n => `<span class="locked-bab-chip">Bab ${n}</span>`).join('')
      : '';
  }

  backdrop.hidden = false;
}

export function showLessonClearStars(lessonNum) {
  if (typeof document === 'undefined' || !document.body) return;

  // Starburst particle overlay
  const burst = document.createElement('div');
  burst.className = 'star-celebration-overlay';
  const starEmojis = ['⭐', '🌟', '✨', '💫', '⭐', '🌟', '✨', '⭐', '💫', '🌟', '✨', '⭐'];
  burst.innerHTML = `
    <div class="star-burst-stage">
      ${starEmojis.map((em, idx) => {
        const angle = (idx / starEmojis.length) * 360;
        const dist = 95 + (idx % 3) * 35;
        const tx = Math.round(Math.cos((angle * Math.PI) / 180) * dist);
        const ty = Math.round(Math.sin((angle * Math.PI) / 180) * dist);
        return `<span class="floating-star-particle" style="--tx:${tx}px;--ty:${ty}px;animation-delay:${(idx * 45)}ms">${em}</span>`;
      }).join('')}
      <div class="star-toast-banner">
        <span class="star-toast-icon">⭐</span>
        <div>
          <strong>Selamat! Bab ${lessonNum} Lulus Penuh!</strong>
          <small>Scorecard Bab ${lessonNum} mencapai 100% — lencana &amp; progres diperbarui!</small>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(burst);

  setTimeout(() => {
    burst.classList.add('fade-out');
    setTimeout(() => burst.remove(), 450);
  }, 3400);
}

export function showBlockUnlockCelebration(block) {
  if (typeof document === 'undefined' || !document.body || !block) return;

  const badge = BADGE_CATALOG[block.badgeId] || { emoji: '🏆', label: block.title };
  const backdrop = document.createElement('div');
  backdrop.className = 'auth-modal-backdrop block-celebration-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');

  const nextMsg = block.unlocksNext
    ? `<p class="block-unlock-next">🔓 <strong>${escapeHtml(block.unlocksNext)}</strong> kini RESMI TERBUKA!</p>`
    : `<p class="block-unlock-next">👑 Anda telah menaklukkan seluruh <strong>Bab 1–14 Minna no Nihongo</strong>!</p>`;

  backdrop.innerHTML = `
    <div class="auth-modal-card block-celebration-card">
      <div class="block-confetti-row">🎉 ⭐ 🏆 ✨ 🎊</div>
      <div class="block-badge-hero">${badge.emoji}</div>
      <h2 style="margin:0.35rem 0 0.4rem;font-size:1.35rem;">Grade Unlock! ${escapeHtml(block.title)}</h2>
      <p style="margin:0 0 0.75rem;font-size:0.9rem;color:var(--text-muted);line-height:1.5;">
        Luar biasa! Anda telah menyelesaikan seluruh Scorecard <strong>${escapeHtml(block.rangeLabel)}</strong>!
      </p>
      ${nextMsg}
      <div class="block-badge-pill-earned">
        <span>${badge.emoji}</span>
        <span>Lencana baru: <strong>${escapeHtml(badge.label)}</strong> (tampil di Leaderboard!)</span>
      </div>
      <button type="button" class="btn btn-primary btn-full" id="btnCloseBlockCelebration" style="margin-top:1.1rem;">
        🚀 Lanjutkan Petualangan!
      </button>
    </div>
  `;

  document.body.appendChild(backdrop);
  const close = () => backdrop.remove();
  backdrop.querySelector('#btnCloseBlockCelebration')?.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
}

export async function notifyAchievementEmail(payload) {
  try {
    await fetch('/api/achievements/notify', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {
    // Non-blocking: ignore offline or unauthenticated guest
  }
}

export function renderBadgeIconsHtml(badgeIds = [], maxVisible = 6) {
  if (!Array.isArray(badgeIds) || badgeIds.length === 0) {
    return `<span class="lb-no-badges">—</span>`;
  }
  const items = badgeIds.slice(0, maxVisible).map(id => {
    const meta = BADGE_CATALOG[id];
    if (!meta) return '';
    return `<span class="lb-badge-chip" title="${escapeHtml(meta.label)}: ${escapeHtml(meta.desc)}">${meta.emoji}</span>`;
  }).filter(Boolean);

  const extra = badgeIds.length > maxVisible ? `<span class="lb-badge-more">+${badgeIds.length - maxVisible}</span>` : '';
  return `<div class="lb-badges-wrap">${items.join('')}${extra}</div>`;
}
