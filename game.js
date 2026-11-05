/**
 * HER SAFE ROUTE: THE SILENT SIGNAL
 * Game State Controller, Narrative Engine & Decision System
 * 10 Progressive Urban Women's Safety Levels
 */

(function () {
  'use strict';

  // ==========================================================================
  // GAME DATA DEFINITION: 10 REAL URBAN SAFETY LEVELS
  // ==========================================================================
  const MISSIONS = [
    {
      id: 0,
      title: "The Shadowed Alley (Gali No. 4)",
      subtitle: "Level 1 of 10 • 09:30 PM",
      locationName: "Gali No. 4 (The Dark Street)",
      narrative: "Priya enters Gali No. 4, a 250-meter residential alleyway between tall brick boundary walls. Three consecutive municipal sodium streetlamps have blown out, casting deep shadows across the path. Ahead lies a sharp 90-degree blind corner with no visibility of oncoming pedestrians or vehicles.",
      hazardText: "Urban Vulnerability: Zero street lighting, blind corners, isolated pedestrian lane with zero active eyes.",
      mood: "Anxious • Heavy shadows • Reduced visibility",
      options: [
        {
          key: "1",
          title: "Community Solar Lighting & Sightline Initiative",
          desc: "Coordinate with the local Resident Welfare Association (RWA) to mount solar-powered motion sensor LED lamps on exterior walls and install convex safety mirrors at the blind corner.",
          points: 10,
          type: "SYSTEMIC URBAN UPGRADE",
          heading: "Outstanding Community Transformation!",
          explanation: "Studies in urban environmental design show that consistent, non-glare lighting and removing blind corners eliminate perceived concealment opportunities. Solar motion LEDs provide independent resilience against municipal power cuts.",
          transformationDesc: "High-lumen solar LED fixtures ignited along Gali No. 4, and convex safety mirrors installed to clear blind corners."
        },
        {
          key: "2",
          title: "Municipal Ward App Report & Active Sightline Walking",
          desc: "Activate phone safety flashlight, walk down the center of the lane for 360° sightlines, ping live location to an emergency contact, and file a geotagged repair ticket on the Ward 14 civic app.",
          points: 7,
          type: "PROACTIVE CIVIC ACTION",
          heading: "Smart Personal Defense & Civic Reporting",
          explanation: "Walking down the center prevents ambush from recessed doorways and parked vehicles. Filing a geotagged civic ticket holds municipal authorities accountable for rapid repair.",
          transformationDesc: "Municipal repair teams are alerted; streetlights are slated for maintenance while temporary solar torches guide the path."
        },
        {
          key: "3",
          title: "Put on Earphones and Speed-Walk Blindly",
          desc: "Plug in earphones to block out fearful thoughts, look straight down at sneakers, and sprint through the dark blind turn to reach the end as fast as possible.",
          points: 2,
          type: "HIGH RISK HABIT",
          heading: "Dangerous Spatial Disconnection",
          explanation: "Blocking auditory senses with earphones strips away your primary early-warning system. Running blindly around unlit corners increases collision and ambush risks.",
          transformationDesc: "The alley remains dark and hazardous for other women walking later."
        }
      ]
    },
    {
      id: 1,
      title: "The Pedestrian Subway Underpass",
      subtitle: "Level 2 of 10 • 09:38 PM",
      locationName: "Railway Pedestrian Subway",
      narrative: "To cross the railway tracks, Priya must navigate a low-ceiling pedestrian underpass. The overhead tube lights are flickering violently, dirty water has pooled across the tiles, and cell signal drops to zero bars inside the concrete tunnel. Commuters actively avoid it after sunset.",
      hazardText: "Urban Vulnerability: Confined subterranean choke point, zero wireless signal, water hazards, poor visibility.",
      mood: "Claustrophobic • Echoing footsteps • Disconnected",
      options: [
        {
          key: "1",
          title: "Subway Revitalization & Hardwired Emergency Blue Light",
          desc: "Petition for subway revitalization: coat walls with high-reflectance white enamel paint, install hardwired analog blue-light emergency intercoms (independent of cellular reception), and overhead convex mirrors.",
          points: 10,
          type: "SUBTERRANEAN SAFETY INFRASTRUCTURE",
          heading: "Brilliant Subterranean Safety Design!",
          explanation: "Subways without cellular signal require hardwired emergency call boxes. Reflective white walls double ambient lumen efficiency, eliminating dingy concealment pockets.",
          transformationDesc: "Underpass walls transformed with bright reflective paint, clear overhead mirrors, and blue-light emergency intercoms."
        },
        {
          key: "2",
          title: "Wait for Family Commuters to Form a Walking Pod",
          desc: "Pause safely at the illuminated ticket counter outside until a group of family commuters approaches, then walk through together within their sightline.",
          points: 7,
          type: "TACTICAL CO-TRAVEL",
          heading: "Prudent Mutual Safety In Transit",
          explanation: "Moving as part of a natural cluster deters opportunistic threats in enclosed passageways.",
          transformationDesc: "Priya navigates through safely with commuters, highlighting the need for collective transit scheduling."
        },
        {
          key: "3",
          title: "Sprint Across the Dark Puddles Alone",
          desc: "Hold your breath, close your eyes to the eerie surroundings, and dash blindly through the dark muddy corridor alone.",
          points: 2,
          type: "PANIC ESCALATION",
          heading: "Slip & Fall Hazard in Enclosed Spaces",
          explanation: "Sprinting blindly across wet underground tiles risks severe physical injury, leaving you incapacitated in an area with zero phone reception.",
          transformationDesc: "The subway remains an unmonitored, intimidating passage."
        }
      ]
    },
    {
      id: 2,
      title: "The Isolated Bus Shelter",
      subtitle: "Level 3 of 10 • 09:46 PM",
      locationName: "Ring Road Suburban Bus Stop",
      narrative: "Priya reaches the Ring Road transit shelter. The overhead tin roof is rusty and unlit, the paper timetable board is torn off, and the scheduled Route 34A bus is delayed by 20 minutes. Two loiterers are whispering in the shadows behind the billboard.",
      hazardText: "Urban Vulnerability: Pitch-black public transit shelter, absent emergency communications, transit schedule uncertainty.",
      mood: "Vulnerable • Commuter isolation • Delayed transit",
      options: [
        {
          key: "1",
          title: "Smart Transit Shelter with Emergency SOS & CCTV",
          desc: "Step across to a well-lit 24/7 tea kiosk 20 meters away in public view; submit a proposal for a Smart Solar Transit Node with one-touch emergency intercom (SOS) and live GPS arrival displays.",
          points: 10,
          type: "TRANSIT INFRASTRUCTURE",
          heading: "Exemplary Public Transit Security!",
          explanation: "Never wait in secluded darkness. Stepping into active public view ('natural surveillance') deters harassment. Smart Bus Shelters with illuminated digital displays, CCTV, and SOS beacons empower women to use public transit confidently.",
          transformationDesc: "Bus shelter rebuilt with solar-powered illumination, an SOS panic button, live arrival timetable, and CCTV surveillance."
        },
        {
          key: "2",
          title: "Commuter Buddy Network & GPS Route Sharing",
          desc: "Join two other women commuters waiting across the street, introduce yourself to form a travel pod, share live GPS tracking with family, and advocate for female transit marshals on night routes.",
          points: 7,
          type: "COMMUNITY SOLIDARITY",
          heading: "Power in Community Co-Travel!",
          explanation: "Solidarity among women commuters drastically reduces vulnerability. Travel pods and verified live sharing ensure someone always knows your route.",
          transformationDesc: "A women's commuter peer group forms and transit marshals are stationed at the stop."
        },
        {
          key: "3",
          title: "Sit Quietly in the Deep Back Corner",
          desc: "Crouch on the furthest rusted bench hidden behind the unlit advertising billboard hoping nobody notices you while waiting 20 minutes in silence.",
          points: 2,
          type: "ISOLATION RISK",
          heading: "Corner Trap Vulnerability",
          explanation: "Hiding in deep dark corners restricts your exit avenues and leaves you trapped against walls. If an aggressor approaches, you have no escape vector or witnesses.",
          transformationDesc: "The transit stop remains a dark, intimidating choke point."
        }
      ]
    },
    {
      id: 3,
      title: "The Shuttered Market Bazaar",
      subtitle: "Level 4 of 10 • 09:54 PM",
      locationName: "Main Bazaar Market",
      narrative: "Priya reaches the Main Bazaar. By 9:30 PM, almost every commercial store has pulled down iron metal shutters. The street is eerily silent, devoid of activity or light. The absence of people on the sidewalks strips away what urban planner Jane Jacobs called 'Eyes on the Street'.",
      hazardText: "Urban Vulnerability: Completely dead street facade, absence of informal surveillance, zero active storefronts.",
      mood: "Eerie • Deserted market • Dead street front",
      options: [
        {
          key: "1",
          title: "24/7 Safe Haven Network & Verandah Lighting",
          desc: "Partner with local merchant associations to keep exterior verandah lights on after closing, and certify the 24/7 Chai Tapri & Medical Store as designated 'Suraksha Kendra' (Safe Havens) with emergency phone kits.",
          points: 10,
          type: "NATURAL SURVEILLANCE & SAFE HAVENS",
          heading: "Urban Masterstroke: Eyes on the Street!",
          explanation: "Active late-night storefronts, warm chai stalls, and 24/7 pharmacies transform a dead street into an active, watchful corridor. Designating trusted businesses as 'Safe Havens' provides women with guaranteed physical sanctuaries during emergencies.",
          transformationDesc: "Storefront verandahs light up, festive fairy lights span the bazaar, and 24/7 Chai Tapri & Pharmacy display bright 'Safe Haven' neon badges."
        },
        {
          key: "2",
          title: "Paced Walk with Quick Glance Verification",
          desc: "Walk briskly down the center of the market, checking reflection in shop glass windows for tails, while holding keys firmly between fingers in a defensive grip.",
          points: 7,
          type: "INDIVIDUAL TACTICS",
          heading: "Good Defensive Readiness, But Lacks Systemic Fix",
          explanation: "Situational awareness (using glass reflections) and physical defense posture are helpful short-term survival tactics, but they do not solve the root issue of an abandoned commercial street.",
          transformationDesc: "Priya crosses safely, but the street facade stays unlit and lifeless."
        },
        {
          key: "3",
          title: "Take a 2.5-Kilometer Unfamiliar Highway Detour",
          desc: "Turn back and take an extra 2.5 km detour along a desolate ring highway bypass to avoid the closed market street altogether.",
          points: 2,
          type: "AVOIDANCE TRAP",
          heading: "The Penalty of Avoidance",
          explanation: "Long unmonitored detours along high-speed highway bypasses often expose pedestrians to greater hazards like reckless traffic and isolated stretches. Public spaces must be made safe rather than surrendered.",
          transformationDesc: "The bazaar remains abandoned and unwelcoming for the neighborhood."
        }
      ]
    },
    {
      id: 4,
      title: "The City Park Perimeter (Nehru Udyan)",
      subtitle: "Level 5 of 10 • 10:02 PM",
      locationName: "Nehru Udyan Park Boundary",
      narrative: "Priya's route borders the perimeter of Nehru Udyan. Overgrown 8-foot shrubs create visual blind spots along the narrow pedestrian sidewalk. Broken sections of the boundary wall allow unmonitored entry, and deep shadows swallow the path ahead.",
      hazardText: "Urban Vulnerability: Concealment zones, visual obstruction by overgrown vegetation, unmaintained public perimeter.",
      mood: "Uneasy • Rustling shadows • Concealment risks",
      options: [
        {
          key: "1",
          title: "CPTED Environmental Pruning & Solar Pathway Bollards",
          desc: "Implement CPTED (Crime Prevention Through Environmental Design): prune hedges below 3 feet to restore clear natural sightlines, replace solid walls with see-through decorative railings, and install solar pathway bollard lamps.",
          points: 10,
          type: "CPTED URBAN REDESIGN",
          heading: "Classic CPTED Transformation!",
          explanation: "The '3-foot/7-foot rule' of CPTED dictates that shrubs should not exceed 3 feet and tree canopies should stay above 7 feet. This preserves unbroken sightlines, eliminating potential ambush pockets.",
          transformationDesc: "Park perimeter pruned to 3 feet with see-through railings, warm solar bollards, and an active community gazebo."
        },
        {
          key: "2",
          title: "Cross to Residential Street Side",
          desc: "Cross immediately to the opposite side of the road where porch lights from residential homes spill illumination across the pavement.",
          points: 7,
          type: "TACTICAL SIGHTLINE CHOICE",
          heading: "Smart Tactical Positioning",
          explanation: "Moving away from dense vegetative boundaries to the residential side leverages residential porch lights for enhanced visibility.",
          transformationDesc: "Priya walks safely on the opposite sidewalk, while park boundary stays shadowy."
        },
        {
          key: "3",
          title: "Cut Through the Unlit Interior Park Pathway",
          desc: "Enter the dark park gate and cut straight across the interior dirt trail to save 3 minutes of walking time.",
          points: 2,
          type: "HIGH CONCEALMENT HAZARD",
          heading: "Severe Ambush Vulnerability",
          explanation: "Cutting through an unlit park after dark is one of the highest urban risks. Trapped among trees with no bystander presence or escape routes invites severe danger.",
          transformationDesc: "The park interior remains hazardous and pitch black."
        }
      ]
    },
    {
      id: 5,
      title: "The Metro Station Auto Hub",
      subtitle: "Level 6 of 10 • 10:10 PM",
      locationName: "Metro Station Auto Hub",
      narrative: "At the bustling metro junction, multiple auto-rickshaws are parked haphazardly. Priya notices a female college student looking visibly distressed as an unregistered, aggressive driver physically blocks her path, demanding triple fare and refusing to use the meter.",
      hazardText: "Urban Vulnerability: Unregulated transit junction, aggressive touting, bystander hesitation in a public dispute.",
      mood: "Tense • Bystander moment • Public intimidation",
      options: [
        {
          key: "1",
          title: "Active Bystander Intervention (Distract) & Pink Kiosk Setup",
          desc: "Execute the 'Distract' bystander technique: approach the student casually asking 'Hey Neha, did our study group start yet?' to break the tension, then escort her to the newly established Pink Police Safety Kiosk with verified QR-code auto fleet.",
          points: 10,
          type: "BYSTANDER INTERVENTION (5 D's)",
          heading: "Masterful Bystander Intervention!",
          explanation: "The 'Distract' method (one of the 5 D's: Distract, Delegate, Document, Delay, Direct) safely diffuses intimidation without hostile escalation. Establishing Pink Safety Kiosks and QR-verified driver registries guarantees accountability across urban transit.",
          transformationDesc: "Pink Police Kiosk operationalized; auto stand reorganized with verified ID badges, transparent meters, and CCTV monitoring."
        },
        {
          key: "2",
          title: "Report to Traffic Police Officer at Metro Gate",
          desc: "Alert the on-duty traffic police officer stationed 40 meters away, providing the auto's registration number and location.",
          points: 7,
          type: "DELEGATION TECHNIQUE",
          heading: "Effective Delegation (5 D's)",
          explanation: "Delegating to an authority figure brings immediate official intervention and enforces transit regulations.",
          transformationDesc: "Traffic police issue a violation citation and escort the commuter safely."
        },
        {
          key: "3",
          title: "Mind Your Own Business and Walk Away",
          desc: "Look down at your phone, pretend you didn't see anything, and walk past quickly since you are alone and don't want trouble.",
          points: 2,
          type: "PASSIVE BYSTANDER EFFECT",
          heading: "The Bystander Paralysis Trap",
          explanation: "When everyone assumes someone else will intervene, nobody does. Over 70% of street harassment ends when a single bystander speaks up or creates a casual distraction. Community safety requires mutual responsibility.",
          transformationDesc: "The junction remains intimidating with unchecked harassment."
        }
      ]
    },
    {
      id: 6,
      title: "The Feeder E-Rickshaw Lane",
      subtitle: "Level 7 of 10 • 10:18 PM",
      locationName: "Feeder Connector Lane",
      narrative: "Priya boards a shared electric feeder rickshaw for the last-mile stretch to her neighborhood. Halfway down the road, the driver suddenly turns into an unpaved, unlit back alley, claiming he's taking a 'quick shortcut', while another passenger makes an uneasy remark.",
      hazardText: "Urban Vulnerability: Route deviation in last-mile transit, unlit feeder routes, lack of passenger oversight.",
      mood: "Alarmed • Route deviation • Enclosed vehicle",
      options: [
        {
          key: "1",
          title: "Assertive Boundary Protocol & Official Night Corridor",
          desc: "Speak firmly and assertively: 'No, return to the main lit road immediately', press the phone's emergency speed-dial, and advocate for an Official Women's Night Feeder Corridor with high-mast LED lighting and designated drop hubs.",
          points: 10,
          type: "TRANSIT ACCOUNTABILITY & ASSERTIVENESS",
          heading: "Assertive Voice & Corridor Formalization!",
          explanation: "Clear, loud boundary enforcement immediately breaks driver presumption of compliance. Institutionalizing high-mast lighting along feeder lanes ensures drivers never deviate into unsafe shortcuts.",
          transformationDesc: "Feeder route designated as an Official Women's Night Corridor with bright high-mast LEDs and solar charging shelters."
        },
        {
          key: "2",
          title: "Display Live GPS Route Loudly on Phone",
          desc: "Turn phone volume up so the GPS voice navigation announces 'Rerouting: Stay on Main Arterial Road', making it obvious to everyone inside that the vehicle is being tracked live.",
          points: 7,
          type: "DIGITAL DETERRENCE",
          heading: "Smart Audible Deterrence",
          explanation: "Letting drivers and passengers hear live tracking signals that deviations are logged in real time, discouraging misconduct.",
          transformationDesc: "The driver returns to the main road; Priya exits safely at the next junction."
        },
        {
          key: "3",
          title: "Freeze in Silence and Hope for the Best",
          desc: "Keep quiet, stare out of the window with pounding heart, and wait to see where the driver takes the vehicle.",
          points: 2,
          type: "FREEZE RESPONSE",
          heading: "Dangerous Compliance Trap",
          explanation: "Remaining silent during an unauthorized transit deviation can result in being taken into isolated industrial zones where escape is impossible. Always voice refusal early.",
          transformationDesc: "The feeder lane remains prone to predatory shortcuts."
        }
      ]
    },
    {
      id: 7,
      title: "The Hostile Street Corner",
      subtitle: "Level 8 of 10 • 10:26 PM",
      locationName: "Reclaimed Street Corner",
      narrative: "Approaching a commercial junction outside an unmonitored liquor outlet, a cluster of rowdy loiterers has blocked the entire sidewalk. They are laughing loudly, catcalling passing pedestrians, and forcing women to step into dangerous moving vehicular traffic.",
      hazardText: "Urban Vulnerability: Hostile sidewalk occupation, aggressive catcalling, forced pedestrian displacement into road traffic.",
      mood: "Hostile • Obstructed sidewalk • Intimidation",
      options: [
        {
          key: "1",
          title: "Community Corner Reclamation & Citizen Patrol Station",
          desc: "Reclaim the corner through positive community activation: install festoon lights, partner with a late-night street chai & snack vendor, set up a neighborhood watch bench, and coordinate with 112 police patrol vans.",
          points: 10,
          type: "PLACEMAKING & PUBLIC SPACE RECLAMATION",
          heading: "Urban Placemaking at Its Best!",
          explanation: "Dark, dead corners invite anti-social loitering. By introducing positive public life—such as an active tea stall, warm string lights, and citizen presence—the space is naturally reclaimed for families and women.",
          transformationDesc: "Corner transformed into a lively community tea hub with citizen watch members, bright festoon lights, and zero harassment."
        },
        {
          key: "2",
          title: "Early Sidewalk Cross & Confident Stride",
          desc: "Spot the hazard 50 meters in advance, cross smoothly to the opposite illuminated sidewalk, maintain an upright posture with hands free, and walk past without making provocative eye contact.",
          points: 7,
          type: "DEFENSIVE PEDESTRIAN POSITIONING",
          heading: "Tactical Spatial Awareness",
          explanation: "Early anticipation avoids physical choke points while maintaining safe distance and reaction time.",
          transformationDesc: "Priya navigates past unharmed, demonstrating keen urban spatial awareness."
        },
        {
          key: "3",
          title: "Keep Head Down and Walk Straight Through the Middle",
          desc: "Lower your head, walk right through the center of the rowdy group, and pretend you don't hear their remarks.",
          points: 2,
          type: "PHYSICAL CORNER TRAP",
          heading: "High Risk of Physical Escalation",
          explanation: "Walking directly through a hostile cluster in a narrow choke point increases the risk of physical groping, blocking, or grabbing.",
          transformationDesc: "The corner remains an intimidating gauntlet for neighborhood women."
        }
      ]
    },
    {
      id: 8,
      title: "The Silent Signal Alert",
      subtitle: "Level 9 of 10 • 10:34 PM",
      locationName: "Public Community Plaza",
      narrative: "Walking across the central plaza, Priya notices a young woman walking beside an aggressive, controlling stranger who grips her elbow tightly. Catching Priya's eye, the woman raises her other hand discretely: Palm open → Thumb tucked in → Fingers folded over. It is the Universal Silent Signal for Help!",
      hazardText: "Urban Vulnerability: Active domestic/public coercion where the victim cannot speak without triggering immediate violence.",
      mood: "High Alert • Critical decision • Discrete distress signal",
      options: [
        {
          key: "1",
          title: "Discrete 5 D's Response & Safe Haven Merchant Alert",
          desc: "Maintain calm eye contact with a gentle nod; walk without haste to the certified 24/7 Medical Safe Haven 15 meters away, alert the trained shopkeeper, and dial 112 giving exact location, suspect description, and clothing colors.",
          points: 10,
          type: "UNIVERSAL SILENT SIGNAL DE-ESCALATION",
          heading: "Flawless Silent Signal Intervention!",
          explanation: "When someone uses the Silent Signal, screaming or rushing at the aggressor often triggers immediate retaliation. Discrete verification and routing to a nearby certified Safe Haven with 112 dispatch protects the victim's life.",
          transformationDesc: "The community Silent Signal rapid response network springs into action; wardens and police intervene safely without escalation."
        },
        {
          key: "2",
          title: "Casual Distraction Intervention ('Study Group Card')",
          desc: "Approach with a casual, non-threatening pretext: 'Excuse me! You dropped your library ID card back at the bus stop', providing the victim an excuse to pause and break away toward a public crowd.",
          points: 7,
          type: "CASUAL DE-ESCALATION",
          heading: "Smart Bystander Distraction",
          explanation: "Using an innocuous distraction disrupts the aggressor's control dynamic, creating space for the victim to seek public refuge.",
          transformationDesc: "The distraction allows the woman to break away safely into a well-lit pharmacy."
        },
        {
          key: "3",
          title: "Scream 'Kidnapper!' at the Top of Your Lungs",
          desc: "Panic and shout 'Kidnapper! Let her go!' right in the aggressor's face in the middle of the plaza.",
          points: 2,
          type: "VIOLENT ESCALATION TRIGGER",
          heading: "Critical Danger to the Victim",
          explanation: "Direct screaming without backup can cause an armed or panicked aggressor to grab the victim forcefully and sprint into an unlit alley. Discrete, coordinated action is essential.",
          transformationDesc: "The aggressor panics and drags the victim into darkness before help arrives."
        }
      ]
    },
    {
      id: 9,
      title: "Transform the City: The Safe Haven Sanctuary",
      subtitle: "Level 10 of 10 • 10:42 PM",
      locationName: "Home Haven & Community Sanctuary",
      narrative: "Priya reaches her home neighborhood entrance. To make Anand Nagar permanently safe for women, girls, and all citizens, the community is adopting a unified transformation plan. How should Anand Nagar seal its evolution from shadows into a permanent community sanctuary?",
      hazardText: "Urban Vulnerability: Ending safety at private home gates rather than creating universal, enduring public space protection.",
      mood: "Triumphant • Final stretch • Community unification",
      options: [
        {
          key: "1",
          title: "Night Walkers Movement & Permanent Community Shield",
          desc: "Launch the 'Night Walkers / Raat Ki Rani' community initiative: weekly evening walks, universal Silent Signal certifications for every street vendor, decorative overhead canopy lighting, open community night libraries, and citizen patrols.",
          points: 10,
          type: "WHOLE-COMMUNITY RECLAMATION",
          heading: "The Ultimate City Transformation Achieved!",
          explanation: "True safety exists when women claim the right to public spaces at all hours without fear. By lighting the streets, training vendors, and filling sidewalks with cultural life, Anand Nagar becomes an inspiring model of urban safety.",
          transformationDesc: "Anand Nagar erupts into a vibrant nocturnal oasis with festive lanterns, street cafes, and a glowing Silent Signal community shield."
        },
        {
          key: "2",
          title: "Establish a Neighborhood Volunteer Walking Escort Pool",
          desc: "Set up a volunteer network of vetted neighborhood residents who provide walking escort services and bicycle escorts for late-night commuters.",
          points: 7,
          type: "GRASSROOTS SOLIDARITY",
          heading: "Compassionate Community Solidarity",
          explanation: "Volunteer escort pools provide tangible peer support for shift workers and late-night students.",
          transformationDesc: "Citizen volunteers establish a nightly transit escort desk at the entrance."
        },
        {
          key: "3",
          title: "Build 12-Foot Iron Gates and Impose Night Curfew",
          desc: "Erect 12-foot iron boundary gates around the colony, lock all pedestrian gates after 8:30 PM, and hire armed guards to interrogate anyone walking through.",
          points: 2,
          type: "GATED EXCLUSION",
          heading: "Gated Paranoia vs. Public Safety",
          explanation: "Gated isolation does not make cities safer—it privatizes security for the wealthy, criminalizes public pedestrians, kills street life, and makes surrounding public roads even more dangerous for working-class women.",
          transformationDesc: "The colony closes into a fortress of fear, deadening the street."
        }
      ]
    }
  ];

  // ==========================================================================
  // GAME STATE
  // ==========================================================================
  const State = {
    currentMissionIndex: 0,
    totalScore: 0,
    missionHistory: [],
    cityMap: null,
    isDecisionMade: false,
    previewMode: false,
    audioMuted: false,
    highContrast: false
  };

  // ==========================================================================
  // DOM REFERENCES
  // ==========================================================================
  const DOM = {
    screenHome: document.getElementById('screen-home'),
    screenGame: document.getElementById('screen-game'),
    screenResults: document.getElementById('screen-results'),

    btnStartJourney: document.getElementById('btn-start-journey'),
    btnQuickRules: document.getElementById('btn-quick-rules'),

    btnAudio: document.getElementById('btn-audio'),
    audioIcon: document.getElementById('audio-icon'),
    btnContrast: document.getElementById('btn-contrast'),
    btnSignalGuide: document.getElementById('btn-signal-guide'),
    btnHelp: document.getElementById('btn-help'),

    hudMissionNumber: document.getElementById('hud-mission-number'),
    hudMissionTitle: document.getElementById('hud-mission-title'),
    hudProgressText: document.getElementById('hud-progress-text'),
    hudProgressFill: document.getElementById('hud-progress-fill'),
    hudSafetyText: document.getElementById('hud-safety-text'),
    hudSafetyFill: document.getElementById('hud-safety-fill'),
    hudVigilanceBadge: document.getElementById('hud-vigilance-badge'),
    hudVigilanceText: document.getElementById('hud-vigilance-text'),

    btnToggleView: document.getElementById('btn-toggle-view'),
    toggleViewText: document.getElementById('toggle-view-text'),
    timelineSteps: document.querySelectorAll('.checkpoint-step'),

    missionBadge: document.getElementById('mission-badge'),
    missionTime: document.getElementById('mission-time'),
    missionTitle: document.getElementById('mission-title'),
    missionNarrative: document.getElementById('mission-narrative'),
    charMood: document.getElementById('char-mood'),
    sceneHazardText: document.getElementById('scene-hazard-text'),
    optionsList: document.getElementById('options-list'),
    decisionContainer: document.getElementById('decision-container'),

    feedbackContainer: document.getElementById('feedback-container'),
    feedbackBadge: document.getElementById('feedback-badge'),
    feedbackType: document.getElementById('feedback-type'),
    feedbackHeading: document.getElementById('feedback-heading'),
    feedbackExplanation: document.getElementById('feedback-explanation'),
    transDescription: document.getElementById('trans-description'),
    btnNextMission: document.getElementById('btn-next-mission'),

    finalScore: document.getElementById('final-score'),
    finalRankBadge: document.getElementById('final-rank-badge'),
    statLighting: document.getElementById('stat-lighting'),
    statSurveillance: document.getElementById('stat-surveillance'),
    statTransit: document.getElementById('stat-transit'),
    statSignal: document.getElementById('stat-signal'),
    reportGrid: document.getElementById('report-grid'),
    btnReplay: document.getElementById('btn-replay'),
    btnViewCity: document.getElementById('btn-view-city'),
    btnCopyReport: document.getElementById('btn-copy-report'),
    btnPrintCert: document.getElementById('btn-print-cert'),
    toastContainer: document.getElementById('toast-container'),

    modalHelp: document.getElementById('modal-help'),
    btnCloseHelp: document.getElementById('btn-close-help'),
    btnAckHelp: document.getElementById('btn-ack-help'),

    modalSignal: document.getElementById('modal-signal'),
    btnCloseSignal: document.getElementById('btn-close-signal'),
    btnAckSignal: document.getElementById('btn-ack-signal'),

    modalInspect: document.getElementById('modal-inspect'),
    modalInspectTitle: document.getElementById('modal-inspect-title'),
    modalInspectContent: document.getElementById('modal-inspect-content'),
    btnCloseInspect: document.getElementById('btn-close-inspect'),
    btnAckInspect: document.getElementById('btn-ack-inspect')
  };

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  function init() {
    State.cityMap = new window.CityMapCanvas('city-canvas');
    bindEvents();
    window.onCheckpointClicked = handleCheckpointInspect;
    updateHUD();
  }

  // ==========================================================================
  // EVENT BINDINGS
  // ==========================================================================
  function bindEvents() {
    DOM.btnStartJourney.addEventListener('click', () => {
      playSound('click');
      startAmbientAudio();
      showScreen('game');
      loadMission(0);
    });

    DOM.btnQuickRules.addEventListener('click', () => {
      openModal(DOM.modalHelp);
    });

    DOM.btnAudio.addEventListener('click', toggleAudio);
    DOM.btnContrast.addEventListener('click', toggleHighContrast);
    DOM.btnSignalGuide.addEventListener('click', () => openModal(DOM.modalSignal));
    DOM.btnHelp.addEventListener('click', () => openModal(DOM.modalHelp));

    DOM.btnCloseHelp.addEventListener('click', () => closeModal(DOM.modalHelp));
    DOM.btnAckHelp.addEventListener('click', () => closeModal(DOM.modalHelp));

    DOM.btnCloseSignal.addEventListener('click', () => closeModal(DOM.modalSignal));
    DOM.btnAckSignal.addEventListener('click', () => closeModal(DOM.modalSignal));

    DOM.btnCloseInspect.addEventListener('click', () => closeModal(DOM.modalInspect));
    DOM.btnAckInspect.addEventListener('click', () => closeModal(DOM.modalInspect));

    DOM.btnNextMission.addEventListener('click', handleNextMission);

    DOM.btnReplay.addEventListener('click', resetGame);
    DOM.btnViewCity.addEventListener('click', () => {
      showScreen('game');
      State.cityMap.previewFullIllumination = true;
      DOM.toggleViewText.textContent = "Night Reality View";
      showToast("Inspecting fully illuminated Anand Nagar!", "🏙️");
    });

    if (DOM.btnCopyReport) {
      DOM.btnCopyReport.addEventListener('click', copySafetyReport);
    }

    if (DOM.btnPrintCert) {
      DOM.btnPrintCert.addEventListener('click', () => {
        playSound('click');
        window.print();
      });
    }

    DOM.btnToggleView.addEventListener('click', () => {
      const isPreview = State.cityMap.togglePreviewIllumination();
      DOM.toggleViewText.textContent = isPreview ? "Night Reality View" : "Preview Full Illumination";
      playSound('click');
    });

    // Re-query timeline steps dynamically in case elements were updated
    const steps = document.querySelectorAll('.checkpoint-step');
    steps.forEach((stepBtn) => {
      stepBtn.addEventListener('click', () => {
        const stepIdx = parseInt(stepBtn.getAttribute('data-step'), 10);
        const cp = State.cityMap.checkpoints[stepIdx];
        if (cp) handleCheckpointInspect(cp);
      });
    });

    initSignalTrainers();
    window.addEventListener('keydown', handleKeyboard);
  }

  function handleKeyboard(e) {
    if (e.key === 'Escape') {
      closeAllModals();
      return;
    }

    if (e.key === 'm' || e.key === 'M') {
      toggleAudio();
      return;
    }

    if (e.key === 'h' || e.key === 'H') {
      openModal(DOM.modalHelp);
      return;
    }

    if (DOM.screenGame.classList.contains('active')) {
      if (!State.isDecisionMade) {
        if (e.key === '1') selectDecision(0);
        else if (e.key === '2') selectDecision(1);
        else if (e.key === '3') selectDecision(2);
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.preventDefault) e.preventDefault();
          handleNextMission();
        }
      }
    }
  }

  // ==========================================================================
  // SCREEN SWITCHING
  // ==========================================================================
  function showScreen(screenName) {
    DOM.screenHome.classList.remove('active');
    DOM.screenGame.classList.remove('active');
    DOM.screenResults.classList.remove('active');

    if (screenName === 'home') {
      DOM.screenHome.classList.add('active');
    } else if (screenName === 'game') {
      DOM.screenGame.classList.add('active');
    } else if (screenName === 'results') {
      DOM.screenResults.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==========================================================================
  // LEVEL / MISSION ENGINE & DECISION SYSTEM
  // ==========================================================================
  function loadMission(index) {
    State.currentMissionIndex = index;
    State.isDecisionMade = false;

    const mission = MISSIONS[index];
    if (!mission) {
      showFinalResults();
      return;
    }

    updateHUD();
    State.cityMap.setMissionState(index, false);

    const steps = document.querySelectorAll('.checkpoint-step');
    steps.forEach((stepEl, idx) => {
      stepEl.classList.remove('active', 'completed');
      const statusEl = stepEl.querySelector('.step-status');
      if (idx < index) {
        stepEl.classList.add('completed');
        if (statusEl) statusEl.textContent = "Done";
      } else if (idx === index) {
        stepEl.classList.add('active');
        if (statusEl) statusEl.textContent = "Active";
      } else {
        if (statusEl) statusEl.textContent = "Pending";
      }
    });

    DOM.missionBadge.textContent = `LEVEL ${index + 1} OF 10`;
    DOM.missionTime.textContent = mission.subtitle;
    DOM.missionTitle.textContent = mission.title;
    DOM.missionNarrative.textContent = mission.narrative;
    DOM.charMood.textContent = mission.mood;
    DOM.sceneHazardText.textContent = mission.hazardText;

    DOM.decisionContainer.classList.remove('hidden');
    DOM.feedbackContainer.classList.add('hidden');

    DOM.optionsList.innerHTML = '';
    mission.options.forEach((opt, optIndex) => {
      const optBtn = document.createElement('button');
      optBtn.className = 'option-card';
      optBtn.setAttribute('data-index', optIndex);
      optBtn.setAttribute('role', 'radio');
      optBtn.setAttribute('aria-checked', 'false');
      optBtn.innerHTML = `
        <div class="option-key" aria-hidden="true">${opt.key}</div>
        <div class="option-body">
          <h5 class="option-title">${opt.title}</h5>
          <p class="option-desc">${opt.desc}</p>
        </div>
      `;

      optBtn.addEventListener('click', () => selectDecision(optIndex));
      DOM.optionsList.appendChild(optBtn);
    });

    const firstOpt = DOM.optionsList.querySelector('.option-card');
    if (firstOpt) firstOpt.focus();
  }

  function selectDecision(optionIndex) {
    if (State.isDecisionMade) return;
    State.isDecisionMade = true;

    const currentMission = MISSIONS[State.currentMissionIndex];
    const option = currentMission.options[optionIndex];
    if (!option) return;

    if (option.points >= 9) {
      playSound('lightOn');
      setTimeout(() => playSound('signalPing'), 200);
    } else if (option.points >= 6) {
      playSound('select');
    } else {
      playSound('caution');
    }

    State.totalScore += option.points;

    State.missionHistory.push({
      missionIndex: State.currentMissionIndex,
      missionTitle: currentMission.title,
      locationName: currentMission.locationName,
      chosenOption: option,
      awardedPoints: option.points
    });

    State.cityMap.markTransformed(State.currentMissionIndex);
    showToast(`✨ Level Up: +${option.points} PTS!`, '💡');

    updateHUD();

    DOM.feedbackBadge.textContent = `+${option.points} PTS`;
    DOM.feedbackType.textContent = option.type;
    DOM.feedbackHeading.textContent = option.heading;
    DOM.feedbackExplanation.textContent = option.explanation;
    DOM.transDescription.textContent = option.transformationDesc;

    DOM.decisionContainer.classList.add('hidden');
    DOM.feedbackContainer.classList.remove('hidden');

    DOM.btnNextMission.focus();
  }

  function handleNextMission() {
    playSound('click');
    const nextIdx = State.currentMissionIndex + 1;
    if (nextIdx < MISSIONS.length) {
      loadMission(nextIdx);
    } else {
      showFinalResults();
    }
  }

  // ==========================================================================
  // HUD UPDATES
  // ==========================================================================
  function updateHUD() {
    const currentIdx = State.currentMissionIndex;
    const progressPercent = Math.min(100, Math.round(((currentIdx + (State.isDecisionMade ? 1 : 0)) / 10) * 100));

    DOM.hudMissionNumber.textContent = `${Math.min(currentIdx + 1, 10)}/10`;
    const curMission = MISSIONS[currentIdx] || MISSIONS[MISSIONS.length - 1];
    DOM.hudMissionTitle.textContent = curMission.title;

    DOM.hudProgressText.textContent = `${progressPercent}%`;
    DOM.hudProgressFill.style.width = `${progressPercent}%`;

    DOM.hudSafetyText.textContent = `${State.totalScore} / 100 PTS`;
    DOM.hudSafetyFill.style.width = `${State.totalScore}%`;

    let vigilanceLabel = "Isolated";
    let vigilanceClass = "status-isolated";

    if (State.totalScore >= 80) {
      vigilanceLabel = "Community Shield Active";
      vigilanceClass = "status-vigilant";
    } else if (State.totalScore >= 50) {
      vigilanceLabel = "Guarded & Connected";
      vigilanceClass = "status-vigilant";
    } else if (State.totalScore >= 25) {
      vigilanceLabel = "Aware & Supported";
      vigilanceClass = "status-vigilant";
    }

    DOM.hudVigilanceText.textContent = vigilanceLabel;
    DOM.hudVigilanceBadge.className = `status-pill ${vigilanceClass}`;
  }

  // ==========================================================================
  // RESULTS SCREEN & REPORT CARD GENERATION
  // ==========================================================================
  function showFinalResults() {
    playSound('fanfare');
    showScreen('results');

    DOM.finalScore.textContent = String(State.totalScore);

    let rankTitle = "COMMUNITY GUARDIAN";
    if (State.totalScore >= 90) {
      rankTitle = "🌟 URBAN SAFETY CHAMPION";
    } else if (State.totalScore >= 75) {
      rankTitle = "🛡️ VIGILANT NEIGHBORHOOD PROTECTOR";
    } else if (State.totalScore >= 50) {
      rankTitle = "🚶 ACTIVE URBAN NAVIGATOR";
    } else {
      rankTitle = "🌱 DEVELOPING ADVOCATE";
    }
    DOM.finalRankBadge.textContent = rankTitle;

    DOM.statLighting.textContent = State.totalScore >= 60 ? "100% Solar LED" : "Partial";
    DOM.statSurveillance.textContent = State.totalScore >= 50 ? "Active / 24x7" : "Limited";
    DOM.statTransit.textContent = State.totalScore >= 70 ? "Smart SOS Ready" : "Unmonitored";
    DOM.statSignal.textContent = State.totalScore >= 80 ? "Universal Protocol" : "Ad-hoc";

    DOM.reportGrid.innerHTML = '';
    State.missionHistory.forEach((item, idx) => {
      const reportItem = document.createElement('div');
      reportItem.className = 'report-item';
      reportItem.innerHTML = `
        <div class="report-icon-box" aria-hidden="true">${MISSIONS[idx] ? '🛡️' : '📍'}</div>
        <div class="report-detail">
          <h4>${idx + 1}. ${item.locationName}</h4>
          <p><strong>Your Decision:</strong> ${item.chosenOption.title}</p>
          <p class="highlight-teal">${item.chosenOption.transformationDesc}</p>
        </div>
        <div class="report-pts">+${item.awardedPoints} pts</div>
      `;
      DOM.reportGrid.appendChild(reportItem);
    });
  }

  // ==========================================================================
  // CHECKPOINT INSPECTION
  // ==========================================================================
  function handleCheckpointInspect(checkpoint) {
    playSound('click');
    DOM.modalInspectTitle.textContent = checkpoint.name;

    const missionMatch = MISSIONS[checkpoint.id];
    const isTrans = checkpoint.isTransformed || State.cityMap.previewFullIllumination;

    DOM.modalInspectContent.innerHTML = `
      <div style="font-size: 2.2rem; text-align: center; margin-bottom: 0.5rem;" aria-hidden="true">
        ${checkpoint.icon}
      </div>
      <h4>Location Overview</h4>
      <p>${missionMatch ? missionMatch.narrative : 'Key urban checkpoint in Anand Nagar.'}</p>
      
      <h4>Urban Vulnerability Identified</h4>
      <p style="color: #ff9fb1;">⚠️ ${checkpoint.hazard}</p>
      
      <h4>Community &amp; Infrastructure Transformation</h4>
      <p style="color: #00f5d4;">
        ${isTrans ? '✨ ' + checkpoint.upgrade : '⏳ Pending transformation through player decisions.'}
      </p>
    `;

    openModal(DOM.modalInspect);
  }

  // ==========================================================================
  // RESET / REPLAY
  // ==========================================================================
  function resetGame() {
    playSound('click');
    State.currentMissionIndex = 0;
    State.totalScore = 0;
    State.missionHistory = [];
    State.isDecisionMade = false;

    State.cityMap.checkpoints.forEach((cp, idx) => {
      cp.status = idx === 0 ? "current" : "locked";
      cp.isTransformed = false;
    });
    State.cityMap.avatarPos = { x: State.cityMap.checkpoints[0].x, y: State.cityMap.checkpoints[0].y };
    State.cityMap.targetPos = { x: State.cityMap.checkpoints[0].x, y: State.cityMap.checkpoints[0].y };
    State.cityMap.previewFullIllumination = false;
    DOM.toggleViewText.textContent = "Preview Full Illumination";

    showScreen('home');
    updateHUD();
  }

  // ==========================================================================
  // UTILITIES: AUDIO & ACCESSIBILITY MODALS
  // ==========================================================================
  function toggleAudio() {
    if (window.soundSystem) {
      const isMuted = window.soundSystem.toggleMute();
      State.audioMuted = isMuted;
      DOM.audioIcon.textContent = isMuted ? '🔇' : '🔊';
      const label = DOM.btnAudio.querySelector('.btn-label');
      if (label) label.textContent = isMuted ? 'Audio Off' : 'Audio On';
    }
  }

  function startAmbientAudio() {
    if (window.soundSystem && !State.audioMuted) {
      window.soundSystem.startAmbient();
    }
  }

  function playSound(soundType) {
    if (!window.soundSystem) return;
    switch (soundType) {
      case 'click': window.soundSystem.playClick(); break;
      case 'select': window.soundSystem.playSelect(); break;
      case 'lightOn': window.soundSystem.playLightOn(); break;
      case 'signalPing': window.soundSystem.playSignalPing(); break;
      case 'fanfare': window.soundSystem.playFanfare(); break;
      case 'caution': window.soundSystem.playCaution(); break;
    }
  }

  function toggleHighContrast() {
    State.highContrast = !State.highContrast;
    document.body.classList.toggle('high-contrast', State.highContrast);
    playSound('click');
  }

  function openModal(modalEl) {
    if (!modalEl) return;
    playSound('click');
    modalEl.classList.remove('hidden');
    const closeBtn = modalEl.querySelector('.modal-close') || modalEl.querySelector('button');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    playSound('click');
    modalEl.classList.add('hidden');
  }

  function closeAllModals() {
    DOM.modalHelp.classList.add('hidden');
    DOM.modalSignal.classList.add('hidden');
    DOM.modalInspect.classList.add('hidden');
  }

  // ==========================================================================
  // TOAST NOTIFICATIONS & USER-FRIENDLY UTILITIES
  // ==========================================================================
  function showToast(message, icon = '🛡️') {
    if (!DOM.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icon}</span>
      <span class="toast-text">${message}</span>
    `;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3900);
  }

  function copySafetyReport() {
    playSound('click');
    const summary = `HER SAFE ROUTE: THE SILENT SIGNAL - Community Safety Report
Total Score: ${State.totalScore} / 100 PTS
Status: ${DOM.finalRankBadge ? DOM.finalRankBadge.textContent : 'Community Guardian'}
Levels Completed: 10 of 10 across Anand Nagar

Key Urban Solutions:
- Solar LED street lighting & sightlines
- Subway revitalized with reflective enamel & blue SOS intercoms
- Smart Transit node with SOS intercom & CCTV
- 24/7 Verified Safe Havens & Natural Surveillance
- CPTED park sightlines & bollards
- Active Bystander Intervention (5 D's) & Pink Kiosk
- Women's night feeder corridor
- Reclaimed street corners & citizen patrols
- Universal Silent Signal Community Shield
- Safe Haven Sanctuary & Night Walkers Movement

Emergency Helplines (India):
- 112 : National Emergency Support
- 1091: Women in Distress Helpline
- 181 : Women Helpline (Domestic/Crisis)
- 1090: Women Powerline`;

    const clip = (window.navigator && window.navigator.clipboard) || (typeof navigator !== 'undefined' && navigator.clipboard);
    if (clip && clip.writeText) {
      clip.writeText(summary).then(() => {
        showToast("Safety report & helplines copied to clipboard!", "📋");
      }).catch(() => {
        showToast("Report generated! Check screen to view/print.", "📋");
      });
    } else {
      showToast("Report ready for viewing and printing!", "📋");
    }
  }

  function initSignalTrainers() {
    const trainerConfigs = [
      {
        containerId: 'signal-trainer-main',
        handId: 'trainer-hand-display',
        statusId: 'trainer-status-text'
      },
      {
        containerId: 'signal-trainer-modal',
        handId: 'trainer-modal-hand',
        statusId: 'trainer-modal-status'
      }
    ];

    trainerConfigs.forEach(cfg => {
      const container = document.getElementById(cfg.containerId);
      if (!container) return;

      const handEl = document.getElementById(cfg.handId);
      const statusEl = document.getElementById(cfg.statusId);
      const buttons = container.querySelectorAll('.step-train-btn');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const step = btn.getAttribute('data-step');
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          if (step === '1') {
            playSound('click');
            if (handEl) {
              handEl.textContent = '✋';
              handEl.classList.remove('pulse-success');
            }
            if (statusEl) statusEl.textContent = 'Step 1: Open Palm (Facing Outward)';
          } else if (step === '2') {
            playSound('select');
            if (handEl) {
              handEl.textContent = '✊';
              handEl.classList.remove('pulse-success');
            }
            if (statusEl) statusEl.textContent = 'Step 2: Fold Thumb Inward';
          } else if (step === '3') {
            playSound('signalPing');
            if (handEl) {
              handEl.textContent = '👊';
              handEl.classList.add('pulse-success');
            }
            if (statusEl) statusEl.textContent = 'Step 3: Trap Fingers! Silent Signal Active 🛡️';
            showToast("Silent Signal Active: Community Alert Triggered!", "✋");
          }
        });
      });
    });
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
