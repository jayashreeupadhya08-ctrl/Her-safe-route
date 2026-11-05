# HER SAFE ROUTE: THE SILENT SIGNAL

> An interactive, 2D illustrated indie browser game promoting women's safety, public-space awareness, and community responsibility in an Indian urban neighborhood.

---

## 🌟 Overview

Set at **9:30 PM in Anand Nagar**, players guide **Priya**, a young student walking home from an evening class. Through **5 real-world urban safety missions**, players make crucial decisions that transform the neighborhood from an intimidating corridor of dark alleys and shuttered streets into an illuminated, community-protected sanctuary.

The game demonstrates Jane Jacobs' principle of **"Eyes on the Street"**, bystander intervention (the 5 D's), and the life-saving **Universal Silent Signal for Help**.

---

## 🚀 How to Play

### 1. Launching the Game
Play immediately at **http://localhost:8080** or open `index.html` in any web browser.
- **Dedicated Port 8080** (Avoids conflict with other local development projects)
- **No installation or dependencies required**
- **No internet required (100% offline & client-side)**
- **No login or paid APIs needed**

### 2. Controls & Keyboard Shortcuts
- <kbd>1</kbd>, <kbd>2</kbd>, <kbd>3</kbd> : Select decision options A, B, or C
- <kbd>Space</kbd> or <kbd>Enter</kbd> : Confirm choice and advance to next mission
- <kbd>M</kbd> : Toggle synthesized ambient music and sound effects
- <kbd>H</kbd> : Open Help & Accessibility dialog
- <kbd>Esc</kbd> : Close open inspection or guide modals
- **Mouse / Touch** : Click any checkpoint pin on the 2D City Map to inspect urban safety conditions

---

## 🏙️ The 10 Progressive Urban Safety Levels

| # | Level | Urban Vulnerability | Community Upgrade |
|---|---|---|---|
| **1** | **The Dark Street (Gali No. 4)** | 3 blown-out sodium lamps, 90° blind corner, long boundary walls | Solar-powered motion sensor LEDs, convex corner safety mirror, civic ward app reporting |
| **2** | **The Pedestrian Subway Underpass** | Low ceiling, water seepage, flickering lights, zero cell reception | High-reflectance white walls, hardwired blue-light emergency intercoms, overhead mirrors |
| **3** | **The Empty Bus Stop (Ring Road Shelter)** | Secluded dark shelter, missing bus timetable, commuter vulnerability | Solar Smart Transit Node with one-touch SOS panic intercom, live bus arrival display, CCTV |
| **4** | **The Shuttered Bazaar (Main Market)** | Dead street front with metal pull-down shutters, no natural surveillance | Verandah lighting, 24/7 Chai Tapri & Medical Store certified as verified "Suraksha Kendra" (Safe Havens) |
| **5** | **The City Park Perimeter (Nehru Udyan)** | Overgrown 8-foot shrubs, broken fence, blind park path | CPTED 3-foot shrub pruning, see-through decorative railings, solar pathway bollard lamps |
| **6** | **The Metro Station Auto Hub** | Unregulated junction, unverified driver harassing a student | Active Bystander Intervention ("Distract" technique), Pink Safety Kiosk, QR-verified auto fleet |
| **7** | **The Feeder E-Rickshaw Lane** | Unlit unpaved connector lane, route deviation risk | Official Women's Night Feeder Corridor with high-mast LED lighting & charging shelters |
| **8** | **The Hostile Street Corner** | Rowdy loiterers blocking sidewalk, catcalling, forced displacement | Community tea stall placemaking, citizen watch bench, festoon lights, and 112 coordination |
| **9** | **The Silent Signal Alert (Plaza)** | Active distress situation where victim cannot speak safely | Universal Silent Signal discrete response, 24/7 Safe Haven routing & rapid police intervention |
| **10** | **The Safe Haven Sanctuary (Home)** | Ending safety at private home gates instead of whole streets | "Night Walkers" movement, weekly night walks, open street libraries, permanent community shield |

---

## ✋ The Universal Silent Signal for Help

Recognized globally, this three-step discrete hand gesture allows anyone to signal danger without speaking or alerting an aggressor:

1. **Step 1 — Palm Facing Out:** Raise open hand with palm facing outward toward camera, friend, or bystander.
2. **Step 2 — Tuck Thumb In:** Fold your thumb into the center of your open palm.
3. **Step 3 — Fold Fingers Over:** Close your four fingers over your thumb, trapping it discretely.

### The 5 D's of Bystander Intervention
- **Distract:** Create a casual diversion (*"Do you know what time the next bus arrives?"*).
- **Delegate:** Alert a shopkeeper, transit marshal, or authority figure.
- **Document:** Keep a safe distance, take notes, or confirm location for emergency dispatch.
- **Delay:** Check in on the person after the situation has diffused.
- **Direct:** Intervene directly only if it is completely safe to do so.

---

## 🇮🇳 Essential Real-World Helplines (India)

- **112** : National Emergency Support System (Police / Medical / Fire)
- **1091** : Women in Distress Helpline
- **181** : Women Helpline (Domestic Abuse & Crisis)
- **1090** : Women Powerline
- **112 India App** : SOS Direct Police Dispatch with Geolocation

---

## 💻 Tech Stack & Architecture

- **HTML5**: Semantic landmark structure (`<main>`, `<header>`, `<nav>`, `<section>`, ARIA live regions).
- **CSS3**: Modern indie night aesthetic, glassmorphic panels, CSS custom properties, responsive breakpoints, high-contrast accessibility mode, print stylesheets.
- **JavaScript (ES6+)**:
  - `game.js`: Mission engine, decision scoring, state management, modal system, toast notifications, keyboard handler.
  - `city-canvas.js`: Interactive 2D canvas city map of Anand Nagar with animated vehicles, lighting cones, walking Priya avatar, hover tooltips, and real-time visual before/after transformations.
  - `audio.js`: Self-contained procedural Web Audio API synthesizers for ambient night pads, light ignition effects, footstep clicks, and victory fanfares (zero external audio files).

---

## 📂 Project Structure

```
her-safe-route/
├── index.html           # Main semantic markup & screen containers
├── style.css            # Responsive styles, glassmorphism & indie aesthetics
├── game.js              # Game logic, decision engine & scoring
├── city-canvas.js       # Interactive 2D canvas city map renderer
├── audio.js             # Web Audio API sound synthesizer
├── test-game-logic.js   # Automated DOM & data verification test
├── test-simulation.js   # End-to-end 5-mission walkthrough test
└── README.md            # Project documentation & safety guide
```
