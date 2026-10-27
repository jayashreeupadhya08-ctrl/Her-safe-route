// HER SAFE ROUTE: THE SILENT SIGNAL
// Main Application Controller & UI Renderer
// Developed for Girls Who Code HHS Hackathon 2026

document.addEventListener('DOMContentLoaded', () => {
  // Try loading saved state
  gameEngine.loadState();
  
  // Initialize UI
  App.init();
});

const App = {
  selectedCluesForDeduction: new Set(),
  activeMapDrawerLocId: null,
  sosCountdownTimer: null,
  sosRemainingSeconds: 3,
  isSirenActive: false,
  covertTapCount: 0,
  covertTapTimer: null,
  navOrigin: 'univ_campus',
  navDest: 'community_center',
  navMode: 'safest',
  hazardFilterDistrict: 'all',
  hazardFilterCat: 'all',

  init() {
    this.bindEvents();
    this.applySettings();
    this.updateTitleScreenButtons();
    this.renderTopBar();

    // Check if player was already playing a mission
    if (gameEngine.state.screen && gameEngine.state.screen !== 'title') {
      this.switchScreen(gameEngine.state.screen);
    } else {
      this.switchScreen('title');
    }
  },

  bindEvents() {
    // Title screen buttons
    document.getElementById('btn-start-game')?.addEventListener('click', () => {
      soundEngine.playClick();
      gameEngine.state.screen = 'game';
      gameEngine.state.activeTab = 'map';
      gameEngine.saveState();
      this.switchScreen('game');
      this.showToast(`Welcome to Aurelia City, Investigator Nova. Mission 1 is active.`, 'info');
    });

    document.getElementById('btn-continue-game')?.addEventListener('click', () => {
      soundEngine.playClick();
      gameEngine.state.screen = 'game';
      this.switchScreen('game');
      this.showToast(`Resuming investigation: ${gameEngine.getCurrentMission().title}`, 'info');
    });

    document.getElementById('btn-how-to-play')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.openModal('modal-tutorial');
    });

    document.getElementById('btn-settings-title')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.openModal('modal-settings');
    });

    document.getElementById('btn-live-demo')?.addEventListener('click', () => {
      soundEngine.playClick();
      DemoTour.start();
    });

    document.getElementById('btn-demo-top')?.addEventListener('click', () => {
      soundEngine.playClick();
      DemoTour.start();
    });

    document.getElementById('btn-demo-prev')?.addEventListener('click', () => {
      soundEngine.playClick();
      DemoTour.prev();
    });

    document.getElementById('btn-demo-next')?.addEventListener('click', () => {
      soundEngine.playClick();
      DemoTour.next();
    });

    document.getElementById('btn-demo-auto-exec')?.addEventListener('click', () => {
      soundEngine.playClick();
      DemoTour.autoExecuteCurrentStep();
    });

    document.getElementById('btn-sdg-title')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.openModal('modal-sdg');
    });

    // Top bar buttons
    document.getElementById('btn-settings-top')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.openModal('modal-settings');
    });

    document.getElementById('btn-audio-toggle')?.addEventListener('click', () => {
      this.toggleAudio();
    });

    document.getElementById('btn-reset-top')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.openModal('modal-reset-confirm');
    });

    // Left Navigation Tabs
    const navButtons = document.querySelectorAll('.sidebar-nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        soundEngine.playClick();
        const tab = btn.dataset.tab;
        if (tab) {
          this.switchTab(tab);
        }
      });
    });

    // Settings inputs
    document.getElementById('setting-sound')?.addEventListener('change', (e) => {
      gameEngine.state.settings.sound = e.target.checked;
      soundEngine.toggleSound(e.target.checked);
      gameEngine.saveState();
      this.updateAudioButtonState();
    });

    document.getElementById('setting-volume')?.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      gameEngine.state.settings.volume = vol;
      soundEngine.setVolume(vol);
      gameEngine.saveState();
    });

    document.getElementById('setting-motion')?.addEventListener('change', (e) => {
      gameEngine.state.settings.reducedMotion = e.target.checked;
      gameEngine.saveState();
      this.applySettings();
    });

    document.getElementById('setting-contrast')?.addEventListener('change', (e) => {
      gameEngine.state.settings.highContrast = e.target.checked;
      gameEngine.saveState();
      this.applySettings();
    });

    document.getElementById('setting-text-size')?.addEventListener('change', (e) => {
      gameEngine.state.settings.textSize = e.target.value;
      gameEngine.saveState();
      this.applySettings();
    });

    // Modal Close buttons
    document.querySelectorAll('.modal-close, .modal-backdrop').forEach(elem => {
      elem.addEventListener('click', (e) => {
        soundEngine.playClick();
        const modal = elem.closest('.modal-container');
        if (modal) modal.classList.add('hidden');
      });
    });

    // Confirm Reset
    document.getElementById('btn-confirm-reset')?.addEventListener('click', () => {
      soundEngine.playClick();
      gameEngine.resetProgress();
      this.closeAllModals();
      this.switchScreen('title');
      this.updateTitleScreenButtons();
      this.showToast('Investigation logs and city progress reset.', 'info');
    });

    // Shortcut button in clue modal: View on Evidence Board
    document.getElementById('btn-clue-to-evidence')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.closeModal('modal-clue-detail');
      this.switchTab('evidence');
    });

    // Real-Time SOS Emergency Button & Modal Controls
    document.getElementById('btn-top-sos')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.openSOSModal();
    });

    document.getElementById('btn-sos-abort')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.abortSOSCountdown();
    });

    document.getElementById('btn-sos-siren-toggle')?.addEventListener('click', () => {
      this.toggleSOSSiren();
    });

    document.getElementById('btn-sos-covert-toggle')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.toggleCovertStealth(true);
    });

    document.getElementById('btn-covert-exit')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.toggleCovertStealth(false);
    });

    document.getElementById('covert-tap-zone')?.addEventListener('click', () => {
      this.handleCovertTap();
    });

    document.getElementById('btn-sos-cancel-active')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.cancelActiveSOS();
    });

    // Crowdsourced Hazard Report Submit
    document.getElementById('btn-submit-hazard-report')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.submitHazardReport();
    });

    // Global Keyboard Navigation (Esc & Hotkeys)
    window.addEventListener('keydown', (e) => {
      // Don't trigger hotkeys if user is in an input or modal is open
      const hasOpenModal = document.querySelector('.modal-container:not(.hidden)');
      if (e.key === 'Escape') {
        this.closeAllModals();
        this.closeMapDrawer();
        return;
      }

      if (hasOpenModal || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'm') this.switchTab('map');
      if (key === 'i') this.switchTab('inspect');
      if (key === 'r') this.switchTab('routes');
      if (key === 'e') this.switchTab('evidence');
      if (key === 'u') this.switchTab('upgrades');
      if (key === 'n') this.switchTab('navigator');
      if (key === 'h') this.switchTab('hazards');
      if (key === 'j') this.switchTab('journal');
      if (key === 'g') this.switchTab('sdg');
    });
  },

  updateTitleScreenButtons() {
    const continueBtn = document.getElementById('btn-continue-game');
    if (continueBtn) {
      if (gameEngine.hasSavedGame()) {
        continueBtn.disabled = false;
        continueBtn.classList.remove('btn-disabled');
      } else {
        continueBtn.disabled = true;
        continueBtn.classList.add('btn-disabled');
      }
    }
  },

  toggleAudio() {
    const current = gameEngine.state.settings.sound;
    const newState = !current;
    gameEngine.state.settings.sound = newState;
    soundEngine.toggleSound(newState);
    if (newState) soundEngine.playClick();
    gameEngine.saveState();
    this.updateAudioButtonState();
    this.showToast(newState ? 'Audio enabled' : 'Audio muted', 'info');
  },

  updateAudioButtonState() {
    const audioBtn = document.getElementById('btn-audio-toggle');
    const soundCheckbox = document.getElementById('setting-sound');
    if (audioBtn) {
      const isSound = gameEngine.state.settings.sound;
      audioBtn.innerHTML = isSound 
        ? `<span class="icon">🔊</span><span class="sr-only">Sound On</span>` 
        : `<span class="icon">🔇</span><span class="sr-only">Sound Off</span>`;
      audioBtn.setAttribute('aria-pressed', isSound);
    }
    if (soundCheckbox) {
      soundCheckbox.checked = gameEngine.state.settings.sound;
    }
  },

  applySettings() {
    const root = document.documentElement;
    const settings = gameEngine.state.settings;

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Text size
    root.classList.remove('text-large', 'text-xlarge');
    if (settings.textSize === 'large') root.classList.add('text-large');
    if (settings.textSize === 'xlarge') root.classList.add('text-xlarge');

    // Sync input controls
    const soundBox = document.getElementById('setting-sound');
    const volumeSlider = document.getElementById('setting-volume');
    const motionBox = document.getElementById('setting-motion');
    const contrastBox = document.getElementById('setting-contrast');
    const textSizeSelect = document.getElementById('setting-text-size');

    if (soundBox) soundBox.checked = settings.sound;
    if (volumeSlider) volumeSlider.value = settings.volume;
    if (motionBox) motionBox.checked = settings.reducedMotion;
    if (contrastBox) contrastBox.checked = settings.highContrast;
    if (textSizeSelect) textSizeSelect.value = settings.textSize;

    this.updateAudioButtonState();
  },

  switchScreen(screenName) {
    gameEngine.state.screen = screenName;
    const titleView = document.getElementById('view-title-screen');
    const gameView = document.getElementById('view-main-game');
    const endingView = document.getElementById('view-campaign-ending');

    if (titleView) titleView.classList.add('hidden');
    if (gameView) gameView.classList.add('hidden');
    if (endingView) endingView.classList.add('hidden');

    if (screenName === 'title') {
      if (titleView) titleView.classList.remove('hidden');
      this.updateTitleScreenButtons();
    } else if (screenName === 'game') {
      if (gameView) gameView.classList.remove('hidden');
      this.renderTopBar();
      this.switchTab(gameEngine.state.activeTab || 'map');
    } else if (screenName === 'ending') {
      if (endingView) endingView.classList.remove('hidden');
      this.renderCampaignEnding();
    }
  },

  switchTab(tabId) {
    gameEngine.state.activeTab = tabId;
    gameEngine.saveState();

    // Update left sidebar active states
    document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // Update central panels
    document.querySelectorAll('.workspace-tab-panel').forEach(panel => {
      if (panel.id === `tab-${tabId}`) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });

    // Render corresponding view
    switch (tabId) {
      case 'map':
        this.renderCityMap();
        break;
      case 'inspect':
        this.renderLocationInspection(gameEngine.state.selectedLocationId);
        break;
      case 'routes':
        this.renderRoutePlanner();
        break;
      case 'evidence':
        this.renderEvidenceBoard();
        break;
      case 'upgrades':
        this.renderUpgradesStore();
        break;
      case 'navigator':
        this.renderLiveNavigator();
        break;
      case 'hazards':
        this.renderHazardReports();
        break;
      case 'journal':
        this.renderMissionJournal();
        break;
      case 'sdg':
        this.renderSDGTab();
        break;
    }

    this.renderRightPanel();
    this.renderTopBar();
  },

  renderTopBar() {
    const mission = gameEngine.getCurrentMission();
    const rank = gameEngine.getInvestigatorRank();
    const totalScore = gameEngine.getTotalScore();

    // Mission badge
    const missionElem = document.getElementById('topbar-mission-name');
    if (missionElem) {
      missionElem.textContent = `M${mission.number}: ${mission.title}`;
    }

    // Rank
    const rankElem = document.getElementById('topbar-rank-badge');
    if (rankElem) {
      rankElem.textContent = rank.title;
    }

    // Budget
    const budgetElem = document.getElementById('topbar-budget-amount');
    if (budgetElem) {
      budgetElem.textContent = `${gameEngine.state.budget} CR`;
    }

    // Impact Score
    const scoreElem = document.getElementById('topbar-score-badge');
    if (scoreElem) {
      scoreElem.textContent = `${totalScore} PTS`;
    }
  },

  // ==========================================
  // 1. ADVANCED CITY MAP RENDERER (SVG + Tracers)
  // ==========================================
  renderCityMap() {
    const mapContainer = document.getElementById('city-map-canvas');
    if (!mapContainer) return;

    const mission = gameEngine.getCurrentMission();
    const isLit = gameEngine.state.cityRemembers.streetlightsRepaired;
    const isCrossingUniversal = gameEngine.state.cityRemembers.crossingImproved;
    const isRealtimeTransit = gameEngine.state.cityRemembers.busInfoUpdated;
    const isAccessibleBus = gameEngine.state.cityRemembers.busAccessibilityImproved;
    const isHelpPoint = gameEngine.state.cityRemembers.communityHelpPointActive;
    const isComplaintReformed = gameEngine.state.cityRemembers.complaintPortalReformed;

    // Build Rich SVG map
    let svgHtml = `
      <svg class="aurelia-city-svg" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Interactive Map of Aurelia City">
        <defs>
          <radialGradient id="lamp-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#43D9E8" stop-opacity="0.45"/>
            <stop offset="45%" stop-color="#8B7CFF" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#080C16" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="river-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0b2b48"/>
            <stop offset="50%" stop-color="#0f3d66"/>
            <stop offset="100%" stop-color="#092138"/>
          </linearGradient>
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Base Background Map Canvas -->
        <rect width="900" height="600" fill="#080C16" />
        
        <!-- District Zoning Grids (Faint architectural outlines) -->
        <g opacity="0.32">
          <!-- Academic District -->
          <rect x="50" y="40" width="370" height="180" fill="#141E34" rx="8" stroke="#223354" stroke-width="1.5" stroke-dasharray="4,4" />
          <!-- Transit Eastern Gateway -->
          <rect x="440" y="40" width="410" height="190" fill="#12243d" rx="8" stroke="#223354" stroke-width="1.5" stroke-dasharray="4,4" />
          <!-- West End & Park -->
          <rect x="50" y="240" width="330" height="320" fill="#11222e" rx="8" stroke="#223354" stroke-width="1.5" stroke-dasharray="4,4" />
          <!-- Civic Core & Healthcare -->
          <rect x="400" y="250" width="450" height="310" fill="#162238" rx="8" stroke="#223354" stroke-width="1.5" stroke-dasharray="4,4" />
        </g>

        <!-- Solaria Green Park Landscaping -->
        <path d="M 230 250 C 270 240, 340 250, 360 290 C 370 330, 320 350, 270 340 C 230 330, 210 270, 230 250 Z" fill="#0d2826" opacity="0.6" stroke="#164e43" stroke-width="2" />
        <circle cx="270" cy="275" r="14" fill="#134337" opacity="0.7" />
        <circle cx="310" cy="290" r="18" fill="#134337" opacity="0.7" />
        <circle cx="280" cy="315" r="15" fill="#134337" opacity="0.7" />

        <!-- Sinuous Aurelia River Path -->
        <path d="M 720 0 Q 660 170 520 250 T 360 410 T 260 600" fill="none" stroke="url(#river-gradient)" stroke-width="54" stroke-linecap="round" />
        <!-- River Water Glow / Current Shimmer -->
        <path d="M 720 0 Q 660 170 520 250 T 360 410 T 260 600" fill="none" stroke="#43D9E8" stroke-width="3" stroke-dasharray="14,28" opacity="0.4" class="street-pulse-line" />

        <!-- River Bridges (Architectural Spans) -->
        <!-- North Transit Bridge (North Crossing to Transit Link) -->
        <rect x="500" y="200" width="36" height="12" fill="#2d3f63" stroke="#8B7CFF" stroke-width="1.5" rx="2" transform="rotate(-30 518 206)" />
        <!-- Crescent Bridge (Civic Way to Hospital) -->
        <rect x="525" y="325" width="40" height="14" fill="#2d3f63" stroke="#8B7CFF" stroke-width="1.5" rx="2" transform="rotate(35 545 332)" />

        <!-- District Title Labels -->
        <text x="130" y="75" class="map-district-label">ACADEMIC & NORTH ARTERIAL</text>
        <text x="590" y="75" class="map-district-label">EAST GATEWAY MULTIMODAL HUB</text>
        <text x="110" y="535" class="map-district-label">WEST END RESIDENTIAL & GREENS</text>
        <text x="600" y="535" class="map-district-label">CIVIC CORE & HEALTHCARE CENTER</text>

        <!-- Upgraded Light Cones if Streetlights Repaired -->
        ${isLit ? `
          <g class="upgraded-lighting-layer">
            <circle cx="270" cy="135" r="105" fill="url(#lamp-glow)" />
            <circle cx="440" cy="160" r="105" fill="url(#lamp-glow)" />
            <circle cx="550" cy="355" r="110" fill="url(#lamp-glow)" />
            <circle cx="685" cy="360" r="110" fill="url(#lamp-glow)" />
            <!-- Little Pedestrian Lamp Posts on Map -->
            <circle cx="270" cy="135" r="4" fill="#FFFFFF" filter="url(#neon-glow)" />
            <circle cx="440" cy="160" r="4" fill="#FFFFFF" filter="url(#neon-glow)" />
            <circle cx="550" cy="355" r="4" fill="#FFFFFF" filter="url(#neon-glow)" />
            <circle cx="685" cy="360" r="4" fill="#FFFFFF" filter="url(#neon-glow)" />
          </g>
        ` : ''}

        <!-- Streets / Road Network -->
        ${GAME_DATA.streets.map(st => {
          const fromLoc = GAME_DATA.locations.find(l => l.id === st.from);
          const toLoc = GAME_DATA.locations.find(l => l.id === st.to);
          if (!fromLoc || !toLoc) return '';
          
          let strokeColor = isLit ? "#5eead4" : "#2d3e63";
          let strokeWidth = st.type === 'arterial' ? 6 : 4;
          let dash = st.type === 'walkway' ? "6,4" : "none";

          return `
            <g class="map-street-segment" data-street-name="${st.name}" data-street-type="${st.type}" tabindex="0" role="button" aria-label="Street: ${st.name}">
              <!-- Base Road Bed -->
              <line x1="${fromLoc.x}" y1="${fromLoc.y}" x2="${toLoc.x}" y2="${toLoc.y}" 
                    stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-dasharray="${dash}" 
                    stroke-linecap="round" opacity="0.8" />
              <!-- Subtle pulsing animated pedestrian/traffic tracer -->
              <line x1="${fromLoc.x}" y1="${fromLoc.y}" x2="${toLoc.x}" y2="${toLoc.y}" 
                    stroke="#8B7CFF" stroke-width="2" stroke-dasharray="10,30" 
                    class="street-pulse-line" opacity="0.9" />
            </g>
          `;
        }).join('')}

        <!-- Upgraded Crossings Visual Details (High-contrast Universal Zebras) -->
        ${isCrossingUniversal ? `
          <!-- North Crossing Universal Raised Crosswalk -->
          <g transform="translate(342, 138)" filter="url(#neon-glow)">
            <rect x="0" y="0" width="36" height="24" fill="#4ADE80" opacity="0.9" rx="3" />
            <line x1="6" y1="3" x2="6" y2="21" stroke="#090D18" stroke-width="3" />
            <line x1="14" y1="3" x2="14" y2="21" stroke="#090D18" stroke-width="3" />
            <line x1="22" y1="3" x2="22" y2="21" stroke="#090D18" stroke-width="3" />
            <line x1="30" y1="3" x2="30" y2="21" stroke="#090D18" stroke-width="3" />
            <!-- Flashing Pedestrian Beacon Symbol -->
            <circle cx="38" cy="12" r="5" fill="#4ADE80" class="mission-target-pulse" />
          </g>
          <!-- Grand Crossing Universal Multi-Lane Signal -->
          <g transform="translate(602, 378)" filter="url(#neon-glow)">
            <rect x="0" y="0" width="40" height="26" fill="#4ADE80" opacity="0.9" rx="3" />
            <line x1="7" y1="3" x2="7" y2="23" stroke="#090D18" stroke-width="3.5" />
            <line x1="16" y1="3" x2="16" y2="23" stroke="#090D18" stroke-width="3.5" />
            <line x1="25" y1="3" x2="25" y2="23" stroke="#090D18" stroke-width="3.5" />
            <line x1="34" y1="3" x2="34" y2="23" stroke="#090D18" stroke-width="3.5" />
            <!-- Flashing Pedestrian Beacon Symbol -->
            <circle cx="-6" cy="13" r="5" fill="#4ADE80" class="mission-target-pulse" />
          </g>
        ` : ''}

        <!-- Upgraded Real-time Digital Transit Display Badge -->
        ${isRealtimeTransit ? `
          <g transform="translate(545, 155)">
            <rect x="0" y="0" width="70" height="20" fill="#151F33" stroke="#43D9E8" stroke-width="1.5" rx="4" />
            <circle cx="10" cy="10" r="3.5" fill="#4ADE80" class="mission-target-pulse" />
            <text x="20" y="14" fill="#43D9E8" font-size="8.5" font-weight="700">BUS 14 • 2m</text>
          </g>
        ` : ''}

        <!-- Upgraded Community Help Point Beacon -->
        ${isHelpPoint ? `
          <g transform="translate(160, 325)">
            <circle cx="0" cy="0" r="16" fill="rgba(139,124,255,0.2)" stroke="#8B7CFF" stroke-width="2" class="mission-target-pulse" />
            <text x="0" y="4" text-anchor="middle" font-size="12">🛡️</text>
          </g>
        ` : ''}

        <!-- Interactive Location Nodes -->
        ${GAME_DATA.locations.map(loc => {
          const isTarget = mission.targetLocations.includes(loc.id);
          const isSelected = gameEngine.state.selectedLocationId === loc.id;
          const nodeColor = isTarget ? "#8B7CFF" : "#43D9E8";

          // Check if witness is waiting here
          let hasWitness = false;
          let witnessName = "";
          if (mission.id === 'mission_1' && loc.id === 'univ_campus') {
            hasWitness = true; witnessName = "Maya";
          } else if (mission.id === 'mission_2' && (loc.id === 'public_services' || loc.id === 'community_center')) {
            hasWitness = true; witnessName = "Aria & Leena";
          } else if (mission.id === 'mission_3' && (loc.id === 'grand_crossing' || loc.id === 'residential_quarter')) {
            hasWitness = true; witnessName = "Elena & Marcus";
          }

          // Uncollected clues at this location
          const locClues = mission.clues.filter(c => c.location === loc.id);
          const uncollectedCount = locClues.filter(c => !gameEngine.isClueDiscovered(c.id)).length;

          return `
            <g class="map-node-group ${isSelected ? 'selected' : ''}" data-loc-id="${loc.id}" transform="translate(${loc.x}, ${loc.y})" tabindex="0" role="button" aria-label="${loc.name}">
              ${isTarget ? `
                <!-- Animated Mission Target Pulsing Ring -->
                <circle cx="0" cy="0" r="28" class="mission-target-pulse" stroke="#F472B6" stroke-width="2" fill="none" opacity="0.85" />
              ` : ''}
              
              <!-- Outer halo node -->
              <circle cx="0" cy="0" r="19" fill="#151F33" stroke="${nodeColor}" stroke-width="${isSelected ? 3.5 : 2}" class="node-circle" />
              
              <!-- Inner icon symbol -->
              <circle cx="0" cy="0" r="7.5" fill="${isTarget ? '#F472B6' : '#43D9E8'}" />
              
              <!-- Witness Badge Callout on Map Node if present -->
              ${hasWitness ? `
                <g transform="translate(14, -14)">
                  <rect x="-4" y="-12" width="62" height="16" fill="#F472B6" rx="4" />
                  <text x="27" y="-1" fill="#090D18" font-size="8.5" font-weight="800" text-anchor="middle">🗣️ ${witnessName.split(' ')[0]}</text>
                </g>
              ` : ''}

              <!-- Clue Counter Badge if uncollected clues exist -->
              ${uncollectedCount > 0 ? `
                <g transform="translate(-16, -16)">
                  <circle cx="0" cy="0" r="7.5" fill="#FBBF24" />
                  <text x="0" y="3" fill="#090D18" font-size="8.5" font-weight="900" text-anchor="middle">${uncollectedCount}</text>
                </g>
              ` : ''}

              <!-- Location Name Tag -->
              <text x="0" y="33" text-anchor="middle" class="map-node-label">${loc.name}</text>
              <text x="0" y="45" text-anchor="middle" class="map-node-district">${loc.district}</text>
            </g>
          `;
        }).join('')}
      </svg>

      <!-- Interactive Map Popover Drawer (In-Map Intel) -->
      <div id="map-drawer" class="map-interactive-drawer hidden" role="region" aria-label="Location Dossier">
        <div class="drawer-header">
          <div>
            <span id="drawer-district-tag" class="badge badge-accent">District</span>
            <h3 id="drawer-title" class="drawer-title">Location Name</h3>
          </div>
          <button id="btn-close-drawer" class="drawer-close" aria-label="Close dossier">✕</button>
        </div>
        <p id="drawer-desc" class="drawer-desc"></p>
        <div id="drawer-status-line" class="text-xs"></div>
        <div class="drawer-actions">
          <button id="btn-drawer-inspect" class="btn btn-primary btn-sm">
            🔍 Enter & Inspect Scene
          </button>
          <button id="btn-drawer-route" class="btn btn-secondary btn-sm">
            🚶 Route Corridor
          </button>
        </div>
      </div>
    `;

    mapContainer.innerHTML = svgHtml;

    // Attach click listeners to map location nodes
    mapContainer.querySelectorAll('.map-node-group').forEach(node => {
      node.addEventListener('click', () => {
        soundEngine.playClick();
        const locId = node.dataset.locId;
        this.selectLocation(locId);
        this.openMapDrawer(locId);
      });
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          soundEngine.playClick();
          const locId = node.dataset.locId;
          this.selectLocation(locId);
          this.openMapDrawer(locId);
        }
      });
    });

    // Attach click listeners to street segments for intelligence
    mapContainer.querySelectorAll('.map-street-segment').forEach(st => {
      st.addEventListener('click', () => {
        soundEngine.playClick();
        const streetName = st.dataset.streetName;
        const streetType = st.dataset.streetType;
        const isLitStr = gameEngine.state.cityRemembers.streetlightsRepaired ? "100% High-Visibility LED" : "Dim / Dark Corridors";
        const isCrossStr = gameEngine.state.cityRemembers.crossingImproved ? "Universal Raised Tactile Crossings" : "Faded Crosswalks";
        this.showToast(`Corridor: ${streetName} (${streetType}). Lighting: ${isLitStr}. Crossings: ${isCrossStr}.`, 'info');
      });
    });

    // Drawer button events
    document.getElementById('btn-close-drawer')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.closeMapDrawer();
    });

    document.getElementById('btn-drawer-inspect')?.addEventListener('click', () => {
      soundEngine.playClick();
      if (this.activeMapDrawerLocId) {
        gameEngine.state.selectedLocationId = this.activeMapDrawerLocId;
      }
      this.switchTab('inspect');
    });

    document.getElementById('btn-drawer-route')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.switchTab('routes');
    });

    // Render upgrade badges bar on map
    this.renderMapUpgradeStatus();
  },

  openMapDrawer(locId) {
    this.activeMapDrawerLocId = locId;
    const drawer = document.getElementById('map-drawer');
    if (!drawer) return;

    const loc = GAME_DATA.locations.find(l => l.id === locId) || GAME_DATA.locations[0];
    const mission = gameEngine.getCurrentMission();
    const isTarget = mission.targetLocations.includes(loc.id);

    document.getElementById('drawer-district-tag').textContent = loc.district;
    document.getElementById('drawer-district-tag').className = `badge ${isTarget ? 'badge-highlight' : 'badge-dim'}`;
    document.getElementById('drawer-title').textContent = loc.name;
    document.getElementById('drawer-desc').textContent = loc.description;

    // Build status details
    const locClues = mission.clues.filter(c => c.location === loc.id);
    const discoveredCount = locClues.filter(c => gameEngine.isClueDiscovered(c.id)).length;
    
    let witnessHtml = "";
    if (mission.id === 'mission_1' && loc.id === 'univ_campus') {
      witnessHtml = `<span class="badge badge-highlight">🗣️ Maya is waiting for interview</span>`;
    } else if (mission.id === 'mission_2' && (loc.id === 'public_services' || loc.id === 'community_center')) {
      witnessHtml = `<span class="badge badge-highlight">🗣️ Aria & Leena present for statement</span>`;
    } else if (mission.id === 'mission_3' && (loc.id === 'grand_crossing' || loc.id === 'residential_quarter')) {
      witnessHtml = `<span class="badge badge-highlight">🗣️ Elena & Marcus present for consultation</span>`;
    }

    document.getElementById('drawer-status-line').innerHTML = `
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:4px;">
        <span class="badge ${discoveredCount === locClues.length && locClues.length > 0 ? 'badge-success' : 'badge-warning'}">
          🔍 Field Evidence: ${discoveredCount} / ${locClues.length} Collected
        </span>
        ${witnessHtml}
      </div>
    `;

    drawer.classList.remove('hidden');
  },

  closeMapDrawer() {
    const drawer = document.getElementById('map-drawer');
    if (drawer) drawer.classList.add('hidden');
    this.activeMapDrawerLocId = null;
  },

  renderMapUpgradeStatus() {
    const statusElem = document.getElementById('map-live-status-bar');
    if (!statusElem) return;

    const r = gameEngine.state.cityRemembers;
    const badges = [];

    if (r.streetlightsRepaired) {
      badges.push(`<span class="badge badge-success">💡 Smart Streetlights Active</span>`);
    } else {
      badges.push(`<span class="badge badge-dim">💡 Streetlights: Dark Corridors</span>`);
    }

    if (r.crossingImproved) {
      badges.push(`<span class="badge badge-success">🚸 Universal Crossings Active</span>`);
    } else {
      badges.push(`<span class="badge badge-dim">🚸 Crossings: Faded & Silent</span>`);
    }

    if (r.busInfoUpdated) {
      badges.push(`<span class="badge badge-success">⏱️ Real-time Transit Displays Active</span>`);
    } else {
      badges.push(`<span class="badge badge-dim">⏱️ Transit: Ghost Schedules</span>`);
    }

    if (r.communityHelpPointActive) {
      badges.push(`<span class="badge badge-accent">🛡️ Community Help Hub Staffed</span>`);
    }

    if (r.complaintPortalReformed) {
      badges.push(`<span class="badge badge-accent">📋 Transparent Intake Portal Online</span>`);
    }

    statusElem.innerHTML = badges.join('');
  },

  selectLocation(locId) {
    gameEngine.state.selectedLocationId = locId;
    gameEngine.saveState();
    
    // Highlight node on map
    document.querySelectorAll('.map-node-group').forEach(n => {
      if (n.dataset.locId === locId) {
        n.classList.add('selected');
      } else {
        n.classList.remove('selected');
      }
    });

    this.renderRightPanel();
  },

  // ==========================================
  // 2. LOCATION INSPECTION & INVESTIGATION
  // ==========================================
  renderLocationInspection(locId) {
    const container = document.getElementById('inspect-view-content');
    if (!container) return;

    const loc = GAME_DATA.locations.find(l => l.id === locId) || GAME_DATA.locations[0];
    const mission = gameEngine.getCurrentMission();
    const isTarget = mission.targetLocations.includes(loc.id);

    // Clues available at this location for the active mission
    const availableClues = mission.clues.filter(c => c.location === loc.id);

    // Dialogue accessibility: Maya (Univ), Aria/Leena (Public Services or Community Center), Elena/Marcus (Grand Crossing or Residential)
    const hasDialogue = (mission.id === 'mission_1' && loc.id === 'univ_campus') ||
                        (mission.id === 'mission_2' && (loc.id === 'public_services' || loc.id === 'community_center')) ||
                        (mission.id === 'mission_3' && (loc.id === 'grand_crossing' || loc.id === 'residential_quarter'));

    let html = `
      <div class="inspect-header-banner">
        <div>
          <span class="badge ${isTarget ? 'badge-accent' : 'badge-dim'}">${loc.district}</span>
          <h2 class="inspect-title">${loc.name}</h2>
          <p class="inspect-desc">${loc.description}</p>
        </div>
        <div class="inspect-quick-action">
          <button class="btn btn-secondary btn-sm" id="btn-back-to-map">
            ← Return to City Map
          </button>
        </div>
      </div>

      <!-- Infrastructure Status Grid -->
      <div class="infra-status-grid">
        <div class="infra-status-card">
          <span class="infra-label">Lighting Condition</span>
          <span class="infra-value ${gameEngine.state.cityRemembers.streetlightsRepaired ? 'text-success' : 'text-warning'}">
            ${gameEngine.state.cityRemembers.streetlightsRepaired ? 'High-Visibility LED Luminaires' : loc.baseStatus.lighting.toUpperCase()}
          </span>
        </div>
        <div class="infra-status-card">
          <span class="infra-label">Pedestrian Accessibility</span>
          <span class="infra-value ${gameEngine.state.cityRemembers.crossingImproved ? 'text-success' : 'text-warning'}">
            ${gameEngine.state.cityRemembers.crossingImproved ? 'Universal Tactile Ramps' : loc.baseStatus.accessibility.toUpperCase()}
          </span>
        </div>
        <div class="infra-status-card">
          <span class="infra-label">Transit Connectivity</span>
          <span class="infra-value ${gameEngine.state.cityRemembers.busInfoUpdated ? 'text-success' : 'text-muted'}">
            ${gameEngine.state.cityRemembers.busInfoUpdated ? 'Digital Live Schedule' : loc.baseStatus.transitInfo.toUpperCase()}
          </span>
        </div>
        <div class="infra-status-card">
          <span class="infra-label">Community Safety Network</span>
          <span class="infra-value ${gameEngine.state.cityRemembers.communityHelpPointActive ? 'text-success' : 'text-muted'}">
            ${gameEngine.state.cityRemembers.communityHelpPointActive ? 'Staffed Safety Hub' : loc.baseStatus.safetyFeatures.toUpperCase()}
          </span>
        </div>
      </div>
    `;

    // Clues / Hotspots Section
    html += `
      <div class="inspect-section">
        <h3 class="section-title">Field Investigation Hotspots (${availableClues.length} Available Clues)</h3>
        ${availableClues.length === 0 ? `
          <div class="empty-state-box">
            <p>No active anomalies flagged at this location for <strong>${mission.title}</strong>.</p>
            <p class="text-muted">Target locations for this mission: ${mission.targetLocations.map(id => GAME_DATA.locations.find(l => l.id === id)?.name).join(', ')}</p>
          </div>
        ` : `
          <div class="clues-grid">
            ${availableClues.map(clue => {
              const discovered = gameEngine.isClueDiscovered(clue.id);
              return `
                <div class="clue-hotspot-card ${discovered ? 'discovered' : 'undiscovered'}" data-clue-id="${clue.id}">
                  <div class="clue-card-header">
                    <span class="badge ${discovered ? 'badge-success' : 'badge-warning'}">
                      ${discovered ? 'Collected' : 'Inspect Point'}
                    </span>
                    <span class="badge badge-dim">${clue.category}</span>
                  </div>
                  <h4 class="clue-card-title">${discovered ? clue.title : 'Unexamined Public Anomaly'}</h4>
                  <p class="clue-card-desc">${discovered ? clue.description : 'Physical inspection required to record field evidence and witness testimony.'}</p>
                  <button class="btn ${discovered ? 'btn-outline' : 'btn-primary'} btn-sm btn-inspect-clue" data-clue-id="${clue.id}">
                    ${discovered ? 'Review Clue Dossier' : 'Inspect & Collect Clue'}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;

    // Interactive Witness Dialogue if applicable
    if (hasDialogue) {
      const dialogue = mission.dialogue;
      const existingChoice = gameEngine.state.dialogueChoices[mission.id];
      const chosenObj = existingChoice ? dialogue.choices.find(c => c.id === existingChoice) : null;

      html += `
        <div class="inspect-section dialogue-section">
          <div class="dialogue-header">
            <div class="dialogue-avatar" style="background: ${mission.character.portraitBg};">
              ${mission.character.name.charAt(0)}
            </div>
            <div>
              <h3 class="dialogue-speaker">${dialogue.speaker}</h3>
              <span class="badge badge-dim">${dialogue.characterRole}</span>
            </div>
          </div>
          
          <div class="dialogue-bubble">
            <p>${dialogue.initialText}</p>
          </div>

          <div class="dialogue-choices-container">
            ${dialogue.choices.map(choice => {
              const isSelected = existingChoice === choice.id;
              return `
                <button class="dialogue-choice-btn ${isSelected ? 'choice-selected' : ''}" 
                        data-choice-id="${choice.id}" ${existingChoice ? 'disabled' : ''}>
                  <div class="choice-text">"${choice.text}"</div>
                  ${isSelected ? `<span class="badge badge-success">Your Decision Recorded</span>` : ''}
                </button>
              `;
            }).join('')}
          </div>

          ${chosenObj ? `
            <div class="dialogue-feedback-box">
              <div class="feedback-title">Witness Reaction & Civic Consequence:</div>
              <p>${chosenObj.response}</p>
              <div class="badge badge-accent mt-2">Impact Logged: ${chosenObj.impactTag} (+${chosenObj.points} Points)</div>
            </div>
          ` : ''}
        </div>
      `;
    }

    container.innerHTML = html;

    // Attach listeners
    document.getElementById('btn-back-to-map')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.switchTab('map');
    });

    container.querySelectorAll('.btn-inspect-clue').forEach(btn => {
      btn.addEventListener('click', () => {
        const clueId = btn.dataset.clueId;
        const clue = mission.clues.find(c => c.id === clueId);
        if (clue) {
          const wasNew = gameEngine.discoverClue(clueId);
          if (wasNew) {
            this.showToast(`Evidence Acquired: ${clue.title}`, 'success');
          }
          this.openClueModal(clue);
          this.renderLocationInspection(locId); // Re-render card state
          this.renderRightPanel();
          this.renderTopBar();
        }
      });
    });

    // Dialogue choice listener
    container.querySelectorAll('.dialogue-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const choiceId = btn.dataset.choiceId;
        const result = gameEngine.makeDialogueChoice(mission.id, choiceId);
        if (result) {
          soundEngine.playClick();
          this.showToast(`Decision recorded: ${result.impactTag}`, 'info');
          this.renderLocationInspection(locId);
          this.renderRightPanel();
        }
      });
    });
  },

  openClueModal(clue) {
    const modal = document.getElementById('modal-clue-detail');
    if (!modal) return;

    document.getElementById('modal-clue-title').textContent = clue.title;
    document.getElementById('modal-clue-category').textContent = clue.category;
    document.getElementById('modal-clue-location').textContent = GAME_DATA.locations.find(l => l.id === clue.location)?.name || clue.location;
    document.getElementById('modal-clue-body').textContent = clue.detailText || clue.description;
    document.getElementById('modal-clue-relevance').textContent = clue.relevance;

    this.openModal('modal-clue-detail');
  },

  // ==========================================
  // 3. ROUTE PLANNER VIEW
  // ==========================================
  renderRoutePlanner() {
    const container = document.getElementById('routes-view-content');
    if (!container) return;

    const mission = gameEngine.getCurrentMission();
    const selectedRouteId = gameEngine.state.selectedRoutes[mission.id];

    let html = `
      <div class="routes-header">
        <span class="badge badge-accent">Strategic Route Evaluation</span>
        <h2 class="view-heading">Mission ${mission.number} Corridor Analysis</h2>
        <p class="view-subtext">
          Compare pedestrian routes for <strong>${mission.character.name}</strong>. Women's safety is not an individual burden—responsible urban design requires evaluating lighting, barrier-free access, and dependable transit.
        </p>
      </div>

      <div class="routes-comparison-grid">
        ${mission.routes.map(r => {
          const isSelected = selectedRouteId === r.id;
          // Apply upgrade bonuses dynamically
          let dynamicSafety = r.baseSafetyRating;
          let dynamicLighting = r.lighting;
          let dynamicAccessibility = r.accessibility;

          if (gameEngine.state.cityRemembers.streetlightsRepaired && (r.id === 'route_1_avenue' || r.id === 'route_3_grand_crossing')) {
            dynamicLighting = "100% High-Visibility LED Luminaires";
            dynamicSafety = "Significantly Improved";
          }
          if (gameEngine.state.cityRemembers.crossingImproved && (r.id === 'route_1_avenue' || r.id === 'route_3_grand_crossing')) {
            dynamicAccessibility = "Universal Tactile Paving & Audio Signals";
            dynamicSafety = "Safe Gold-Standard Corridor";
          }
          if (gameEngine.state.cityRemembers.communityHelpPointActive && r.id === 'route_2_plaza') {
            dynamicSafety = "Staffed Safe Community Corridor";
          }

          return `
            <div class="route-card ${isSelected ? 'route-selected' : ''}" data-route-id="${r.id}">
              <div class="route-card-header">
                <h3 class="route-card-title">${r.name}</h3>
                <span class="badge ${isSelected ? 'badge-success' : 'badge-dim'}">
                  ${isSelected ? 'Active Journey Plan' : r.duration}
                </span>
              </div>

              <div class="route-metrics">
                <div class="route-metric-row">
                  <span class="metric-label">Estimated Transit Time:</span>
                  <span class="metric-val"><strong>${r.duration}</strong></span>
                </div>
                <div class="route-metric-row">
                  <span class="metric-label">Infrastructure Safety:</span>
                  <span class="metric-val text-accent">${dynamicSafety}</span>
                </div>
                <div class="route-metric-row">
                  <span class="metric-label">Lighting Condition:</span>
                  <span class="metric-val">${dynamicLighting}</span>
                </div>
                <div class="route-metric-row">
                  <span class="metric-label">Universal Accessibility:</span>
                  <span class="metric-val">${dynamicAccessibility}</span>
                </div>
                <div class="route-metric-row">
                  <span class="metric-label">Pedestrian Sightlines:</span>
                  <span class="metric-val">${r.trafficCondition}</span>
                </div>
              </div>

              <p class="route-desc">${r.description}</p>
              
              <div class="route-evidence-note">
                <strong>Investigative Assessment:</strong> ${r.evidenceNotes}
              </div>

              ${r.upgradeBenefit ? `
                <div class="route-upgrade-callout">
                  ✨ <strong>Upgrade Link:</strong> ${r.upgradeBenefit}
                </div>
              ` : ''}

              <button class="btn ${isSelected ? 'btn-success' : 'btn-primary'} btn-block mt-3 btn-select-route" data-route-id="${r.id}">
                ${isSelected ? '✓ Plan Confirmed' : 'Select This Route Plan'}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.innerHTML = html;

    // Attach listeners
    container.querySelectorAll('.btn-select-route').forEach(btn => {
      btn.addEventListener('click', () => {
        const routeId = btn.dataset.routeId;
        gameEngine.selectRoute(mission.id, routeId);
        this.renderRoutePlanner();
        this.renderRightPanel();
        this.showToast('Journey route selected and logged.', 'success');
      });
    });
  },

  // ==========================================
  // 4. EVIDENCE BOARD & DEDUCTION VIEW
  // ==========================================
  renderEvidenceBoard() {
    const container = document.getElementById('evidence-view-content');
    if (!container) return;

    const mission = gameEngine.getCurrentMission();
    const discoveredClues = gameEngine.getDiscoveredCluesForMission(mission.id);
    const existingDeductionId = gameEngine.state.completedDeductions[mission.id];
    const deduction = mission.deduction;
    const existingOption = existingDeductionId ? deduction.options.find(o => o.id === existingDeductionId) : null;

    let html = `
      <div class="evidence-header">
        <span class="badge badge-accent">Tactical Clue Deduction</span>
        <h2 class="view-heading">Evidence Board: ${mission.title}</h2>
        <p class="view-subtext">
          Pin discovered evidence together to formulate a root-cause civic deduction. True solutions address institutional failures and infrastructure neglect rather than blaming individuals.
        </p>
      </div>

      <div class="evidence-board-workspace">
        <div class="evidence-clues-column">
          <h3 class="section-title">Collected Field Clues (${discoveredClues.length} / ${mission.clues.length})</h3>
          
          ${discoveredClues.length === 0 ? `
            <div class="empty-state-box">
              <p>No evidence collected yet for this mission.</p>
              <p class="text-muted">Head to the City Map and inspect the target locations (indicated with pulsing beacons) to uncover clues.</p>
              <button class="btn btn-secondary btn-sm mt-2" id="btn-goto-map-from-evidence">Open City Map</button>
            </div>
          ` : `
            <div class="evidence-clues-list">
              ${discoveredClues.map(c => {
                const isSelected = this.selectedCluesForDeduction.has(c.id);
                return `
                  <div class="evidence-pin-card ${isSelected ? 'pin-selected' : ''}" data-clue-id="${c.id}" tabindex="0" role="checkbox" aria-checked="${isSelected}">
                    <div class="pin-card-top">
                      <span class="badge badge-dim">${c.category}</span>
                      <span class="pin-checkbox">${isSelected ? '☑ Selected' : '☐ Select'}</span>
                    </div>
                    <h4 class="pin-card-title">${c.title}</h4>
                    <p class="pin-card-desc">${c.description}</p>
                    <div class="pin-card-location">📍 ${GAME_DATA.locations.find(l => l.id === c.location)?.name}</div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>

        <div class="evidence-deduction-column">
          <div class="deduction-card">
            <h3 class="deduction-card-title">Root-Cause Deduction Hypothesis</h3>
            <p class="deduction-question">${deduction.question}</p>
            
            <div class="deduction-options-list">
              ${deduction.options.map(opt => {
                const isChosen = existingDeductionId === opt.id;
                return `
                  <label class="deduction-radio-label ${isChosen ? 'deduction-chosen' : ''}">
                    <input type="radio" name="deduction-option" value="${opt.id}" ${isChosen ? 'checked' : ''} ${existingDeductionId ? 'disabled' : ''}>
                    <div class="radio-content">
                      <div class="deduction-opt-text">${opt.text}</div>
                      ${isChosen ? `
                        <div class="deduction-opt-feedback ${opt.isCorrect ? 'text-success' : 'text-warning'}">
                          ${opt.feedback}
                        </div>
                      ` : ''}
                    </div>
                  </label>
                `;
              }).join('')}
            </div>

            <div class="deduction-actions">
              ${existingDeductionId ? `
                <div class="badge ${existingOption && existingOption.isCorrect ? 'badge-success' : 'badge-warning'} btn-block text-center py-2">
                  ${existingOption && existingOption.isCorrect ? '✓ Accurate Deduction Registered' : '⚠️ Deduction Incomplete or Unsupported'}
                </div>
                ${existingOption && !existingOption.isCorrect ? `
                  <button class="btn btn-secondary btn-block mt-2" id="btn-revise-deduction">
                    🔄 Re-evaluate Evidence & Revise Deduction
                  </button>
                ` : ''}
              ` : `
                <button class="btn btn-primary btn-block" id="btn-submit-deduction">
                  Formulate & Submit Deduction Findings
                </button>
                <div class="text-muted text-xs mt-2 text-center">
                  Tip: Check the boxes on supporting clues to back your hypothesis.
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach listeners
    document.getElementById('btn-goto-map-from-evidence')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.switchTab('map');
    });

    container.querySelectorAll('.evidence-pin-card').forEach(card => {
      card.addEventListener('click', () => {
        soundEngine.playClick();
        const clueId = card.dataset.clueId;
        if (this.selectedCluesForDeduction.has(clueId)) {
          this.selectedCluesForDeduction.delete(clueId);
        } else {
          this.selectedCluesForDeduction.add(clueId);
        }
        this.renderEvidenceBoard();
      });
    });

    document.getElementById('btn-submit-deduction')?.addEventListener('click', () => {
      const selectedRadio = container.querySelector('input[name="deduction-option"]:checked');
      if (!selectedRadio) {
        this.showToast('Please select a hypothesis to submit.', 'warning');
        return;
      }
      const optionId = selectedRadio.value;
      const selectedClues = Array.from(this.selectedCluesForDeduction);

      const result = gameEngine.submitDeduction(mission.id, optionId, selectedClues);
      if (result.success) {
        this.showToast(result.isCorrect ? 'Accurate Deduction Solved!' : 'Deduction Submitted', result.isCorrect ? 'success' : 'info');
        this.renderEvidenceBoard();
        this.renderRightPanel();
        this.renderTopBar();
      } else {
        this.showToast(result.message, 'warning');
      }
    });

    // Revise deduction listener
    document.getElementById('btn-revise-deduction')?.addEventListener('click', () => {
      soundEngine.playClick();
      delete gameEngine.state.completedDeductions[mission.id];
      gameEngine.saveState();
      this.renderEvidenceBoard();
      this.renderRightPanel();
      this.showToast('Deduction unlocked for re-evaluation.', 'info');
    });
  },

  // ==========================================
  // 5. CITY IMPROVEMENTS & BUDGET STORE
  // ==========================================
  renderUpgradesStore() {
    const container = document.getElementById('upgrades-view-content');
    if (!container) return;

    let html = `
      <div class="upgrades-header">
        <div class="upgrades-title-area">
          <span class="badge badge-accent">Municipal Capital Works</span>
          <h2 class="view-heading">Aurelia City Infrastructure Investments</h2>
          <p class="view-subtext">
            Invest municipal funds into sustainable physical infrastructure, universal accessibility, and institutional accountability. Every improvement visibly transforms the city map and enhances route safety.
          </p>
        </div>
        <div class="budget-display-card">
          <span class="budget-label">Available Municipal Budget</span>
          <span class="budget-big">${gameEngine.state.budget} CR</span>
        </div>
      </div>

      <div class="upgrades-grid">
        ${GAME_DATA.upgrades.map(upg => {
          const purchased = gameEngine.isUpgradePurchased(upg.id);
          const canAfford = gameEngine.canAffordUpgrade(upg.id);

          return `
            <div class="upgrade-card ${purchased ? 'upgrade-purchased' : ''}">
              <div class="upgrade-card-header">
                <span class="badge badge-dim">${upg.category}</span>
                <span class="badge ${purchased ? 'badge-success' : 'badge-warning'}">
                  ${purchased ? 'Completed' : `${upg.cost} CR`}
                </span>
              </div>

              <h3 class="upgrade-card-title">${upg.title}</h3>
              <p class="upgrade-card-desc">${upg.description}</p>
              
              <div class="upgrade-impact-box">
                <div class="impact-heading">Social Good Impact:</div>
                <p class="impact-text">${upg.socialImpact}</p>
              </div>

              <div class="upgrade-benefit-text">
                ✨ <strong>System Benefit:</strong> ${upg.benefitText}
              </div>

              <div class="upgrade-card-footer">
                <button class="btn ${purchased ? 'btn-outline' : (canAfford ? 'btn-primary' : 'btn-disabled')} btn-block btn-buy-upgrade" 
                        data-upgrade-id="${upg.id}" ${purchased || !canAfford ? 'disabled' : ''}>
                  ${purchased ? '✓ Installed in Aurelia City' : (canAfford ? `Commission Upgrade (${upg.cost} CR)` : `Insufficient Funds (${upg.cost} CR)`)}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.innerHTML = html;

    // Attach purchase listeners
    container.querySelectorAll('.btn-buy-upgrade').forEach(btn => {
      btn.addEventListener('click', () => {
        const upgId = btn.dataset.upgradeId;
        const res = gameEngine.purchaseUpgrade(upgId);
        if (res.success) {
          this.showToast(res.message, 'success');
          this.renderUpgradesStore();
          this.renderTopBar();
          this.renderRightPanel();
        } else {
          this.showToast(res.message, 'warning');
        }
      });
    });
  },

  // ==========================================
  // 6. MISSION JOURNAL & AUDIT LOGS
  // ==========================================
  renderMissionJournal() {
    const container = document.getElementById('journal-view-content');
    if (!container) return;

    const mission = gameEngine.getCurrentMission();
    const completedCount = gameEngine.state.completedMissions.length;

    let html = `
      <div class="journal-header">
        <span class="badge badge-accent">Field Records</span>
        <h2 class="view-heading">Investigator Nova's Mission Journal</h2>
        <p class="view-subtext">Archived case notes, community testimony, and audit trails of Aurelia City's civic transformation.</p>
      </div>

      <div class="journal-campaign-overview">
        <div class="journal-metric-card">
          <span class="val">${completedCount} / 3</span>
          <span class="lbl">Missions Completed</span>
        </div>
        <div class="journal-metric-card">
          <span class="val">${gameEngine.state.discoveredClues.length}</span>
          <span class="lbl">Clues Documented</span>
        </div>
        <div class="journal-metric-card">
          <span class="val">${gameEngine.state.purchasedUpgrades.length} / 6</span>
          <span class="lbl">Public Improvements</span>
        </div>
        <div class="journal-metric-card">
          <span class="val">${gameEngine.getTotalScore()} PTS</span>
          <span class="lbl">Civic Impact Score</span>
        </div>
      </div>

      <div class="journal-sections-grid">
        <div class="journal-col">
          <h3 class="section-title">The City Remembers (Persistent Impacts)</h3>
          <div class="journal-card">
            <ul class="remembers-list">
              <li>
                <strong>Street Lighting:</strong> ${gameEngine.state.cityRemembers.streetlightsRepaired ? '✅ Upgraded to pedestrian-scale LED luminaires' : '⚠️ Burned out sodium lamps remaining'}
              </li>
              <li>
                <strong>Pedestrian Crossings:</strong> ${gameEngine.state.cityRemembers.crossingImproved ? '✅ Universal raised crosswalks & audible signals active' : '⚠️ Faded markings & dangerous curb barriers'}
              </li>
              <li>
                <strong>Transit Information:</strong> ${gameEngine.state.cityRemembers.busInfoUpdated ? '✅ Real-time GPS departure displays installed' : '⚠️ Outdated paper timetables & ghost buses'}
              </li>
              <li>
                <strong>Universal Accessibility:</strong> ${gameEngine.state.cityRemembers.busAccessibilityImproved ? '✅ Flush boarding platforms and blister pavers deployed' : '⚠️ Fractured curbs and missing tactile cues'}
              </li>
              <li>
                <strong>Community Stewardship:</strong> ${gameEngine.state.cityRemembers.communityHelpPointActive ? '✅ Staffed evening safety hub active' : '⚠️ Unstaffed transit stops after dark'}
              </li>
              <li>
                <strong>Institutional Accountability:</strong> ${gameEngine.state.cityRemembers.complaintPortalReformed ? '✅ Anonymous reporting & 48h response SLAs enforced' : '⚠️ Auto-rejection and victim-blaming intake'}
              </li>
            </ul>
          </div>
        </div>

        <div class="journal-col">
          <h3 class="section-title">Real-Time Event Audit Log</h3>
          <div class="journal-card audit-logs-box">
            ${gameEngine.state.historyLogs.length === 0 ? `
              <p class="text-muted">No audit events recorded yet.</p>
            ` : `
              <ul class="audit-log-list">
                ${gameEngine.state.historyLogs.map(log => `<li>${log}</li>`).join('')}
              </ul>
            `}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  // ==========================================
  // 7. SDG & EDUCATIONAL TAB
  // ==========================================
  renderSDGTab() {
    const container = document.getElementById('sdg-view-content');
    if (!container) return;

    const g = GAME_DATA.educationalGuide;

    let html = `
      <div class="sdg-header">
        <span class="badge badge-accent">United Nations Global Goals</span>
        <h2 class="view-heading">Social Impact: Designing for Dignity & Equality</h2>
        <p class="view-subtext">
          HER SAFE ROUTE: THE SILENT SIGNAL is created for the Girls Who Code HHS Hackathon 2026. The game demonstrates that women's safety is a collective social responsibility.
        </p>
      </div>

      <div class="sdg-cards-container">
        <!-- Primary SDG 5 -->
        <div class="sdg-card sdg-card-primary">
          <div class="sdg-badge-large">${g.primarySDG.code}</div>
          <div class="sdg-card-content">
            <h3 class="sdg-card-title">${g.primarySDG.name}</h3>
            <div class="sdg-target-tag">${g.primarySDG.target}</div>
            <p class="sdg-desc">${g.primarySDG.description}</p>
          </div>
        </div>

        <!-- Secondary SDGs Grid -->
        <div class="sdg-subgrid">
          ${g.secondarySDGs.map(s => `
            <div class="sdg-card sdg-card-sub">
              <span class="badge badge-dim">${s.code}</span>
              <h4 class="sdg-sub-title">${s.name}</h4>
              <p class="sdg-sub-target">${s.target}</p>
            </div>
          `).join('')}
        </div>

        <!-- The 5 Ds of Safe Bystander Intervention -->
        <div class="bystander-guide-card">
          <h3 class="bystander-title">Community Stewardship: The 5 Ds of Safe Bystander Intervention</h3>
          <p class="bystander-subtitle">Safety is co-created. When someone is in distress, never assume someone else will help. Safe, non-violent intervention principles:</p>
          
          <div class="bystander-steps-grid">
            ${g.bystanderIntervention.map((step, idx) => `
              <div class="bystander-step-box">
                <div class="bystander-num">${idx + 1}</div>
                <h4 class="bystander-step-name">${step.name}</h4>
                <p class="bystander-step-desc">${step.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  // ==========================================
  // 8. RIGHT CONTEXTUAL INFORMATION PANEL
  // ==========================================
  renderRightPanel() {
    const container = document.getElementById('right-context-panel');
    if (!container) return;

    const mission = gameEngine.getCurrentMission();
    const locId = gameEngine.state.selectedLocationId;
    const loc = GAME_DATA.locations.find(l => l.id === locId) || GAME_DATA.locations[0];
    
    // Check progress
    const missionCluesFound = gameEngine.getDiscoveredCluesForMission(mission.id);
    const deductionDone = !!gameEngine.state.completedDeductions[mission.id];
    const dialogueDone = !!gameEngine.state.dialogueChoices[mission.id];
    const routeSelected = !!gameEngine.state.selectedRoutes[mission.id];

    // Is mission ready for debrief?
    const canCompleteMission = deductionDone && routeSelected && dialogueDone;

    // Remaining required objectives string
    const missingItems = [];
    if (missionCluesFound.length < 3) missingItems.push(`Clues (${missionCluesFound.length}/3)`);
    if (!dialogueDone) missingItems.push("Witness Dialogue");
    if (!deductionDone) missingItems.push("Deduction Board");
    if (!routeSelected) missingItems.push("Route Selection");

    // Location witness check
    let witnessLocId = null;
    let witnessTitle = null;
    if (mission.id === 'mission_1') { witnessLocId = 'univ_campus'; witnessTitle = 'Maya'; }
    if (mission.id === 'mission_2') { witnessLocId = 'public_services'; witnessTitle = 'Aria & Leena'; }
    if (mission.id === 'mission_3') { witnessLocId = 'grand_crossing'; witnessTitle = 'Elena & Marcus'; }

    let html = `
      <div class="right-panel-block">
        <span class="panel-section-label">Active Mission Dossier</span>
        <h3 class="panel-mission-title">${mission.title}</h3>
        <p class="panel-mission-desc">${mission.briefing}</p>

        <div class="mission-checklist">
          <div class="checklist-item ${missionCluesFound.length >= 3 ? 'item-done' : ''}">
            <span class="check-icon">${missionCluesFound.length >= 3 ? '✓' : '○'}</span>
            <span>Gather Field Evidence (${missionCluesFound.length} / ${mission.clues.length})</span>
          </div>
          <div class="checklist-item ${dialogueDone ? 'item-done' : ''}">
            <span class="check-icon">${dialogueDone ? '✓' : '○'}</span>
            <span>Record Witness Dialogue</span>
          </div>
          <div class="checklist-item ${deductionDone ? 'item-done' : ''}">
            <span class="check-icon">${deductionDone ? '✓' : '○'}</span>
            <span>Solve Clue Deduction</span>
          </div>
          <div class="checklist-item ${routeSelected ? 'item-done' : ''}">
            <span class="check-icon">${routeSelected ? '✓' : '○'}</span>
            <span>Select Responsible Route</span>
          </div>
        </div>

        <div class="mt-3">
          ${canCompleteMission ? `
            <button class="btn btn-success btn-block" id="btn-complete-mission">
              ★ File Mission Findings & Complete
            </button>
          ` : `
            <div class="btn btn-disabled btn-block text-xs" title="Missing: ${missingItems.join(', ')}">
              Requires: ${missingItems.join(' • ')}
            </div>
          `}
        </div>
      </div>

      <div class="right-panel-block">
        <span class="panel-section-label">Inspected Location</span>
        <h4 class="panel-loc-name">${loc.name}</h4>
        <span class="badge badge-dim mb-2">${loc.district}</span>
        <p class="panel-loc-desc">${loc.description}</p>
        
        <div style="display:flex; flex-direction:column; gap:6px; margin-top:8px;">
          <button class="btn btn-secondary btn-sm btn-block" id="btn-inspect-selected-loc">
            🔍 Inspect Location Scene
          </button>
          ${!dialogueDone && witnessLocId ? `
            <button class="btn btn-outline btn-sm btn-block" id="btn-quick-talk-witness">
              🗣️ Interview ${witnessTitle}
            </button>
          ` : ''}
        </div>
      </div>

      <div class="right-panel-block">
        <span class="panel-section-label">Quick Actions</span>
        <div class="quick-actions-list">
          <button class="btn btn-outline btn-sm btn-block" id="btn-quick-routes">
            🗺️ Open Route Planner
          </button>
          <button class="btn btn-outline btn-sm btn-block" id="btn-quick-evidence">
            📌 Open Evidence Board
          </button>
          <button class="btn btn-outline btn-sm btn-block" id="btn-quick-upgrades">
            🏗️ Municipal Budget Store
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach listeners
    document.getElementById('btn-complete-mission')?.addEventListener('click', () => {
      soundEngine.playClick();
      const scoreData = gameEngine.completeMission(mission.id);
      this.launchConfetti();
      this.openMissionDebriefModal(mission, scoreData);
      this.renderTopBar();
    });

    document.getElementById('btn-inspect-selected-loc')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.switchTab('inspect');
    });

    document.getElementById('btn-quick-talk-witness')?.addEventListener('click', () => {
      soundEngine.playClick();
      if (witnessLocId) {
        gameEngine.state.selectedLocationId = witnessLocId;
      }
      this.switchTab('inspect');
    });

    document.getElementById('btn-quick-routes')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.switchTab('routes');
    });

    document.getElementById('btn-quick-evidence')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.switchTab('evidence');
    });

    document.getElementById('btn-quick-upgrades')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.switchTab('upgrades');
    });
  },

  // ==========================================
  // 9. MISSION DEBRIEF & SCORECARD MODAL
  // ==========================================
  openMissionDebriefModal(mission, scoreData) {
    const modal = document.getElementById('modal-mission-debrief');
    if (!modal) return;

    document.getElementById('debrief-mission-title').textContent = `Mission ${mission.number}: ${mission.title} Complete`;
    document.getElementById('debrief-total-score').textContent = `${scoreData.total} / 100`;
    
    const tierBadge = document.getElementById('debrief-tier-badge');
    tierBadge.textContent = scoreData.tier;
    tierBadge.className = `badge ${scoreData.tierClass}`;

    // Category breakdown
    const b = scoreData.breakdown;
    document.getElementById('score-investigation').textContent = `${b.investigation} / 25`;
    document.getElementById('score-route').textContent = `${b.routePlanning} / 20`;
    document.getElementById('score-response').textContent = `${b.appropriateResponse} / 20`;
    document.getElementById('score-upgrades').textContent = `${b.qualityUpgrades} / 25`;
    document.getElementById('score-budget').textContent = `${b.budgetManagement} / 10`;

    // Award notification
    document.getElementById('debrief-reward-text').textContent = `+${mission.rewardCredits} Municipal Credits allocated to city budget!`;

    const nextBtn = document.getElementById('btn-next-mission');
    if (mission.number < 3) {
      nextBtn.textContent = `Proceed to Mission ${mission.number + 1} →`;
    } else {
      nextBtn.textContent = `View Aurelia City Campaign Finale ★`;
    }

    nextBtn.onclick = () => {
      soundEngine.playClick();
      this.closeModal('modal-mission-debrief');
      if (mission.number < 3) {
        gameEngine.advanceToNextMission();
        this.switchTab('map');
        this.renderCityMap();
        this.renderRightPanel();
        this.renderTopBar();
        this.showToast(`Mission ${mission.number + 1} is now active.`, 'info');
      } else {
        this.launchConfetti();
        this.switchScreen('ending');
      }
    };

    this.openModal('modal-mission-debrief');
  },

  // ==========================================
  // 10. FINAL CAMPAIGN ENDING DOSSIER
  // ==========================================
  renderCampaignEnding() {
    const container = document.getElementById('campaign-ending-content');
    if (!container) return;

    const summary = gameEngine.generateCampaignSummary();
    const v = summary.verdict;
    const r = gameEngine.state.cityRemembers;

    let bystanderText = "Safe Bystander Intervention (Consensual Support)";
    if (r.bystanderApproach === 'bystander_ignore') bystanderText = "Passive Bystander (Individualist)";
    if (r.bystanderApproach === 'bystander_confront') bystanderText = "Aggressive Confrontation (Escalation)";

    let institutionalText = "Independent Oversight & Transparent Portal";
    if (r.institutionalStance === 'hand_over') institutionalText = "Surrendered to Bureaucratic Verification";
    if (r.institutionalStance === 'ignore_city') institutionalText = "Complete Civic Disengagement";

    let accessText = "Championed Universal Design ('Curb-Cut Effect')";
    if (r.accessibilityPhilosophy === 'compromise_minimum') accessText = "Compromised Minimum Path";
    if (r.accessibilityPhilosophy === 'advise_detour') accessText = "Unjust Detours Imposed";

    let html = `
      <div class="ending-card">
        <div class="ending-top-badge">
          <span class="badge badge-accent">Aurelia City Public Safety Final Commission</span>
        </div>
        
        <h1 class="ending-hero-title">${v.title}</h1>
        <h3 class="ending-hero-subtitle">${v.subtitle}</h3>
        <p class="ending-summary-p">${v.summary}</p>

        <!-- Final Campaign Metrics -->
        <div class="ending-metrics-row">
          <div class="ending-stat-box">
            <span class="stat-number text-accent">${summary.totalScore}</span>
            <span class="stat-label">Total Impact (out of ${summary.maxPossibleScore})</span>
          </div>
          <div class="ending-stat-box">
            <span class="stat-number">${summary.missionsCompleted} / 3</span>
            <span class="stat-label">Missions Fully Resolved</span>
          </div>
          <div class="ending-stat-box">
            <span class="stat-number">${summary.cluesFound} / ${summary.totalClues}</span>
            <span class="stat-label">Evidence Clues Discovered</span>
          </div>
          <div class="ending-stat-box">
            <span class="stat-number">${summary.upgradesCompleted} / ${summary.totalUpgrades}</span>
            <span class="stat-label">Municipal Upgrades Completed</span>
          </div>
          <div class="ending-stat-box">
            <span class="stat-number">${summary.remainingCredits} CR</span>
            <span class="stat-label">Remaining Budget</span>
          </div>
        </div>

        <!-- Key Decisions Logged -->
        <div class="journal-card mt-2">
          <h4 class="text-accent mb-2">Key Decisions & Community Principles Formed:</h4>
          <ul class="remembers-list" style="font-size:0.86rem;">
            <li><strong>Mission 1 Community Stance:</strong> ${bystanderText}</li>
            <li><strong>Mission 2 Institutional Policy:</strong> ${institutionalText}</li>
            <li><strong>Mission 3 Accessibility Philosophy:</strong> ${accessText}</li>
          </ul>
        </div>

        <!-- Before & After Transformation Comparison -->
        <div class="transformation-section">
          <h3 class="section-title">Aurelia City: The Transformation You Created</h3>
          <div class="transformation-grid">
            <div class="trans-col before-col">
              <h4 class="trans-col-title">Before Nova's Investigation</h4>
              <ul class="trans-list">
                <li>❌ Unlit corridors and burned out lamps stranded late-night students.</li>
                <li>❌ Peeling paper schedules created 30+ minute ghost-bus waiting periods.</li>
                <li>❌ Hostile intake bureaucracy auto-rejected 19 harassment complaints.</li>
                <li>❌ Dangerous 6-inch broken curbs and silent 9-second pedestrian signals blocked wheelchair users and seniors.</li>
                <li>❌ Culture of bystander silence and individual victim-blaming.</li>
              </ul>
            </div>
            <div class="trans-col after-col">
              <h4 class="trans-col-title">After Your Municipal Interventions</h4>
              <ul class="trans-list">
                <li>✅ ${summary.cityChanges.streetlights ? 'Pedestrian-scale smart LED luminaires illuminate university corridors.' : 'Corridors remain partially dark; further lighting needed.'}</li>
                <li>✅ ${summary.cityChanges.busInfo ? 'Live real-time transit departure screens eliminate stranded anxiety.' : 'Timetables require ongoing municipal digitization.'}</li>
                <li>✅ ${summary.cityChanges.complaintPortal ? 'Transparent 48h tracking portal eliminated bureaucratic silencing.' : 'Complaint procedures still require administrative reform.'}</li>
                <li>✅ ${summary.cityChanges.crossings ? 'Universal raised crosswalks and tactile audio beacons ensure safe dignified access for all.' : 'Crossings still present mobility hurdles.'}</li>
                <li>✅ Community-driven stewardship: women and vulnerable residents possess real voice and collective institutional backing.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Core Message Callout -->
        <div class="ending-message-callout">
          <h3>The Central Lesson of Aurelia City</h3>
          <p>
            "Women's safety is not an individual burden to bear, and no route is made safe by asking people to shrink their lives. Safer communities are built when urban planners illuminate streets, transit agencies guarantee reliability, institutions listen to complaints without prejudice, and neighbors look out for one another with active care."
          </p>
          <div class="mt-2 text-muted text-xs">
            Aligned with UN Sustainable Development Goals 5, 11, 16, & 10.
          </div>
        </div>

        <div class="ending-actions-row">
          <button class="btn btn-primary" id="btn-play-again">
            ↺ Restart Campaign (New Game)
          </button>
          <button class="btn btn-secondary" id="btn-review-map">
            🗺️ Inspect Fully Upgraded City Map
          </button>
          <button class="btn btn-outline" id="btn-ending-sdg">
            📘 Read SDG & Bystander Guide
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach listeners
    document.getElementById('btn-play-again')?.addEventListener('click', () => {
      soundEngine.playClick();
      gameEngine.resetProgress();
      this.switchScreen('title');
      this.showToast('New campaign ready to begin.', 'info');
    });

    document.getElementById('btn-review-map')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.switchScreen('game');
      this.switchTab('map');
    });

    document.getElementById('btn-ending-sdg')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.openModal('modal-sdg');
    });
  },

  // Confetti Particle Burst
  launchConfetti() {
    if (gameEngine.state.settings.reducedMotion) return;

    const colors = ['#8B7CFF', '#43D9E8', '#F472B6', '#4ADE80', '#FBBF24', '#FFFFFF'];
    const container = document.createElement('div');
    container.className = 'confetti-container';

    for (let i = 0; i < 45; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDelay = `${Math.random() * 0.8}s`;
      p.style.animationDuration = `${2.4 + Math.random() * 1.6}s`;
      p.style.width = `${6 + Math.random() * 7}px`;
      p.style.height = `${10 + Math.random() * 8}px`;
      container.appendChild(p);
    }

    document.body.appendChild(container);
    setTimeout(() => {
      if (container.parentNode) container.parentNode.removeChild(container);
    }, 4500);
  },

  // Modal helpers
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      const focusTarget = modal.querySelector('button, [tabindex="0"]');
      if (focusTarget) focusTarget.focus();
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
  },

  closeAllModals() {
    document.querySelectorAll('.modal-container').forEach(m => m.classList.add('hidden'));
  },

  // Toast notifications
  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : (type === 'warning' ? '⚠' : 'ℹ')}</span>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3800);
  },

  // ==========================================
  // REAL-TIME SOS DISPATCH & SAFETY HAVENS
  // ==========================================
  openSOSModal() {
    this.openModal('modal-sos-dispatch');
    const countdownView = document.getElementById('sos-countdown-view');
    const activeView = document.getElementById('sos-active-view');
    const curLocId = gameEngine.state.selectedLocationId || 'univ_campus';

    if (gameEngine.state.sosState && gameEngine.state.sosState.isTriggered) {
      if (countdownView) countdownView.classList.add('hidden');
      if (activeView) activeView.classList.remove('hidden');
      const timeElem = document.getElementById('sos-dispatch-timestamp');
      if (timeElem) timeElem.textContent = `Dispatched at ${gameEngine.state.sosState.dispatchedTime || 'Active'}`;
      const locObj = GAME_DATA.locations.find(l => l.id === curLocId);
      const locElem = document.getElementById('sos-telemetry-loc');
      if (locElem && locObj) locElem.textContent = `${locObj.name} (${locObj.district})`;
      this.renderSOSSafeHavens(curLocId);
      return;
    }

    if (countdownView) countdownView.classList.remove('hidden');
    if (activeView) activeView.classList.add('hidden');

    if (this.sosCountdownTimer) clearInterval(this.sosCountdownTimer);
    this.sosRemainingSeconds = 3;
    const numElem = document.getElementById('sos-countdown-timer');
    const secElem = document.getElementById('sos-countdown-sec');
    if (numElem) numElem.textContent = '3';
    if (secElem) secElem.textContent = '3';

    this.sosCountdownTimer = setInterval(() => {
      this.sosRemainingSeconds--;
      if (numElem) numElem.textContent = this.sosRemainingSeconds;
      if (secElem) secElem.textContent = this.sosRemainingSeconds;

      if (this.sosRemainingSeconds > 0) {
        soundEngine.playCountdownTick();
      } else {
        clearInterval(this.sosCountdownTimer);
        this.sosCountdownTimer = null;
        this.triggerSOSDispatch();
      }
    }, 1000);
  },

  abortSOSCountdown() {
    if (this.sosCountdownTimer) {
      clearInterval(this.sosCountdownTimer);
      this.sosCountdownTimer = null;
    }
    this.closeModal('modal-sos-dispatch');
    this.showToast('SOS Countdown cancelled.', 'info');
  },

  triggerSOSDispatch() {
    const curLocId = gameEngine.state.selectedLocationId || 'univ_campus';
    const result = gameEngine.triggerSOS(curLocId);

    const countdownView = document.getElementById('sos-countdown-view');
    const activeView = document.getElementById('sos-active-view');
    if (countdownView) countdownView.classList.add('hidden');
    if (activeView) activeView.classList.remove('hidden');

    const timeElem = document.getElementById('sos-dispatch-timestamp');
    if (timeElem) timeElem.textContent = `Dispatched at ${result.dispatchedTime}`;

    const locObj = GAME_DATA.locations.find(l => l.id === curLocId);
    const locElem = document.getElementById('sos-telemetry-loc');
    if (locElem && locObj) locElem.textContent = `${locObj.name} (${locObj.district})`;

    this.renderSOSSafeHavens(curLocId);
    soundEngine.playAlert();
    this.showToast('🚨 High-Priority SOS Dispatched! Guardians & Escort notified.', 'warning');
  },

  renderSOSSafeHavens(locId) {
    const listContainer = document.getElementById('sos-safe-havens-list');
    if (!listContainer) return;

    const havens = gameEngine.getNearestSafeHavens(locId);
    listContainer.innerHTML = havens.map((sh, idx) => `
      <div class="safe-haven-card ${idx === 0 ? 'recommended' : ''}">
        <div class="haven-header">
          <div>
            <div class="haven-name">
              ${idx === 0 ? '⭐ ' : ''}${sh.name}
            </div>
            <div class="text-xs text-muted">${sh.address} • ${sh.phone}</div>
          </div>
          <span class="haven-distance-badge">${sh.distanceMeters}m (~${sh.walkMins}m walk)</span>
        </div>
        <div class="haven-details">
          <strong>Hours:</strong> ${sh.hours}<br>
          <strong>Staffing:</strong> ${sh.staffing}
        </div>
        <div class="haven-features">
          ${(sh.features || []).map(f => `<span class="haven-feature-tag">${f}</span>`).join('')}
        </div>
        <div class="mt-2 text-right">
          <button class="btn btn-outline btn-xs" onclick="App.routeToSafeHaven('${sh.locationId || locId}')">
            🚶 Route Me Here (Safe Navigator)
          </button>
        </div>
      </div>
    `).join('');
  },

  routeToSafeHaven(destLocId) {
    soundEngine.playClick();
    this.closeModal('modal-sos-dispatch');
    this.navDest = destLocId;
    this.switchTab('navigator');
    this.showToast('Destination updated to nearest 24/7 Safe Haven.', 'info');
  },

  cancelActiveSOS() {
    if (this.sosCountdownTimer) {
      clearInterval(this.sosCountdownTimer);
      this.sosCountdownTimer = null;
    }
    if (this.isSirenActive) {
      this.toggleSOSSiren();
    }
    gameEngine.cancelSOS();
    this.closeModal('modal-sos-dispatch');
    this.showToast('SOS Alert deactivated by user.', 'info');
  },

  toggleSOSSiren() {
    const sirenBtn = document.getElementById('btn-sos-siren-toggle');
    const statusText = document.getElementById('sos-siren-status-text');

    if (this.isSirenActive) {
      soundEngine.stopSiren();
      this.isSirenActive = false;
      if (sirenBtn) {
        sirenBtn.innerHTML = `<span class="icon">🔊</span> Sound Audio Deterrent (Siren)`;
        sirenBtn.classList.remove('btn-danger');
      }
      if (statusText) {
        statusText.textContent = 'Siren Inactive';
        statusText.style.color = 'var(--text-muted)';
      }
      this.showToast('Audio deterrent stopped.', 'info');
    } else {
      soundEngine.startSiren();
      this.isSirenActive = true;
      if (sirenBtn) {
        sirenBtn.innerHTML = `<span class="icon">🔇</span> Mute Audio Deterrent`;
        sirenBtn.classList.add('btn-danger');
      }
      if (statusText) {
        statusText.textContent = 'Active (1.8 Hz Wailing Siren)';
        statusText.style.color = '#ff5252';
      }
      this.showToast('🚨 Warning: Audio siren alarm sounding!', 'warning');
    }
  },

  toggleCovertStealth(show) {
    const screen = document.getElementById('covert-stealth-screen');
    if (!screen) return;
    if (show) {
      screen.classList.remove('hidden');
      this.closeModal('modal-sos-dispatch');
    } else {
      screen.classList.add('hidden');
      if (gameEngine.state.sosState?.isTriggered) {
        this.openModal('modal-sos-dispatch');
      }
    }
  },

  handleCovertTap() {
    this.covertTapCount = (this.covertTapCount || 0) + 1;
    if (this.covertTapTimer) clearTimeout(this.covertTapTimer);
    if (this.covertTapCount >= 3) {
      this.toggleCovertStealth(false);
      this.covertTapCount = 0;
    } else {
      this.covertTapTimer = setTimeout(() => {
        this.covertTapCount = 0;
      }, 2000);
    }
  },

  // ==========================================
  // REAL-TIME SAFE ROUTE NAVIGATOR
  // ==========================================
  renderLiveNavigator() {
    const container = document.getElementById('navigator-view-content');
    if (!container) return;

    if (!this.navOrigin) this.navOrigin = 'univ_campus';
    if (!this.navDest) this.navDest = 'community_center';
    if (!this.navMode) this.navMode = 'safest';

    const originLoc = GAME_DATA.locations.find(l => l.id === this.navOrigin) || GAME_DATA.locations[0];
    const destLoc = GAME_DATA.locations.find(l => l.id === this.navDest) || GAME_DATA.locations[4];

    const safetyScore = gameEngine.calculateSafetyRating(this.navOrigin, this.navDest, this.navMode);
    const scoreColorClass = safetyScore >= 75 ? 'gauge-high' : (safetyScore >= 50 ? 'gauge-mid' : 'gauge-low');
    const fillColorClass = safetyScore >= 75 ? 'fill-high' : (safetyScore >= 50 ? 'fill-mid' : 'fill-low');

    const safetyVerdict = safetyScore >= 80 ? 'Exceptional Civic Route • Well-Lit & Monitored' :
                         (safetyScore >= 65 ? 'Monitored Transit Way • Average Lighting' :
                         (safetyScore >= 45 ? 'Caution Advised • Intermittent Streetlights' : 'High Risk Corridor • Unlit & Isolated'));

    // Check for hazards along origin / dest
    const hazards = gameEngine.getAllHazards().filter(h => !h.isResolved && (h.locationId === this.navOrigin || h.locationId === this.navDest));
    const nearestHavens = gameEngine.getNearestSafeHavens(this.navOrigin);
    const primaryHaven = nearestHavens[0];

    const locationsOptionsOrigin = GAME_DATA.locations.map(l =>
      `<option value="${l.id}" ${l.id === this.navOrigin ? 'selected' : ''}>${l.name} (${l.district})</option>`
    ).join('');

    const locationsOptionsDest = GAME_DATA.locations.map(l =>
      `<option value="${l.id}" ${l.id === this.navDest ? 'selected' : ''}>${l.name} (${l.district})</option>`
    ).join('');

    container.innerHTML = `
      <div class="mb-3">
        <h2 class="view-heading">🧭 Real-Time Safety Route Navigator</h2>
        <p class="view-subtext">Dynamic safety ratings factoring in streetlight infrastructure, active crowd-sourced hazards, and verified 24/7 Safe Haven sanctuaries.</p>
      </div>

      <div class="nav-layout-grid">
        <!-- Configuration Column -->
        <div class="nav-config-panel">
          <h3 class="card-title text-sm">📍 Route Parameters</h3>

          <div class="form-group">
            <label class="form-label" for="nav-select-origin">Origin Point</label>
            <select id="nav-select-origin" class="form-select">
              ${locationsOptionsOrigin}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="nav-select-dest">Destination Point</label>
            <select id="nav-select-dest" class="form-select">
              ${locationsOptionsDest}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Routing Priority</label>
            <div class="mode-toggle-group">
              <button class="mode-toggle-btn ${this.navMode === 'safest' ? 'active' : ''}" data-mode="safest">
                🛡️ Safest
              </button>
              <button class="mode-toggle-btn ${this.navMode === 'fastest' ? 'active' : ''}" data-mode="fastest">
                ⚡ Fastest
              </button>
              <button class="mode-toggle-btn ${this.navMode === 'shortcut' ? 'active' : ''}" data-mode="shortcut">
                🏃 Shortcut
              </button>
            </div>
          </div>

          <div class="card p-3" style="background: var(--bg-secondary); border: 1px solid var(--border-color);">
            <div class="text-xs text-muted font-bold uppercase mb-1">Municipal Infrastructure Multipliers</div>
            <div class="text-xs" style="line-height: 1.6;">
              ${gameEngine.state.cityRemembers.streetlightsRepaired ? '✓ <span style="color:var(--success);">Smart Streetlights (+14%)</span><br>' : '✗ <span class="text-muted">Unrepaired Streetlights (0%)</span><br>'}
              ${gameEngine.state.cityRemembers.crossingImproved ? '✓ <span style="color:var(--success);">Universal Curb Ramps (+12%)</span><br>' : '✗ <span class="text-muted">High Inaccessible Curbs (0%)</span><br>'}
              ${gameEngine.state.cityRemembers.busInfoUpdated ? '✓ <span style="color:var(--success);">Real-Time Bus GPS (+8%)</span><br>' : '✗ <span class="text-muted">Ghost Schedules (0%)</span><br>'}
              ${gameEngine.state.cityRemembers.communityHelpPointActive ? '✓ <span style="color:var(--success);">Community Help Points (+10%)</span>' : '✗ <span class="text-muted">No Mutual-Aid Kiosks (0%)</span>'}
            </div>
          </div>

          <button id="btn-simulate-walk" class="btn btn-primary w-100">
            <span class="icon">🚶‍♀️</span> Simulate Walking Route
          </button>
        </div>

        <!-- Navigation Results Column -->
        <div class="nav-results-panel">
          <!-- Safety Meter -->
          <div class="safety-meter-card">
            <div class="safety-meter-score ${scoreColorClass}" id="nav-gauge-value">${safetyScore}%</div>
            <div class="safety-bar-wrapper">
              <div class="d-flex justify-between items-center">
                <strong style="font-size: 1.05rem;">SAFETY RATING INDEX</strong>
                <span class="badge ${safetyScore >= 75 ? 'badge-success' : (safetyScore >= 50 ? 'badge-warning' : 'badge-danger')}">
                  ${safetyScore >= 75 ? 'OPTIMAL SAFETY' : (safetyScore >= 50 ? 'MODERATE RISK' : 'ELEVATED DANGER')}
                </span>
              </div>
              <div class="safety-bar-track">
                <div class="safety-bar-fill ${fillColorClass}" style="width: ${safetyScore}%;"></div>
              </div>
              <div class="text-xs text-muted">${safetyVerdict}</div>
            </div>
          </div>

          <!-- Hazards Alert Banner (if any) -->
          ${hazards.length > 0 ? `
            <div class="hazard-card" style="border-color: rgba(248, 113, 113, 0.4); background: rgba(248, 113, 113, 0.08);">
              <div class="hazard-top">
                <span class="hazard-badge-cat severity-critical">⚠️ ${hazards.length} ACTIVE CROWDSOURCED HAZARDS ON PATH</span>
                <span class="text-xs text-muted">Community Verified</span>
              </div>
              <div class="text-xs mt-1" style="line-height: 1.5;">
                ${hazards.map(h => `<strong>• ${h.title}:</strong> ${h.description} <span class="text-muted">(${h.upvotes} upvotes)</span>`).join('<br>')}
              </div>
            </div>
          ` : `
            <div class="card p-2 text-xs" style="background: rgba(74, 222, 128, 0.08); border: 1px solid rgba(74, 222, 128, 0.25); color: var(--success);">
              ✓ Zero active infrastructure hazard warnings reported along this corridor.
            </div>
          `}

          <!-- Step-by-Step Guidance -->
          <div>
            <h3 class="card-title text-sm mb-3">🚶 Step-by-Step Navigation Plan</h3>
            <div class="nav-steps-list">
              <div class="nav-step-item">
                <div class="nav-step-index">1</div>
                <div class="nav-step-desc">
                  <strong>Depart:</strong> ${originLoc.name} (${originLoc.district}).<br>
                  <span class="text-xs text-muted">Lighting: <em>${originLoc.baseStatus.lighting}</em> • Safety: <em>${originLoc.baseStatus.safetyFeatures}</em></span>
                </div>
              </div>

              <div class="nav-step-item">
                <div class="nav-step-index">2</div>
                <div class="nav-step-desc">
                  <strong>Corridor Transit:</strong> ${this.navMode === 'safest' ? 'Follow illuminated arterial sidewalks along Central Promenade with high foot-traffic.' : (this.navMode === 'fastest' ? 'Take direct North Arterial corridor through Grand Crossing.' : 'Cut through Solaria Park unlit secondary pathways.')}<br>
                  <span class="text-xs text-muted">${this.navMode === 'safest' ? 'Maintained under active municipal streetlights.' : 'Warning: Dim lighting and blind corners.'}</span>
                </div>
              </div>

              <div class="nav-step-item">
                <div class="nav-step-index">3</div>
                <div class="nav-step-desc">
                  <strong>Sanctuary Checkpoint:</strong> Passing within 150m of <strong>${primaryHaven.name}</strong>.<br>
                  <span class="text-xs text-muted">24/7 Verified Safe Haven • Staffed with emergency phone ${primaryHaven.phone}.</span>
                </div>
              </div>

              <div class="nav-step-item">
                <div class="nav-step-index">4</div>
                <div class="nav-step-desc">
                  <strong>Arrival:</strong> Arrive safely at ${destLoc.name}.<br>
                  <span class="text-xs text-muted">Estimated walking time: ~${Math.max(4, Math.round(Math.abs(originLoc.x - destLoc.x) / 40) + 3)} minutes.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Walk Simulation Progress Area (Hidden until triggered) -->
          <div id="walk-sim-progress" class="hidden card p-3" style="background: var(--bg-secondary); border: 1px solid var(--accent-secondary);">
            <div class="d-flex justify-between items-center mb-1">
              <strong class="text-xs uppercase" style="color: var(--accent-secondary);">Walking Simulator Active</strong>
              <span id="sim-pct-text" class="text-xs font-bold">0%</span>
            </div>
            <div class="safety-bar-track">
              <div id="sim-bar-fill" class="safety-bar-fill fill-high" style="width: 0%;"></div>
            </div>
            <div id="sim-status-log" class="text-xs text-muted mt-2">Starting journey...</div>
          </div>
        </div>
      </div>
    `;

    // Wire up events
    document.getElementById('nav-select-origin')?.addEventListener('change', (e) => {
      this.navOrigin = e.target.value;
      soundEngine.playClick();
      this.renderLiveNavigator();
    });

    document.getElementById('nav-select-dest')?.addEventListener('change', (e) => {
      this.navDest = e.target.value;
      soundEngine.playClick();
      this.renderLiveNavigator();
    });

    document.querySelectorAll('.mode-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        soundEngine.playClick();
        this.navMode = btn.dataset.mode;
        this.renderLiveNavigator();
      });
    });

    document.getElementById('btn-simulate-walk')?.addEventListener('click', () => {
      this.simulateWalkRoute();
    });
  },

  simulateWalkRoute() {
    const simBox = document.getElementById('walk-sim-progress');
    const bar = document.getElementById('sim-bar-fill');
    const pct = document.getElementById('sim-pct-text');
    const log = document.getElementById('sim-status-log');
    const btn = document.getElementById('btn-simulate-walk');

    if (!simBox || !bar || !pct || !log) return;
    simBox.classList.remove('hidden');
    if (btn) btn.disabled = true;

    let progress = 0;
    soundEngine.playRouteSelected();

    const messages = [
      "Departing origin under municipal surveillance...",
      "Passing illuminated pedestrian crosswalk...",
      "Crossing near 24/7 Verified Safe Haven...",
      "Approaching destination with zero safety alerts...",
      "Safely arrived at destination!"
    ];

    const interval = setInterval(() => {
      progress += 20;
      bar.style.width = `${progress}%`;
      pct.textContent = `${progress}%`;
      const stepIdx = Math.min(messages.length - 1, Math.floor(progress / 20) - 1);
      log.textContent = messages[stepIdx];
      soundEngine.playInspectStep();

      if (progress >= 100) {
        clearInterval(interval);
        soundEngine.playClueFound();
        this.showToast('Route simulated successfully: Zero incidents logged!', 'success');
        if (btn) btn.disabled = false;
      }
    }, 600);
  },

  // ==========================================
  // CROWDSOURCED HAZARDS VIEW
  // ==========================================
  renderHazardReports() {
    const container = document.getElementById('hazards-view-content');
    if (!container) return;

    const allHazards = gameEngine.getAllHazards();
    const categories = [
      { id: 'all', label: 'All Categories' },
      { id: 'unlit_corridor', label: '💡 Unlit Corridors' },
      { id: 'broken_curb', label: '♿ Inaccessible Curbs' },
      { id: 'ghost_schedule', label: '🚌 Transit Ghosting' },
      { id: 'isolated_tunnel', label: '🚇 Blind Underpasses' },
      { id: 'infrastructure', label: '🚨 Broken Hardware' }
    ];

    const filtered = allHazards.filter(h => {
      if (this.hazardFilterCat && this.hazardFilterCat !== 'all' && h.category !== this.hazardFilterCat) {
        return false;
      }
      return true;
    });

    container.innerHTML = `
      <div class="hazards-header-bar">
        <div>
          <h2 class="view-heading">⚠️ Crowdsourced Danger & Infrastructure Reports</h2>
          <p class="view-subtext">Community-reported civic hazards across Aurelia City. Upvote persistent hazards to push for municipal remediation.</p>
        </div>
        <button id="btn-open-report-hazard-modal" class="btn btn-primary">
          <span class="icon">📢</span> Report a Danger / Hazard
        </button>
      </div>

      <div class="d-flex items-center gap-3 mb-4 flex-wrap">
        <label class="text-xs text-muted uppercase font-bold">Filter Category:</label>
        <div class="d-flex gap-2 flex-wrap">
          ${categories.map(c => `
            <button class="btn btn-outline btn-xs ${this.hazardFilterCat === c.id ? 'active' : ''}" onclick="App.setHazardCategoryFilter('${c.id}')">
              ${c.label}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="hazards-feed-grid">
        ${filtered.map(h => {
          const loc = GAME_DATA.locations.find(l => l.id === h.locationId);
          const locName = loc ? loc.name : h.locationId;
          const district = loc ? loc.district : 'Aurelia City';
          const sevClass = h.severity === 'critical' ? 'severity-critical' : (h.severity === 'high' ? 'severity-high' : 'severity-moderate');

          return `
            <div class="hazard-card ${h.isResolved ? 'resolved' : ''}">
              <div>
                <div class="hazard-top">
                  <span class="hazard-badge-cat ${sevClass}">${h.category.replace('_', ' ')}</span>
                  ${h.isResolved ? `<span class="badge-resolved">✓ Resolved by Upgrade</span>` : `<span class="text-xs text-muted">${h.timeAgo || 'Recent'}</span>`}
                </div>
                <h3 class="hazard-title">${h.title}</h3>
                <div class="text-xs text-muted mb-2">📍 ${locName} • ${district}</div>
                <p class="hazard-desc">${h.description}</p>
              </div>

              <div class="hazard-footer">
                <span class="hazard-meta">Reported by: <strong>${h.reportedBy || 'Anonymous'}</strong></span>
                <button class="btn-upvote ${h.userUpvoted ? 'upvoted' : ''}" onclick="App.upvoteHazard('${h.id}')">
                  ▲ Upvote <strong style="margin-left:2px;">${h.effectiveUpvotes || h.upvotes || 0}</strong>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    document.getElementById('btn-open-report-hazard-modal')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.openReportHazardModal();
    });
  },

  setHazardCategoryFilter(catId) {
    soundEngine.playClick();
    this.hazardFilterCat = catId;
    this.renderHazardReports();
  },

  upvoteHazard(hazardId) {
    gameEngine.upvoteHazard(hazardId);
    this.renderHazardReports();
  },

  openReportHazardModal() {
    const select = document.getElementById('hazard-form-location');
    if (select) {
      select.innerHTML = GAME_DATA.locations.map(l =>
        `<option value="${l.id}">${l.name} (${l.district})</option>`
      ).join('');
    }
    this.openModal('modal-report-hazard');
  },

  submitHazardReport() {
    const locId = document.getElementById('hazard-form-location')?.value;
    const cat = document.getElementById('hazard-form-category')?.value;
    const sev = document.getElementById('hazard-form-severity')?.value;
    const title = document.getElementById('hazard-form-title')?.value;
    const desc = document.getElementById('hazard-form-desc')?.value;
    const isAnon = document.getElementById('hazard-form-anon')?.checked;

    if (!title || !desc) {
      this.showToast('Please provide both a hazard title and description.', 'warning');
      return;
    }

    gameEngine.reportCustomHazard({
      locationId: locId,
      category: cat,
      severity: sev,
      title: title.trim(),
      description: desc.trim(),
      isAnonymous: isAnon
    });

    this.closeModal('modal-report-hazard');
    // Clear inputs
    const titleInp = document.getElementById('hazard-form-title');
    const descInp = document.getElementById('hazard-form-desc');
    if (titleInp) titleInp.value = '';
    if (descInp) descInp.value = '';

    this.showToast('Hazard report broadcast to Aurelia Civic Network!', 'success');
    this.renderHazardReports();
  }
};

// =========================================================================
// INTERACTIVE GUIDED DEMO TOUR CONTROLLER (Hackathon Showcase)
// =========================================================================
const DemoTour = {
  currentStep: 0,
  steps: [
    {
      title: "Step 1 of 6: City Map & Mission 1 Briefing",
      badge: "Step 1 of 6",
      desc: `
        <div style="line-height:1.6;">
          <p><strong>Aurelia City Needs Investigator Nova:</strong> You begin at <strong>Mission 1: The Last Bus</strong>. Engineering student Maya was stranded in the dark after an evening lab.</p>
          <p class="mt-2 text-accent">Notice the interactive vector map: 10 municipal hubs across 4 districts, connected by road corridors with live traffic pulses and bridges over the Aurelia River.</p>
          <div class="route-evidence-note mt-2">
            📍 <strong>Key Hotspot:</strong> Aurelia University East Gate connecting to North Avenue Crossing.
          </div>
        </div>
      `,
      exec: () => {
        App.switchScreen('game');
        App.switchTab('map');
        App.selectLocation('univ_campus');
        App.openMapDrawer('univ_campus');
        App.showToast("Demo: Switched to City Map & opened University Dossier.", "info");
      }
    },
    {
      title: "Step 2 of 6: Field Inspection & Clue Discovery",
      badge: "Step 2 of 6",
      desc: `
        <div style="line-height:1.6;">
          <p><strong>Uncovering Systemic Evidence:</strong> Inspecting physical corridors reveals that Maya's distress wasn't an isolated accident—it was caused by neglected infrastructure and silent schedule changes.</p>
          <ul class="trans-list mt-2" style="font-size:0.85rem;">
            <li>💡 <strong>Shattered Luminaire:</strong> 22 days of pitch darkness at North Crossing.</li>
            <li>🚸 <strong>Faded Crosswalk:</strong> Bare asphalt and 4-inch cracked curb lip.</li>
            <li>⏱️ <strong>Ghost Timetable:</strong> 9:15 PM bus silently pushed to 9:45 PM.</li>
            <li>📋 <strong>Ignored Work Order #2049:</strong> Repair ticket marked 'Deferred'.</li>
            <li>🗣️ <strong>Sam's Testimony:</strong> Confirmation of dozens of stranded commuters.</li>
          </ul>
        </div>
      `,
      exec: () => {
        const m1 = gameEngine.getCurrentMission();
        m1.clues.forEach(c => gameEngine.discoverClue(c.id));
        App.switchTab('inspect');
        App.renderLocationInspection('univ_campus');
        App.renderRightPanel();
        App.renderTopBar();
        App.showToast("Demo: Discovered all 5 Mission 1 field clues!", "success");
      }
    },
    {
      title: "Step 3 of 6: Active Bystander Intervention Dialogue",
      badge: "Step 3 of 6",
      desc: `
        <div style="line-height:1.6;">
          <p><strong>Community Stewardship in Action:</strong> When Maya was stranded, unfamiliar cars honked and slowed down. How should a community respond?</p>
          <p class="mt-2">The game champions <strong>Safe Bystander Intervention (The 5 Ds)</strong>: consensual de-escalation, shared presence in lit areas, and active solidarity rather than aggressive confrontation or passive neglect.</p>
          <div class="badge badge-success mt-2">Selected Choice: "+20 Pts • Promoted Safe Bystander Intervention"</div>
        </div>
      `,
      exec: () => {
        gameEngine.makeDialogueChoice('mission_1', 'bystander_safe_checkin');
        App.renderLocationInspection('univ_campus');
        App.renderRightPanel();
        App.showToast("Demo: Logged Safe Bystander Intervention (+20 pts).", "success");
      }
    },
    {
      title: "Step 4 of 6: Tactical Evidence Board & Root-Cause Deduction",
      badge: "Step 4 of 6",
      desc: `
        <div style="line-height:1.6;">
          <p><strong>Root-Cause Deduction:</strong> On the Evidence Board, players pin collected clues to formulate an evidence-backed hypothesis.</p>
          <p class="mt-2 text-accent">Superficial distractors (blaming Maya's timing or demanding invasive surveillance) are rejected. The true cause is systemic: <em>compounding neglect between deferred light repairs and silent transit schedule alterations</em>.</p>
          <div class="badge badge-success mt-2">Deduction Registered: "+25 Pts • Root Cause Accurately Identified"</div>
        </div>
      `,
      exec: () => {
        App.switchTab('evidence');
        App.selectedCluesForDeduction = new Set(["m1_clue_lamp", "m1_clue_schedule", "m1_clue_ticket"]);
        gameEngine.submitDeduction('mission_1', 'correct', ["m1_clue_lamp", "m1_clue_schedule", "m1_clue_ticket"]);
        App.renderEvidenceBoard();
        App.renderRightPanel();
        App.showToast("Demo: Deduction solved with supporting evidence (+25 pts).", "success");
      }
    },
    {
      title: "Step 5 of 6: Route Planning & Municipal Upgrades",
      badge: "Step 5 of 6",
      desc: `
        <div style="line-height:1.6;">
          <p><strong>Urban Infrastructure Investments:</strong> Nova allocates municipal credits from the 500 CR capital works budget into real physical improvements.</p>
          <p class="mt-2">Watch the city map: commissioning <strong>Pedestrian-Scale Smart Streetlights</strong> (100 CR) illuminates the avenues with warm light pools, and <strong>Real-Time Transit Displays</strong> (80 CR) eliminates schedule ghosting on Route B!</p>
          <div class="route-upgrade-callout mt-2">
            ✨ <strong>Route B Upgraded:</strong> Transforms into a 100% Lit, Gold-Standard Transit Corridor!
          </div>
        </div>
      `,
      exec: () => {
        gameEngine.purchaseUpgrade('repair_streetlights');
        gameEngine.purchaseUpgrade('update_bus_stop_info');
        gameEngine.selectRoute('mission_1', 'route_1_avenue');
        App.switchTab('map');
        App.renderCityMap();
        App.renderTopBar();
        App.renderRightPanel();
        App.showToast("Demo: Streetlights repaired! Corridors illuminated on map.", "success");
      }
    },
    {
      title: "Step 6 of 6: 100/100 Scorecard & Campaign Progression",
      badge: "Step 6 of 6",
      desc: `
        <div style="line-height:1.6;">
          <p><strong>Filing Findings & Campaign Impact:</strong> With all evidence collected, dialogue recorded, deduction solved, and infrastructure upgraded, Nova files mission findings.</p>
          <p class="mt-2">Mission 1 awards a perfect <strong>100/100 City Changemaker Scorecard</strong> and +180 CR budget! Decisions persist into Mission 2 (<em>The Silent Report</em>) and Mission 3 (<em>The Dark Crossing</em>), leading directly to the Grand Campaign Finale Dossier.</p>
          <div class="badge tier-changemaker mt-2">Achievement: CITY CHANGEMAKER (100 / 100 PTS)</div>
        </div>
      `,
      exec: () => {
        const scoreData = gameEngine.completeMission('mission_1');
        App.launchConfetti();
        App.openMissionDebriefModal(GAME_DATA.missions[0], scoreData);
        App.renderTopBar();
        App.showToast("Demo: Mission 1 completed with 100/100 Changemaker rating!", "success");
      }
    }
  ],

  start() {
    this.currentStep = 0;
    this.showStep(0);
    App.openModal('modal-demo-tour');
  },

  showStep(idx) {
    this.currentStep = Math.max(0, Math.min(this.steps.length - 1, idx));
    const step = this.steps[this.currentStep];

    const titleElem = document.getElementById('modal-demo-title');
    const badgeElem = document.getElementById('demo-step-badge');
    const contentElem = document.getElementById('demo-step-content');
    const prevBtn = document.getElementById('btn-demo-prev');
    const nextBtn = document.getElementById('btn-demo-next');

    if (titleElem) titleElem.textContent = step.title;
    if (badgeElem) badgeElem.textContent = step.badge;
    if (contentElem) contentElem.innerHTML = step.desc;

    if (prevBtn) prevBtn.disabled = (this.currentStep === 0);
    if (nextBtn) {
      if (this.currentStep === this.steps.length - 1) {
        nextBtn.textContent = "Finish Tour & Explore";
      } else {
        nextBtn.textContent = "Next Step →";
      }
    }
  },

  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.showStep(this.currentStep + 1);
    } else {
      App.closeModal('modal-demo-tour');
      App.showToast("Demo complete! Feel free to explore Aurelia City.", "success");
    }
  },

  prev() {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1);
    }
  },

  autoExecuteCurrentStep() {
    const step = this.steps[this.currentStep];
    if (step && typeof step.exec === 'function') {
      step.exec();
    }
  }
};
