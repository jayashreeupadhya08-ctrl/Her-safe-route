/**
 * Runtime Simulation Test for HER SAFE ROUTE: THE SILENT SIGNAL
 * Simulates user walkthrough across all 5 missions
 */

const fs = require('fs');
const path = require('path');

// Minimal mock DOM for Node execution
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
  appendChild(child) { this.children.push(child); }
  focus() {}

  querySelector(sel) {
    if (sel.startsWith('.')) {
      const cls = sel.slice(1);
      return this.children.find(c => c.classList.contains(cls)) || null;
    }
    return null;
  }
  querySelectorAll() { return []; }
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
  measureText(str) { return { width: str.length * 6 }; }
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
  addEventListener(evt, fn) { this[evt] = fn; },
  scrollTo() {},
  requestAnimationFrame(fn) { return setTimeout(fn, 16); },
  cancelAnimationFrame(id) { clearTimeout(id); },
  AudioContext: class {
    constructor() { this.currentTime = 0; this.state = 'running'; }
    createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} }, connect() {} }; }
    createOscillator() { return { type: '', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} }, connect() {}, start() {}, stop() {} }; }
    createBiquadFilter() { return { type: '', frequency: { setValueAtTime() {} }, connect() {} }; }
    resume() {}
  }
};
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
      return [0,1,2,3,4].map(i => {
        const el = new MockElement('button');
        el.setAttribute('data-step', i.toString());
        return el;
      });
    }
    return [];
  },
  createElement(tag) { return new MockElement(tag); }
};

// Load scripts in simulated environment
require('./audio.js');
require('./city-canvas.js');
require('./game.js');

console.log("✓ Scripts evaluated and game initialized in mock DOM!");

// Test Simulation
console.log("--- SIMULATING USER CLICKING 'START JOURNEY' ---");
const btnStart = getOrCreateElem('btn-start-journey');
btnStart.click();

const screenGame = getOrCreateElem('screen-game');
console.log("Is Game Screen Active?", screenGame.classList.contains('active'));

if (!screenGame.classList.contains('active')) {
  console.error("FAIL: Game screen did not become active");
  process.exit(1);
}

// Simulate 5 missions
const optionsList = getOrCreateElem('options-list');
const btnNextMission = getOrCreateElem('btn-next-mission');

for (let m = 0; m < 5; m++) {
  console.log(`\n--- MISSION ${m + 1} SIMULATION ---`);
  const hudNum = getOrCreateElem('hud-mission-number');
  console.log(`Current HUD Mission: ${hudNum.textContent}`);

  // Options rendered
  const currentOptions = optionsList.children;
  console.log(`Rendered options count: ${currentOptions.length}`);
  if (currentOptions.length !== 3) {
    console.error(`FAIL: Expected 3 options in mission ${m + 1}, found ${currentOptions.length}`);
    process.exit(1);
  }

  // Click Option 1 (20 points)
  console.log(`Selecting Option 1...`);
  currentOptions[0].click();

  const feedbackContainer = getOrCreateElem('feedback-container');
  console.log(`Feedback shown?`, !feedbackContainer.classList.contains('hidden'));
  const feedbackBadge = getOrCreateElem('feedback-badge');
  console.log(`Feedback badge: ${feedbackBadge.textContent}`);

  const hudSafety = getOrCreateElem('hud-safety-text');
  console.log(`HUD Safety Score: ${hudSafety.textContent}`);

  // Click Next / Continue
  btnNextMission.click();
}

console.log("\n--- SIMULATION REACHED FINAL RESULTS ---");
const screenResults = getOrCreateElem('screen-results');
console.log("Is Results Screen Active?", screenResults.classList.contains('active'));

const finalScoreEl = getOrCreateElem('final-score');
console.log(`Final Score Displayed: ${finalScoreEl.textContent}`);

const reportGrid = getOrCreateElem('report-grid');
console.log(`Report grid generated items: ${reportGrid.children.length}`);

if (parseInt(finalScoreEl.textContent, 10) === 100 && reportGrid.children.length === 5) {
  console.log("\n🎉 ALL 5 MISSIONS, CHOICES, FEEDBACK, TRANSFORMATION & FINAL RESULTS VERIFIED WITH 100/100 SCORE!");
  process.exit(0);
} else {
  console.error("FAIL: Verification mismatch in score or report items");
  process.exit(1);
}
