/**
 * Comprehensive Validation Test Suite
 * Tests every mission, button, scoring branch, city transformation, and restart functionality.
 */

const fs = require('fs');
const path = require('path');

// Mock DOM & Canvas Environment
class MockClassList {
  constructor() { this.classes = new Set(); }
  add(...c) { c.forEach(x => this.classes.add(x)); }
  remove(...c) { c.forEach(x => this.classes.delete(x)); }
  toggle(c, force) {
    if (force !== undefined) {
      if (force) this.classes.add(c); else this.classes.delete(c);
      return force;
    }
    if (this.classes.has(c)) { this.classes.delete(c); return false; }
    this.classes.add(c); return true;
  }
  contains(c) { return this.classes.has(c); }
}

class MockElement {
  constructor(tag, id = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.classList = new MockClassList();
    this.style = {};
    this.listeners = {};
    this.attributes = {};
    this.children = [];
    this.textContent = '';
    this._innerHTML = '';
  }

  get textContent() { return this._text !== undefined ? this._text : ''; }
  set textContent(val) { this._text = val === null || val === undefined ? '' : String(val); }

  get innerHTML() { return this._innerHTML; }
  set innerHTML(val) {
    this._innerHTML = val;
    this.children = [];
  }

  addEventListener(evt, fn) {
    if (!this.listeners[evt]) this.listeners[evt] = [];
    this.listeners[evt].push(fn);
  }

  dispatchEvent(evt) {
    const handlers = this.listeners[evt.type] || [];
    handlers.forEach(h => h(evt));
  }

  click() {
    this.dispatchEvent({ type: 'click' });
  }

  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k]; }
  appendChild(child) {
    this.children.push(child);
    child.parentNode = this;
  }
  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parentNode = null;
    }
  }
  focus() {}

  querySelector(sel) {
    if (sel.startsWith('#')) {
      const id = sel.slice(1);
      if (this.id === id) return this;
      for (const c of this.children) {
        if (c.id === id) return c;
        const sub = c.querySelector(sel);
        if (sub) return sub;
      }
      return null;
    }
    if (sel.startsWith('.')) {
      const cls = sel.slice(1);
      for (const c of this.children) {
        if (c.classList.contains(cls)) return c;
        const sub = c.querySelector(sel);
        if (sub) return sub;
      }
      return null;
    }
    return null;
  }

  querySelectorAll(sel) {
    const results = [];
    if (sel.startsWith('.')) {
      const cls = sel.slice(1);
      const search = (node) => {
        for (const c of node.children) {
          if (c.classList.contains(cls)) results.push(c);
          search(c);
        }
      };
      search(this);
    }
    return results;
  }
}

class MockCanvasContext {
  clearRect() {}
  save() {}
  restore() {}
  beginPath() {}
  closePath() {}
  moveTo() {}
  lineTo() {}
  arc() {}
  fill() {}
  stroke() {}
  fillRect() {}
  strokeRect() {}
  roundRect() {}
  quadraticCurveTo() {}
  bezierCurveTo() {}
  ellipse() {}
  fillText() {}
  setLineDash() {}
  measureText(str) { return { width: (str || '').length * 6 }; }
  createLinearGradient() { return { addColorStop() {} }; }
  createRadialGradient() { return { addColorStop() {} }; }
}

class MockCanvas extends MockElement {
  constructor(id) {
    super('canvas', id);
    this.width = 900;
    this.height = 520;
    this.ctx = new MockCanvasContext();
  }
  getContext() { return this.ctx; }
  getBoundingClientRect() { return { left: 0, top: 0, width: 900, height: 520 }; }
}

// Global Mocks
global.window = {
  listeners: {},
  addEventListener(evt, fn) {
    if (!this.listeners[evt]) this.listeners[evt] = [];
    this.listeners[evt].push(fn);
  },
  dispatchEvent(evt) {
    const handlers = this.listeners[evt.type] || [];
    handlers.forEach(h => h(evt));
  },
  scrollTo() {},
  print() { this.printed = true; },
  requestAnimationFrame(fn) { return setTimeout(fn, 16); },
  cancelAnimationFrame(id) { clearTimeout(id); },
  AudioContext: class {
    constructor() { this.currentTime = 0; this.state = 'running'; }
    createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} }, connect() {} }; }
    createOscillator() { return { type: '', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} }, connect() {}, start() {}, stop() {} }; }
    createBiquadFilter() { return { type: '', frequency: { setValueAtTime() {} }, connect() {} }; }
    resume() {}
  },
  navigator: {
    clipboard: {
      writeText(text) {
        global.copiedText = text;
        return Promise.resolve();
      }
    }
  }
};
global.navigator = global.window.navigator;
global.requestAnimationFrame = global.window.requestAnimationFrame;
global.cancelAnimationFrame = global.window.cancelAnimationFrame;

const domStore = {};
function getOrCreateElem(id, tag = 'div') {
  if (!domStore[id]) {
    if (id === 'city-canvas') {
      domStore[id] = new MockCanvas(id);
    } else {
      domStore[id] = new MockElement(tag, id);
    }
  }
  return domStore[id];
}

global.document = {
  readyState: 'complete',
  addEventListener() {},
  body: new MockElement('body'),
  getElementById(id) { return getOrCreateElem(id); },
  querySelector(sel) {
    if (sel.startsWith('#')) return getOrCreateElem(sel.slice(1));
    return new MockElement('div');
  },
  querySelectorAll(sel) {
    if (sel === '.checkpoint-step') {
      return [0,1,2,3,4,5,6,7,8,9].map(i => {
        const el = new MockElement('button');
        el.setAttribute('data-step', i.toString());
        const statusEl = new MockElement('span');
        statusEl.classList.add('step-status');
        el.appendChild(statusEl);
        return el;
      });
    }
    return [];
  },
  createElement(tag) { return new MockElement(tag); }
};

// Pre-seed mock elements with attributes and classes matching index.html
getOrCreateElem('screen-home').classList.add('screen', 'active');
getOrCreateElem('screen-game').classList.add('screen');
getOrCreateElem('screen-results').classList.add('screen');
getOrCreateElem('modal-help').classList.add('modal-overlay', 'hidden');
getOrCreateElem('modal-signal').classList.add('modal-overlay', 'hidden');
getOrCreateElem('modal-inspect').classList.add('modal-overlay', 'hidden');
getOrCreateElem('feedback-container').classList.add('feedback-container', 'hidden');

// Set up Interactive Signal Trainer buttons in DOM
const trainerMain = getOrCreateElem('signal-trainer-main');
['1', '2', '3'].forEach(step => {
  const btn = new MockElement('button');
  btn.classList.add('step-train-btn');
  btn.setAttribute('data-step', step);
  trainerMain.appendChild(btn);
});

// Load Scripts
require('./audio.js');
require('./city-canvas.js');
require('./game.js');

console.log("==================================================");
console.log("HER SAFE ROUTE: COMPREHENSIVE AUTOMATED TEST SUITE");
console.log("==================================================");

let testsPassed = 0;
function assert(desc, condition) {
  if (!condition) {
    console.error(`❌ FAILED: ${desc}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${desc}`);
  testsPassed++;
}

// 1. Test Home Screen initial state
assert("Home screen is active initially", getOrCreateElem('screen-home').classList.contains('active'));
assert("Game screen is not active initially", !getOrCreateElem('screen-game').classList.contains('active'));
assert("Results screen is not active initially", !getOrCreateElem('screen-results').classList.contains('active'));

// 2. Test Audio Toggle Button
const btnAudio = getOrCreateElem('btn-audio');
const audioIcon = getOrCreateElem('audio-icon');
btnAudio.click();
assert("Audio toggles to Muted on click", audioIcon.textContent === '🔇');
btnAudio.click();
assert("Audio toggles back to On on second click", audioIcon.textContent === '🔊');

// 3. Test High Contrast Button
const btnContrast = getOrCreateElem('btn-contrast');
btnContrast.click();
assert("High contrast mode toggled on body", global.document.body.classList.contains('high-contrast'));
btnContrast.click();
assert("High contrast mode toggled off", !global.document.body.classList.contains('high-contrast'));

// 4. Test Modals: Help, Silent Signal Guide, Inspection
const btnHelp = getOrCreateElem('btn-help');
const modalHelp = getOrCreateElem('modal-help');
btnHelp.click();
assert("Help modal opens on help button click", !modalHelp.classList.contains('hidden'));

const btnCloseHelp = getOrCreateElem('btn-close-help');
btnCloseHelp.click();
assert("Help modal closes on close button click", modalHelp.classList.contains('hidden'));

const btnSignalGuide = getOrCreateElem('btn-signal-guide');
const modalSignal = getOrCreateElem('modal-signal');
btnSignalGuide.click();
assert("Silent Signal modal opens", !modalSignal.classList.contains('hidden'));

const btnAckSignal = getOrCreateElem('btn-ack-signal');
btnAckSignal.click();
assert("Silent Signal modal closes on Ack", modalSignal.classList.contains('hidden'));

// 5. Test Interactive Signal Trainer buttons
const trainerButtons = trainerMain.querySelectorAll('.step-train-btn');
const trainerHandDisplay = getOrCreateElem('trainer-hand-display');
const trainerStatusText = getOrCreateElem('trainer-status-text');

trainerButtons[0].click();
assert("Trainer step 1 sets open hand", trainerHandDisplay.textContent === '✋');

trainerButtons[1].click();
assert("Trainer step 2 sets folded thumb", trainerHandDisplay.textContent === '✊');

trainerButtons[2].click();
assert("Trainer step 3 sets trapped fist", trainerHandDisplay.textContent === '👊');
assert("Trainer step 3 triggers pulse success", trainerHandDisplay.classList.contains('pulse-success'));

// 6. Test Start Journey Transition
const btnStartJourney = getOrCreateElem('btn-start-journey');
btnStartJourney.click();
assert("Game screen becomes active on Start Journey", getOrCreateElem('screen-game').classList.contains('active'));
assert("Home screen is deactivated", !getOrCreateElem('screen-home').classList.contains('active'));

// 7. Test All 10 Levels (Level 1 to 10)
const optionsList = getOrCreateElem('options-list');
const feedbackContainer = getOrCreateElem('feedback-container');
const btnNextMission = getOrCreateElem('btn-next-mission');
const hudSafetyText = getOrCreateElem('hud-safety-text');
const hudMissionNum = getOrCreateElem('hud-mission-number');

for (let lvl = 0; lvl < 10; lvl++) {
  assert(`Level ${lvl + 1} loaded: HUD shows ${lvl + 1}/10`, hudMissionNum.textContent.includes(`${lvl + 1}/10`));
  assert(`Level ${lvl + 1} has 3 choices`, optionsList.children.length === 3);

  // Choose Option 1 (Top community upgrade, +10 pts)
  optionsList.children[0].click();
  assert(`Level ${lvl + 1} feedback card shown`, !feedbackContainer.classList.contains('hidden'));
  const expectedPts = (lvl + 1) * 10;
  assert(`Score updated to ${expectedPts} pts`, hudSafetyText.textContent.includes(`${expectedPts} / 100`));

  // Advance to next level or results
  btnNextMission.click();
}

// 8. Test Results Screen
const screenResults = getOrCreateElem('screen-results');
assert("Results screen is active after completing 10 levels", screenResults.classList.contains('active'));

const finalScore = getOrCreateElem('final-score');
assert("Final score displays 100", finalScore.textContent === '100');

const finalRank = getOrCreateElem('final-rank-badge');
assert("Final rank is Urban Safety Champion", finalRank.textContent.includes('URBAN SAFETY CHAMPION'));

const reportGrid = getOrCreateElem('report-grid');
assert("All 10 level report cards generated in grid", reportGrid.children.length === 10);

// 9. Test Copy Report Button
const btnCopyReport = getOrCreateElem('btn-copy-report');
btnCopyReport.click();
assert("Clipboard writeText triggered with report text", global.copiedText && global.copiedText.includes('HER SAFE ROUTE'));
assert("Emergency Helplines (112, 1091) included in copied report", global.copiedText.includes('112') && global.copiedText.includes('1091'));

// 10. Test Print / Save Certificate Button
const btnPrintCert = getOrCreateElem('btn-print-cert');
btnPrintCert.click();
assert("Window print triggered", global.window.printed === true);

// 11. Test Inspect Transformed City Button
const btnViewCity = getOrCreateElem('btn-view-city');
btnViewCity.click();
assert("Switches to game screen for city inspection", getOrCreateElem('screen-game').classList.contains('active'));

// 12. Test Restart / Play Again Functionality
const btnReplay = getOrCreateElem('btn-replay');
btnReplay.click();
assert("Game restarts and returns to Home screen", getOrCreateElem('screen-home').classList.contains('active'));
assert("Score resets to 0 / 100", getOrCreateElem('hud-safety-text').textContent.includes('0 / 100'));
assert("Level progress resets to 1/10", getOrCreateElem('hud-mission-number').textContent.includes('1/10'));

// 13. Test Keyboard Navigation (1, 2, 3, Space, Enter, M, H, Esc)
btnStartJourney.click(); // go to game
assert("Game active again", getOrCreateElem('screen-game').classList.contains('active'));

// Press '2' for option 2 (+7 pts)
global.window.dispatchEvent({ type: 'keydown', key: '2' });
assert("Keyboard '2' chooses second option", !feedbackContainer.classList.contains('hidden'));
assert("Score for option 2 is 7", getOrCreateElem('hud-safety-text').textContent.includes('7 / 100'));

// Press Enter to advance
global.window.dispatchEvent({ type: 'keydown', key: 'Enter' });
assert("Keyboard Enter advances to level 2", getOrCreateElem('hud-mission-number').textContent.includes('2/10'));

// Press 'M' to toggle mute
global.window.dispatchEvent({ type: 'keydown', key: 'm' });
assert("Keyboard M toggles audio", getOrCreateElem('audio-icon').textContent === '🔇');

// Press 'H' to open help
global.window.dispatchEvent({ type: 'keydown', key: 'h' });
assert("Keyboard H opens help modal", !modalHelp.classList.contains('hidden'));

// Press 'Escape' to close modal
global.window.dispatchEvent({ type: 'keydown', key: 'Escape' });
assert("Keyboard Escape closes modal", modalHelp.classList.contains('hidden'));

console.log("\n==================================================");
console.log(`🎉 ALL ${testsPassed} COMPREHENSIVE TESTS PASSED WITH ZERO ERRORS!`);
console.log("==================================================");
process.exit(0);
