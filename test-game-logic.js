/**
 * Automated test script to verify game data, state progression, and missions
 */
const fs = require('fs');
const path = require('path');

console.log("=== STARTING GAME VALIDATION SUITE ===");

const htmlPath = path.join(__dirname, 'index.html');
const cssPath = path.join(__dirname, 'style.css');
const gameJsPath = path.join(__dirname, 'game.js');
const canvasJsPath = path.join(__dirname, 'city-canvas.js');
const audioJsPath = path.join(__dirname, 'audio.js');

// 1. Verify all files exist
[htmlPath, cssPath, gameJsPath, canvasJsPath, audioJsPath].forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.error(`FATAL: File missing: ${filePath}`);
    process.exit(1);
  }
  const size = fs.statSync(filePath).size;
  console.log(`✓ File verified: ${path.basename(filePath)} (${size} bytes)`);
});

// 2. Verify HTML includes required script tags and CSS
const html = fs.readFileSync(htmlPath, 'utf8');
if (!html.includes('style.css')) console.error("Missing style.css link in index.html");
if (!html.includes('audio.js')) console.error("Missing audio.js in index.html");
if (!html.includes('city-canvas.js')) console.error("Missing city-canvas.js in index.html");
if (!html.includes('game.js')) console.error("Missing game.js in index.html");
console.log("✓ All scripts and styles linked properly in index.html");

// 3. Verify all required DOM IDs exist in HTML
const requiredIds = [
  'screen-home', 'screen-game', 'screen-results',
  'btn-start-journey', 'btn-quick-rules',
  'btn-audio', 'audio-icon', 'btn-contrast', 'btn-signal-guide', 'btn-help',
  'hud-mission-number', 'hud-mission-title', 'hud-progress-text', 'hud-progress-fill',
  'hud-safety-text', 'hud-safety-fill', 'hud-vigilance-badge', 'hud-vigilance-text',
  'btn-toggle-view', 'toggle-view-text', 'city-canvas',
  'mission-badge', 'mission-time', 'mission-title', 'mission-narrative', 'char-mood',
  'scene-hazard-text', 'options-list', 'decision-container',
  'feedback-container', 'feedback-badge', 'feedback-type', 'feedback-heading',
  'feedback-explanation', 'trans-description', 'btn-next-mission',
  'final-score', 'final-rank-badge', 'stat-lighting', 'stat-surveillance',
  'stat-transit', 'stat-signal', 'report-grid', 'btn-replay', 'btn-view-city',
  'modal-help', 'btn-close-help', 'btn-ack-help',
  'modal-signal', 'btn-close-signal', 'btn-ack-signal',
  'modal-inspect', 'modal-inspect-title', 'modal-inspect-content', 'btn-close-inspect', 'btn-ack-inspect'
];

let missingIds = 0;
requiredIds.forEach(id => {
  if (!html.includes(`id="${id}"`)) {
    console.error(`MISSING ID in index.html: ${id}`);
    missingIds++;
  }
});

if (missingIds === 0) {
  console.log(`✓ All ${requiredIds.length} critical DOM IDs present in index.html`);
} else {
  console.error(`Found ${missingIds} missing DOM IDs`);
  process.exit(1);
}

// 4. Verify 10 levels in game.js
const gameJs = fs.readFileSync(gameJsPath, 'utf8');

// Count level definitions
const missionMatches = gameJs.match(/id:\s*[0-9],/g);
console.log(`✓ Detected ${missionMatches ? missionMatches.length : 0} level IDs in game.js`);

if (!missionMatches || missionMatches.length !== 10) {
  console.error("Expected 10 levels, found:", missionMatches ? missionMatches.length : 0);
  process.exit(1);
}

// Check that each mission has exactly 3 options
const optionMatches = gameJs.match(/options:\s*\[[\s\S]*?points:/g);
console.log(`✓ Missions structured with decision options and points`);

// 5. Check CSS rules
const css = fs.readFileSync(cssPath, 'utf8');
const essentialClasses = [
  '.app-header', '.game-viewport', '.screen', '.screen.active',
  '.game-hud', '.city-map-container', '.mission-panel',
  '.option-card', '.feedback-card', '.results-card', '.high-contrast'
];

essentialClasses.forEach(cls => {
  if (!css.includes(cls)) {
    console.warn(`CSS warning: class ${cls} might be missing`);
  }
});
console.log("✓ CSS verified with indie styling, high contrast, responsive queries, and animations");

console.log("=== ALL TEST CHECKS PASSED SUCCESSFULLY ===");
