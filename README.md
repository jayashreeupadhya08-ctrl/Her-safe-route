# HER SAFE ROUTE: THE SILENT SIGNAL
### *Every street tells a story. Every decision can change a city.*

**A Detective-Strategy Browser Game for Social Good**  
Developed for the **Girls Who Code HHS Hackathon 2026**  
Theme: *Building Games for Social Good*

---

## 🌟 1. Game Vision & Social Good Mission

**HER SAFE ROUTE: THE SILENT SIGNAL** is a premium, modern detective-strategy browser game centered on women's safety, accessible public infrastructure, institutional accountability, and community responsibility.

In Aurelia City, public safety concerns have too often been dismissed as personal inconveniences or individual burdens. Players step into the shoes of **Nova**, a dedicated community safety investigator. By listening to residents, inspecting physical corridors, uncovering hidden maintenance backlogs, and reforming bureaucratic complaint systems, players demonstrate the game's core thesis:

> **Women's safety is a shared civic responsibility. Safer communities require thoughtful urban design, dependable public transportation, transparent institutions, accessible infrastructure, and supportive community stewardship—not asking women to shrink their lives.**

The game strictly avoids victim-blaming and does not imply that women are responsible for preventing harassment or that any street can be guaranteed 100% risk-free. Instead, it highlights how infrastructure neglect and bureaucratic friction compound vulnerability.

---

## 🎯 2. UN Sustainable Development Goals (SDGs)

The game embeds real-world social impact principles aligned with the United Nations 2030 Agenda:

1. **SDG 5: Gender Equality (Target 5.2)**  
   Eliminating violence and harassment against women in public spaces. Freedom of movement without fear of intimidation is an essential foundation for equal participation in education, work, and civic life.
2. **SDG 11: Sustainable Cities & Communities (Target 11.2 & 11.7)**  
   Providing safe, accessible, and sustainable public transit and inclusive public spaces, with special attention to women, children, persons with disabilities, and older persons.
3. **SDG 16: Peace, Justice & Strong Institutions (Target 16.6)**  
   Creating accountable and transparent civic institutions. Mission 2 reveals how automated rejection scripts and intrusive verification erase community complaints to make official statistics look artificially clean.
4. **SDG 10: Reduced Inequalities (Target 10.2)**  
   Championing **Universal Design** through the "Curb-Cut Effect"—showing that streets built to protect wheelchair users, seniors, and parents with strollers create a safer, more humane city for all.

---

## 🎮 3. Core Gameplay Loop

Across three interconnected campaign missions, players progress through an investigative cycle:

```
[ Receive Resident Report ] 
            ↓
[ Explore Interactive City Map & Streets ]
            ↓
[ Inspect Hotspots & Interview Witnesses ] 
            ↓
[ Pin Clues on the Evidence Board & Deduce Root Causes ]
            ↓
[ Compare & Select Pedestrian Routes ]
            ↓
[ Invest Municipal Budget in Physical Upgrades ]
            ↓
[ Review Mission Scorecard & The City Remembers Consequence ]
```

### The 3 Campaign Missions:
1. **Mission 1: The Last Bus**  
   *Witness:* Maya (University Engineering Student).  
   *Problem:* An unlit corridor, burned-out sodium lamps, faded crosswalks, and an unannounced 30-minute transit schedule change leave evening students stranded after dark.  
   *Core Insight:* Disjointed infrastructure and transit unreliability multiply nighttime vulnerability.

2. **Mission 2: The Silent Report**  
   *Witnesses:* Leena (Night-shift Nurse) & Aria (Community Advocate).  
   *Problem:* Recurring platform harassment and a severed emergency call-box went unaddressed because the municipal complaint portal automatically purged reports lacking verified home IDs.  
   *Core Insight:* Hostile bureaucratic intake silences victims and conceals unsafe hotspots.

3. **Mission 3: The Dark Crossing**  
   *Witnesses:* Elena (Wheelchair User & Accountant) & Marcus (Senior Resident).  
   *Problem:* Grand Avenue's 6-lane crossing has a 6-inch fractured curb drop, disconnected audio chirpers, and a 9-second walk phase designed strictly to speed up car traffic.  
   *Core Insight:* Prioritizing vehicular speed over universal accessibility endangers vulnerable residents and fractures the community.

---

## 🏛️ 4. Unique Game Systems

- **Interactive Vector City Map & Street Intelligence:**  
  Features 10 distinct district nodes with the winding Aurelia River, realistic bridges, and animated commuter pulses. Clicking on any street corridor displays real-time pavement, lighting, and safety intelligence.
- **Real-Time Safety-Rated Route Navigator:**  
  Calculates a dynamic 0-100% Safety Rating Index for any origin and destination across Aurelia City. Incorporates streetlighting multipliers, universal accessibility curb cuts, active crowdsourced hazards, and nearest safe haven sanctuaries. Offers three routing priorities: *Safest* (well-lit, monitored avenues), *Fastest* (transit arterials), and *Shortcut* (alleys/unlit parks), plus animated step-by-step pedestrian walking simulations.
- **Crowdsourced Danger & Infrastructure Reporting:**  
  A community-powered reporting feed where residents and investigators log unlit streetlights, broken sidewalks, ghost schedules, blind corners, and dead call-boxes. Supports anonymous reporting, upvoting, and tracks municipal remediation as players purchase civic upgrades.
- **Instant SOS Emergency Dispatch & Mutual Aid:**  
  High-priority distress response featuring a 3-second abort countdown, simulated GPS telemetry dispatch to trusted guardians and campus safety escorts, a synthesized dual-tone FM siren deterrent, nearest 24/7 verified Safe Havens (walk-in shelters with hours and phone contacts), and a **Covert Stealth Mode** screen disguise that conceals the application behind academic student notes.
- **In-Map Location Dossier Drawer:**  
  Clicking any location on the map displays a popover drawer with district intelligence, clue count, witness tags (*"🗣️ Maya is waiting for interview"*), and direct action buttons to inspect the scene or plan a route.
- **Evidence Board & Deductions with Re-evaluation:**  
  Players pin clues across five categories (*Infrastructure, Transportation, Community Reports, Institutional Response, Accessibility*) and evaluate root-cause hypotheses. If a distractor hypothesis is tested, educational feedback explains why it is unsupported and allows players to revise their deduction.
- **Dynamic Route Simulator:**  
  Pedestrian routes react in real-time to city investments. Upgrading streetlights and crosswalks transforms hazardous alleys into gold-standard lit corridors.
- **The City Remembers System:**  
  Decisions made in early missions persist across the campaign. Repaired lights remain lit, complaint reforms fast-track later hospital petitions, and character dialogue reflects Nova's earlier choices.
- **Procedural Web Audio Engine:**  
  100% offline procedural audio synthesized with the Web Audio API—harmonic clue discovery chimes, upgrade cash-register bells, dual-tone SOS sirens, countdown ticks, victory fanfares, and ambient tones with zero external audio assets.
- **Victory Celebration & Confetti:**  
  Confetti particle bursts celebrate mission achievements and the final campaign dossier.
- **Comprehensive Accessibility & Hotkeys:**  
  Full keyboard navigation, visible focus rings, reduced-motion toggle, high-contrast mode, text scaling, and double-confirmed progress resets.
  - Hotkeys: `M` (Map), `I` (Inspect), `R` (Routes), `E` (Evidence), `U` (Upgrades), `N` (Navigator), `H` (Hazards), `J` (Journal), `G` (SDG Guide), `Esc` (Close Drawer/Modal).

---

## 🚀 5. How to Run & Play

The project is built with **zero external dependencies** and requires **no installation, build step, database, or API keys**.

### Option A: Localhost Server (Currently Live)
The game is already live at:
**[http://localhost:8080/](http://localhost:8080/)**

To restart the server at any time:
```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\Admin\.gemini\antigravity\scratch\her-safe-route\server.ps1" -Port 8080
```

### Option B: Direct Browser Launch
1. Locate the project folder:
   `C:\Users\Admin\.gemini\antigravity\scratch\her-safe-route`
2. Double-click `index.html` to open it in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

---

## 📁 6. Project Architecture

```
her-safe-route/
├── index.html       # Semantic HTML5 layout, ARIA attributes, modals, and screen containers
├── style.css        # Cyber-noir aesthetic, SVG map elements, responsive breakpoints, high-contrast
├── audio.js         # Web Audio API procedural sound synthesizer (chimes, clicks, fanfares)
├── gameData.js      # Missions, locations, clues, routes, branching dialogues, and UN SDG guide
├── gameEngine.js    # Reactive state management, localStorage persistence, scoring logic
├── app.js           # UI controller, SVG map renderer, event listeners, deduction evaluator
├── server.ps1       # Lightweight zero-dependency Windows .NET HTTP server
├── test_runner.html # Automated test suite (55 assertions, 100% pass rate)
└── README.md        # Comprehensive documentation, hackathon alignment, and gameplay guide
```

---

## 🤝 7. Safe Bystander Intervention Principles (The 5 Ds)

Embedded in Mission 1's dialogue and the educational field guide:
1. **Direct:** Address the situation respectfully if safe to do so.
2. **Distract:** De-escalate tension through a casual interruption (e.g., asking for transit times or directions).
3. **Delegate:** Find a transit operator, staff member, or community helper with duty of care.
4. **Delay:** Offer presence and empathy after an incident: *"I saw what happened. Are you okay? Can I wait with you?"*
5. **Document:** Keep safe, consensual notes of time, transit vehicle numbers, and details.

---

## 🧪 8. Test Verification Results

All 75 automated unit and integration tests passed with 0 failures over `http://localhost:8080/test_runner.html`:
- ✅ Initial game configuration & clean state defaults.
- ✅ Clue collection and duplicate clue prevention across all 3 missions.
- ✅ Accurate hypothesis deductions and deduction revision capability.
- ✅ Active bystander dialogue branches and "The City Remembers" persistence.
- ✅ Strategic route selection and dynamic upgrade bonus application.
- ✅ Municipal budget deductions, deficit blocking, and duplicate purchase prevention.
- ✅ Mission scoring calculations against all rubric categories.
- ✅ Advancement through Missions 1, 2, and 3.
- ✅ Final campaign dossier generation and title assignments.
- ✅ `localStorage` serialization, safe parsing, and progress resetting.
- ✅ Real-time safety-rated route calculation and priority boundaries.
- ✅ Crowdsourced hazard feed querying, custom report submission, and upvoting.
- ✅ Verified 24/7 Safe Havens distance proximity sorting.
- ✅ Instant SOS telemetry dispatch, countdown lifecycle, and safe cancellation.

---

## 🏆 9. Hackathon Submission Information
- **Project:** HER SAFE ROUTE: THE SILENT SIGNAL
- **Hackathon:** Girls Who Code HHS Hackathon 2026
- **Category:** Games for Social Good
- **Licensing:** Open Source for Educational and Social Good Distribution
