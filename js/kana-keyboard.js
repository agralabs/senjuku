// KiraKira Nihongo — Zero-Dependency Interactive Japanese Kana On-Screen Keyboard
// Supports full 46-char Hiragana & Katakana Gojuon + smart Dakuten (゛), Handakuten (゜), Small (小), Choonpu (ー), Backspace & Clear.

const HIRAGANA_ROWS = [
  ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'],
  ['い', 'き', 'し', 'ち', 'に', 'ひ', 'み', '',   'り', 'を'],
  ['う', 'く', 'す', 'つ', 'ぬ', 'ふ', 'む', 'ゆ', 'る', 'ん'],
  ['え', 'け', 'せ', 'て', 'ね', 'へ', 'め', '',   'れ', 'ー'],
  ['お', 'こ', 'そ', 'と', 'の', 'ほ', 'も', 'よ', 'ろ', '。']
];

const KATAKANA_ROWS = [
  ['ア', 'カ', 'サ', 'タ', 'ナ', 'ハ', 'マ', 'ヤ', 'ラ', 'ワ'],
  ['イ', 'キ', 'シ', 'チ', 'ニ', 'ヒ', 'ミ', '',   'リ', 'ヲ'],
  ['ウ', 'ク', 'ス', 'ツ', 'ヌ', 'フ', 'ム', 'ユ', 'ル', 'ン'],
  ['エ', 'ケ', 'セ', 'テ', 'ネ', 'ヘ', 'メ', '',   'レ', 'ー'],
  ['オ', 'コ', 'ソ', 'ト', 'ノ', 'ホ', 'モ', 'ヨ', 'ロ', '。']
];

const DAKUTEN_MAP = {
  // Hiragana
  'か': 'が', 'き': 'ぎ', 'く': 'ぐ', 'け': 'げ', 'こ': 'ご',
  'さ': 'ざ', 'し': 'じ', 'す': 'ず', 'せ': 'ぜ', 'そ': 'ぞ',
  'た': 'だ', 'ち': 'ぢ', 'つ': 'づ', 'て': 'で', 'と': 'ど',
  'は': 'ば', 'ひ': 'び', 'ふ': 'ぶ', 'へ': 'べ', 'ほ': 'ぼ',
  'う': 'ゔ',
  'が': 'か', 'ぎ': 'き', 'ぐ': 'く', 'げ': 'け', 'ご': 'こ',
  'ざ': 'さ', 'じ': 'し', 'ず': 'す', 'ぜ': 'せ', 'ぞ': 'そ',
  'だ': 'た', 'ぢ': 'ち', 'づ': 'つ', 'で': 'て', 'ど': 'と',
  'ば': 'は', 'び': 'ひ', 'ぶ': 'ふ', 'べ': 'へ', 'ぼ': 'ほ',
  'ぱ': 'ば', 'ぴ': 'び', 'ぷ': 'ぶ', 'ぺ': 'べ', 'ぽ': 'ぼ',
  'ゔ': 'う',
  // Katakana
  'カ': 'ガ', 'キ': 'ギ', 'ク': 'グ', 'ケ': 'ゲ', 'コ': 'ゴ',
  'サ': 'ザ', 'シ': 'ジ', 'ス': 'ズ', 'セ': 'ゼ', 'ソ': 'ゾ',
  'タ': 'ダ', 'チ': 'ヂ', 'ツ': 'ヅ', 'テ': 'デ', 'ト': 'ド',
  'ハ': 'バ', 'ヒ': 'ビ', 'フ': 'ブ', 'ヘ': 'ベ', 'ホ': 'ボ',
  'ウ': 'ヴ',
  'ガ': 'カ', 'ギ': 'キ', 'グ': 'ク', 'ゲ': 'ケ', 'ゴ': 'コ',
  'ザ': 'サ', 'ジ': 'シ', 'ズ': 'ス', 'ゼ': 'セ', 'ゾ': 'ソ',
  'ダ': 'タ', 'ヂ': 'チ', 'ヅ': 'ツ', 'デ': 'テ', 'ド': 'ト',
  'バ': 'ハ', 'ビ': 'ヒ', 'ブ': 'フ', 'ベ': 'ヘ', 'ボ': 'ホ',
  'パ': 'バ', 'ピ': 'ビ', 'プ': 'ブ', 'ペ': 'ベ', 'ポ': 'ボ',
  'ヴ': 'ウ'
};

const HANDAKUTEN_MAP = {
  'は': 'ぱ', 'ひ': 'ぴ', 'ふ': 'ぷ', 'へ': 'ぺ', 'ほ': 'ぽ',
  'ば': 'ぱ', 'び': 'ぴ', 'ぶ': 'ぷ', 'べ': 'ぺ', 'ぼ': 'ぽ',
  'ぱ': 'は', 'ぴ': 'ひ', 'ぷ': 'ふ', 'ぺ': 'へ', 'ぽ': 'ほ',
  'ハ': 'パ', 'ヒ': 'ピ', 'フ': 'プ', 'ヘ': 'ペ', 'ホ': 'ポ',
  'バ': 'パ', 'ビ': 'ピ', 'ブ': 'プ', 'ベ': 'ペ', 'ボ': 'ポ',
  'パ': 'ハ', 'ピ': 'ヒ', 'プ': 'フ', 'ペ': 'ヘ', 'ポ': 'ホ'
};

const SMALL_MAP = {
  'あ': 'ぁ', 'い': 'ぃ', 'う': 'ぅ', 'え': 'ぇ', 'お': 'ぉ',
  'つ': 'っ', 'や': 'ゃ', 'ゆ': 'ゅ', 'よ': 'ょ', 'わ': 'ゎ',
  'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お',
  'っ': 'つ', 'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ', 'ゎ': 'わ',
  'ア': 'ァ', 'イ': 'ィ', 'ウ': 'ゥ', 'エ': 'ェ', 'オ': 'ォ',
  'ツ': 'ッ', 'ヤ': 'ャ', 'ユ': 'ュ', 'ヨ': 'ョ', 'ワ': 'ヮ',
  'ァ': 'ア', 'ィ': 'イ', 'ゥ': 'ウ', 'ェ': 'エ', 'ォ': 'オ',
  'ッ': 'ツ', 'ャ': 'ヤ', 'ュ': 'ユ', 'ョ': 'ヨ', 'ヮ': 'ワ'
};

export function renderKanaKeyboardHtml(initialScript = 'hiragana') {
  const isKata = initialScript === 'katakana';
  return `
    <div class="kana-osk" data-kana-osk data-script="${isKata ? 'katakana' : 'hiragana'}">
      <div class="kana-osk-toolbar">
        <div class="kana-osk-script-tabs">
          <button type="button" class="kana-osk-tab ${!isKata ? 'active' : ''}" data-osk-script="hiragana">あ ひらがな</button>
          <button type="button" class="kana-osk-tab ${isKata ? 'active' : ''}" data-osk-script="katakana">ア カタカナ</button>
        </div>
        <div class="kana-osk-mod-actions">
          <button type="button" class="kana-osk-mod-btn" data-osk-action="dakuten" title="Ubah ke Dakuten (゛: か→が, さ→ざ, た→だ, は→ば)">゛</button>
          <button type="button" class="kana-osk-mod-btn" data-osk-action="handakuten" title="Ubah ke Handakuten (゜: は→ぱ)">゜</button>
          <button type="button" class="kana-osk-mod-btn" data-osk-action="small" title="Ubah ke huruf kecil (っ, ゃ, ゅ, ょ)">小</button>
          <button type="button" class="kana-osk-mod-btn kana-osk-bksp" data-osk-action="backspace" title="Hapus 1 karakter">⌫</button>
          <button type="button" class="kana-osk-mod-btn kana-osk-clear" data-osk-action="clear" title="Bersihkan kotak ketik">C</button>
          <button type="button" class="kana-osk-mod-btn kana-osk-native-toggle" data-osk-action="toggle-native-kb" title="Aktifkan/nonaktifkan keyboard bawaan HP" aria-pressed="false">⌨️</button>
        </div>
      </div>
      <div class="kana-osk-grid" data-osk-grid>
        ${buildGridButtonsHtml(isKata ? KATAKANA_ROWS : HIRAGANA_ROWS)}
      </div>
    </div>
  `;
}

function buildGridButtonsHtml(rows) {
  return rows.map(row =>
    row.map(ch => {
      if (!ch) return `<span class="kana-osk-spacer" aria-hidden="true"></span>`;
      return `<button type="button" class="kana-osk-key" data-osk-char="${ch}">${ch}</button>`;
    }).join('')
  ).join('');
}

export function attachKanaKeyboard(containerEl, inputEl, options = {}) {
  if (!containerEl || !inputEl) return;
  const osk = containerEl.querySelector('[data-kana-osk]');
  if (!osk) return;

  const onUpdate = typeof options.onUpdate === 'function' ? options.onUpdate : () => {};

  // On touch devices, suppress the native QWERTY soft keyboard by default so it doesn't cover the Japanese Kana OSK
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  let useNativeKb = !isTouchDevice;
  if (isTouchDevice && typeof inputEl.setAttribute === 'function') {
    inputEl.setAttribute('inputmode', 'none');
  }

  const insertAtCursor = (str) => {
    if (inputEl.disabled) return;
    const start = typeof inputEl.selectionStart === 'number' ? inputEl.selectionStart : inputEl.value.length;
    const end = typeof inputEl.selectionEnd === 'number' ? inputEl.selectionEnd : inputEl.value.length;
    inputEl.value = inputEl.value.slice(0, start) + str + inputEl.value.slice(end);
    const nextPos = start + str.length;
    if (typeof inputEl.setSelectionRange === 'function') {
      inputEl.setSelectionRange(nextPos, nextPos);
    }
    inputEl.focus();
    onUpdate(inputEl.value);
  };

  const transformBeforeCursor = (map) => {
    if (inputEl.disabled) return;
    const pos = typeof inputEl.selectionStart === 'number' ? inputEl.selectionStart : inputEl.value.length;
    if (pos <= 0) return;
    const prevChar = inputEl.value[pos - 1];
    const mapped = map[prevChar];
    if (!mapped) return;
    inputEl.value = inputEl.value.slice(0, pos - 1) + mapped + inputEl.value.slice(pos);
    if (typeof inputEl.setSelectionRange === 'function') {
      inputEl.setSelectionRange(pos, pos);
    }
    inputEl.focus();
    onUpdate(inputEl.value);
  };

  const handleBackspace = () => {
    if (inputEl.disabled) return;
    const start = typeof inputEl.selectionStart === 'number' ? inputEl.selectionStart : inputEl.value.length;
    const end = typeof inputEl.selectionEnd === 'number' ? inputEl.selectionEnd : inputEl.value.length;
    if (start !== end) {
      inputEl.value = inputEl.value.slice(0, start) + inputEl.value.slice(end);
      if (typeof inputEl.setSelectionRange === 'function') inputEl.setSelectionRange(start, start);
    } else if (start > 0) {
      inputEl.value = inputEl.value.slice(0, start - 1) + inputEl.value.slice(start);
      if (typeof inputEl.setSelectionRange === 'function') inputEl.setSelectionRange(start - 1, start - 1);
    }
    inputEl.focus();
    onUpdate(inputEl.value);
  };

  osk.addEventListener('click', (e) => {
    const scriptBtn = e.target.closest ? e.target.closest('[data-osk-script]') : null;
    if (scriptBtn) {
      const nextScript = scriptBtn.dataset.oskScript === 'katakana' ? 'katakana' : 'hiragana';
      osk.dataset.script = nextScript;
      osk.querySelectorAll('[data-osk-script]').forEach(b => b.classList.toggle('active', b.dataset.oskScript === nextScript));
      const grid = osk.querySelector('[data-osk-grid]');
      if (grid) {
        grid.innerHTML = buildGridButtonsHtml(nextScript === 'katakana' ? KATAKANA_ROWS : HIRAGANA_ROWS);
      }
      inputEl.focus();
      return;
    }

    const keyBtn = e.target.closest ? e.target.closest('[data-osk-char]') : null;
    if (keyBtn) {
      insertAtCursor(keyBtn.dataset.oskChar);
      return;
    }

    const actBtn = e.target.closest ? e.target.closest('[data-osk-action]') : null;
    if (actBtn) {
      const act = actBtn.dataset.oskAction;
      if (act === 'dakuten') transformBeforeCursor(DAKUTEN_MAP);
      else if (act === 'handakuten') transformBeforeCursor(HANDAKUTEN_MAP);
      else if (act === 'small') transformBeforeCursor(SMALL_MAP);
      else if (act === 'backspace') handleBackspace();
      else if (act === 'clear') {
        if (!inputEl.disabled) {
          inputEl.value = '';
          inputEl.focus();
          onUpdate('');
        }
      } else if (act === 'toggle-native-kb') {
        useNativeKb = !useNativeKb;
        if (typeof inputEl.setAttribute === 'function') {
          inputEl.setAttribute('inputmode', useNativeKb ? 'text' : 'none');
        }
        actBtn.setAttribute('aria-pressed', String(useNativeKb));
        actBtn.classList.toggle('active', useNativeKb);
        inputEl.focus();
      }
    }
  });
}
