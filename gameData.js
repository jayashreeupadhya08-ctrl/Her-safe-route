// HER SAFE ROUTE: THE SILENT SIGNAL
// Game Data: Missions, Locations, Clues, Deductions, Upgrades, Dialogues, Routes, and Educational Content

const GAME_DATA = {
  initialBudget: 500,
  
  // 10 Detailed Aurelia City Locations
  locations: [
    {
      id: "univ_campus",
      name: "Aurelia University - East Gate",
      district: "Academic Quarter",
      icon: "graduation-cap",
      x: 180,
      y: 120,
      description: "A bustling campus perimeter where evening classes let out late. Students frequently commute toward the transit corridors after dark.",
      baseStatus: {
        lighting: "dim",
        accessibility: "moderate",
        transitInfo: "poor",
        safetyFeatures: "basic"
      },
      inspectable: true
    },
    {
      id: "north_crossing",
      name: "North Avenue Pedestrian Crossing",
      district: "North Arterial",
      icon: "walk",
      x: 360,
      y: 150,
      description: "A wide crossing connecting university housing with commercial blocks. High vehicle speeds and faded road markings make crossings stressful.",
      baseStatus: {
        lighting: "poor",
        accessibility: "faded_curb",
        transitInfo: "none",
        safetyFeatures: "none"
      },
      inspectable: true
    },
    {
      id: "central_bus_stop",
      name: "Central Avenue Bus Stop (Bay 4)",
      district: "Midtown Transit Hub",
      icon: "bus",
      x: 520,
      y: 170,
      description: "A high-volume transfer point. Lacks real-time displays; passengers rely on peeling paper timetables while waiting along an unlit corridor.",
      baseStatus: {
        lighting: "poor",
        accessibility: "partial",
        transitInfo: "outdated",
        safetyFeatures: "broken_intercom"
      },
      inspectable: true
    },
    {
      id: "public_park",
      name: "Solaria Public Park & Promenade",
      district: "Greenway District",
      icon: "trees",
      x: 290,
      y: 280,
      description: "A popular daylight walking park connecting residential units to community centers, but virtually abandoned at night due to dense foliage obscuring lamp posts.",
      baseStatus: {
        lighting: "unlit",
        accessibility: "rough_paths",
        transitInfo: "none",
        safetyFeatures: "isolated"
      },
      inspectable: true
    },
    {
      id: "community_center",
      name: "Hope Horizon Community Center",
      district: "West End Neighborhood",
      icon: "home-heart",
      x: 160,
      y: 360,
      description: "A welcoming hub hosting night classes, advocacy workshops, and mutual aid networks. Volunteers frequently organize community walks.",
      baseStatus: {
        lighting: "adequate",
        accessibility: "ramped",
        transitInfo: "community_board",
        safetyFeatures: "staffed_evenings"
      },
      inspectable: true
    },
    {
      id: "public_services",
      name: "Municipal Public Services Bureau",
      district: "Civic Core",
      icon: "building-columns",
      x: 480,
      y: 320,
      description: "The city administration building housing urban planning, infrastructure maintenance logs, and public complaint intake desks.",
      baseStatus: {
        lighting: "well_lit",
        accessibility: "ada_compliant",
        transitInfo: "official",
        safetyFeatures: "bureaucratic"
      },
      inspectable: true
    },
    {
      id: "grand_crossing",
      name: "Grand Avenue Multi-Lane Crossing",
      district: "Medical & Commercial Junction",
      icon: "traffic-light",
      x: 620,
      y: 390,
      description: "A critical 6-lane intersection dividing residential neighborhoods from the hospital and pharmacy. Steep curb drops and silent crosswalk lights endanger mobility-aid users.",
      baseStatus: {
        lighting: "flickering",
        accessibility: "severe_barrier",
        transitInfo: "none",
        safetyFeatures: "silent_signals"
      },
      inspectable: true
    },
    {
      id: "st_jude_hospital",
      name: "Aurelia Memorial Hospital",
      district: "Healthcare Sector",
      icon: "hospital",
      x: 750,
      y: 330,
      description: "Major healthcare facility operating 24/7. Hundreds of healthcare workers, nurses, and patients arrive or depart during late night shift rotations.",
      baseStatus: {
        lighting: "bright",
        accessibility: "accessible",
        transitInfo: "indoor_screen",
        safetyFeatures: "hospital_security"
      },
      inspectable: true
    },
    {
      id: "residential_quarter",
      name: "Willow Creek Residential District",
      district: "South Residential",
      icon: "house",
      x: 320,
      y: 470,
      description: "A quiet, high-density neighborhood where working families, students, and seniors reside. Residents report feeling isolated during the final 500 meters of their journeys.",
      baseStatus: {
        lighting: "dim",
        accessibility: "inconsistent",
        transitInfo: "none",
        safetyFeatures: "residential"
      },
      inspectable: true
    },
    {
      id: "transit_terminal",
      name: "Grand Union Metro & Bus Terminal",
      district: "Eastern Gateway",
      icon: "train",
      x: 720,
      y: 190,
      description: "The central multimodal transit hub. High evening foot traffic, but confusing wayfinding, closed service windows, and poor exterior platform visibility.",
      baseStatus: {
        lighting: "moderate",
        accessibility: "elevators_slow",
        transitInfo: "digital_central",
        safetyFeatures: "transit_police"
      },
      inspectable: true
    }
  ],

  // Street network connecting the locations on the map
  streets: [
    { from: "univ_campus", to: "north_crossing", name: "University Blvd", type: "arterial" },
    { from: "north_crossing", to: "central_bus_stop", name: "North Avenue", type: "arterial" },
    { from: "univ_campus", to: "public_park", name: "Campus Greenway", type: "walkway" },
    { from: "public_park", to: "community_center", name: "Parkway South", type: "walkway" },
    { from: "north_crossing", to: "public_services", name: "Civic Way", type: "street" },
    { from: "central_bus_stop", to: "transit_terminal", name: "Transit Link East", type: "arterial" },
    { from: "public_services", to: "grand_crossing", name: "Grand Avenue", type: "arterial" },
    { from: "grand_crossing", to: "st_jude_hospital", name: "Health Corridor", type: "street" },
    { from: "community_center", to: "residential_quarter", name: "Willow Lane", type: "residential" },
    { from: "public_services", to: "residential_quarter", name: "South Civic Route", type: "street" },
    { from: "grand_crossing", to: "residential_quarter", name: "Crescent Boulevard", type: "arterial" }
  ],

  // City Upgrades available in the municipal store
  upgrades: [
    {
      id: "repair_streetlights",
      title: "Pedestrian-Scale Smart Streetlights",
      cost: 100,
      category: "Infrastructure",
      icon: "lightbulb",
      targetLocations: ["univ_campus", "north_crossing", "central_bus_stop", "grand_crossing"],
      description: "Install warm-spectrum, high-visibility pedestrian-height LED luminaires along unlit corridors.",
      socialImpact: "Removes dark corridors, enhances visual clarity for all pedestrians, and fosters natural passive surveillance without intrusive glare.",
      benefitText: "+35% Corridor Visibility, eliminates lighting penalties on all relevant routes.",
      requiresIssue: "broken_streetlight"
    },
    {
      id: "improve_pedestrian_crossing",
      title: "Universal Pedestrian Crossing & Signalization",
      cost: 150,
      category: "Safety & Accessibility",
      icon: "traffic-light",
      targetLocations: ["north_crossing", "grand_crossing"],
      description: "Repave high-contrast zebra crosswalks, install raised pedestrian speed-tables, and activate accessible audio/vibrating push-button signals.",
      socialImpact: "Protects pedestrians from speeding vehicular traffic and provides safe, dignified crossings for people with visual and sensory disabilities.",
      benefitText: "Eliminates crossing barriers, adds tactile audio cues, reduces route transit danger.",
      requiresIssue: "faded_crossing"
    },
    {
      id: "update_bus_stop_info",
      title: "Real-Time Digital Transit Displays & Solar Shelter",
      cost: 80,
      category: "Transportation",
      icon: "clock",
      targetLocations: ["central_bus_stop", "transit_terminal"],
      description: "Replace outdated static paper schedules with backlit, real-time GPS arrival displays and weather shelters.",
      socialImpact: "Reduces anxiety and vulnerability by removing unpredictable 30+ minute waiting times in isolated, unlit bus stops.",
      benefitText: "Eliminates schedule ghosting, reduces wait times by 40%, updates Route B reliability.",
      requiresIssue: "outdated_timetable"
    },
    {
      id: "improve_bus_accessibility",
      title: "Universal Transit Accessibility Ramp & Tactile Paving",
      cost: 120,
      category: "Accessibility",
      icon: "wheelchair",
      targetLocations: ["central_bus_stop", "grand_crossing", "st_jude_hospital"],
      description: "Re-grade bus boarding pads to flush platform heights and install directional blister tactile paving for cane users.",
      socialImpact: "Ensures elderly residents, parents with strollers, and wheelchair users can board public transit independently without being stranded.",
      benefitText: "Removes mobility barriers across bus lines; allows accessible journey planning.",
      requiresIssue: "curb_barrier"
    },
    {
      id: "community_help_point",
      title: "Community Safety Hub & Staffed Evening Care Point",
      cost: 120,
      category: "Community",
      icon: "users",
      targetLocations: ["community_center", "public_park", "central_bus_stop"],
      description: "Partner with local women's advocacy collectives to establish well-lit, staffed evening community help and wayfinding stations.",
      socialImpact: "Builds collective community stewardship, active bystander hubs, and safe rest stops rather than relying solely on punitive policing.",
      benefitText: "Enables community accompaniment, raises witness trust, unlocks local support.",
      requiresIssue: "lack_of_support"
    },
    {
      id: "improve_complaint_procedures",
      title: "Transparent Digital Complaint & Accountability Portal",
      cost: 140,
      category: "Institutional",
      icon: "clipboard-check",
      targetLocations: ["public_services", "univ_campus"],
      description: "Overhaul the city's reporting pipeline: remove mandatory identity exposure, implement public tracking tickets, and mandate 48h response SLAs.",
      socialImpact: "Dismantles institutional silence. Legitimizes community reports of harassment and neglect instead of burying them under red tape.",
      benefitText: "Resolves bureaucratic backlog, unlocks historical incident reports in Mission 2 & 3.",
      requiresIssue: "opaque_reporting"
    }
  ],

  // 3 Detailed, Connected Campaign Missions
  missions: [
    {
      id: "mission_1",
      number: 1,
      title: "The Last Bus",
      tagline: "When infrastructure fails, simple journeys become daunting trials.",
      character: {
        name: "Maya",
        role: "University Engineering Student",
        avatar: "student",
        portraitBg: "#8B7CFF",
        intro: "I had a robotics lab until 9:00 PM. The walk to Central Bus Stop used to be okay, but lately half the lamps are burned out, the timetable is completely wrong, and cars blast through the crosswalk like nobody is there. I felt completely trapped waiting alone."
      },
      briefing: "Aurelia University student Maya filed a report detailing extreme distress while attempting to reach Central Bus Stop after an evening lab. Explore the academic corridor, collect physical and institutional clues, evaluate transit routes, and implement infrastructural interventions.",
      targetLocations: ["univ_campus", "north_crossing", "central_bus_stop"],
      rewardCredits: 180,
      
      clues: [
        {
          id: "m1_clue_lamp",
          title: "Shattered Luminaire & Burned Out Sodium Lamp",
          category: "Infrastructure",
          location: "north_crossing",
          icon: "lightbulb-off",
          description: "A pedestrian pole lamp on 4th & North Avenue has been dead for 22 days. The surrounding 150-meter pavement is shrouded in pitch darkness.",
          detailText: "Physical inspection reveals the high-pressure sodium bulb burst nearly a month ago. Pedestrians crossing here are completely invisible to approaching headlights until the last 15 feet.",
          relevance: "Direct cause of low visibility and severe nighttime pedestrian vulnerability."
        },
        {
          id: "m1_clue_crossing",
          title: "Faded Zebra Stripes & Steep Curb Lip",
          category: "Accessibility",
          location: "north_crossing",
          icon: "road",
          description: "Crosswalk paint has eroded down to bare asphalt. The sidewalk transition has a cracked 4-inch lip that blocks strollers and wheelchairs.",
          detailText: "Traffic counts show evening vehicular speeds average 48 mph despite the 25 mph school zone limit. Without reflective crosswalk paint, drivers do not decelerate.",
          relevance: "Creates high physical danger for pedestrians crossing to reach the transit bay."
        },
        {
          id: "m1_clue_schedule",
          title: "Vandalized Paper Schedule & 30-Min Ghost Bus",
          category: "Transportation",
          location: "central_bus_stop",
          icon: "calendar-x",
          description: "Peeling paper timetable lists Route 14 at 9:15 PM, but the transit agency silently altered it to 9:45 PM without posting digital notices.",
          detailText: "Maya waited in the dark for 32 minutes believing the bus was simply late. Outdated static information artificially prolongs vulnerable waiting periods in unmonitored spaces.",
          relevance: "Unreliable public transit schedules force extended waiting in unsafe, unlit conditions."
        },
        {
          id: "m1_clue_ticket",
          title: "Ignored Municipal Work Order #2049",
          category: "Institutional Response",
          location: "univ_campus",
          icon: "file-text",
          description: "University Student Council submitted an urgent repair request for lighting and crossing repainting three weeks ago; status is marked 'Deferred - Low Priority'.",
          detailText: "The municipal public works department classified student pedestrian safety as secondary to arterial repaving projects, leaving the route unaddressed.",
          relevance: "Shows administrative neglect and failure to listen to student and community warnings."
        },
        {
          id: "m1_clue_commuter",
          title: "Statement: Sam (Transit Shift Worker)",
          category: "Community Reports",
          location: "central_bus_stop",
          icon: "message-square",
          description: "Sam confirms: 'We get dozens of students stranded here every week. When the lights went out, people started taking unsafe detours or paying for expensive rides.'",
          detailText: "'Public transit has to be dependable after sunset. If you can't guarantee a lit, predictable bus stop, you're effectively locking women and young people out of the city.'",
          relevance: "Witness confirmation of systemic recurring issues rather than an isolated incident."
        }
      ],

      // Deduction logic: user selects clues to form conclusions
      deduction: {
        question: "Based on the evidence collected, what is the primary systemic cause of Maya's unsafe journey?",
        options: [
          {
            id: "correct",
            requiredClues: ["m1_clue_lamp", "m1_clue_schedule", "m1_clue_ticket"],
            text: "Compounding Infrastructure & Scheduling Neglect: Ignored maintenance tickets created an unlit corridor, while silent transit schedule changes forced prolonged waiting in isolation.",
            feedback: "Spot on! You recognized that women's safety is compromised when institutional neglect (deferred repair tickets) leaves public infrastructure dark, compounding transit unreliability.",
            isCorrect: true,
            score: 25
          },
          {
            id: "distractor_individual",
            requiredClues: ["m1_clue_lamp"],
            text: "Individual Timing Misjudgment: Maya simply arrived at the wrong time and should have chosen a daylight transit option.",
            feedback: "Incorrect & Victim-Blaming. Maya had legitimate evening lab coursework. Public infrastructure and reliable transit must serve residents at all scheduled hours, not just daylight.",
            isCorrect: false,
            score: 5
          },
          {
            id: "distractor_policing",
            requiredClues: ["m1_clue_commuter"],
            text: "Lack of Police Patrols: The entire issue would be solved if continuous armed law enforcement patrolled the campus perimeter.",
            feedback: "Incomplete analysis. Surveillance or policing does not fix broken lightbulbs, faded pedestrian crosswalks, or cancelled bus schedules. Sustainable safety requires functional public infrastructure.",
            isCorrect: false,
            score: 10
          }
        ]
      },

      // Branching Dialogue with Maya and Bystander
      dialogue: {
        speaker: "Maya",
        characterRole: "Student",
        initialText: "Investigator Nova, thank you for looking into this. When I was stranded at Bay 4, another commuter saw I was visibly anxious as cars were slowing down and honking near the dark stop. What do you think is the right way for a community to respond in situations like that?",
        choices: [
          {
            id: "bystander_safe_checkin",
            text: "An active bystander should check in respectfully: 'Hey, are you waiting for the 14? Mind if we wait together under the shop awning where it's lit?'",
            response: "Maya nods with relief: 'Exactly. That person didn't try to be a vigilante hero or invade my space; they just offered solidarity and shared presence in a well-lit spot. It made all the difference in de-escalating my fear.'",
            points: 20,
            impactTag: "Promoted Safe Bystander Intervention"
          },
          {
            id: "bystander_ignore",
            text: "People should mind their own business and assume everyone handles their own journey.",
            response: "Maya looks disheartened: 'When everyone ignores distress, public spaces become cold and dangerous. Isolation is what predators count on. Collective safety requires looking out for one another.'",
            points: 5,
            impactTag: "Passive Bystander Approach"
          },
          {
            id: "bystander_confront",
            text: "The bystander should aggressively confront any suspicious driver or shout at passing cars.",
            response: "Maya winces: 'Escalating into aggressive confrontation often triggers more danger and panic. Calm, supportive, consensual presence is much safer.'",
            points: 10,
            impactTag: "Aggressive Escalation"
          }
        ]
      },

      // Route options for Maya
      routes: [
        {
          id: "route_1_alley",
          name: "Route A: North Shortcut Alley",
          duration: "5 mins",
          baseSafetyRating: "Poor (High Hazard)",
          lighting: "Zero (Unlit dark alley)",
          accessibility: "Broken pavement & rubble",
          trafficCondition: "Narrow dead-end, no passive surveillance",
          description: "Fastest route on paper, but cuts through unmaintained service alleys behind shuttered warehouses with no lighting or exit sightlines.",
          evidenceNotes: "Dangerous entrapment risk; unlit and isolated.",
          suitability: "Unfavorable",
          requiresUpgrade: null
        },
        {
          id: "route_1_avenue",
          name: "Route B: North Avenue Arterial",
          duration: "9 mins",
          baseSafetyRating: "Fair (Improvable)",
          lighting: "Partially lit (Flickering lamp at crossing)",
          accessibility: "Standard sidewalks with faded crosswalk",
          trafficCondition: "Moderate foot traffic, open street sightlines",
          description: "Follows the main university boulevard. Open sightlines and active storefronts, but hindered by the broken streetlight at 4th and faded crosswalk.",
          evidenceNotes: "Best foundational path; upgrading streetlights and pedestrian crossing makes this an ideal safe corridor.",
          suitability: "Recommended",
          upgradeBenefit: "If Streetlights + Crossing are upgraded, becomes 100% lit, fully signalized safe corridor."
        },
        {
          id: "route_1_park",
          name: "Route C: Solaria Park Outer Trail",
          duration: "13 mins",
          baseSafetyRating: "Moderate Risk",
          lighting: "Sparse perimeter lanterns",
          accessibility: "Gentle dirt trail, impassable in heavy rain",
          trafficCondition: "Desolate after 8 PM; dense shrubbery",
          description: "A scenic bypass avoiding traffic, but the overgrown tree canopy creates severe blind spots and emergency assistance is far away.",
          evidenceNotes: "Too isolated for late evening transit transfers without active park staffing.",
          suitability: "Caution",
          requiresUpgrade: null
        }
      ]
    },

    {
      id: "mission_2",
      number: 2,
      title: "The Silent Report",
      tagline: "When complaints are buried in bureaucracy, the city's blind spots grow.",
      character: {
        name: "Leena & Aria",
        role: "Healthcare Worker & Community Volunteer",
        avatar: "advocate",
        portraitBg: "#43D9E8",
        intro: "We filed four separate reports about the dead emergency call-box and aggressive harassment at Civic Plaza transit platforms. The municipal portal asked for our home addresses and government IDs, and then two weeks later sent an automated email saying: 'Case Closed - Insufficient Civic Priority.' People have given up on reporting."
      },
      briefing: "A pattern of harassment and broken safety infrastructure at the Civic Transit junction has been systematically hidden by a defective complaint-handling bureaucracy. Investigate municipal records, interview workers, reform reporting accountability, and establish community-driven safety hubs.",
      targetLocations: ["public_services", "central_bus_stop", "community_center"],
      rewardCredits: 200,

      clues: [
        {
          id: "m2_clue_redacted",
          title: "Closed Incident Log #8812 & Auto-Rejection Script",
          category: "Institutional Response",
          location: "public_services",
          icon: "file-x",
          description: "Municipal records show 19 reports in two months were closed by an automated script because callers did not provide permanent residential proof.",
          detailText: "The city's reporting software automatically purged reports flagged as 'unverified identity'. This created an artificial statistical record showing 'zero safety incidents' in an area with widespread harassment.",
          relevance: "Institutional gaslighting: bureaucratic barriers erase real community experiences to make official metrics look clean."
        },
        {
          id: "m2_clue_callbox",
          title: "Severed Emergency Intercom at Platform 3",
          category: "Infrastructure",
          location: "central_bus_stop",
          icon: "phone-off",
          description: "The illuminated 'Emergency Assistance' pillar has its copper wiring severed inside the inspection hatch. The call button produces only a dead tone.",
          detailText: "A sticker on the intercom reads 'Tested OK 2024'. Maintenance has not physically opened the unit in over 18 months, giving transit riders a false sense of security.",
          relevance: "Fictional safety theater that fails when a resident actually needs emergency contact."
        },
        {
          id: "m2_clue_advocate_log",
          title: "Hope Horizon Independent Incident Journal",
          category: "Community Reports",
          location: "community_center",
          icon: "book-open",
          description: "Volunteer Aria maintains a handwritten log of 28 separate incidents reported by night shift nurses and students that never appear in official police records.",
          detailText: "'Women don't report because they are either blamed, interrogated, or forced to reveal private contact information to the very entities that ignored them.'",
          relevance: "Demonstrates that grassroots community trust exists where official institutional channels have failed."
        },
        {
          id: "m2_clue_leena_testimony",
          title: "Statement: Leena (Night Shift Nurse)",
          category: "Community Reports",
          location: "public_services",
          icon: "message-circle",
          description: "Leena explains: 'When I finish my 12-hour shift at 11 PM, I have to walk past the darkened plaza. I tried to report catcalling and following, but the clerk asked what I was wearing.'",
          detailText: "'Secondary victimization by city intake clerks makes people suffer in silence. We need anonymous reporting, real human care, and staffed safe zones.'",
          relevance: "Direct evidence of institutional bias discouraging victims from seeking institutional remedies."
        },
        {
          id: "m2_clue_transit_budget",
          title: "Transit Allocation Discrepancy Memo",
          category: "Transportation",
          location: "public_services",
          icon: "trending-down",
          description: "Audit memo reveals 92% of the district's public safety budget was diverted into facial recognition cameras, while zero funds were spent on lighting or staff.",
          detailText: "Passive surveillance cameras recorded crimes without preventing them or offering any on-the-spot aid to victims in distress.",
          relevance: "Highlights the fallacy that punitive surveillance alone creates community safety without responsive human support."
        }
      ],

      deduction: {
        question: "What systemic failure allowed recurring safety problems at the Civic Hub to go completely unresolved?",
        options: [
          {
            id: "correct",
            requiredClues: ["m2_clue_redacted", "m2_clue_advocate_log", "m2_clue_leena_testimony"],
            text: "Hostile Bureaucratic Reporting Architecture: Demanding intrusive identity verification, automated dismissals, and victim-blaming intake erased community incidents from official oversight.",
            feedback: "Brilliant analysis! You uncovered that administrative silencing and victim-blaming intake structures protect municipal reputations while abandoning residents.",
            isCorrect: true,
            score: 25
          },
          {
            id: "distractor_camera",
            requiredClues: ["m2_clue_transit_budget"],
            text: "Camera Resolution Deficit: The security cameras simply did not have enough optical zoom to identify offenders.",
            feedback: "Flawed premise. High-tech surveillance does not address why human beings were ignored, why emergency call boxes were severed, or why victims faced secondary traumatization.",
            isCorrect: false,
            score: 5
          },
          {
            id: "distractor_apathy",
            requiredClues: ["m2_clue_callbox"],
            text: "Community Apathy: Residents simply did not care enough to follow through on formal paperwork.",
            feedback: "Untrue. Community logs show 28 separate attempts to seek help. The breakdown was institutional refusal to act, not community apathy.",
            isCorrect: false,
            score: 5
          }
        ]
      },

      dialogue: {
        speaker: "Aria",
        characterRole: "Community Advocate",
        initialText: "Nova, the Municipal Bureau wants us to stop logging complaints independently and tell residents to 'just use the official app'. But our community members don't trust them. How should we restructure accountability in Aurelia City?",
        choices: [
          {
            id: "systemic_reform",
            text: "Implement an independent community oversight board with anonymous reporting, guaranteed 48h response tracking, and public accountability dashboards.",
            response: "Aria's eyes light up: 'Yes! Transparency is the antidote to neglect. When the public can track work orders and report without fear of exposure, institutions are forced to act.'",
            points: 20,
            impactTag: "Institutional Transparency Established"
          },
          {
            id: "hand_over",
            text: "Hand over all community records to the city and advise victims to comply with the existing verification rules.",
            response: "Aria shakes her head sadly: 'That would violate the trust our vulnerable neighbors placed in us. We cannot surrender people's privacy to a broken system.'",
            points: 5,
            impactTag: "Surrendered Community Autonomy"
          },
          {
            id: "ignore_city",
            text: "Boycott all city institutions entirely and rely only on unofficial neighborhood buddy systems.",
            response: "Aria sighs: 'Mutual aid is vital, but tax dollars belong to the people. We must demand that city infrastructure and public services do their duty, not let them off the hook.'",
            points: 12,
            impactTag: "Partial Civic Disengagement"
          }
        ]
      },

      routes: [
        {
          id: "route_2_plaza",
          name: "Route A: Civic Plaza Direct Concourse",
          duration: "7 mins",
          baseSafetyRating: "Uncertain (High Conflict)",
          lighting: "Overhead halogen spotlights with dark alcoves",
          accessibility: "Smooth marble paving",
          trafficCondition: "Desolate plazas with unstaffed blind corners",
          description: "Fast pedestrian concourse passing directly through Civic Plaza. Open during work hours, but after 9 PM, deserted colonnades create isolation.",
          evidenceNotes: "Severe risk until complaint procedures and community help points are instituted.",
          suitability: "Conditional",
          upgradeBenefit: "With Community Help Point installed, becomes a secure, staffed transit corridor."
        },
        {
          id: "route_2_civic_way",
          name: "Route B: Civic Way Commercial Perimeter",
          duration: "10 mins",
          baseSafetyRating: "Good (Consistent Activity)",
          lighting: "Well-maintained storefront awnings & streetlights",
          accessibility: "Standard sidewalks with tactile crossings",
          trafficCondition: "Moderate late-night delivery and restaurant foot traffic",
          description: "Follows active convenience shops, all-night bakeries, and well-lit bus lanes. Slightly longer, but provides natural community presence.",
          evidenceNotes: "Excellent example of 'eyes on the street' creating organic community safety.",
          suitability: "Recommended",
          requiresUpgrade: null
        },
        {
          id: "route_2_service_tunnel",
          name: "Route C: Metro Sub-Level Pedestrian Underpass",
          duration: "6 mins",
          baseSafetyRating: "Severe Hazard",
          lighting: "Flickering neon tubes with blind 90-degree corners",
          accessibility: "Steep staircase; broken wheelchair lift",
          trafficCondition: "Enclosed tunnel with zero cellular signal and broken intercoms",
          description: "Underground pedestrian shortcut crossing under the train tracks. Completely enclosed with no mobile phone signal or emergency egress.",
          evidenceNotes: "Avoid at all costs. An architectural trap that violates universal safety principles.",
          suitability: "Dangerous",
          requiresUpgrade: null
        }
      ]
    },

    {
      id: "mission_3",
      number: 3,
      title: "The Dark Crossing",
      tagline: "True community safety is universal: when a city fails its most vulnerable, it fails everyone.",
      character: {
        name: "Elena & Marcus",
        role: "Accountant (Wheelchair User) & Senior Resident",
        avatar: "universal_access",
        portraitBg: "#F472B6",
        intro: "Grand Avenue Crossing is our only route to the hospital, pharmacy, and grocery. But the city timed the pedestrian light for only 9 seconds to cross six lanes of traffic! The curb drop has a 6-inch broken concrete ledge, the audible chirpers have been dead for months, and cars turn without looking. We are literally trapped in our own neighborhood."
      },
      briefing: "The vital Grand Avenue intersection connecting residential quarters with healthcare and daily necessities has become an impassable barrier for residents with mobility, sensory, and age-related access needs. Gather cross-disciplinary accessibility evidence, redesign the crossing, and complete Aurelia City's transformation.",
      targetLocations: ["grand_crossing", "st_jude_hospital", "residential_quarter"],
      rewardCredits: 220,

      clues: [
        {
          id: "m3_clue_curb",
          title: "Broken 6-Inch Curb Ledge & Fractured Ramp",
          category: "Accessibility",
          location: "grand_crossing",
          icon: "alert-triangle",
          description: "The curb-cut ramp was destroyed during winter utility excavations and replaced with a temporary asphalt wedge that has washed away, leaving a jagged barrier.",
          detailText: "Elena's power wheelchair cannot mount the 6-inch concrete drop. To cross, she is forced to wheel 400 meters in active traffic lanes alongside speeding vehicles.",
          relevance: "Infrastructure physical barrier that forces vulnerable pedestrians into extreme traffic danger."
        },
        {
          id: "m3_clue_signal_timer",
          title: "9-Second Traffic Signal Cycle Metric",
          category: "Infrastructure",
          location: "grand_crossing",
          icon: "timer",
          description: "Traffic control box shows the pedestrian walk phase is set to 9 seconds across 72 feet of roadway (8.0 feet/sec), designed solely to maximize vehicular throughput.",
          detailText: "Universal design standards mandate walking speeds of no more than 2.8 to 3.0 feet/second to accommodate seniors, crutch users, and parents with infants.",
          relevance: "Institutional policy prioritizing automobile speed over human pedestrian survival."
        },
        {
          id: "m3_clue_audio_chirper",
          title: "Silent Audio Crosswalk Beacon & Missing Tactile Pavers",
          category: "Accessibility",
          location: "grand_crossing",
          icon: "volume-x",
          description: "The audible acoustic locator for blind pedestrians has been disconnected. Warning truncated dome blister pavers were paved over during road resurfacing.",
          detailText: "Marcus, who has partial sight, cannot determine when the light has changed or where the safe crosswalk boundary begins, resulting in several near-misses.",
          relevance: "Sensory exclusion that removes dignity and safety for residents with visual disabilities."
        },
        {
          id: "m3_clue_prior_complaints",
          title: "Cross-Reference: Prior Hospital Staff Petitions",
          category: "Institutional Response",
          location: "st_jude_hospital",
          icon: "folder-check",
          description: "Hospital administration and disability advocates submitted 43 petitions over two years requesting traffic calming and a raised pedestrian refuge island.",
          detailText: "If the player enacted the 'Transparent Digital Complaint Portal' in Mission 2, this petition was automatically escalated to emergency city council agenda!",
          relevance: "Demonstrates how earlier institutional reforms accelerate justice in future crises (The City Remembers)."
        },
        {
          id: "m3_clue_hospital_shift",
          title: "Statement: Marcus (Senior Resident)",
          category: "Community Reports",
          location: "residential_quarter",
          icon: "heart-handshake",
          description: "Marcus states: 'When people talk about women's safety or community safety, they often forget about elderly grandmothers or mothers with double strollers.'",
          detailText: "'A truly safe route isn't just safe from crime—it is safe from reckless speed, accessible to wheels of all kinds, and illuminated with care for human life.'",
          relevance: "Articulates the core intersectional thesis of universal design and social good."
        }
      ],

      deduction: {
        question: "What does the Grand Avenue investigation prove about the relationship between urban accessibility and community safety?",
        options: [
          {
            id: "correct",
            requiredClues: ["m3_clue_curb", "m3_clue_signal_timer", "m3_clue_audio_chirper"],
            text: "Systemic Exclusion by Design: Prioritizing vehicular throughput over pedestrian accessibility physically traps seniors, people with disabilities, and caregivers in dangerous transit bottlenecks.",
            feedback: "Exceptional insight! You grasped the foundational truth of inclusive urbanism: designing for the most vulnerable residents creates a safer, more humane city for everyone.",
            isCorrect: true,
            score: 25
          },
          {
            id: "distractor_individual_transit",
            requiredClues: ["m3_clue_curb"],
            text: "Private Vehicle Superiority: People with mobility challenges should avoid public sidewalks and rely exclusively on private paratransit vans.",
            feedback: "Discriminatory perspective. Public space is a universal human right. Segregating vulnerable citizens into costly, unreliable paratransit excuses the city from building accessible infrastructure.",
            isCorrect: false,
            score: 5
          },
          {
            id: "distractor_driver_blame",
            requiredClues: ["m3_clue_signal_timer"],
            text: "Individual Driver Recklessness: The crossing is fine; the only issue is reckless motorists who need more traffic tickets.",
            feedback: "Surface-level conclusion. Even the most cautious driver cannot see a pedestrian stranded in the dark due to a 9-second light timing and non-existent curb ramps. The geometry of the street is the root issue.",
            isCorrect: false,
            score: 10
          }
        ]
      },

      dialogue: {
        speaker: "Elena",
        characterRole: "Accountant & Disability Advocate",
        initialText: "Nova, city engineers always claim that curb ramps, audible signals, and longer crosswalk times 'slow down traffic and cost too much'. How do we convince them that universal accessibility is worth investing in?",
        choices: [
          {
            id: "universal_curb_cut",
            text: "Show them the 'Curb-Cut Effect': improvements built for wheelchair users directly benefit parents with strollers, delivery workers with carts, travelers with luggage, and seniors. Universal design elevates the whole community.",
            response: "Elena smiles warmly: 'That is the ultimate truth of civic design. When you design a city for the margins, the center thrives too. Accessibility isn't an act of charity; it is the cornerstone of justice.'",
            points: 20,
            impactTag: "Universal Design Championed"
          },
          {
            id: "compromise_minimum",
            text: "Ask for just one narrow painted pathway and tell seniors to walk quickly during peak traffic hours.",
            response: "Elena frowns: 'Half-measures leave people stranded in traffic. Dignified access requires uncompromised universal standards, not token gestures.'",
            points: 5,
            impactTag: "Compromised Accessibility"
          },
          {
            id: "advise_detour",
            text: "Recommend that residents take a 2-kilometer detour around the arterial avenue.",
            response: "Elena sighs: 'Expecting disabled or elderly residents to travel an extra mile in bad weather just to get groceries is deeply unjust. The street belongs to us too.'",
            points: 8,
            impactTag: "Unjust Detour Imposed"
          }
        ]
      },

      routes: [
        {
          id: "route_3_grand_crossing",
          name: "Route A: Grand Avenue Direct Crossing",
          duration: "6 mins",
          baseSafetyRating: "Extreme Hazard (Pre-Upgrade)",
          lighting: "Overhead glare with deep road shadows",
          accessibility: "Broken 6-inch curb drops; silent signals",
          trafficCondition: "High-speed 6-lane multi-arterial turning traffic",
          description: "The direct pedestrian lifeline connecting the residential district with the hospital. Highly perilous before universal upgrades.",
          evidenceNotes: "Essential connection. Must be upgraded with universal crossings and accessible ramps.",
          suitability: "Critical Upgrade Target",
          upgradeBenefit: "When Pedestrian Crossing + Accessibility Upgrades are purchased, transforms into a premier Gold-Standard Universal Crossing."
        },
        {
          id: "route_3_crescent",
          name: "Route B: Crescent Boulevard Overpass",
          duration: "18 mins",
          baseSafetyRating: "Moderate (Physically Exhausting)",
          lighting: "Consistent amber highway lamps",
          accessibility: "Steep 8% incline pedestrian bridge with no elevator",
          trafficCondition: "Separated from cars, but isolated over highway",
          description: "A grade-separated pedestrian bridge over the highway. Physically exhausting for seniors, completely inaccessible for manual wheelchairs, and isolated late at night.",
          evidenceNotes: "Illustrates how 'pedestrian bridges' often prioritize cars by forcing humans to climb stairs rather than slowing down vehicular traffic.",
          suitability: "Inaccessible Bypass",
          requiresUpgrade: null
        },
        {
          id: "route_3_river_path",
          name: "Route C: Riverfront Medical Pathway",
          duration: "12 mins",
          baseSafetyRating: "Fair (Weather Permitting)",
          lighting: "Low bollard solar lighting",
          accessibility: "Paved path with occasional tree root ridges",
          trafficCondition: "Car-free scenic greenway",
          description: "A pleasant riverside route connecting south neighborhoods to hospital gardens. Peaceful in fair weather, but isolated after dark with poor cellular reception.",
          evidenceNotes: "Good auxiliary route, but cannot substitute for a safe, accessible arterial crossing to commercial essentials.",
          suitability: "Secondary",
          requiresUpgrade: null
        }
      ]
    }
  ],

  // Scoring rubric parameters
  scoringWeights: {
    investigation: 25, // Clues collected & evidence board completion
    routePlanning: 20, // Responsible route choice based on witness needs
    appropriateResponse: 20, // Safe bystander / empathetic / institutional reform choices
    qualityUpgrades: 25, // Relevant upgrades purchased to address root causes
    budgetManagement: 10 // Prudent stewardship without wasteful deficit
  },

  // Final Campaign Titles based on player decisions
  campaignTitles: {
    changemaker: {
      minScore: 260,
      title: "Aurelia's Master Changemaker",
      subtitle: "Champion of Universal Safety & Institutional Integrity",
      badge: "star-gold",
      summary: "You did not merely patch potholes; you dismantled bureaucratic silence, illuminated dark corridors, and proved that a city designed for its most vulnerable residents becomes a beacon of safety for all."
    },
    champion: {
      minScore: 210,
      title: "The Community Champion",
      subtitle: "Guardian of Grassroots Solidarity & Civic Infrastructure",
      badge: "shield-check",
      summary: "Through thoughtful listening and persistent investigation, you restored trust between Aurelia's neighborhoods and public institutions, transforming dangerous journeys into routes of dignity."
    },
    investigator: {
      minScore: 0,
      title: "The Dedicated Field Investigator",
      subtitle: "Advocate for Ongoing Urban Reform",
      badge: "compass",
      summary: "You gathered vital evidence and initiated critical conversations about women's safety and public infrastructure. Aurelia City has begun its journey toward true social equity, with more work still ahead."
    }
  },

  // Educational SDG & Real-World Guidelines
  educationalGuide: {
    primarySDG: {
      code: "SDG 5",
      name: "Gender Equality",
      target: "Target 5.2: Eliminate all forms of violence against all women and girls in public and private spheres.",
      description: "Freedom of movement without fear of harassment or intimidation is a fundamental prerequisite for gender equality. When public spaces, transit lines, and streets are unsafe or unlit, women are systematically restricted in their educational, economic, and social opportunities."
    },
    secondarySDGs: [
      {
        code: "SDG 11",
        name: "Sustainable Cities & Communities",
        target: "Target 11.2 & 11.7: Provide access to safe, affordable, accessible and sustainable transport systems and universal green/public spaces, with special attention to the needs of women, children, persons with disabilities and older persons."
      },
      {
        code: "SDG 16",
        name: "Peace, Justice & Strong Institutions",
        target: "Target 16.6: Develop effective, accountable and transparent institutions at all levels, eliminating bureaucratic dismissal of public safety reports."
      },
      {
        code: "SDG 10",
        name: "Reduced Inequalities",
        target: "Target 10.2: Empower and promote the social, economic and political inclusion of all, irrespective of age, sex, disability, race, or economic status through universal design."
      }
    ],
    bystanderIntervention: [
      {
        name: "Direct",
        desc: "If safe to do so, directly address the person causing harm or check in directly with the person targeted."
      },
      {
        name: "Distract",
        desc: "De-escalate tension by asking for directions, dropping a book, or starting a casual conversation with the targeted person."
      },
      {
        name: "Delegate",
        desc: "Find a transit operator, store employee, or authority figure with the duty and power to intervene safely."
      },
      {
        name: "Delay",
        desc: "Check in with the targeted person after the incident has passed: 'I saw what happened. Are you okay? Can I wait with you?'"
      },
      {
        name: "Document",
        desc: "If someone is already helping and it is safe, note details (time, transit vehicle number) with the consent of the targeted person."
      }
    ]
  },

  // Verified 24/7 Community Safe Havens
  safeHavens: [
    {
      id: "sh_hospital",
      name: "Aurelia Memorial Hospital (24/7 Emergency Triage)",
      district: "Healthcare Sector",
      locationId: "st_jude_hospital",
      address: "750 Health Corridor",
      hours: "24/7 Always Open",
      staffing: "Medical Staff, Security Escorts & Well-Lit Emergency Canopy",
      features: ["24/7 Staffed Desk", "Emergency Telemetry", "First Aid", "High Visibility"],
      phone: "(555) 019-9110",
      x: 750, y: 330
    },
    {
      id: "sh_community",
      name: "Hope Horizon Community Center (Evening Safe Haven)",
      district: "West End Neighborhood",
      locationId: "community_center",
      address: "160 Parkway South",
      hours: "Open until 2:00 AM (Staffed Evening Hub)",
      staffing: "Women's Advocacy Collective & Volunteer Safe-Walk Escorts",
      features: ["Safe Rest Area", "Escort Service", "Direct Transit Helpline", "Tea & Charging"],
      phone: "(555) 019-SAFE",
      x: 160, y: 360
    },
    {
      id: "sh_transit",
      name: "Grand Union Terminal Staffed Operations Desk",
      district: "Eastern Gateway",
      locationId: "transit_terminal",
      address: "720 Transit Link East",
      hours: "24/7 Transit Police & Dispatch Hub",
      staffing: "Transit Customer Care, Active CCTV & Security Personnel",
      features: ["CCTV Coverage", "Emergency SOS Pillar", "Escorted Boarding", "Direct Line"],
      phone: "(555) 019-TRAN",
      x: 720, y: 190
    },
    {
      id: "sh_campus",
      name: "University East Gate Campus Safety Escort Office",
      district: "Academic Quarter",
      locationId: "univ_campus",
      address: "180 University Blvd",
      hours: "24/7 Campus Patrol & Safe-Walk Desk",
      staffing: "Campus Safety Officers & Student Safe-Walk Volunteers",
      features: ["Safe-Walk Accompaniment", "Emergency Call Pillar", "Well-Lit Awning"],
      phone: "(555) 019-WALK",
      x: 180, y: 120
    }
  ],

  // Real-Time Crowdsourced Community Danger & Infrastructure Hazard Reports
  crowdsourcedHazards: [
    {
      id: "haz_lamp_north",
      locationId: "north_crossing",
      category: "unlit_corridor",
      title: "Pitch-Black Corridor & Burned-Out Sodium Luminaire",
      description: "Streetlight has been dead for 3 weeks. Commuters crossing 4th & North are invisible to oncoming vehicles until the last 15 feet.",
      severity: "critical",
      reportedBy: "Maya S. (Engineering Student)",
      timeAgo: "18 mins ago",
      upvotes: 42,
      resolvedByUpgrade: "repair_streetlights",
      x: 360, y: 150
    },
    {
      id: "haz_ghost_bus",
      locationId: "central_bus_stop",
      category: "ghost_schedule",
      title: "Silent 30-Min Schedule Ghosting at Bay 4",
      description: "The 9:15 PM Route 14 was cancelled without notice. Over a dozen women and evening workers stranded in the unmonitored cold.",
      severity: "high",
      reportedBy: "Sam R. (Transit Commuter)",
      timeAgo: "32 mins ago",
      upvotes: 35,
      resolvedByUpgrade: "update_bus_stop_info",
      x: 520, y: 170
    },
    {
      id: "haz_broken_curb",
      locationId: "grand_crossing",
      category: "broken_curb",
      title: "6-Inch Concrete Ledge Trapping Wheelchairs & Strollers",
      description: "Excavation trench washed away curb-cut ramp. Wheelchair users forced into oncoming 6-lane traffic to cross.",
      severity: "critical",
      reportedBy: "Elena R. (Disability Advocate)",
      timeAgo: "1 hour ago",
      upvotes: 68,
      resolvedByUpgrade: "improve_pedestrian_crossing",
      x: 620, y: 390
    },
    {
      id: "haz_callbox_severed",
      locationId: "central_bus_stop",
      category: "infrastructure",
      title: "Platform 3 Emergency Call Pillar Wiring Severed",
      description: "Call-box produces dead tone; maintenance sticker is outdated by 18 months, giving false sense of emergency protection.",
      severity: "high",
      reportedBy: "Leena K. (Healthcare Worker)",
      timeAgo: "2 hours ago",
      upvotes: 29,
      resolvedByUpgrade: "community_help_point",
      x: 520, y: 170
    },
    {
      id: "haz_signal_timer",
      locationId: "grand_crossing",
      category: "accessibility",
      title: "9-Second Walk Cycle Across 6 Traffic Lanes",
      description: "Senior pedestrians and crutch users stranded in median as signal turns red before halfway point.",
      severity: "high",
      reportedBy: "Marcus T. (Senior Resident)",
      timeAgo: "3 hours ago",
      upvotes: 51,
      resolvedByUpgrade: "improve_pedestrian_crossing",
      x: 620, y: 390
    },
    {
      id: "haz_sub_tunnel",
      locationId: "public_services",
      category: "isolated_tunnel",
      title: "Desolate Sub-Level Metro Underpass - Zero Mobile Signal",
      description: "Blind 90-degree corners, flickering neon bulbs, and zero mobile phone reception. Avoid walking alone after 8 PM.",
      severity: "critical",
      reportedBy: "Anonymous Shift Worker",
      timeAgo: "Yesterday",
      upvotes: 74,
      resolvedByUpgrade: "improve_complaint_procedures",
      x: 480, y: 320
    }
  ]
};
