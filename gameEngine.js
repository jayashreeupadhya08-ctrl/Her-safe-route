// HER SAFE ROUTE: THE SILENT SIGNAL
// Game Engine: State Management, Logic, Calculations, Persistence, and Scoring

class GameEngine {
  constructor() {
    this.storageKey = 'her_safe_route_v1_save';
    this.resetToDefaults();
  }

  resetToDefaults() {
    this.state = {
      screen: 'title',
      currentMissionIdx: 0,
      budget: GAME_DATA.initialBudget,
      discoveredClues: [],
      completedDeductions: {}, // missionId -> optionId
      dialogueChoices: {},     // missionId -> choiceId
      selectedRoutes: {},      // missionId -> routeId
      purchasedUpgrades: [],   // [upgradeId, ...]
      missionScores: {},       // missionId -> { total, breakdown, tier }
      completedMissions: [],   // [missionId, ...]
      selectedLocationId: 'univ_campus',
      activeTab: 'map',
      historyLogs: [],
      customHazards: [],
      hazardUpvotes: {},
      navigationState: {
        originId: 'univ_campus',
        destinationId: 'central_bus_stop',
        selectedPathType: 'safest',
        isNavigating: false,
        stepIdx: 0
      },
      sosState: {
        isTriggered: false,
        dispatchedTime: null,
        activeSafeHavenId: null,
        isCovert: false
      },
      settings: {
        sound: true,
        volume: 0.4,
        reducedMotion: false,
        textSize: 'normal', // 'normal', 'large', 'xlarge'
        highContrast: false
      },
      cityRemembers: {
        streetlightsRepaired: false,
        crossingImproved: false,
        busInfoUpdated: false,
        busAccessibilityImproved: false,
        communityHelpPointActive: false,
        complaintPortalReformed: false,
        bystanderApproach: null,
        institutionalStance: null,
        accessibilityPhilosophy: null
      }
    };
  }

  // Load from LocalStorage with error safety
  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          this.state = Object.assign({}, this.state, parsed);
          // Sync sound engine
          if (window.soundEngine) {
            soundEngine.toggleSound(this.state.settings.sound);
            soundEngine.setVolume(this.state.settings.volume);
          }
          return true;
        }
      }
    } catch (e) {
      console.warn("Could not parse saved game state:", e);
    }
    return false;
  }

  // Save to LocalStorage
  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Could not save game state:", e);
    }
  }

  hasSavedGame() {
    return !!localStorage.getItem(this.storageKey);
  }

  resetProgress() {
    localStorage.removeItem(this.storageKey);
    this.resetToDefaults();
  }

  // Current Mission helper
  getCurrentMission() {
    const idx = Math.min(this.state.currentMissionIdx, GAME_DATA.missions.length - 1);
    return GAME_DATA.missions[idx];
  }

  // Rank title helper
  getInvestigatorRank() {
    const completedCount = this.state.completedMissions.length;
    const totalScore = this.getTotalScore();
    if (completedCount >= 3 || totalScore >= 260) {
      return { title: "Chief Civic Changemaker", badge: "Gold Investigator", level: 3 };
    } else if (completedCount >= 1 || totalScore >= 80) {
      return { title: "Senior Urban Detective", badge: "Silver Investigator", level: 2 };
    }
    return { title: "Junior Field Investigator", badge: "Bronze Investigator", level: 1 };
  }

  getTotalScore() {
    let sum = 0;
    Object.values(this.state.missionScores).forEach(s => {
      sum += (s.total || 0);
    });
    return sum;
  }

  // Clue discovery
  discoverClue(clueId) {
    if (!this.state.discoveredClues.includes(clueId)) {
      this.state.discoveredClues.push(clueId);
      this.addLog(`Discovered evidence: ${this.getClueById(clueId)?.title || clueId}`);
      if (window.soundEngine) soundEngine.playClueDiscovered();
      this.saveState();
      return true;
    }
    return false;
  }

  isClueDiscovered(clueId) {
    return this.state.discoveredClues.includes(clueId);
  }

  getClueById(clueId) {
    for (const m of GAME_DATA.missions) {
      const clue = m.clues.find(c => c.id === clueId);
      if (clue) return clue;
    }
    return null;
  }

  getDiscoveredCluesForMission(missionId) {
    const mission = GAME_DATA.missions.find(m => m.id === missionId);
    if (!mission) return [];
    return mission.clues.filter(c => this.isClueDiscovered(c.id));
  }

  // City Upgrades
  isUpgradePurchased(upgradeId) {
    return this.state.purchasedUpgrades.includes(upgradeId);
  }

  canAffordUpgrade(upgradeId) {
    const upg = GAME_DATA.upgrades.find(u => u.id === upgradeId);
    if (!upg) return false;
    return this.state.budget >= upg.cost && !this.isUpgradePurchased(upgradeId);
  }

  purchaseUpgrade(upgradeId) {
    const upg = GAME_DATA.upgrades.find(u => u.id === upgradeId);
    if (!upg) return { success: false, message: "Upgrade not found." };
    if (this.isUpgradePurchased(upgradeId)) {
      return { success: false, message: "This improvement has already been completed." };
    }
    if (this.state.budget < upg.cost) {
      return { success: false, message: `Insufficient municipal funds. Requires ${upg.cost} credits.` };
    }

    this.state.budget -= upg.cost;
    this.state.purchasedUpgrades.push(upgradeId);

    // Apply persistent city consequence
    if (upgradeId === 'repair_streetlights') this.state.cityRemembers.streetlightsRepaired = true;
    if (upgradeId === 'improve_pedestrian_crossing') this.state.cityRemembers.crossingImproved = true;
    if (upgradeId === 'update_bus_stop_info') this.state.cityRemembers.busInfoUpdated = true;
    if (upgradeId === 'improve_bus_accessibility') this.state.cityRemembers.busAccessibilityImproved = true;
    if (upgradeId === 'community_help_point') this.state.cityRemembers.communityHelpPointActive = true;
    if (upgradeId === 'improve_complaint_procedures') this.state.cityRemembers.complaintPortalReformed = true;

    this.addLog(`Commissioned public improvement: ${upg.title} (-${upg.cost} credits).`);
    if (window.soundEngine) soundEngine.playUpgradePurchased();
    this.saveState();

    return {
      success: true,
      message: `Successfully commissioned: ${upg.title}! Public spaces have been upgraded.`,
      upgrade: upg
    };
  }

  // Branching Dialogue Choice
  makeDialogueChoice(missionId, choiceId) {
    const mission = GAME_DATA.missions.find(m => m.id === missionId);
    if (!mission) return null;
    const choice = mission.dialogue.choices.find(c => c.id === choiceId);
    if (!choice) return null;

    this.state.dialogueChoices[missionId] = choiceId;

    if (missionId === 'mission_1') this.state.cityRemembers.bystanderApproach = choiceId;
    if (missionId === 'mission_2') this.state.cityRemembers.institutionalStance = choiceId;
    if (missionId === 'mission_3') this.state.cityRemembers.accessibilityPhilosophy = choiceId;

    this.addLog(`Dialogue decision logged: "${choice.impactTag}"`);
    this.saveState();
    return choice;
  }

  // Route Selection
  selectRoute(missionId, routeId) {
    this.state.selectedRoutes[missionId] = routeId;
    const mission = GAME_DATA.missions.find(m => m.id === missionId);
    const route = mission ? mission.routes.find(r => r.id === routeId) : null;
    if (window.soundEngine) soundEngine.playRouteSelected();
    this.addLog(`Selected journey plan: ${route ? route.name : routeId}`);
    this.saveState();
  }

  // Deduction validation
  submitDeduction(missionId, optionId, selectedClueIds) {
    const mission = GAME_DATA.missions.find(m => m.id === missionId);
    if (!mission) return { success: false, message: "Mission not found." };

    const option = mission.deduction.options.find(o => o.id === optionId);
    if (!option) return { success: false, message: "Please select an explanation." };

    // Check if player selected the required clues
    const missingClues = option.requiredClues.filter(cId => !selectedClueIds.includes(cId));
    if (missingClues.length > 0) {
      if (window.soundEngine) soundEngine.playDeductionFail();
      return {
        success: false,
        isCorrect: false,
        message: `Your hypothesis lacks sufficient corroborating evidence. Select clues directly supporting this conclusion on the board.`,
        missingCount: missingClues.length
      };
    }

    this.state.completedDeductions[missionId] = optionId;
    if (option.isCorrect) {
      if (window.soundEngine) soundEngine.playDeductionSuccess();
      this.addLog(`Deduction solved: ${option.text.substring(0, 40)}...`);
    } else {
      if (window.soundEngine) soundEngine.playDeductionFail();
    }
    this.saveState();

    return {
      success: true,
      isCorrect: option.isCorrect,
      score: option.score,
      feedback: option.feedback,
      option: option
    };
  }

  // Compute Mission Score out of 100
  calculateMissionScore(missionId) {
    const mission = GAME_DATA.missions.find(m => m.id === missionId);
    if (!mission) return null;

    let investigationPts = 0;
    let routePts = 0;
    let responsePts = 0;
    let upgradePts = 0;
    let budgetPts = 10; // Default disciplined budget points

    // 1. Investigation & Evidence (Max 25 pts)
    const discoveredClues = this.getDiscoveredCluesForMission(missionId);
    const clueRatio = discoveredClues.length / mission.clues.length;
    investigationPts = Math.round(clueRatio * 15); // up to 15 for clues
    
    // Deduction accuracy (up to 10)
    const deductionId = this.state.completedDeductions[missionId];
    if (deductionId) {
      const deductionOpt = mission.deduction.options.find(o => o.id === deductionId);
      if (deductionOpt && deductionOpt.isCorrect) {
        investigationPts += 10;
      } else if (deductionOpt) {
        investigationPts += 3;
      }
    }
    investigationPts = Math.min(25, investigationPts);

    // 2. Route Planning (Max 20 pts)
    const selectedRouteId = this.state.selectedRoutes[missionId];
    if (selectedRouteId) {
      const route = mission.routes.find(r => r.id === selectedRouteId);
      if (route) {
        if (route.suitability === "Recommended") {
          routePts = 20;
        } else if (route.suitability === "Critical Upgrade Target") {
          // In Mission 3, selecting direct route with upgrades is prime
          routePts = (this.isUpgradePurchased("improve_pedestrian_crossing")) ? 20 : 12;
        } else if (route.suitability === "Conditional") {
          routePts = (this.isUpgradePurchased("community_help_point")) ? 20 : 14;
        } else if (route.suitability === "Caution" || route.suitability === "Secondary") {
          routePts = 12;
        } else {
          routePts = 6; // High hazard choice
        }
      }
    }

    // 3. Appropriate Responses (Max 20 pts)
    const dialogueChoiceId = this.state.dialogueChoices[missionId];
    if (dialogueChoiceId) {
      const choice = mission.dialogue.choices.find(c => c.id === dialogueChoiceId);
      if (choice) {
        responsePts = choice.points;
      }
    }

    // 4. Quality of Improvements (Max 25 pts)
    // Check which relevant upgrades were purchased
    let relevantUpgradesCount = 0;
    if (missionId === 'mission_1') {
      if (this.isUpgradePurchased('repair_streetlights')) relevantUpgradesCount += 13;
      if (this.isUpgradePurchased('update_bus_stop_info')) relevantUpgradesCount += 12;
    } else if (missionId === 'mission_2') {
      if (this.isUpgradePurchased('improve_complaint_procedures')) relevantUpgradesCount += 13;
      if (this.isUpgradePurchased('community_help_point')) relevantUpgradesCount += 12;
    } else if (missionId === 'mission_3') {
      if (this.isUpgradePurchased('improve_pedestrian_crossing')) relevantUpgradesCount += 13;
      if (this.isUpgradePurchased('improve_bus_accessibility')) relevantUpgradesCount += 12;
    }
    upgradePts = Math.min(25, relevantUpgradesCount);

    // 5. Budget Management (Max 10 pts)
    if (this.state.budget < 0) {
      budgetPts = 0;
    } else if (this.state.budget >= 100) {
      budgetPts = 10;
    } else {
      budgetPts = 7;
    }

    const total = investigationPts + routePts + responsePts + upgradePts + budgetPts;

    let tier = "INVESTIGATION CONTINUES";
    let tierClass = "tier-review";
    if (total >= 90) {
      tier = "CITY CHANGEMAKER";
      tierClass = "tier-changemaker";
    } else if (total >= 70) {
      tier = "COMMUNITY CHAMPION";
      tierClass = "tier-champion";
    }

    const scoreData = {
      total,
      tier,
      tierClass,
      breakdown: {
        investigation: investigationPts,
        routePlanning: routePts,
        appropriateResponse: responsePts,
        qualityUpgrades: upgradePts,
        budgetManagement: budgetPts
      }
    };

    return scoreData;
  }

  // Complete Mission and award reward
  completeMission(missionId) {
    const mission = GAME_DATA.missions.find(m => m.id === missionId);
    if (!mission) return null;

    const scoreData = this.calculateMissionScore(missionId);
    this.state.missionScores[missionId] = scoreData;

    if (!this.state.completedMissions.includes(missionId)) {
      this.state.completedMissions.push(missionId);
      // Award completion budget credits once
      this.state.budget += mission.rewardCredits;
      this.addLog(`Mission completed: ${mission.title}! Awarded ${mission.rewardCredits} municipal credits.`);
    }

    if (window.soundEngine) soundEngine.playMissionComplete();
    this.saveState();
    return scoreData;
  }

  // Advance to next mission
  advanceToNextMission() {
    if (this.state.currentMissionIdx < GAME_DATA.missions.length - 1) {
      this.state.currentMissionIdx += 1;
      this.state.activeTab = 'map';
      this.saveState();
      return true;
    }
    return false; // Campaign finished
  }

  addLog(entry) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.state.historyLogs.unshift(`[${timestamp}] ${entry}`);
    if (this.state.historyLogs.length > 40) {
      this.state.historyLogs.pop();
    }
  }

  // Final Campaign Dossier Evaluation
  generateCampaignSummary() {
    const totalScore = this.getTotalScore();
    const completedCount = this.state.completedMissions.length;
    const cluesFound = this.state.discoveredClues.length;
    const totalClues = GAME_DATA.missions.reduce((acc, m) => acc + m.clues.length, 0);
    const upgradesDone = this.state.purchasedUpgrades.length;

    let verdict = GAME_DATA.campaignTitles.changemaker;
    if (totalScore < 210) {
      verdict = GAME_DATA.campaignTitles.investigator;
    } else if (totalScore < 260) {
      verdict = GAME_DATA.campaignTitles.champion;
    }

    return {
      totalScore,
      maxPossibleScore: 300,
      verdict,
      missionsCompleted: completedCount,
      cluesFound,
      totalClues,
      upgradesCompleted: upgradesDone,
      totalUpgrades: GAME_DATA.upgrades.length,
      remainingCredits: this.state.budget,
      cityChanges: {
        streetlights: this.state.cityRemembers.streetlightsRepaired,
        crossings: this.state.cityRemembers.crossingImproved,
        busInfo: this.state.cityRemembers.busInfoUpdated,
        accessibility: this.state.cityRemembers.busAccessibilityImproved,
        helpPoint: this.state.cityRemembers.communityHelpPointActive,
        complaintPortal: this.state.cityRemembers.complaintPortalReformed
      }
    };
  }

  // =========================================================================
  // REAL-TIME SAFETY NAVIGATION, CROWDSOURCING & SOS DISPATCH SYSTEM
  // =========================================================================

  getAllHazards() {
    const base = GAME_DATA.crowdsourcedHazards || [];
    const custom = this.state.customHazards || [];
    const all = [...custom, ...base];
    return all.map(h => {
      const isResolved = h.resolvedByUpgrade ? this.isUpgradePurchased(h.resolvedByUpgrade) : false;
      const userUpvoted = !!this.state.hazardUpvotes[h.id];
      const effectiveUpvotes = (h.upvotes || 0) + (userUpvoted ? 1 : 0);
      return Object.assign({}, h, { isResolved, userUpvoted, effectiveUpvotes });
    });
  }

  upvoteHazard(hazardId) {
    if (!this.state.hazardUpvotes) this.state.hazardUpvotes = {};
    const current = !!this.state.hazardUpvotes[hazardId];
    this.state.hazardUpvotes[hazardId] = !current;
    if (window.soundEngine) soundEngine.playClick();
    this.saveState();
    return !current;
  }

  reportCustomHazard(data) {
    if (!this.state.customHazards) this.state.customHazards = [];
    const loc = GAME_DATA.locations.find(l => l.id === data.locationId) || GAME_DATA.locations[0];
    const newHazard = {
      id: `custom_${Date.now()}`,
      locationId: data.locationId,
      category: data.category || "unlit_corridor",
      title: data.title || "Community Reported Hazard",
      description: data.description || "Reported by resident via Aurelia Civic Safety Network.",
      severity: data.severity || "high",
      reportedBy: data.isAnonymous ? "Anonymous Resident" : "Nova (Investigator)",
      timeAgo: "Just now",
      upvotes: 1,
      resolvedByUpgrade: data.category === "unlit_corridor" ? "repair_streetlights" :
                         (data.category === "broken_curb" ? "improve_pedestrian_crossing" :
                         (data.category === "ghost_schedule" ? "update_bus_stop_info" : "community_help_point")),
      x: loc.x + (Math.random() * 20 - 10),
      y: loc.y + (Math.random() * 20 - 10)
    };

    this.state.customHazards.unshift(newHazard);
    this.addLog(`Logged crowdsourced hazard: "${newHazard.title}" at ${loc.name}.`);
    if (window.soundEngine) soundEngine.playHazardReported();
    this.saveState();
    return newHazard;
  }

  // Calculate Real-Time Dynamic Safety Rating (0-100%)
  calculateSafetyRating(originId, destId, pathType = "safest") {
    let score = (pathType === "safest") ? 72 : (pathType === "fastest" ? 54 : 32);

    // Apply municipal infrastructure bonuses
    if (this.state.cityRemembers.streetlightsRepaired) score += (pathType === "safest" ? 8 : 6);
    if (this.state.cityRemembers.crossingImproved) score += (pathType === "safest" ? 7 : 5);
    if (this.state.cityRemembers.busInfoUpdated) score += (pathType === "safest" ? 5 : 4);
    if (this.state.cityRemembers.communityHelpPointActive) score += (pathType === "safest" ? 6 : 4);
    if (this.state.cityRemembers.busAccessibilityImproved) score += (pathType === "safest" ? 4 : 3);

    // Deduct for active (unresolved) hazards affecting either origin, destination or connecting corridors
    const hazards = this.getAllHazards().filter(h => !h.isResolved);
    const relevantHazards = hazards.filter(h => h.locationId === originId || h.locationId === destId);
    score -= (relevantHazards.length * 8);

    // Bounded cap per path category
    const maxCap = (pathType === "safest") ? 99 : (pathType === "fastest" ? 86 : 68);
    return Math.max(18, Math.min(maxCap, Math.round(score)));
  }

  // Identify 3 Nearest 24/7 Verified Safe Havens
  getNearestSafeHavens(locationId) {
    const originLoc = GAME_DATA.locations.find(l => l.id === locationId) || GAME_DATA.locations[0];
    const havens = (GAME_DATA.safeHavens || []).map(sh => {
      const dx = sh.x - originLoc.x;
      const dy = sh.y - originLoc.y;
      const distMeters = Math.round(Math.sqrt(dx * dx + dy * dy) * 4.2); // scale to meters
      const estWalkMins = Math.max(1, Math.round(distMeters / 75));
      return Object.assign({}, sh, { distanceMeters: distMeters, walkMins: estWalkMins });
    });

    havens.sort((a, b) => a.distanceMeters - b.distanceMeters);
    return havens;
  }

  triggerSOS(locationId) {
    if (!this.state.sosState) this.state.sosState = {};
    const nearestHavens = this.getNearestSafeHavens(locationId);
    this.state.sosState.isTriggered = true;
    this.state.sosState.dispatchedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.state.sosState.activeSafeHavenId = nearestHavens.length > 0 ? nearestHavens[0].id : null;
    this.addLog(`🚨 EMERGENCY SOS DISPATCHED: Live telemetry sent to Guardians & Escorts. Nearest Haven: ${nearestHavens[0]?.name}`);
    this.saveState();
    return {
      dispatchedTime: this.state.sosState.dispatchedTime,
      nearestHavens
    };
  }

  cancelSOS() {
    if (!this.state.sosState) this.state.sosState = {};
    this.state.sosState.isTriggered = false;
    this.state.sosState.activeSafeHavenId = null;
    this.addLog("SOS Alert cancelled by user.");
    this.saveState();
  }
}

// Global game engine singleton
const gameEngine = new GameEngine();
