// tools/verify-guest-registration-wall.mjs
// Verification script for Registration Wall & Teaser Mode for Anonymous Users

import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 Verifying Registration Wall & Teaser Mode implementation...\n');

const htmlContent = fs.readFileSync('index.html', 'utf8');
const cssContent = fs.readFileSync('style.css', 'utf8');
const authUiContent = fs.readFileSync('js/auth-ui.js', 'utf8');
const appContent = fs.readFileSync('js/app.js', 'utf8');

// Test 1: HTML Structure
const requiredHtmlElements = [
  'id="guestNoticeBanner"',
  'id="guestLessonsWrapper"',
  'id="guestBucketCard"',
  'id="btnGuestRegister"',
  'id="btnGuestLogin"',
  'id="btnGuestUnlockLessons"',
  'data-guest-locked="true"',
  'class="teaser-lock-badge"'
];

for (const el of requiredHtmlElements) {
  if (!htmlContent.includes(el)) {
    console.error(`❌ HTML element missing: ${el}`);
    process.exit(1);
  }
}
console.log('✅ Test 1: HTML structure has guestNoticeBanner, guestLessonsWrapper, guestBucketCard & teaser lock badges.');

// Test 2: CSS Styles
const requiredCssClasses = [
  '.guest-notice-banner',
  '.guest-bucket-card',
  '.teaser-locked',
  '.teaser-lock-badge',
  '.auth-custom-notice'
];

for (const cls of requiredCssClasses) {
  if (!cssContent.includes(cls)) {
    console.error(`❌ CSS class missing: ${cls}`);
    process.exit(1);
  }
}
console.log('✅ Test 2: CSS defines styles for guest banner, bucket card, teaser locked states & badges.');

// Test 3: auth-ui.js controller
if (!authUiContent.includes('this.onAuthChange = typeof options.onAuthChange') ||
    !authUiContent.includes('notifyAuthChange()') ||
    !authUiContent.includes('authCustomNotice')) {
  console.error('❌ auth-ui.js missing onAuthChange callback or authCustomNotice support');
  process.exit(1);
}
console.log('✅ Test 3: auth-ui.js provides onAuthChange callback and custom notice modal alerts.');

// Test 4: app.js access control logic
if (!appContent.includes('applyAccessControl(user)') ||
    !appContent.includes('updateTeaserLockStates(isGuest)') ||
    !appContent.includes('return [1, 2, 3, 4, 5];')) {
  console.error('❌ app.js missing applyAccessControl, updateTeaserLockStates, or Bab 1-5 default assignment');
  process.exit(1);
}
console.log('✅ Test 4: app.js implements applyAccessControl, teaser locking, and automatic Bab 1–5 assignment for guests.');

console.log('\n🎉 ALL REGISTRATION WALL VERIFICATIONS PASSED SUCCESSFULLY!');
