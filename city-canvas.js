/**
 * HER SAFE ROUTE: THE SILENT SIGNAL
 * Interactive 2D City Map Canvas Renderer
 * Renders an animated nighttime Indian neighborhood (Anand Nagar)
 * with dynamic visual transformations across 10 progressive urban levels.
 */

class CityMapCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Base coordinate system
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // Checkpoints on the map (10 progressive urban levels)
    this.checkpoints = [
      {
        id: 0,
        name: "Level 1: Gali No. 4 (The Dark Street)",
        shortName: "1. Dark Alley",
        x: 75,
        y: 440,
        status: "current",
        isTransformed: false,
        icon: "💡",
        hazard: "Burned out sodium lamps, 90° blind corner",
        upgrade: "Solar LED fixtures & convex corner safety mirror"
      },
      {
        id: 1,
        name: "Level 2: Railway Pedestrian Subway",
        shortName: "2. Subway",
        x: 160,
        y: 385,
        status: "locked",
        isTransformed: false,
        icon: "🚇",
        hazard: "Flickering tubes, water seepage, zero mobile signal",
        upgrade: "Reflective white walls, blue SOS call station & LED strips"
      },
      {
        id: 2,
        name: "Level 3: Ring Road Bus Shelter",
        shortName: "3. Bus Stop",
        x: 245,
        y: 315,
        status: "locked",
        isTransformed: false,
        icon: "🚌",
        hazard: "Dark tin shelter, missing schedule, isolated wait",
        upgrade: "Solar Smart Shelter with SOS button, CCTV & transit warden"
      },
      {
        id: 3,
        name: "Level 4: Main Bazaar Market",
        shortName: "4. Bazaar",
        x: 335,
        y: 375,
        status: "locked",
        isTransformed: false,
        icon: "🏪",
        hazard: "Shuttered shops, zero eyes on the street",
        upgrade: "24/7 Chai Tapri & Medical Safe Havens with verandah lights"
      },
      {
        id: 4,
        name: "Level 5: Nehru Udyan City Park",
        shortName: "5. City Park",
        x: 425,
        y: 290,
        status: "locked",
        isTransformed: false,
        icon: "🌳",
        hazard: "Overgrown 8-foot shrubs, broken fence, blind park path",
        upgrade: "CPTED pruned hedges, see-through railings & solar lanterns"
      },
      {
        id: 5,
        name: "Level 6: Metro Station Auto Hub",
        shortName: "6. Metro Hub",
        x: 515,
        y: 360,
        status: "locked",
        isTransformed: false,
        icon: "🛺",
        hazard: "Unregistered drivers, touting, passenger intimidation",
        upgrade: "Pink Safety Kiosk, QR verified drivers & bystander circle"
      },
      {
        id: 6,
        name: "Level 7: Feeder E-Rickshaw Lane",
        shortName: "7. Feeder Lane",
        x: 605,
        y: 275,
        status: "locked",
        isTransformed: false,
        icon: "⚡",
        hazard: "Unlit unpaved connector lane, route deviation risk",
        upgrade: "Official Women's Night Feeder Corridor with high-mast LED"
      },
      {
        id: 7,
        name: "Level 8: Reclaimed Corner Hub",
        shortName: "8. Corner Hub",
        x: 695,
        y: 340,
        status: "locked",
        isTransformed: false,
        icon: "☕",
        hazard: "Rowdy loiterers blocking sidewalk, catcalling",
        upgrade: "Community tea stall, citizen watch bench & festoon lights"
      },
      {
        id: 8,
        name: "Level 9: Public Community Plaza",
        shortName: "9. Plaza Alert",
        x: 770,
        y: 215,
        status: "locked",
        isTransformed: false,
        icon: "✋",
        hazard: "Distress situation in crowd needing discrete intervention",
        upgrade: "Universal Silent Signal network & rapid merchant response"
      },
      {
        id: 9,
        name: "Level 10: Home Haven & Safe Square",
        shortName: "10. Home Haven",
        x: 835,
        y: 100,
        status: "locked",
        isTransformed: false,
        icon: "🏡",
        hazard: "Isolated residential approach road",
        upgrade: "Night Walkers sanctuary, full neighborhood community shield"
      }
    ];

    // Player Avatar animation position
    this.currentCheckpointIndex = 0;
    this.avatarPos = { x: this.checkpoints[0].x, y: this.checkpoints[0].y };
    this.targetPos = { x: this.checkpoints[0].x, y: this.checkpoints[0].y };
    this.isWalking = false;

    // Moving Auto-Rickshaw vehicle
    this.autoRickshaw = {
      x: -50,
      y: 440,
      speed: 1.4,
      targetY: 440
    };

    // Stars & Particles
    this.stars = [];
    this.initStars();

    // Visual State Preview
    this.previewFullIllumination = false;

    // Animation loop timer
    this.animationFrameId = null;
    this.time = 0;

    // Mouse & Touch interaction
    this.hoveredCheckpoint = null;
    this.bindEvents();

    // Start loop
    this.animate = this.animate.bind(this);
    this.animate();
  }

  initStars() {
    this.stars = [];
    for (let i = 0; i < 75; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.45),
        radius: Math.random() * 1.5 + 0.5,
        twinkleSpeed: Math.random() * 0.05 + 0.02,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? '#ffffff' : (Math.random() > 0.5 ? '#00f5d4' : '#b388ff')
      });
    }
  }

  bindEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      this.handlePointerMove(e.clientX, e.clientY);
    });

    this.canvas.addEventListener('click', (e) => {
      this.handlePointerClick(e.clientX, e.clientY);
    });

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        this.handlePointerMove(touch.clientX, touch.clientY);
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      if (this.hoveredCheckpoint && window.onCheckpointClicked) {
        window.onCheckpointClicked(this.hoveredCheckpoint);
      }
    });
  }

  handlePointerMove(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.width / rect.width;
    const scaleY = this.height / rect.height;
    const mouseX = (clientX - rect.left) * scaleX;
    const mouseY = (clientY - rect.top) * scaleY;

    let found = null;
    for (const cp of this.checkpoints) {
      const dx = mouseX - cp.x;
      const dy = mouseY - cp.y;
      if (Math.hypot(dx, dy) < 26) {
        found = cp;
        break;
      }
    }

    if (found !== this.hoveredCheckpoint && found && window.soundSystem) {
      window.soundSystem.playClick();
    }

    this.hoveredCheckpoint = found;
    this.canvas.style.cursor = found ? 'pointer' : 'default';
  }

  handlePointerClick(clientX, clientY) {
    this.handlePointerMove(clientX, clientY);
    if (this.hoveredCheckpoint && window.onCheckpointClicked) {
      window.onCheckpointClicked(this.hoveredCheckpoint);
    }
  }

  setMissionState(index, transformed = false) {
    this.currentCheckpointIndex = Math.min(index, this.checkpoints.length - 1);

    for (let i = 0; i < this.checkpoints.length; i++) {
      if (i < this.currentCheckpointIndex) {
        this.checkpoints[i].status = "completed";
      } else if (i === this.currentCheckpointIndex) {
        this.checkpoints[i].status = "current";
      } else {
        this.checkpoints[i].status = "locked";
      }
    }

    if (transformed && this.checkpoints[index]) {
      this.checkpoints[index].isTransformed = true;
    }

    // Set walking target for Priya
    const targetCP = this.checkpoints[this.currentCheckpointIndex];
    if (targetCP) {
      this.targetPos = { x: targetCP.x, y: targetCP.y };
      this.isWalking = true;
    }
  }

  markTransformed(index) {
    if (this.checkpoints[index]) {
      this.checkpoints[index].isTransformed = true;
    }
  }

  togglePreviewIllumination() {
    this.previewFullIllumination = !this.previewFullIllumination;
    return this.previewFullIllumination;
  }

  // ==========================================================================
  // MAIN DRAW CYCLE
  // ==========================================================================
  animate() {
    this.time += 0.03;
    this.update();
    this.draw();
    this.animationFrameId = (window.requestAnimationFrame || function (fn) { return setTimeout(fn, 16); })(this.animate);
  }

  update() {
    // Smoothly interpolate Priya toward target checkpoint
    const dx = this.targetPos.x - this.avatarPos.x;
    const dy = this.targetPos.y - this.avatarPos.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 1.5) {
      this.avatarPos.x += dx * 0.06;
      this.avatarPos.y += dy * 0.06;
      if (Math.random() < 0.08 && window.soundSystem) {
        window.soundSystem.playFootstep();
      }
    } else {
      this.avatarPos.x = this.targetPos.x;
      this.avatarPos.y = this.targetPos.y;
      this.isWalking = false;
    }

    // Move ambient Auto-Rickshaw
    this.autoRickshaw.x += this.autoRickshaw.speed;
    if (this.autoRickshaw.x > this.width + 60) {
      this.autoRickshaw.x = -60;
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Night Sky & Stars
    this.drawSky();

    // 2. Draw Distant Skyline
    this.drawSkyline();

    // 3. Draw Roadway & Crossings
    this.drawRoadways();

    // 4. Draw Landmarks for 10 Levels
    this.drawLandmarks();

    // 5. Draw Auto-Rickshaw
    this.drawAutoRickshaw();

    // 6. Draw 10 Checkpoint Pins
    this.drawCheckpointPins();

    // 7. Draw Priya Avatar
    this.drawPriyaAvatar();

    // 8. Draw Atmospheric Light Vignette
    this.drawAtmosphericLight();
  }

  // 1. Sky & Twinkling Stars
  drawSky() {
    const ctx = this.ctx;
    const skyGradient = ctx.createLinearGradient(0, 0, 0, this.height * 0.65);
    skyGradient.addColorStop(0, '#060913');
    skyGradient.addColorStop(0.5, '#0c1324');
    skyGradient.addColorStop(1, '#141d33');

    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw Moon
    ctx.save();
    ctx.beginPath();
    ctx.arc(840, 50, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#fff9db';
    ctx.shadowColor = 'rgba(255, 249, 219, 0.6)';
    ctx.shadowBlur = 35;
    ctx.fill();

    // Moon crater
    ctx.beginPath();
    ctx.arc(834, 48, 24, 0, Math.PI * 2);
    ctx.fillStyle = '#0e1628';
    ctx.fill();
    ctx.restore();

    // Draw Stars
    ctx.save();
    for (const star of this.stars) {
      const alpha = 0.35 + 0.65 * Math.sin(this.time * star.twinkleSpeed * 40 + star.twinkleOffset);
      ctx.globalAlpha = Math.max(0.1, alpha);
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 2. Skyline
  drawSkyline() {
    const ctx = this.ctx;
    ctx.save();

    const buildings = [
      { x: 20, w: 75, h: 140, windows: true },
      { x: 100, w: 65, h: 110, dish: true },
      { x: 170, w: 90, h: 170, sintex: true, windows: true },
      { x: 265, w: 55, h: 95 },
      { x: 325, w: 105, h: 185, dish: true, windows: true },
      { x: 435, w: 75, h: 125, sintex: true },
      { x: 515, w: 100, h: 160, tower: true, windows: true },
      { x: 620, w: 65, h: 120 },
      { x: 690, w: 85, h: 150, windows: true },
      { x: 780, w: 100, h: 175, windows: true }
    ];

    const baseY = 240;

    for (const b of buildings) {
      ctx.fillStyle = '#0a101f';
      ctx.fillRect(b.x, baseY - b.h, b.w, b.h);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.strokeRect(b.x, baseY - b.h, b.w, b.h);

      if (b.sintex) {
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(b.x + b.w / 2 - 10, baseY - b.h - 16, 20, 16, 4);
        ctx.fill();
        ctx.strokeStyle = '#00f5d4';
        ctx.stroke();
      }

      if (b.dish) {
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(b.x + 18, baseY - b.h);
        ctx.lineTo(b.x + 18, baseY - b.h - 16);
        ctx.arc(b.x + 18, baseY - b.h - 20, 8, 0.6, 2.8);
        ctx.stroke();
      }

      if (b.tower) {
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(b.x + b.w / 2 - 14, baseY - b.h);
        ctx.lineTo(b.x + b.w / 2, baseY - b.h - 36);
        ctx.lineTo(b.x + b.w / 2 + 14, baseY - b.h);
        ctx.stroke();

        const blink = Math.sin(this.time * 6) > 0.3;
        if (blink) {
          ctx.fillStyle = '#ff0055';
          ctx.shadowColor = '#ff0055';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(b.x + b.w / 2, baseY - b.h - 38, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      if (b.windows) {
        const rows = Math.floor(b.h / 28);
        const cols = Math.floor(b.w / 22);
        for (let r = 1; r < rows; r++) {
          for (let c = 1; c < cols; c++) {
            const winX = b.x + c * 20 - 4;
            const winY = baseY - b.h + r * 25;
            const isLit = ((b.x + r * 7 + c * 3) % 4 === 0);
            ctx.fillStyle = isLit ? 'rgba(255, 214, 10, 0.55)' : 'rgba(255, 255, 255, 0.04)';
            ctx.fillRect(winX, winY, 7, 11);
          }
        }
      }
    }

    // Overhead power lines
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 160);
    ctx.bezierCurveTo(250, 195, 550, 185, 900, 150);
    ctx.stroke();

    ctx.restore();
  }

  // 3. Winding Roadways for 10 Checkpoints
  drawRoadways() {
    const ctx = this.ctx;
    ctx.save();

    // Ground Base
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 220, this.width, this.height - 220);

    // Main asphalt road winding through all 10 nodes
    ctx.fillStyle = '#172033';
    ctx.beginPath();
    ctx.moveTo(0, 480);
    ctx.quadraticCurveTo(150, 470, 240, 390);
    ctx.quadraticCurveTo(320, 310, 420, 360);
    ctx.quadraticCurveTo(510, 420, 600, 340);
    ctx.quadraticCurveTo(690, 260, 780, 280);
    ctx.quadraticCurveTo(840, 200, 900, 180);
    ctx.lineTo(900, 90);
    ctx.quadraticCurveTo(810, 110, 740, 190);
    ctx.quadraticCurveTo(660, 270, 570, 250);
    ctx.quadraticCurveTo(480, 320, 390, 270);
    ctx.quadraticCurveTo(300, 220, 210, 300);
    ctx.quadraticCurveTo(120, 370, 0, 390);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Dashed Center Divider
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([14, 14]);
    ctx.beginPath();
    ctx.moveTo(10, 435);
    ctx.quadraticCurveTo(145, 425, 230, 350);
    ctx.quadraticCurveTo(315, 275, 410, 315);
    ctx.quadraticCurveTo(500, 370, 590, 295);
    ctx.quadraticCurveTo(680, 220, 765, 240);
    ctx.quadraticCurveTo(825, 160, 890, 140);
    ctx.stroke();
    ctx.setLineDash([]);

    // Zebra Crossings
    this.drawZebraCrossing(70, 430, 40, 10);
    this.drawZebraCrossing(235, 310, 35, 10);
    this.drawZebraCrossing(415, 280, 35, 10);
    this.drawZebraCrossing(595, 270, 35, 10);
    this.drawZebraCrossing(760, 210, 35, 10);

    ctx.restore();
  }

  drawZebraCrossing(x, y, w, h) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    const stripes = 5;
    const stripeW = w / stripes - 3;
    for (let i = 0; i < stripes; i++) {
      ctx.fillRect(x + i * (stripeW + 3), y, stripeW, h);
    }
    ctx.restore();
  }

  // 4. Landmarks for All 10 Levels
  drawLandmarks() {
    const ctx = this.ctx;

    // Level 1: Dark Street
    const isTrans1 = this.checkpoints[0].isTransformed || this.previewFullIllumination;
    this.drawStreetLamp(50, 460, isTrans1, isTrans1 ? '#00f5d4' : '#ffb703', !isTrans1);
    if (isTrans1) {
      this.drawSafetyMirror(95, 430);
    }

    // Level 2: Subway Underpass
    const isTrans2 = this.checkpoints[1].isTransformed || this.previewFullIllumination;
    this.drawSubway(160, 375, isTrans2);

    // Level 3: Bus Shelter
    const isTrans3 = this.checkpoints[2].isTransformed || this.previewFullIllumination;
    this.drawBusStop(245, 305, isTrans3);

    // Level 4: Market Bazaar
    const isTrans4 = this.checkpoints[3].isTransformed || this.previewFullIllumination;
    this.drawMarket(335, 365, isTrans4);

    // Level 5: City Park
    const isTrans5 = this.checkpoints[4].isTransformed || this.previewFullIllumination;
    this.drawPark(425, 275, isTrans5);

    // Level 6: Metro Auto Hub
    const isTrans6 = this.checkpoints[5].isTransformed || this.previewFullIllumination;
    this.drawMetroHub(515, 350, isTrans6);

    // Level 7: Feeder Lane
    const isTrans7 = this.checkpoints[6].isTransformed || this.previewFullIllumination;
    this.drawFeederLane(605, 260, isTrans7);

    // Level 8: Reclaimed Corner
    const isTrans8 = this.checkpoints[7].isTransformed || this.previewFullIllumination;
    this.drawReclaimedCorner(695, 330, isTrans8);

    // Level 9: Plaza Signal
    const isTrans9 = this.checkpoints[8].isTransformed || this.previewFullIllumination;
    this.drawPlazaAlert(770, 205, isTrans9);

    // Level 10: Home Sanctuary
    const isTrans10 = this.checkpoints[9].isTransformed || this.previewFullIllumination;
    this.drawHomeHaven(835, 90, isTrans10);
  }

  // --- LANDMARK RENDERERS ---

  drawSafetyMirror(x, y) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 7px sans-serif';
    ctx.fillText('WARD 14', x - 15, y + 18);
    ctx.restore();
  }

  drawSubway(x, y, isTransformed) {
    const ctx = this.ctx;
    ctx.save();
    // Subway Archway
    ctx.fillStyle = isTransformed ? '#f8fafc' : '#1e293b';
    ctx.beginPath();
    ctx.roundRect(x - 24, y - 32, 48, 32, 6);
    ctx.fill();
    ctx.strokeStyle = isTransformed ? '#00f5d4' : '#475569';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Railway tracks on top
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 30, y - 34);
    ctx.lineTo(x + 30, y - 34);
    ctx.moveTo(x - 30, y - 37);
    ctx.lineTo(x + 30, y - 37);
    ctx.stroke();

    if (isTransformed) {
      // Blue Emergency SOS Light
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y - 24, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 6px sans-serif';
      ctx.fillText('SOS SUBWAY', x - 18, y - 10);
    } else {
      // Dark dingy interior
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x - 14, y - 22, 28, 22);
      ctx.fillStyle = '#64748b';
      ctx.font = '5px sans-serif';
      ctx.fillText('SUBWAY', x - 10, y - 12);
    }
    ctx.restore();
  }

  drawBusStop(x, y, isTransformed) {
    const ctx = this.ctx;
    ctx.save();
    // Shelter Canopy
    ctx.fillStyle = isTransformed ? '#0f766e' : '#334155';
    ctx.beginPath();
    ctx.roundRect(x - 22, y - 28, 44, 6, 3);
    ctx.fill();

    // Posts
    ctx.strokeStyle = isTransformed ? '#00f5d4' : '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 18, y + 10);
    ctx.lineTo(x - 18, y - 22);
    ctx.moveTo(x + 18, y + 10);
    ctx.lineTo(x + 18, y - 22);
    ctx.stroke();

    if (isTransformed) {
      // Digital ETA
      ctx.fillStyle = '#020617';
      ctx.fillRect(x - 14, y - 20, 28, 10);
      ctx.fillStyle = '#00f5d4';
      ctx.font = 'bold 5px monospace';
      ctx.fillText('BUS 34A: 2m', x - 13, y - 13);
      // SOS button
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(x + 20, y - 8, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#64748b';
      ctx.font = '5px sans-serif';
      ctx.fillText('BUS STOP', x - 12, y - 12);
    }
    ctx.restore();
  }

  drawMarket(x, y, isTransformed) {
    const ctx = this.ctx;
    ctx.save();
    const shopW = 40;
    const shopH = 34;
    ctx.fillStyle = isTransformed ? '#1e293b' : '#334155';
    ctx.fillRect(x - shopW / 2, y - shopH, shopW, shopH);

    if (isTransformed) {
      ctx.fillStyle = '#fb923c';
      ctx.fillRect(x - shopW / 2 - 2, y - shopH - 4, shopW + 4, 6);
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('➕ 24x7 SAFE', x - 16, y - shopH + 12);
      // Fairy lights
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 22, y - shopH);
      ctx.quadraticCurveTo(x, y - shopH + 6, x + 22, y - shopH);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#64748b';
      ctx.font = '6px sans-serif';
      ctx.fillText('CLOSED', x - 11, y - 14);
    }
    ctx.restore();
  }

  drawPark(x, y, isTransformed) {
    const ctx = this.ctx;
    ctx.save();
    // Trees / Shrubbery
    ctx.fillStyle = isTransformed ? '#15803d' : '#14532d';
    ctx.beginPath();
    ctx.arc(x - 14, y - 16, 12, 0, Math.PI * 2);
    ctx.arc(x + 14, y - 16, 12, 0, Math.PI * 2);
    ctx.arc(x, y - 24, 14, 0, Math.PI * 2);
    ctx.fill();

    if (isTransformed) {
      // Illuminated Solar Bollard Lamp
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 12;
      ctx.fillRect(x - 3, y - 8, 6, 12);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#00f5d4';
      ctx.font = 'bold 6px sans-serif';
      ctx.fillText('SAFE PARK', x - 14, y + 16);
    } else {
      ctx.fillStyle = '#64748b';
      ctx.font = '5px sans-serif';
      ctx.fillText('PARK (DARK)', x - 14, y + 12);
    }
    ctx.restore();
  }

  drawMetroHub(x, y, isTransformed) {
    const ctx = this.ctx;
    ctx.save();
    if (isTransformed) {
      // Pink Kiosk
      ctx.fillStyle = '#db2777';
      ctx.beginPath();
      ctx.roundRect(x - 16, y - 36, 32, 36, 5);
      ctx.fill();
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 5px sans-serif';
      ctx.fillText('PINK KIOSK', x - 13, y - 24);
      ctx.fillText('QR AUTOS', x - 11, y - 16);
    } else {
      ctx.fillStyle = '#475569';
      ctx.fillRect(x - 12, y - 26, 24, 26);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '5px sans-serif';
      ctx.fillText('STAND', x - 8, y - 14);
    }
    ctx.restore();
  }

  drawFeederLane(x, y, isTransformed) {
    const ctx = this.ctx;
    ctx.save();
    if (isTransformed) {
      // Green E-Rickshaw Charging Station & Light
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.roundRect(x - 16, y - 28, 32, 28, 4);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 5px sans-serif';
      ctx.fillText('⚡ E-FEEDER', x - 13, y - 16);
      ctx.fillText('WOMEN CORRIDOR', x - 14, y - 8);
    } else {
      ctx.fillStyle = '#334155';
      ctx.fillRect(x - 10, y - 20, 20, 20);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '5px sans-serif';
      ctx.fillText('FEEDER', x - 8, y - 10);
    }
    ctx.restore();
  }

  drawReclaimedCorner(x, y, isTransformed) {
    const ctx = this.ctx;
    ctx.save();
    if (isTransformed) {
      // Evening Chai Corner with Strings
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.roundRect(x - 16, y - 28, 32, 28, 4);
      ctx.fill();
      ctx.fillStyle = '#ffedd5';
      ctx.font = 'bold 5px sans-serif';
      ctx.fillText('☕ CHAI HUB', x - 12, y - 16);
      ctx.fillText('CITIZEN PATROL', x - 14, y - 8);
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x - 12, y - 22, 24, 22);
      ctx.fillStyle = '#ff4d6d';
      ctx.font = '5px sans-serif';
      ctx.fillText('SHADY', x - 8, y - 10);
    }
    ctx.restore();
  }

  drawPlazaAlert(x, y, isTransformed) {
    const ctx = this.ctx;
    ctx.save();
    // Plaza Pillar / Monument
    ctx.fillStyle = isTransformed ? '#00f5d4' : '#475569';
    ctx.beginPath();
    ctx.roundRect(x - 8, y - 36, 16, 36, 4);
    ctx.fill();

    if (isTransformed) {
      ctx.fillStyle = '#05141c';
      ctx.font = '9px sans-serif';
      ctx.fillText('✋', x - 4, y - 22);
      ctx.fillStyle = '#00f5d4';
      ctx.font = 'bold 6px sans-serif';
      ctx.fillText('SILENT SIGNAL', x - 20, y + 14);
    } else {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '5px sans-serif';
      ctx.fillText('PLAZA', x - 6, y - 14);
    }
    ctx.restore();
  }

  drawHomeHaven(x, y, isTransformed) {
    const ctx = this.ctx;
    ctx.save();
    // Gateway Arch
    ctx.strokeStyle = isTransformed ? '#00f5d4' : '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 22, y + 25);
    ctx.lineTo(x - 22, y - 15);
    ctx.quadraticCurveTo(x, y - 30, x + 22, y - 15);
    ctx.lineTo(x + 22, y + 25);
    ctx.stroke();

    if (isTransformed) {
      // Glow shield
      ctx.fillStyle = 'rgba(0, 245, 212, 0.4)';
      ctx.beginPath();
      ctx.arc(x, y + 15, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px sans-serif';
      ctx.fillText('🛡️', x - 6, y + 20);
      ctx.fillStyle = '#00f5d4';
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('SAFE SANCTUARY', x - 30, y + 42);
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '6px sans-serif';
      ctx.fillText('HOME GATE', x - 18, y + 38);
    }
    ctx.restore();
  }

  drawStreetLamp(x, y, isLit, color = '#ffb703', isFlickering = false) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 50);
    ctx.quadraticCurveTo(x, y - 62, x + 12, y - 62);
    ctx.stroke();

    let lightAlpha = isLit ? 0.85 : (isFlickering && Math.random() > 0.8 ? 0.35 : 0.05);

    if (lightAlpha > 0.1) {
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(x + 12, y - 60, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      const coneGrad = ctx.createRadialGradient(x + 12, y - 58, 4, x + 12, y, 70);
      coneGrad.addColorStop(0, color === '#00f5d4' ? 'rgba(0, 245, 212, 0.35)' : 'rgba(255, 183, 3, 0.35)');
      coneGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(x + 12, y - 58);
      ctx.lineTo(x - 40, y + 10);
      ctx.lineTo(x + 64, y + 10);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(x + 12, y - 60, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Draw Auto-Rickshaw
  drawSingleAuto(x, y) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(x - 10, y + 8, 4, 0, Math.PI * 2);
    ctx.arc(x + 10, y + 8, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.roundRect(x - 14, y - 2, 28, 8, 2);
    ctx.fill();

    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.roundRect(x - 12, y - 12, 24, 10, 3);
    ctx.fill();
    ctx.restore();
  }

  drawAutoRickshaw() {
    const ctx = this.ctx;
    ctx.save();
    const x = this.autoRickshaw.x;
    const y = this.autoRickshaw.y;

    this.drawSingleAuto(x, y);

    const headGrad = ctx.createRadialGradient(x + 14, y + 2, 2, x + 55, y + 4, 40);
    headGrad.addColorStop(0, 'rgba(255, 235, 150, 0.7)');
    headGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.moveTo(x + 14, y + 2);
    ctx.lineTo(x + 60, y - 8);
    ctx.lineTo(x + 60, y + 16);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 6. Draw 10 Checkpoint Pins
  drawCheckpointPins() {
    const ctx = this.ctx;
    ctx.save();

    this.checkpoints.forEach((cp, index) => {
      const isCurrent = (index === this.currentCheckpointIndex);
      const isHovered = (this.hoveredCheckpoint && this.hoveredCheckpoint.id === cp.id);
      const isCompleted = (index < this.currentCheckpointIndex);

      if (isCurrent) {
        const pulse = 16 + Math.sin(this.time * 4) * 5;
        ctx.strokeStyle = 'rgba(0, 245, 212, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cp.x, cp.y, pulse, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(cp.x, cp.y, isHovered ? 16 : 13, 0, Math.PI * 2);

      if (isHovered) {
        ctx.strokeStyle = '#00f5d4';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      if (isCompleted || cp.isTransformed) {
        ctx.fillStyle = '#00f5d4';
        ctx.shadowColor = '#00f5d4';
        ctx.shadowBlur = 10;
      } else if (isCurrent) {
        ctx.fillStyle = '#ffb703';
        ctx.shadowColor = '#ffb703';
        ctx.shadowBlur = 14;
      } else {
        ctx.fillStyle = '#334155';
        ctx.shadowBlur = 0;
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = (isCompleted || isCurrent || cp.isTransformed) ? '#05141c' : '#94a3b8';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isCompleted ? '✓' : (index + 1), cp.x, cp.y);

      // Name Label Pill
      ctx.font = 'bold 8px sans-serif';
      const textMetrics = ctx.measureText(cp.shortName);
      const pillW = textMetrics.width + 10;

      ctx.fillStyle = 'rgba(10, 15, 28, 0.85)';
      ctx.beginPath();
      ctx.roundRect(cp.x - pillW / 2, cp.y + 16, pillW, 13, 3);
      ctx.fill();
      ctx.strokeStyle = isCurrent ? '#ffb703' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = isCurrent ? '#ffb703' : '#d1dff6';
      ctx.fillText(cp.shortName, cp.x, cp.y + 23);

      if (isHovered) {
        const tipText = `📍 ${cp.name}`;
        ctx.font = 'bold 9px sans-serif';
        const tipW = ctx.measureText(tipText).width + 14;
        const tipY = cp.y - 26;

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(cp.x - tipW / 2, tipY, tipW, 16, 4);
        ctx.fill();
        ctx.strokeStyle = '#00f5d4';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#00f5d4';
        ctx.fillText(tipText, cp.x, tipY + 11);
      }
    });

    ctx.restore();
  }

  // 7. Priya Avatar
  drawPriyaAvatar() {
    const ctx = this.ctx;
    ctx.save();
    const x = this.avatarPos.x;
    const y = this.avatarPos.y - 10;
    const bob = this.isWalking ? Math.sin(this.time * 12) * 2 : 0;

    const aura = ctx.createRadialGradient(x, y - 5, 2, x, y - 5, 18);
    aura.addColorStop(0, 'rgba(0, 245, 212, 0.45)');
    aura.addColorStop(1, 'transparent');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(x, y - 5, 18, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(x, y - 12 + bob, 5, 0, Math.PI * 2);
    ctx.fill();

    // Kurta
    ctx.fillStyle = '#9d4edd';
    ctx.beginPath();
    ctx.roundRect(x - 4, y - 7 + bob, 8, 12, 2);
    ctx.fill();

    // Legs
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    const legSwing = this.isWalking ? Math.sin(this.time * 12) * 3 : 0;
    ctx.beginPath();
    ctx.moveTo(x - 2, y + 5 + bob);
    ctx.lineTo(x - 2 - legSwing, y + 12);
    ctx.moveTo(x + 2, y + 5 + bob);
    ctx.lineTo(x + 2 + legSwing, y + 12);
    ctx.stroke();

    ctx.fillStyle = '#00f5d4';
    ctx.font = 'bold 7px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PRIYA', x, y - 20 + bob);

    ctx.restore();
  }

  // 8. Atmospheric Light
  drawAtmosphericLight() {
    const ctx = this.ctx;
    ctx.save();
    const vig = ctx.createRadialGradient(this.width / 2, this.height / 2, 220, this.width / 2, this.height / 2, this.width * 0.7);
    vig.addColorStop(0, 'transparent');
    vig.addColorStop(1, 'rgba(5, 8, 16, 0.45)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  }
}

// Attach to window
window.CityMapCanvas = CityMapCanvas;
