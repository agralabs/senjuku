// KiraKira Nihongo - Frontend Auth, Profile, Membership & Public Leaderboard Controller
// Modular & self-contained; integrates cleanly with ProgressManager (srs.js) and app.js.

import { progress } from './srs.js';
import { renderBadgeIconsHtml, renderScoreGuideCardHtml, bindScoreGuideToggle } from './progression.js';

const AVATAR_OPTIONS = ['🌸', '🦊', '🐱', '🐼', '🗻', '⛩️', '🎎', '🍙', '🍡', '🥷', '🏯', '🎌'];

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getClientTimingMetadata() {
  const now = new Date();
  let timezone = 'UTC';
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {}
  return {
    localHour: now.getHours(),
    localDow: now.getDay(),
    timezone
  };
}

class AuthUIController {
  constructor() {
    this.user = null;
    this.initialized = false;
    this.leaderboardPeriod = 'all';
    this.syncTimer = null;
    this.onProgressUpdated = null;
    this.onAuthChange = null;
  }

  async init(options = {}) {
    if (this.initialized) return;
    this.initialized = true;
    this.onProgressUpdated = typeof options.onProgressUpdated === 'function' ? options.onProgressUpdated : null;
    this.onAuthChange = typeof options.onAuthChange === 'function' ? options.onAuthChange : null;

    this.ensureModalsExist();
    this.bindLeaderboardControls();
    this.bindAdminControls();

    // Register cloud sync hook on ProgressManager if supported
    if (typeof progress.setCloudSyncHandler === 'function') {
      progress.setCloudSyncHandler((data) => this.scheduleSync(data));
    }

    await this.refreshSession();
  }

  notifyAuthChange() {
    if (typeof this.onAuthChange === 'function') {
      try {
        this.onAuthChange(this.user);
      } catch (err) {
        console.error('Error in onAuthChange callback:', err);
      }
    }
  }

  async refreshSession() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
      if (!res.ok) {
        this.user = null;
        this.renderHeaderSlot();
        this.updateAdminTabVisibility();
        this.notifyAuthChange();
        return;
      }
      const data = await res.json();
      this.user = data.authenticated ? data.user : null;
      this.renderHeaderSlot();
      this.updateAdminTabVisibility();

      if (this.user) {
        if (typeof progress.setStorageScope === 'function') {
          progress.setStorageScope(this.user.id);
        }
        await this.pullCloudProgress();
        this.logAppOpenDebounced();
      } else {
        if (typeof progress.setStorageScope === 'function') {
          progress.setStorageScope(null);
        }
        if (this.onProgressUpdated) this.onProgressUpdated();
      }
      this.notifyAuthChange();
    } catch {
      // Offline / static-only fallback: app continues working with localStorage
      this.user = null;
      if (typeof progress.setStorageScope === 'function') {
        progress.setStorageScope(null);
      }
      this.renderHeaderSlot();
      this.updateAdminTabVisibility();
      this.notifyAuthChange();
    }
  }

  async pullCloudProgress() {
    if (!this.user) return;
    try {
      // Isolate user's local cache to their own user ID so guest/other users never bleed in
      if (typeof progress.setStorageScope === 'function') {
        progress.setStorageScope(this.user.id);
      }
      const res = await fetch('/api/progress/me', { credentials: 'same-origin' });
      if (!res.ok) return;
      const { progress: cloud } = await res.json();
      // Always apply the authenticated user's own cloud progress cleanly (new users start at 0 XP / Lv.1)
      document.getElementById('guestMergeBanner')?.remove();

      // Recover unsynced scoped local progress (e.g. from offline sessions or prior failed syncs)
      const localCardCount = Object.keys(progress.data?.cards || {}).length;
      const cloudCardCount = Object.keys(cloud?.cards || {}).length;
      const hasUnsyncedLocal =
        (Number(progress.data?.xp || 0) > Number(cloud?.xp || 0)) ||
        (localCardCount > cloudCardCount);

      if (hasUnsyncedLocal) {
        const merged = await this.pushProgressToCloud(progress.data, 'merge');
        if (merged) return;
      }

      this.applyCloudProgressToLocal(cloud || progress.getDefaultData());
    } catch {
      // ignore offline
    }
  }

  applyCloudProgressToLocal(cloud) {
    if (!cloud) return;
    const rawCards = cloud.cards && typeof cloud.cards === 'object' ? cloud.cards : {};
    const normalizedCards = {};
    for (const [cardId, card] of Object.entries(rawCards)) {
      if (!card || typeof card !== 'object') continue;
      const { cov, mult, ...rest } = card;
      const rawMult = typeof card.scoreMultiplier === 'number' ? card.scoreMultiplier : mult;
      normalizedCards[cardId] = {
        ...rest,
        coverageCredit: typeof card.coverageCredit === 'number'
          ? card.coverageCredit
          : (typeof cov === 'number' ? cov : (card.correct > 0 ? 1.0 : 0)),
        scoreMultiplier: (typeof rawMult === 'number' && Number.isFinite(rawMult) && rawMult >= 1.0) ? rawMult : 1.0
      };
    }

    // Start strictly from getDefaultData() so no stale fields from guest or another user ever leak in
    progress.data = {
      ...progress.getDefaultData(),
      xp: cloud.xp ?? 0,
      level: cloud.level ?? 1,
      streakDays: cloud.streakDays ?? 0,
      lastActiveDate: cloud.lastActiveDate ?? null,
      badges: Array.isArray(cloud.badges) ? cloud.badges : [],
      history: cloud.history && typeof cloud.history === 'object' ? cloud.history : {},
      cards: normalizedCards
    };
    if (typeof progress.saveDataLocalOnly === 'function') {
      progress.saveDataLocalOnly();
    } else {
      progress.saveData();
    }
    if (this.onProgressUpdated) this.onProgressUpdated();
  }

  buildWireSafeProgressPayload(data) {
    if (!data || typeof data !== 'object') return data;
    const rawCards = data.cards && typeof data.cards === 'object' ? data.cards : {};
    const wireCards = {};
    for (const [cardId, card] of Object.entries(rawCards)) {
      if (!card || typeof card !== 'object') continue;
      // Rename coverageCredit -> cov and scoreMultiplier -> mult over the wire to avoid WAF/ModSecurity false-positive 403s
      const { coverageCredit, scoreMultiplier, ...rest } = card;
      wireCards[cardId] = {
        ...rest,
        ...(typeof coverageCredit === 'number' ? { cov: coverageCredit } : {}),
        ...(typeof scoreMultiplier === 'number' && scoreMultiplier > 1 ? { mult: scoreMultiplier } : {})
      };
    }
    return {
      ...data,
      cards: wireCards
    };
  }

  scheduleSync(data) {
    if (!this.user) return;
    if (this.syncTimer) clearTimeout(this.syncTimer);
    this.syncTimer = setTimeout(() => {
      this.pushProgressToCloud(data, 'replace');
    }, 600);
  }

  async pushProgressToCloud(data = progress.data, mode = 'replace') {
    if (!this.user) return false;
    try {
      const safePayload = this.buildWireSafeProgressPayload(data);
      const res = await fetch('/api/progress/sync', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, progress: safePayload })
      });
      if (!res.ok) {
        console.warn('[Cloud Sync] /api/progress/sync failed:', res.status);
        return false;
      }
      const out = await res.json();
      if (mode === 'merge' && out.progress) {
        this.applyCloudProgressToLocal(out.progress);
      }
      return true;
    } catch (err) {
      console.warn('[Cloud Sync] Network error:', err?.message || err);
      return false;
    }
  }

  logAppOpenDebounced() {
    if (!this.user || typeof fetch !== 'function') return;
    const DEBOUNCE_MS = 30 * 60 * 1000;
    const storageKey = `kk_last_app_open_log_${this.user.id}`;
    try {
      const lastTs = Number(sessionStorage.getItem(storageKey) || '0');
      if (lastTs && Date.now() - lastTs < DEBOUNCE_MS) return;
      sessionStorage.setItem(storageKey, String(Date.now()));
    } catch {}

    try {
      fetch('/api/activity/log', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'app_open',
          ...getClientTimingMetadata()
        })
      }).catch(() => {});
    } catch {}
  }

  renderHeaderSlot() {
    const slot = document.getElementById('authHeaderSlot');
    if (!slot) return;

    if (!this.user) {
      slot.innerHTML = `
        <button type="button" class="auth-header-btn" id="btnOpenLoginModal">Masuk</button>
        <button type="button" class="auth-header-btn primary" id="btnOpenRegisterModal">Daftar</button>
      `;
      slot.querySelector('#btnOpenLoginModal')?.addEventListener('click', () => this.openAuthModal('login'));
      slot.querySelector('#btnOpenRegisterModal')?.addEventListener('click', () => this.openAuthModal('register'));
      return;
    }

    const tierLabel = this.user.membershipTier === 'pro' ? 'PRO' : 'FREE';
    slot.innerHTML = `
      <button type="button" class="auth-user-pill" id="btnOpenProfileModal" title="Profil & Membership">
        <span class="auth-avatar-mini">${escapeHtml(this.user.avatarEmoji || '🌸')}</span>
        <span>${escapeHtml(this.user.nickname)}</span>
        <span class="auth-tier-badge ${escapeHtml(this.user.membershipTier || 'free')}">${tierLabel}</span>
      </button>
    `;
    slot.querySelector('#btnOpenProfileModal')?.addEventListener('click', () => this.openProfileModal());
  }

  showGuestMergeBanner(cloudProgress) {
    const host = document.querySelector('main.app-main') || document.body;
    let banner = document.getElementById('guestMergeBanner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'guestMergeBanner';
      banner.className = 'guest-merge-banner';
      host.prepend(banner);
    }
    banner.innerHTML = `
      <span>🔄 Ditemukan progres lokal (${progress.data.xp} XP). Gabungkan progres latihan Anda saat ini ke akun <strong>${escapeHtml(this.user.nickname)}</strong>?</span>
      <div class="guest-merge-actions">
        <button type="button" class="btn btn-primary btn-sm" id="btnConfirmGuestMerge">Gabungkan Progres</button>
        <button type="button" class="btn btn-secondary btn-sm" id="btnUseCloudOnly">Gunakan Data Akun</button>
      </div>
    `;
    banner.querySelector('#btnConfirmGuestMerge')?.addEventListener('click', async () => {
      await this.pushProgressToCloud(progress.data, 'merge');
      banner.remove();
    });
    banner.querySelector('#btnUseCloudOnly')?.addEventListener('click', () => {
      this.applyCloudProgressToLocal(cloudProgress);
      banner.remove();
    });
  }

  ensureModalsExist() {
    if (document.getElementById('authModalBackdrop')) return;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <!-- Login & Register Modal -->
      <div class="auth-modal-backdrop" id="authModalBackdrop" hidden role="dialog" aria-modal="true" aria-labelledby="authModalTitle">
        <div class="auth-modal-card">
          <button type="button" class="auth-modal-close" id="btnCloseAuthModal" aria-label="Tutup">&times;</button>
          <h2 id="authModalTitle" style="margin:0;font-size:1.25rem;">🌸 Akun Senjuku Nihongo</h2>
          <p style="margin:0.3rem 0 0;font-size:0.84rem;color:var(--text-muted);">Simpan progres SRS Anda &amp; ikut Papan Peringkat.</p>

          <div id="authCustomNotice" class="auth-custom-notice" hidden></div>

          <div class="auth-modal-tabs">
            <button type="button" class="auth-tab-btn active" id="authTabLogin">Masuk</button>
            <button type="button" class="auth-tab-btn" id="authTabRegister">Daftar Baru</button>
          </div>

          <form id="loginForm" class="auth-form">
            <label class="auth-field">
              <span>Email atau Nickname</span>
              <input type="text" id="loginIdentifier" required autocomplete="username" placeholder="contoh: sakura@email.com atau Kenji" />
            </label>
            <label class="auth-field">
              <span>Kata Sandi</span>
              <input type="password" id="loginPassword" required autocomplete="current-password" placeholder="Masukkan kata sandi..." />
            </label>
            <div class="auth-forgot-row">
              <button type="button" class="auth-link-btn" id="btnShowForgotForm">Lupa kata sandi?</button>
            </div>
            <div id="loginFeedback" class="auth-feedback" hidden></div>
            <button type="submit" class="btn btn-primary btn-full" id="btnSubmitLogin">Masuk</button>
          </form>

          <form id="forgotPasswordForm" class="auth-form" hidden>
            <p style="margin:0;font-size:0.84rem;color:var(--text-muted);line-height:1.5;">
              🔑 Masukkan <strong>Email</strong> atau <strong>Nickname</strong> akun Anda. Kami akan mengirimkan tautan verifikasi ke email Anda untuk menyetel ulang kata sandi.
            </p>
            <label class="auth-field">
              <span>Email atau Nickname</span>
              <input type="text" id="forgotIdentifier" required autocomplete="username" placeholder="contoh: sakura@email.com atau Kenji" />
            </label>
            <div id="forgotFeedback" class="auth-feedback" hidden></div>
            <button type="submit" class="btn btn-primary btn-full" id="btnSubmitForgot">Kirim Link Reset Password</button>
            <button type="button" class="auth-link-btn" id="btnBackToLogin" style="align-self:center;">← Kembali ke Masuk</button>
          </form>

          <form id="registerForm" class="auth-form" hidden>
            <label class="auth-field">
              <span>Nickname Publik (tampil di Leaderboard)</span>
              <input type="text" id="regNickname" minlength="2" maxlength="24" required placeholder="contoh: KenjiMaster" />
            </label>
            <label class="auth-field">
              <span>Alamat Email (privat, untuk verifikasi)</span>
              <input type="email" id="regEmail" required autocomplete="email" placeholder="nama@email.com" />
            </label>
            <p style="margin:0;font-size:0.78rem;color:var(--text-muted);line-height:1.45;">
              📧 Kami akan mengirim tautan aktivasi ke email Anda. Anda akan membuat kata sandi saat membuka tautan tersebut.
            </p>
            <div id="registerFeedback" class="auth-feedback" hidden></div>
            <button type="submit" class="btn btn-primary btn-full" id="btnSubmitRegister">Kirim Link Verifikasi</button>
          </form>
        </div>
      </div>

      <!-- Profile, Role & Membership Modal -->
      <div class="auth-modal-backdrop" id="profileModalBackdrop" hidden role="dialog" aria-modal="true" aria-labelledby="profileModalTitle">
        <div class="auth-modal-card">
          <button type="button" class="auth-modal-close" id="btnCloseProfileModal" aria-label="Tutup">&times;</button>
          <h2 id="profileModalTitle" style="margin:0 0 1rem;font-size:1.25rem;">👤 Profil &amp; Membership</h2>

          <div class="profile-header-banner">
            <div class="profile-avatar-lg" id="profAvatarPreview">🌸</div>
            <div>
              <strong id="profDisplayNick" style="font-size:1.05rem;"></strong>
              <div id="profDisplayEmail" style="font-size:0.8rem;color:var(--text-muted);"></div>
              <div class="profile-meta-badges">
                <span class="auth-role-badge" id="profRoleBadge">MEMBER</span>
                <span class="auth-tier-badge free" id="profTierBadge">FREE</span>
              </div>
            </div>
          </div>

          <div id="mustChangePasswordBanner" class="auth-custom-notice" hidden>
            ⚠️ <strong>Peringatan Keamanan:</strong> Anda sedang menggunakan kata sandi default. Demi keamanan server Anda, segera perbarui kata sandi di bagian <strong>Ubah Kata Sandi</strong> di bawah ini.
          </div>

          <form id="profileForm" class="auth-form">
            <label class="auth-field">
              <span>Nickname</span>
              <input type="text" id="profNicknameInput" minlength="2" maxlength="24" required />
            </label>

            <div class="auth-field">
              <span>Pilih Avatar</span>
              <div class="avatar-picker-grid" id="avatarPickerGrid">
                ${AVATAR_OPTIONS.map(em => `<button type="button" class="avatar-pick-btn" data-emoji="${em}">${em}</button>`).join('')}
              </div>
            </div>

            <label class="auth-field">
              <span>Bio Singkat (opsional)</span>
              <textarea id="profBioInput" rows="2" maxlength="160" placeholder="Target JLPT N5 bulan ini!"></textarea>
            </label>

            <div class="auth-field">
              <span>Paket Membership</span>
              <div class="membership-tier-cards">
                <button type="button" class="tier-option-card" data-tier="free" id="tierBtnFree">
                  <strong>🌱 Free</strong>
                  <small>Drill harian, SRS, &amp; Leaderboard publik</small>
                </button>
                <button type="button" class="tier-option-card" data-tier="pro" id="tierBtnPro">
                  <strong>⭐ Pro</strong>
                  <small>Badge Pro, prioritas sinkronisasi &amp; analitik lanjutan</small>
                </button>
              </div>
            </div>

            <div id="profileFeedback" class="auth-feedback" hidden></div>

            <div class="profile-actions-row">
              <button type="submit" class="btn btn-primary" style="flex:1;justify-content:center;" id="btnSaveProfile">Simpan Profil</button>
              <button type="button" class="btn btn-secondary" id="btnLogoutAccount">Keluar</button>
            </div>
          </form>

          <hr style="border:none;border-top:1px solid var(--border-subtle);margin:1.15rem 0;" />

          <form id="changePasswordForm" class="auth-form">
            <h3 style="margin:0;font-size:0.95rem;">🔑 Ubah Kata Sandi</h3>
            <label class="auth-field">
              <span>Kata Sandi Saat Ini</span>
              <input type="password" id="currentPasswordInput" required autocomplete="current-password" placeholder="Masukkan kata sandi saat ini..." />
            </label>
            <label class="auth-field">
              <span>Kata Sandi Baru (minimal 6 karakter)</span>
              <input type="password" id="newPasswordInput" minlength="6" maxlength="128" required autocomplete="new-password" placeholder="Buat kata sandi baru yang kuat..." />
            </label>
            <div id="changePasswordFeedback" class="auth-feedback" hidden></div>
            <button type="submit" class="btn btn-secondary btn-full" id="btnChangePassword">Perbarui Kata Sandi</button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(wrapper);
    this.bindModalEvents();
  }

  bindModalEvents() {
    const authBackdrop = document.getElementById('authModalBackdrop');
    const profileBackdrop = document.getElementById('profileModalBackdrop');

    document.getElementById('btnCloseAuthModal')?.addEventListener('click', () => { authBackdrop.hidden = true; });
    document.getElementById('btnCloseProfileModal')?.addEventListener('click', () => { profileBackdrop.hidden = true; });

    authBackdrop?.addEventListener('click', (e) => { if (e.target === authBackdrop) authBackdrop.hidden = true; });
    profileBackdrop?.addEventListener('click', (e) => { if (e.target === profileBackdrop) profileBackdrop.hidden = true; });

    document.getElementById('authTabLogin')?.addEventListener('click', () => this.switchAuthTab('login'));
    document.getElementById('authTabRegister')?.addEventListener('click', () => this.switchAuthTab('register'));
    document.getElementById('btnShowForgotForm')?.addEventListener('click', () => this.switchAuthTab('forgot'));
    document.getElementById('btnBackToLogin')?.addEventListener('click', () => this.switchAuthTab('login'));

    // Forgot Password Submit
    document.getElementById('forgotPasswordForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const feedback = document.getElementById('forgotFeedback');
      const btn = document.getElementById('btnSubmitForgot');
      feedback.hidden = true;
      btn.disabled = true;
      btn.textContent = 'Mengirim link reset...';

      try {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: document.getElementById('forgotIdentifier').value.trim()
          })
        });
        const data = await res.json();
        if (!res.ok) {
          feedback.textContent = data.error || 'Gagal mengirim link reset.';
          feedback.className = 'auth-feedback error';
          feedback.hidden = false;
          return;
        }
        feedback.className = 'auth-feedback success';
        if (data.devResetUrl) {
          feedback.innerHTML = `${escapeHtml(data.message)}<br /><br /><strong>Tautan Reset Lokal:</strong> <a href="${escapeHtml(data.devResetUrl)}">Klik untuk buat kata sandi baru →</a>`;
        } else {
          feedback.textContent = data.message;
        }
        feedback.hidden = false;
      } catch {
        feedback.textContent = 'Gagal menghubungi server.';
        feedback.className = 'auth-feedback error';
        feedback.hidden = false;
      } finally {
        btn.disabled = false;
        btn.textContent = 'Kirim Link Reset Password';
      }
    });

    // Login Submit
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const feedback = document.getElementById('loginFeedback');
      const btn = document.getElementById('btnSubmitLogin');
      feedback.hidden = true;
      btn.disabled = true;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: document.getElementById('loginIdentifier').value.trim(),
            password: document.getElementById('loginPassword').value,
            ...getClientTimingMetadata()
          })
        });
        let data = {};
        try {
          data = await res.json();
        } catch {
          data = { error: res.status === 404
            ? 'Endpoint /api/auth/login belum aktif. Silakan RESTART terminal "node server.js" Anda.'
            : `Server merespon dengan status ${res.status}. Pastikan server.js sudah di-restart.` };
        }
        if (!res.ok) {
          feedback.textContent = data.error || 'Gagal masuk.';
          feedback.className = 'auth-feedback error';
          feedback.hidden = false;
          btn.disabled = false;
          return;
        }
        this.user = data.user;
        authBackdrop.hidden = true;
        this.renderHeaderSlot();
        this.updateAdminTabVisibility();
        this.notifyAuthChange();
        await this.pullCloudProgress();
        this.loadLeaderboard();
        if (this.user?.mustChangePassword) {
          this.openProfileModal();
        }
      } catch (err) {
        feedback.textContent = 'Gagal menghubungi server. Pastikan server lokal aktif di http://localhost:3000.';
        feedback.className = 'auth-feedback error';
        feedback.hidden = false;
      } finally {
        btn.disabled = false;
      }
    });

    // Register Submit
    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const feedback = document.getElementById('registerFeedback');
      const btn = document.getElementById('btnSubmitRegister');
      feedback.hidden = true;
      btn.disabled = true;
      btn.textContent = 'Mengirim link verifikasi...';

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nickname: document.getElementById('regNickname').value.trim(),
            email: document.getElementById('regEmail').value.trim()
          })
        });
        let data = {};
        try {
          data = await res.json();
        } catch {
          data = { error: res.status === 404
            ? 'Endpoint pendaftaran belum aktif di server. Silakan RESTART server lokal Anda (tekan Ctrl+C di terminal lalu jalankan "node server.js" lagi).'
            : `Server merespon dengan status ${res.status}. Silakan restart "node server.js".` };
        }
        if (!res.ok) {
          feedback.textContent = data.error || 'Pendaftaran gagal.';
          feedback.className = 'auth-feedback error';
          feedback.hidden = false;
          return;
        }
        feedback.className = 'auth-feedback success';
        if (data.devVerifyUrl) {
          feedback.innerHTML = `${escapeHtml(data.message)}<br /><br /><strong>Tautan Aktivasi:</strong> <a href="${escapeHtml(data.devVerifyUrl)}" target="_blank" style="color:#a5b4fc;text-decoration:underline;">Klik di sini untuk verifikasi &amp; buat password →</a>`;
        } else {
          feedback.textContent = data.message;
        }
        feedback.hidden = false;
      } catch (err) {
        feedback.textContent = 'Gagal menghubungi server. Pastikan terminal "node server.js" sedang berjalan di http://localhost:3000.';
        feedback.className = 'auth-feedback error';
        feedback.hidden = false;
      } finally {
        btn.disabled = false;
        btn.textContent = 'Kirim Link Verifikasi';
      }
    });

    // Avatar Picker
    document.getElementById('avatarPickerGrid')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.avatar-pick-btn');
      if (!btn) return;
      document.querySelectorAll('.avatar-pick-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      document.getElementById('profAvatarPreview').textContent = btn.dataset.emoji;
    });

    // Membership Tier Picker
    document.querySelectorAll('.tier-option-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.tier-option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });

    // Profile Save
    document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const feedback = document.getElementById('profileFeedback');
      feedback.hidden = true;

      const selectedAvatar = document.querySelector('.avatar-pick-btn.selected')?.dataset.emoji || this.user?.avatarEmoji || '🌸';
      const selectedTier = document.querySelector('.tier-option-card.selected')?.dataset.tier || this.user?.membershipTier || 'free';

      try {
        const res = await fetch('/api/profile', {
          method: 'PATCH',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nickname: document.getElementById('profNicknameInput').value.trim(),
            avatarEmoji: selectedAvatar,
            bio: document.getElementById('profBioInput').value.trim(),
            membershipTier: selectedTier
          })
        });
        const data = await res.json();
        if (!res.ok) {
          feedback.textContent = data.error || 'Gagal menyimpan profil.';
          feedback.className = 'auth-feedback error';
          feedback.hidden = false;
          return;
        }
        this.user = data.user;
        this.renderHeaderSlot();
        this.populateProfileModal();
        this.loadLeaderboard();
        feedback.textContent = 'Profil & membership berhasil diperbarui!';
        feedback.className = 'auth-feedback success';
        feedback.hidden = false;
      } catch {
        feedback.textContent = 'Gagal terhubung ke server.';
        feedback.className = 'auth-feedback error';
        feedback.hidden = false;
      }
    });

    // Logout
    document.getElementById('btnLogoutAccount')?.addEventListener('click', async () => {
      try {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
      } catch {}
      this.user = null;
      if (typeof progress.setStorageScope === 'function') {
        progress.setStorageScope(null);
      }
      document.getElementById('guestMergeBanner')?.remove();
      profileBackdrop.hidden = true;
      this.renderHeaderSlot();
      this.updateAdminTabVisibility();
      this.notifyAuthChange();
      if (this.onProgressUpdated) this.onProgressUpdated();
      this.loadLeaderboard();
    });

    // Change Password Submit (also clears mustChangePassword flag)
    document.getElementById('changePasswordForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const feedback = document.getElementById('changePasswordFeedback');
      const btn = document.getElementById('btnChangePassword');
      const curInput = document.getElementById('currentPasswordInput');
      const newInput = document.getElementById('newPasswordInput');
      if (feedback) feedback.hidden = true;
      if (btn) btn.disabled = true;

      try {
        const res = await fetch('/api/auth/change-password', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword: curInput?.value || '',
            newPassword: newInput?.value || ''
          })
        });
        const data = await res.json();
        if (!res.ok) {
          if (feedback) {
            feedback.textContent = data.error || 'Gagal memperbarui kata sandi.';
            feedback.className = 'auth-feedback error';
            feedback.hidden = false;
          }
          return;
        }
        if (this.user) this.user.mustChangePassword = false;
        const warnBanner = document.getElementById('mustChangePasswordBanner');
        if (warnBanner) warnBanner.hidden = true;
        if (curInput) curInput.value = '';
        if (newInput) newInput.value = '';
        if (feedback) {
          feedback.textContent = '✅ Kata sandi berhasil diperbarui!';
          feedback.className = 'auth-feedback success';
          feedback.hidden = false;
        }
      } catch {
        if (feedback) {
          feedback.textContent = 'Gagal menghubungi server.';
          feedback.className = 'auth-feedback error';
          feedback.hidden = false;
        }
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  }

  openAuthModal(tab = 'login', notice = null) {
    const backdrop = document.getElementById('authModalBackdrop');
    if (!backdrop) return;
    this.switchAuthTab(tab);
    const noticeEl = document.getElementById('authCustomNotice');
    if (noticeEl) {
      if (notice) {
        noticeEl.innerHTML = notice;
        noticeEl.hidden = false;
      } else {
        noticeEl.hidden = true;
      }
    }
    backdrop.hidden = false;
  }

  switchAuthTab(tab) {
    const isLogin = tab === 'login';
    const isForgot = tab === 'forgot';
    document.getElementById('authTabLogin')?.classList.toggle('active', isLogin || isForgot);
    document.getElementById('authTabRegister')?.classList.toggle('active', tab === 'register');
    const loginForm = document.getElementById('loginForm');
    const regForm = document.getElementById('registerForm');
    const forgotForm = document.getElementById('forgotPasswordForm');
    if (loginForm) loginForm.hidden = !isLogin;
    if (regForm) regForm.hidden = tab !== 'register';
    if (forgotForm) forgotForm.hidden = !isForgot;
  }

  openProfileModal() {
    if (!this.user) {
      this.openAuthModal('login');
      return;
    }
    this.populateProfileModal();
    const fb = document.getElementById('profileFeedback');
    if (fb) fb.hidden = true;
    document.getElementById('profileModalBackdrop').hidden = false;
  }

  populateProfileModal() {
    if (!this.user) return;
    const warnBanner = document.getElementById('mustChangePasswordBanner');
    if (warnBanner) warnBanner.hidden = !this.user.mustChangePassword;
    const pwdFb = document.getElementById('changePasswordFeedback');
    if (pwdFb) pwdFb.hidden = true;

    document.getElementById('profAvatarPreview').textContent = this.user.avatarEmoji || '🌸';
    document.getElementById('profDisplayNick').textContent = this.user.nickname;
    document.getElementById('profDisplayEmail').textContent = this.user.email;
    document.getElementById('profRoleBadge').textContent = (this.user.role || 'member').toUpperCase();

    const tierBadge = document.getElementById('profTierBadge');
    const tier = this.user.membershipTier || 'free';
    tierBadge.textContent = tier.toUpperCase();
    tierBadge.className = `auth-tier-badge ${tier}`;

    document.getElementById('profNicknameInput').value = this.user.nickname;
    document.getElementById('profBioInput').value = this.user.bio || '';

    document.querySelectorAll('.avatar-pick-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.emoji === (this.user.avatarEmoji || '🌸'));
    });
    document.querySelectorAll('.tier-option-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.tier === tier);
    });
  }

  bindLeaderboardControls() {
    document.getElementById('lbFilterAll')?.addEventListener('click', () => {
      this.leaderboardPeriod = 'all';
      this.updateLeaderboardFilterUI();
      this.loadLeaderboard();
    });
    document.getElementById('lbFilterWeek')?.addEventListener('click', () => {
      this.leaderboardPeriod = 'week';
      this.updateLeaderboardFilterUI();
      this.loadLeaderboard();
    });

    const guideSlot = document.getElementById('lbScoreGuideSlot');
    if (guideSlot && !guideSlot.dataset.rendered) {
      guideSlot.dataset.rendered = '1';
      guideSlot.innerHTML = renderScoreGuideCardHtml('lbScoreGuideCard');
      bindScoreGuideToggle(
        document.getElementById('btnLbScoreGuide'),
        document.getElementById('lbScoreGuideCard')
      );
    }
  }

  updateLeaderboardFilterUI() {
    document.getElementById('lbFilterAll')?.classList.toggle('active', this.leaderboardPeriod === 'all');
    document.getElementById('lbFilterWeek')?.classList.toggle('active', this.leaderboardPeriod === 'week');
  }

  async loadLeaderboard() {
    const tbody = document.getElementById('leaderboardTableBody');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="7" class="lb-empty-state">Memuat papan peringkat...</td></tr>`;

    // Flush any pending debounced progress sync so the user's latest score is reflected immediately
    if (this.user && this.syncTimer) {
      clearTimeout(this.syncTimer);
      this.syncTimer = null;
      await this.pushProgressToCloud(progress.data, 'replace');
    }

    try {
      const res = await fetch(`/api/leaderboard?period=${encodeURIComponent(this.leaderboardPeriod)}`, {
        credentials: 'same-origin'
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const entries = data.entries || [];

      if (entries.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="lb-empty-state">
              Belum ada peserta terdaftar di papan peringkat. Daftar sekarang untuk menjadi #1! 🏆
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = entries.map(entry => {
        const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`;
        const tierBadge = entry.membershipTier === 'pro' ? `<span class="auth-tier-badge pro">PRO</span>` : '';
        const meTag = entry.isCurrentUser ? `<span class="auth-role-badge">ANDA</span>` : '';
        const badgesHtml = renderBadgeIconsHtml(entry.badges || []);
        const totalScore = Number(entry.totalScore || 0);
        const maxTotalScore = Number(entry.maxTotalScore || 2500);
        return `
          <tr class="${entry.isCurrentUser ? 'is-me' : ''}">
            <td class="lb-rank-cell">${medal}</td>
            <td>
              <div class="lb-user-cell">
                <span>${escapeHtml(entry.avatarEmoji || '🌸')}</span>
                <span>${escapeHtml(entry.nickname)}</span>
                ${tierBadge}
                ${meTag}
              </div>
              ${badgesHtml}
            </td>
            <td class="lb-score-cell">
              <strong>🏆 ${totalScore.toLocaleString('id-ID')}</strong>
              <span class="lb-score-max">/ ${maxTotalScore.toLocaleString('id-ID')}</span>
            </td>
            <td>Lv. ${entry.level}</td>
            <td><strong>${entry.xp.toLocaleString('id-ID')} XP</strong></td>
            <td>🔥 ${entry.streakDays} hr</td>
            <td>${entry.masteredCardsCount} kartu • ${entry.weeklyMinutes} mnt</td>
          </tr>
        `;
      }).join('');
    } catch {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="lb-empty-state">
            Papan peringkat membutuhkan server lokal aktif (<code>node server.js</code>).
          </td>
        </tr>
      `;
    }
  }

  // =========================================================
  // Admin / Sensei Dashboard Methods
  // =========================================================

  updateAdminTabVisibility() {
    const adminBtn = document.getElementById('navTabAdmin');
    if (!adminBtn) return;
    const isAdmin = this.user && this.user.role === 'admin';
    adminBtn.style.display = isAdmin ? '' : 'none';
  }

  bindAdminControls() {
    document.getElementById('btnRefreshAdminData')?.addEventListener('click', () => {
      this.loadAdminDashboard();
    });

    const searchInput = document.getElementById('adminStudentSearch');
    let searchTimeout = null;
    searchInput?.addEventListener('input', (e) => {
      if (searchTimeout) clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.loadAdminStudents(e.target.value.trim());
      }, 300);
    });

    // Close buttons for student detail modal
    const detailModal = document.getElementById('adminStudentDetailModal');
    document.getElementById('btnCloseAdminDetailModal')?.addEventListener('click', () => {
      if (detailModal) detailModal.close();
    });
    document.getElementById('btnCloseAdminDetailBtn')?.addEventListener('click', () => {
      if (detailModal) detailModal.close();
    });
  }

  async loadAdminDashboard() {
    if (!this.user || this.user.role !== 'admin') return;
    await Promise.all([
      this.loadAdminOverview(),
      this.loadAdminStudents(document.getElementById('adminStudentSearch')?.value?.trim() || '')
    ]);
  }

  async loadAdminOverview() {
    try {
      const res = await fetch('/api/admin/overview', { credentials: 'same-origin' });
      if (!res.ok) return;
      const { overview } = await res.json();
      if (!overview) return;

      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      setVal('adminStatTotalUsers', (overview.totalUsers || 0).toLocaleString('id-ID'));
      setVal('adminStatVerifiedStudents', (overview.verifiedStudents || 0).toLocaleString('id-ID'));
      setVal('adminStatActiveWeekly', (overview.activeStudentsWeekly || 0).toLocaleString('id-ID'));
      setVal('adminStatTotalDrillMinutes', `${(overview.totalDrillMinutesWeekly || 0).toLocaleString('id-ID')} mnt`);
      setVal('adminStatCardsMastered', (overview.totalCardsMastered || 0).toLocaleString('id-ID'));
    } catch (e) {
      console.warn('[Admin Overview Error]', e);
    }
  }

  async loadAdminStudents(search = '') {
    const tbody = document.getElementById('adminStudentsTableBody');
    const countLabel = document.getElementById('adminStudentCountLabel');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="7" class="lb-empty-state">Memuat data siswa...</td></tr>`;

    try {
      const url = `/api/admin/students?limit=100${search ? `&search=${encodeURIComponent(search)}` : ''}`;
      const res = await fetch(url, { credentials: 'same-origin' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const { students = [], total = 0 } = await res.json();

      if (countLabel) {
        countLabel.textContent = `Menampilkan ${students.length} dari ${total} pengguna terdaftar`;
      }

      if (students.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="lb-empty-state">
              ${search ? 'Tidak ada siswa yang cocok dengan pencarian.' : 'Belum ada siswa terdaftar.'}
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = students.map(s => {
        const isSelf = s.id === this.user?.id;
        const roleBadge = s.role === 'admin'
          ? `<span class="admin-role-badge admin">👑 Sensei (Admin)</span>`
          : `<span class="admin-role-badge student">Murid</span>`;

        const verifyPill = s.is_verified
          ? `<span class="admin-status-pill verified">✓ Terverifikasi</span>`
          : `<span class="admin-status-pill unverified">⏳ Belum Aktif</span>`;

        return `
          <tr data-student-id="${escapeHtml(s.id)}">
            <td>
              <div class="lb-user-cell">
                <span>${escapeHtml(s.avatar_emoji || '🌸')}</span>
                <strong>${escapeHtml(s.nickname)}</strong>
                ${isSelf ? '<span class="auth-role-badge">ANDA</span>' : ''}
              </div>
            </td>
            <td><code>${escapeHtml(s.email)}</code></td>
            <td>${roleBadge}</td>
            <td>${verifyPill}</td>
            <td>Lv. ${s.level || 1} • <strong>${(s.xp || 0).toLocaleString('id-ID')} XP</strong></td>
            <td>${s.mastered_cards_count || 0} kartu • ${s.weekly_minutes || 0} mnt/mgg</td>
            <td>
              <div class="admin-btn-group">
                <button type="button" class="admin-action-btn btn-inspect-student" title="Lihat kartu lemah & progres detail">🔍 Detail</button>
                ${!s.is_verified ? `
                  <button type="button" class="admin-action-btn btn-verify-student" title="Verifikasi akun secara manual">✓ Aktifkan</button>
                ` : ''}
                ${!isSelf ? `
                  <button type="button" class="admin-action-btn ${s.role === 'admin' ? '' : 'promote'} btn-toggle-role" data-role="${s.role}">
                    ${s.role === 'admin' ? 'Jadikan Murid' : 'Jadikan Admin'}
                  </button>
                ` : ''}
              </div>
            </td>
          </tr>
        `;
      }).join('');

      // Bind row actions
      tbody.querySelectorAll('.btn-inspect-student').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const tr = e.target.closest('tr');
          const studentId = tr?.dataset?.studentId;
          if (studentId) this.inspectStudent(studentId);
        });
      });

      tbody.querySelectorAll('.btn-verify-student').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const tr = e.target.closest('tr');
          const studentId = tr?.dataset?.studentId;
          if (studentId && confirm('Verifikasi & aktifkan akun siswa ini sekarang?')) {
            await this.performStudentAction(studentId, 'verify_now');
          }
        });
      });

      tbody.querySelectorAll('.btn-toggle-role').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const tr = e.target.closest('tr');
          const studentId = tr?.dataset?.studentId;
          const currentRole = btn.dataset.role;
          const newRole = currentRole === 'admin' ? 'student' : 'admin';
          const promptMsg = newRole === 'admin'
            ? 'Promosikan siswa ini menjadi Admin (Sensei)?'
            : 'Ubah peran pengguna ini menjadi Murid biasa?';
          if (studentId && confirm(promptMsg)) {
            await this.performStudentAction(studentId, 'change_role', { role: newRole });
          }
        });
      });

    } catch (err) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="lb-empty-state">
            Gagal memuat data siswa: ${escapeHtml(err.message)}
          </td>
        </tr>
      `;
    }
  }

  async inspectStudent(studentId) {
    const modal = document.getElementById('adminStudentDetailModal');
    if (!modal) return;

    try {
      const res = await fetch(`/api/admin/students/${encodeURIComponent(studentId)}/detail`, {
        credentials: 'same-origin'
      });
      if (!res.ok) {
        alert('Gagal mengambil detail siswa.');
        return;
      }
      const data = await res.json();
      const student = data.student;
      if (!student) return;

      document.getElementById('adminDetailAvatarBadge').textContent = student.avatar_emoji || '🌸';
      document.getElementById('adminDetailNickname').textContent = `${student.nickname} (${(student.role || 'student').toUpperCase()})`;
      document.getElementById('adminDetailEmail').textContent = student.email;

      const p = data.progress || {};
      const cardsList = data.cardsList || [];
      const grid = document.getElementById('adminDetailStatsGrid');
      grid.innerHTML = `
        <div class="student-detail-box">
          <strong>Level &amp; XP</strong>
          <span style="font-size:1.15rem;font-weight:700;">Lv. ${p.level || 1} • ${(p.xp || 0).toLocaleString('id-ID')} XP</span>
        </div>
        <div class="student-detail-box">
          <strong>Daily Streak</strong>
          <span style="font-size:1.15rem;font-weight:700;">🔥 ${p.streakDays || 0} Hari</span>
        </div>
        <div class="student-detail-box">
          <strong>Total Kartu Aktif</strong>
          <span style="font-size:1.15rem;font-weight:700;">🗂️ ${cardsList.length} Kartu</span>
        </div>
        <div class="student-detail-box">
          <strong>Latihan Minggu Ini</strong>
          <span style="font-size:1.15rem;font-weight:700;">⏱️ ${p.weeklyMinutes || 0} Menit</span>
        </div>
      `;

      // Stage Breakdown
      const stages = {
        mastered: cardsList.filter(c => c.stage === 'mastered').length,
        learning: cardsList.filter(c => c.stage === 'learning').length,
        weak: cardsList.filter(c => c.stage === 'relearning' || (c.wrong || 0) > 1).length
      };
      const stageRow = document.getElementById('adminDetailStageBreakdown');
      stageRow.innerHTML = `
        <span class="stage-badge mastered">✓ Dikuasai: ${stages.mastered} kartu</span>
        <span class="stage-badge learning">📖 Sedang Dipelajari: ${stages.learning} kartu</span>
        <span class="stage-badge weak">⚠️ Perlu Latihan: ${stages.weak} kartu</span>
      `;

      // Weak list
      const weakList = document.getElementById('adminDetailWeakList');
      const weakItems = cardsList.filter(c => (c.wrong || 0) > 0).slice(0, 15).map(c => ({
        cardId: c.card_id,
        lapses: c.wrong,
        accuracy: Math.round(((c.correct || 0) / Math.max(1, (c.correct || 0) + (c.wrong || 0))) * 100)
      }));
      if (weakItems.length === 0) {
        weakList.innerHTML = `<span style="color:var(--text-muted);">Tidak ada kata lemah yang tercatat (semua kartu akurat atau belum pernah salah).</span>`;
      } else {
        weakList.innerHTML = `
          <ul style="margin:0;padding-left:1.2rem;">
            ${weakItems.map(w => `
              <li><strong>${escapeHtml(w.cardId)}</strong> — Salah: ${w.lapses}x (Akurasi: ${w.accuracy}%)</li>
            `).join('')}
          </ul>
        `;
      }

      modal.showModal();
    } catch {
      alert('Terjadi kesalahan saat memuat detail siswa.');
    }
  }

  async performStudentAction(studentId, action, payload = {}) {
    try {
      const res = await fetch(`/api/admin/students/${encodeURIComponent(studentId)}/action`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Aksi gagal.');
        return;
      }
      // Refresh students and overview
      await this.loadAdminDashboard();
    } catch {
      alert('Gagal menghubungi server.');
    }
  }
}

export const authUI = new AuthUIController();
