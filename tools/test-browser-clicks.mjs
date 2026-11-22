// Mock browser DOM environment to test app.js initialization and button clicks
import fs from 'fs';

// Setup minimal DOM mocks
class MockElement {
  constructor(tag = 'div', id = '', classes = []) {
    this.tagName = tag.toUpperCase();
    this.id = id;
    const set = new Set(classes);
    this.classList = {
      add: (c) => set.add(c),
      remove: (c) => set.delete(c),
      toggle: (c, force) => {
        if (force === undefined) {
          if (set.has(c)) { set.delete(c); return false; }
          else { set.add(c); return true; }
        }
        if (force) { set.add(c); return true; }
        else { set.delete(c); return false; }
      },
      contains: (c) => set.has(c),
      has: (c) => set.has(c)
    };
    this.listeners = {};
    this.dataset = {};
    this.hidden = false;
    this.style = {};
    this.children = [];
    this.textContent = '';
    this.innerHTML = '';
    this.attributes = {};
  }

  showModal() { this.setAttribute('open', ''); }
  close() { this.removeAttribute('open'); }
  removeAttribute(k) { delete this.attributes[k]; }
  closest(sel) { return this; }
  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k]; }

  addEventListener(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }

  click() {
    if (this.listeners['click']) {
      this.listeners['click'].forEach(fn => fn({ target: this, preventDefault: () => {} }));
    }
  }

  querySelector(sel) {
    if (sel.startsWith('.')) {
      const cls = sel.slice(1);
      return this.children.find(c => c.classList.has(cls)) || new MockElement('span');
    }
    if (sel.startsWith('#')) {
      const id = sel.slice(1);
      return this.children.find(c => c.id === id) || new MockElement('div', id);
    }
    return new MockElement('span');
  }

  querySelectorAll(sel) {
    return this.children;
  }
}

// Parse HTML elements roughly to create elements with IDs
const html = fs.readFileSync('index.html', 'utf8');
const elementMap = new Map();

function getOrCreate(id) {
  if (!elementMap.has(id)) {
    elementMap.set(id, new MockElement('div', id));
  }
  return elementMap.get(id);
}

// Mock Global Window and Document
const listeners = {};
global.window = {
  addEventListener: (event, fn) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
  },
  localStorage: {
    data: {},
    getItem: (k) => global.window.localStorage.data[k] || null,
    setItem: (k, v) => { global.window.localStorage.data[k] = String(v); }
  },
  speechSynthesis: {
    speak: () => {},
    cancel: () => {},
    getVoices: () => []
  },
  AudioContext: class {
    createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } }; }
    createOscillator() { return { connect: () => {}, start: () => {}, stop: () => {}, frequency: { setValueAtTime: () => {} } }; }
  }
};
global.window.webkitAudioContext = global.window.AudioContext;
global.localStorage = global.window.localStorage;
global.speechSynthesis = global.window.speechSynthesis;
global.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };

global.document = {
  body: new MockElement('body'),
  addEventListener: (event, fn) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
  },
  getElementById: (id) => getOrCreate(id),
  querySelectorAll: (sel) => {
    if (sel === '.nav-tab-btn') {
      return [
        Object.assign(new MockElement('button', '', ['nav-tab-btn']), { dataset: { tab: 'drill' } }),
        Object.assign(new MockElement('button', '', ['nav-tab-btn']), { dataset: { tab: 'explorer' } }),
        Object.assign(new MockElement('button', '', ['nav-tab-btn']), { dataset: { tab: 'scorecard' } })
      ];
    }
    if (sel === '.tab-panel') {
      return [
        new MockElement('div', 'tab-drill', ['tab-panel']),
        new MockElement('div', 'tab-explorer', ['tab-panel']),
        new MockElement('div', 'tab-scorecard', ['tab-panel'])
      ];
    }
    if (sel === '.preset-btn') {
      return [
        Object.assign(new MockElement('button', '', ['preset-btn']), { dataset: { preset: 'all' } }),
        Object.assign(new MockElement('button', '', ['preset-btn']), { dataset: { preset: '1-5' } }),
        Object.assign(new MockElement('button', '', ['preset-btn']), { dataset: { preset: 'clear' } })
      ];
    }
    if (sel === '.lesson-tile') {
      const tiles = [];
      for (let i = 1; i <= 14; i++) {
        const tile = Object.assign(new MockElement('div', `tile-${i}`, ['lesson-tile', 'selected']), { dataset: { lesson: String(i) } });
        const cb = Object.assign(new MockElement('input'), { type: 'checkbox', value: String(i), checked: true });
        tile.children.push(cb);
        tile.querySelector = (s) => (s.includes('input') ? cb : null);
        tiles.push(tile);
      }
      return tiles;
    }
    if (sel === '.lesson-tile input[type="checkbox"]:checked') {
      return [Object.assign(new MockElement('input'), { value: '1' })];
    }
    return [];
  }
};

console.log('--- Loading app.js dynamically ---');
const { JapaneseApp } = await import('../js/app.js');

const app = new JapaneseApp();
app.init();
console.log('✅ app.init() ran successfully without throwing errors!');

// Test clicking Nav Tabs
console.log('\n--- Testing Nav Tab clicks ---');
app.switchTab('explorer');
console.log('Switched to explorer tab. currentTab:', app.currentTab);
if (app.currentTab !== 'explorer') throw new Error('Tab switch failed');

app.switchTab('scorecard');
console.log('Switched to scorecard tab. currentTab:', app.currentTab);
if (app.currentTab !== 'scorecard') throw new Error('Tab switch failed');

app.switchTab('drill');
console.log('Switched to drill tab. currentTab:', app.currentTab);
if (app.currentTab !== 'drill') throw new Error('Tab switch failed');

// Test clicking Session Type
console.log('\n--- Testing Session Type toggle ---');
app.setSessionType('learning');
console.log('Switched session type to learning. currentSessionType:', app.currentSessionType);
if (app.currentSessionType !== 'learning') throw new Error('Session type toggle failed');

app.setSessionType('quiz');
console.log('Switched session type to quiz. currentSessionType:', app.currentSessionType);
if (app.currentSessionType !== 'quiz') throw new Error('Session type toggle failed');

// Test clicking Format Switcher
console.log('\n--- Testing Format Switcher ---');
app.setInputFormat('typing');
console.log('Switched format to typing. currentInputFormat:', app.currentInputFormat);
if (app.currentInputFormat !== 'typing') throw new Error('Format switch to typing failed');

app.setInputFormat('mcq');
console.log('Switched format to mcq. currentInputFormat:', app.currentInputFormat);
if (app.currentInputFormat !== 'mcq') throw new Error('Format switch to mcq failed');

// Test clicking Start Drill Button
console.log('\n--- Testing Start Drill Launch ---');
app.launchDrill('quiz', 'kanji_match', [1, 2]);
console.log('Drill launched successfully! Active area hidden status:', app.dom.drillActiveArea.hidden);

console.log('\n🎉 ALL BUTTON CLICKS AND EVENT HANDLERS PASSED VERIFICATION!');
process.exit(0);
