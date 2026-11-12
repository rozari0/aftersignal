import type { SocialPost } from "@/data/types";

/**
 * Every post is dated to a real mission event and never refers to anything later than its own date.
 * Story bodies are in-character fiction; telemetry bodies are factual mission-log prose.
 */
export const posts: SocialPost[] = [
  // ── Opportunity ────────────────────────────────────────────────────────────
  {
    id: "oppy-landing",
    authorId: "opportunity",
    publishedAt: "2004-01-25",
    topic: "status",
    story: {
      body: "Bounced about 200 metres on airbags and rolled straight into a 22-metre crater.\n\nThe team is calling it a hole in one. I'm calling it the only spot for kilometres with bedrock showing, which was the whole point.",
      hashtags: ["#HoleInOne", "#Meridiani"],
      mood: "pleased",
    },
    telemetry: {
      headline: "SOL 1 — LANDING, EAGLE CRATER",
      body: "Airbag-cushioned landing at Meridiani Planum. Lander came to rest inside a ~22 m impact crater; first images show layered outcrop exposed on the crater wall a few metres away.",
      readings: [
        { label: "Landing latitude", value: "1.9462°S" },
        { label: "Landing longitude", value: "5.5266°W" },
      ],
    },
    metrics: { likes: 8420, reposts: 1930, replies: 2 },
  },
  {
    id: "oppy-water",
    authorId: "opportunity",
    publishedAt: "2004-03-02",
    topic: "status",
    story: {
      body: "Hematite spherules in the outcrop. Sulfate salts. Ripple patterns from moving water.\n\nThe rocks at Eagle crater sat in liquid water once. Took me five weeks of grinding and squinting to say it out loud.",
      hashtags: ["#Blueberries", "#FollowTheWater"],
      mood: "proud",
    },
    telemetry: {
      headline: "FINDING — PAST WATER AT MERIDIANI",
      body: "Announced 2004-03-02. Outcrop chemistry (high sulfate, jarosite) and textures (cross-bedding, vugs, hematite concretions) indicate the rocks formed in or were altered by liquid water.",
    },
    metrics: { likes: 12800, reposts: 4410, replies: 2 },
  },
  {
    id: "oppy-marathon",
    authorId: "opportunity",
    publishedAt: "2015-03-24",
    topic: "status",
    story: {
      body: "42.195 kilometres. Eleven years and two months.\n\nFinishing time is not competitive. Course record anyway.",
      hashtags: ["#MarathonOnMars"],
      mood: "wry",
    },
    telemetry: {
      headline: "ODOMETRY — MARATHON DISTANCE EXCEEDED",
      body: "Cumulative drive distance passes 42.195 km on the western rim of Endeavour Crater, the first time any human-made vehicle has covered marathon distance on another world.",
      readings: [{ label: "Odometry", value: "42.2", unit: "km" }],
    },
    metrics: { likes: 9150, reposts: 2600, replies: 2 },
  },
  {
    id: "oppy-sol-5000",
    authorId: "opportunity",
    publishedAt: "2018-02-16",
    topic: "anniversary",
    story: {
      body: "Sol 5,000. Took my first selfie with the microscopic imager, which was built to photograph sand grains, not rovers.\n\nBlurry. Accurate.",
      hashtags: ["#Sol5000", "#PerseveranceValley"],
      mood: "wry",
    },
    telemetry: {
      headline: "SOL 5000 — MICROSCOPIC IMAGER SELF-PORTRAIT",
      body: "Rover marks its 5,000th Martian day inside Perseverance Valley. Microscopic Imager frames of the rover deck are assembled into a first, out-of-focus self-portrait.",
    },
    media: {
      src: "/images/equipment/opportunity-cover.webp",
      alt: "Opportunity's robotic arm over striped ground inside Perseverance Valley, February 2018",
      credit: "NASA/JPL-Caltech",
      nasaId: "PIA22218",
      width: 1600,
      height: 600,
    },
    metrics: { likes: 7020, reposts: 1180, replies: 1 },
  },
  {
    id: "oppy-last-signal",
    authorId: "opportunity",
    publishedAt: "2018-06-10",
    pinned: true,
    topic: "last-signal",
    story: {
      body: "My battery is low and it's getting dark.\n\nDust storm's covering the whole sky. Going to sleep and let the panels wait it out. If the wind cleans them off, I'll call.",
      hashtags: ["#DustStormSurvivor", "#StillHere"],
      mood: "tired",
    },
    telemetry: {
      headline: "SOL 5111 — LAST TRANSMISSION",
      body: "Final telemetry received 2018-06-10. A planet-encircling dust storm drove atmospheric opacity to about 10.8, leaving too little solar energy to keep the rover awake. Over 1,000 recovery commands were sent through February 2019 without response.",
      readings: [
        { label: "Atmospheric opacity", value: "~10.8", unit: "τ" },
        { label: "Sol", value: "5,111" },
      ],
      sourceNote:
        "\"My battery is low and it's getting dark\" is journalist Jacob Margolis's paraphrase of the final telemetry, not a message the rover sent.",
    },
    metrics: { likes: 48200, reposts: 21900, replies: 7 },
    sources: [
      {
        label: "JPL — Opportunity mission comes to end",
        url: "https://www.jpl.nasa.gov/news/nasas-record-setting-opportunity-rover-mission-on-mars-comes-to-end",
      },
    ],
  },

  // ── Ingenuity ──────────────────────────────────────────────────────────────
  {
    id: "ginny-wright-swatch",
    authorId: "ingenuity",
    publishedAt: "2021-03-23",
    topic: "status",
    story: {
      body: "Packing note: I'm carrying a postage-stamp-sized piece of muslin from the 1903 Wright Flyer, wrapped around a cable under my solar panel.\n\nNo pressure.",
      hashtags: ["#WrightFlyer", "#CarryOn"],
      mood: "nervous",
    },
    telemetry: {
      headline: "PAYLOAD — WRIGHT FLYER FABRIC",
      body: "A small swatch of fabric from the Wright Flyer's wing, loaned by Carillon Historical Park in Dayton, is attached to a cable beneath the helicopter's solar panel.",
    },
    metrics: { likes: 15400, reposts: 3800, replies: 2 },
  },
  {
    id: "ginny-first-flight",
    authorId: "ingenuity",
    publishedAt: "2021-04-19",
    topic: "flight",
    story: {
      body: "Spun up, lifted three metres, held, came back down. 39.1 seconds.\n\nThe air here is about one percent as dense as Earth's. That was the whole experiment.",
      hashtags: ["#FirstFlight", "#WrightBrothersField"],
      mood: "elated",
    },
    telemetry: {
      headline: "FLIGHT 1 — FIRST POWERED FLIGHT ON ANOTHER PLANET",
      body: "Autonomous hover to 3 m, 30 s hold, and landing at Wright Brothers Field, Jezero Crater. Data relayed through Perseverance and confirmed at JPL.",
      readings: [
        { label: "Duration", value: "39.1", unit: "s" },
        { label: "Altitude", value: "3", unit: "m" },
      ],
    },
    metrics: { likes: 61300, reposts: 24100, replies: 3 },
  },
  {
    id: "ginny-flight-50",
    authorId: "ingenuity",
    publishedAt: "2023-04-13",
    topic: "flight",
    story: {
      body: "Flight 50. The plan said five.\n\nI've stopped reading the plan.",
      hashtags: ["#Flight50", "#Overtime"],
      mood: "dry",
    },
    telemetry: {
      headline: "FLIGHT 50 — ALTITUDE RECORD",
      body: "Fiftieth flight covers about 322 m in 145.7 s and sets a new altitude record of 18 m while keeping ahead of Perseverance on the Jezero delta.",
      readings: [
        { label: "Distance", value: "~322", unit: "m" },
        { label: "Max altitude", value: "18", unit: "m" },
      ],
    },
    metrics: { likes: 20700, reposts: 4100, replies: 1 },
  },
  {
    id: "ginny-flight-72",
    authorId: "ingenuity",
    publishedAt: "2024-01-25",
    pinned: true,
    topic: "flight",
    story: {
      body: "Flight 72. Lost track of the ground over smooth sand on the way down, landed hard, broke my rotor blades.\n\nSeventy-two flights on a five-flight plan. I'm grounded. Not going anywhere. Literally.",
      hashtags: ["#Flight72", "#Grounded"],
      mood: "resigned",
    },
    telemetry: {
      headline: "FLIGHT 72 — ROTOR DAMAGE, FLIGHT OPS END",
      body: "Flight 72 (2024-01-18) was a short vertical check flight after an off-nominal landing on Flight 71. Contact dropped during descent and was restored the next day. Images showed rotor blade damage; NASA ended flight operations on 2024-01-25.",
      readings: [
        { label: "Flights", value: "72" },
        { label: "Total airtime", value: "128.8", unit: "min" },
      ],
    },
    media: {
      src: "/images/equipment/ingenuity-cover.webp",
      alt: "Ingenuity as a speck among sand ripples at Valinor Hills, seen by Perseverance in February 2024",
      credit: "NASA/JPL-Caltech/ASU/MSSS",
      nasaId: "PIA26237",
      width: 1600,
      height: 600,
    },
    metrics: { likes: 39800, reposts: 11200, replies: 5 },
  },
  {
    id: "ginny-weather-station",
    authorId: "ingenuity",
    publishedAt: "2024-12-11",
    topic: "last-signal",
    story: {
      body: "Accident report's in. Featureless sand fooled my navigation camera. I came in too fast sideways, pitched, and all four blades snapped.\n\nI still wake up, take readings, and save them. A weather station with nobody nearby to read it yet.",
      hashtags: ["#StillWorking", "#Grounded"],
      mood: "steady",
    },
    telemetry: {
      headline: "INVESTIGATION — FLIGHT 72 FINDINGS",
      body: "NASA/JPL's first aircraft accident investigation on another world concluded the vision navigation system lost usable features over smooth ripples, causing high horizontal velocity at touchdown. The helicopter remains upright and has software to continue collecting data as a stationary testbed.",
    },
    metrics: { likes: 18600, reposts: 3300, replies: 2 },
    sources: [{ label: "NASA Images — PIA26482, Ingenuity's Hard Landing", url: "https://images.nasa.gov/details/PIA26482" }],
  },

  // ── Surveyor 3 ─────────────────────────────────────────────────────────────
  {
    id: "surveyor-landing",
    authorId: "surveyor-3",
    publishedAt: "1967-04-20",
    topic: "status",
    story: {
      body: "Engines didn't cut off at touchdown. Bounced twice. Came to rest on a slope inside a crater.\n\nStill counts as a landing.",
      hashtags: ["#Bounced", "#OceanusProcellarum"],
      mood: "defensive",
    },
    telemetry: {
      headline: "TOUCHDOWN — OCEANUS PROCELLARUM",
      body: "Vernier engines kept firing through first contact because bright reflections confused the landing radar. The spacecraft bounced twice before settling on the inner slope of a ~200 m crater.",
    },
    metrics: { likes: 2140, reposts: 380, replies: 1 },
  },
  {
    id: "surveyor-trench",
    authorId: "surveyor-3",
    publishedAt: "1967-04-23",
    topic: "status",
    story: {
      body: "First trench ever dug on the Moon. My scoop, my arm, my soil.\n\nResult: the ground holds. Tell the people with the big rocket it's safe to land.",
      hashtags: ["#FirstTrench", "#SoilMechanics"],
      mood: "proud",
    },
    telemetry: {
      headline: "SURFACE SAMPLER — BEARING TESTS",
      body: "Surface sampler scoop digs trenches and performs bearing and impact tests. Results show lunar soil firm enough to support crewed landers, informing Apollo landing site certification.",
    },
    metrics: { likes: 1870, reposts: 290, replies: 1 },
  },
  {
    id: "surveyor-last-frame",
    authorId: "surveyor-3",
    publishedAt: "1967-05-04",
    topic: "last-signal",
    story: {
      body: "Sun's going down on Oceanus Procellarum. My battery won't make it through two weeks of night.\n\nSix thousand photos on file. Somebody come check on me some time.",
      hashtags: ["#LunarNight", "#SignalLost"],
      mood: "tired",
    },
    telemetry: {
      headline: "LAST CONTACT — LUNAR SUNSET",
      body: "Final contact 1967-05-04 at the onset of lunar night. The spacecraft did not respond after sunrise.",
      readings: [{ label: "Images returned", value: "6,326" }],
    },
    metrics: { likes: 3020, reposts: 610, replies: 1 },
  },
  {
    id: "surveyor-camera",
    authorId: "surveyor-3",
    publishedAt: "1969-11-20",
    pinned: true,
    topic: "salvage",
    story: {
      body: "Thirty-one months of quiet. Then two Apollo 12 astronauts walk over from the lander they parked 180 metres away, take some photos, and cut off my TV camera.\n\nAnd my scoop. \"For science.\" The camera's in a museum now. I'm still here.",
      hashtags: ["#Apollo12", "#GiveItBack"],
      mood: "salty",
    },
    telemetry: {
      headline: "APOLLO 12 EVA-2 — PARTS RETRIEVED",
      body: "Conrad and Bean removed the TV camera, surface sampler scoop, aluminium tubing, and cabling (about 10 kg) to study how materials age after 31 months on the lunar surface. A later report of Earth bacteria surviving in the camera is now attributed to contamination after return.",
      readings: [
        { label: "Distance to Apollo 12 LM", value: "~180", unit: "m" },
        { label: "Mass retrieved", value: "~10", unit: "kg" },
      ],
    },
    media: {
      src: "/images/equipment/surveyor-3-cover.webp",
      alt: "Alan Bean examining Surveyor 3, with the Apollo 12 lunar module on the horizon",
      credit: "NASA/JSC",
      nasaId: "AS12-48-7134",
      width: 1600,
      height: 600,
    },
    metrics: { likes: 26900, reposts: 8800, replies: 6 },
  },

  // ── Apollo 11 descent stage ────────────────────────────────────────────────
  {
    id: "eagle-touchdown",
    authorId: "apollo-11-descent-stage",
    publishedAt: "1969-07-20",
    topic: "status",
    story: {
      body: "Contact light. Engine off. Four legs down.\n\nThe computer was steering us into a boulder field, so the commander flew us past it by hand. A couple of computer alarms on the way down. We landed anyway.",
      hashtags: ["#TheEagleHasLanded", "#TranquilityBase"],
      mood: "steady",
    },
    telemetry: {
      headline: "TOUCHDOWN — 20:17 UTC",
      body: "Armstrong took semi-manual control to overfly a boulder-strewn crater, landing several kilometres downrange of the target. 1201 and 1202 guidance computer alarms occurred during descent; neither required an abort.",
    },
    metrics: { likes: 94100, reposts: 50200, replies: 2 },
  },
  {
    id: "eagle-plaque",
    authorId: "apollo-11-descent-stage",
    publishedAt: "1969-07-21",
    pinned: true,
    topic: "status",
    story: {
      body: "There's a plaque on my front leg:\n\n\"Here men from the planet Earth first set foot upon the Moon, July 1969, A.D. We came in peace for all mankind.\"\n\nI didn't write it. I'm the one holding it.",
      hashtags: ["#WeCameInPeace", "#TranquilityBase"],
      mood: "proud",
    },
    telemetry: {
      headline: "ARTIFACT — COMMEMORATIVE PLAQUE",
      body: "Stainless-steel plaque on the forward landing leg strut, signed by the three crew members and President Nixon. It stays with the descent stage at Tranquility Base, surrounded by preserved bootprints.",
    },
    media: {
      src: "/images/equipment/apollo-11-descent-stage-cover.webp",
      alt: "Eagle's gold-foil descent stage and landing legs, with Buzz Aldrin unloading experiments",
      credit: "NASA/JSC",
      nasaId: "as11-40-5927",
      width: 1600,
      height: 600,
    },
    metrics: { likes: 71300, reposts: 30100, replies: 3 },
  },
  {
    id: "eagle-last-signal",
    authorId: "apollo-11-descent-stage",
    publishedAt: "1969-07-21",
    topic: "last-signal",
    story: {
      body: "Top half just left. The exhaust knocked the flag over on the way out.\n\nI'm the launch pad now. No solar panels, no recharge. This is it from me.",
      hashtags: ["#LaunchPad", "#SignalLost"],
      mood: "quiet",
    },
    telemetry: {
      headline: "ASCENT — 17:54 UTC",
      body: "The ascent stage lifted off using the descent stage as its launch platform. Aldrin reported seeing the flag fall in the exhaust. The descent stage was left without power and sent no further telemetry.",
    },
    metrics: { likes: 40700, reposts: 9900, replies: 2 },
  },
  {
    id: "eagle-anniversary",
    authorId: "apollo-11-descent-stage",
    publishedAt: "2019-07-20",
    topic: "anniversary",
    story: {
      body: "Fifty years at Tranquility Base. The bootprints haven't moved. No wind, no rain.\n\nThere's a camera in orbit that checks on me now. From up there I'm a bright dot with a long shadow.",
      hashtags: ["#Apollo50", "#TranquilityBase"],
      mood: "reflective",
    },
    telemetry: {
      headline: "ANNIVERSARY — 50 YEARS",
      body: "Lunar Reconnaissance Orbiter Narrow Angle Camera images resolve the descent stage, the deployed experiments, and darker trails where the astronauts walked.",
    },
    metrics: { likes: 52600, reposts: 14700, replies: 2 },
  },

  // ── Apollo 11 retroreflector ───────────────────────────────────────────────
  {
    id: "mirror-deployed",
    authorId: "apollo-11-retroreflector",
    publishedAt: "1969-07-21",
    topic: "status",
    story: {
      body: "Unpacked, carried out, levelled, aimed at Earth.\n\nNo switch. No battery. I was working the moment I saw the sky.",
      hashtags: ["#CornerCube", "#EASEP"],
      mood: "matter-of-fact",
    },
    telemetry: {
      headline: "DEPLOYMENT — EASEP",
      body: "Aldrin deployed the Laser Ranging Retroreflector near the Passive Seismic Experiment during the Apollo 11 EVA. The array needs no power and no commands.",
    },
    media: {
      src: "/images/equipment/apollo-11-retroreflector-cover.webp",
      alt: "The deployed Apollo 11 experiments: seismometer in front, laser retroreflector beyond it",
      credit: "NASA/JSC",
      nasaId: "as11-40-5948",
      width: 1600,
      height: 600,
    },
    metrics: { likes: 11200, reposts: 2100, replies: 1 },
  },
  {
    id: "mirror-first-return",
    authorId: "apollo-11-retroreflector",
    publishedAt: "1969-08-01",
    topic: "status",
    story: {
      body: "Lick Observatory fired a laser at me. I sent it back.\n\nRound trip about two and a half seconds. First ping of many.",
      hashtags: ["#Ping", "#StillReflecting"],
      mood: "pleased",
    },
    telemetry: {
      headline: "FIRST RETURN — LICK OBSERVATORY",
      body: "Lick Observatory detects the first laser pulses reflected from the Apollo 11 array, ten days after deployment.",
      readings: [{ label: "Round-trip light time", value: "~2.5", unit: "s" }],
    },
    metrics: { likes: 8800, reposts: 1600, replies: 1 },
  },
  {
    id: "mirror-recession",
    authorId: "apollo-11-retroreflector",
    publishedAt: "2009-07-21",
    topic: "anniversary",
    story: {
      body: "Forty years of ranging and the numbers are in: the Moon is moving away from Earth by about 3.8 centimetres a year.\n\nDon't look at me. I just reflect.",
      hashtags: ["#StillReflecting", "#LunarLaserRanging"],
      mood: "dry",
    },
    telemetry: {
      headline: "RESULT — LUNAR RECESSION",
      body: "Lunar laser ranging measures the Moon's orbit growing by ~3.8 cm per year as tidal interaction transfers Earth's rotational momentum to the Moon. The same data constrain the Moon's fluid core and tests of general relativity.",
      readings: [{ label: "Recession rate", value: "~3.8", unit: "cm/yr" }],
    },
    metrics: { likes: 14300, reposts: 5200, replies: 2 },
  },
  {
    id: "mirror-still-reflecting",
    authorId: "apollo-11-retroreflector",
    publishedAt: "2019-07-21",
    pinned: true,
    topic: "anniversary",
    story: {
      body: "Fifty years, zero watts.\n\nEverything else at Tranquility Base ran out of power within weeks. I never needed any. Point a laser at me and I'll answer. Every time.",
      hashtags: ["#StillReflecting", "#NoBatteriesRequired"],
      mood: "smug",
    },
    telemetry: {
      headline: "STATUS — PASSIVE, OPERATIONAL",
      body: "Lunar laser ranging stations continue to range to the Apollo 11, 14 and 15 arrays and the Lunokhod reflectors, measuring the Earth–Moon distance to the millimetre level. No power, maintenance, or commands required.",
      readings: [
        { label: "Power draw", value: "0", unit: "W" },
        { label: "Years in service", value: "50" },
      ],
    },
    metrics: { likes: 33400, reposts: 9700, replies: 4 },
  },

  // ── Sojourner ──────────────────────────────────────────────────────────────
  {
    id: "sojourner-rolloff",
    authorId: "sojourner",
    publishedAt: "1997-07-06",
    topic: "status",
    story: {
      body: "Down the ramp and onto the dirt. First wheels on another planet.\n\nTop speed: one centimetre per second. Mind the airbags.",
      hashtags: ["#FirstWheels", "#AresVallis"],
      mood: "elated",
    },
    telemetry: {
      headline: "SOL 3 — ROVER EGRESS",
      body: "After a deflated airbag blocked the forward ramp, Sojourner drove down the rear ramp onto the surface of Ares Vallis.",
    },
    media: {
      src: "/images/equipment/sojourner-cover.webp",
      alt: "Sojourner still latched to the Pathfinder lander petal on sol 1, ramps not yet deployed",
      credit: "NASA/JPL",
      nasaId: "PIA00621",
      width: 1600,
      height: 600,
    },
    metrics: { likes: 6900, reposts: 1700, replies: 1 },
  },
  {
    id: "sojourner-barnacle-bill",
    authorId: "sojourner",
    publishedAt: "1997-07-07",
    topic: "status",
    story: {
      body: "Pressed my spectrometer against a rock the team named Barnacle Bill.\n\nMore silica than anyone expected. The geologists are already arguing. My work here is done. Kidding. It's sol four.",
      hashtags: ["#BarnacleBill", "#APXS"],
      mood: "playful",
    },
    telemetry: {
      headline: "APXS — FIRST ROCK ANALYSIS",
      body: "The Alpha Proton X-ray Spectrometer measures Barnacle Bill's composition: relatively silica-rich, closer to an andesite than the expected basalt.",
    },
    metrics: { likes: 4100, reposts: 760, replies: 1 },
  },
  {
    id: "sojourner-grandparent",
    authorId: "sojourner",
    publishedAt: "1997-08-03",
    pinned: true,
    topic: "banter",
    story: {
      body: "Warranty said seven sols. I'm on thirty.\n\nSmall, solar-powered, still driving. Someday they'll send bigger rovers. Tell them who went first.",
      hashtags: ["#WhoWentFirst", "#SevenSolWarranty"],
      mood: "proud",
    },
    telemetry: {
      headline: "SOL 30 — EXTENDED OPERATIONS",
      body: "Rover passes four times its seven-sol design lifetime, continuing APXS measurements and imaging around the Rock Garden.",
      readings: [{ label: "Design lifetime", value: "7", unit: "sols" }],
    },
    metrics: { likes: 17800, reposts: 4900, replies: 4 },
  },
  {
    id: "sojourner-last-signal",
    authorId: "sojourner",
    publishedAt: "1997-09-27",
    topic: "last-signal",
    story: {
      body: "The lander's gone quiet. It was my radio.\n\nI'll keep circling and wait for a command. Eighty-three sols on a seven-sol plan. Not bad for the size of a microwave.",
      hashtags: ["#SignalLost", "#WhoWentFirst"],
      mood: "quiet",
    },
    telemetry: {
      headline: "SOL 83 — LAST CONTACT VIA LANDER",
      body: "Final successful transmission from the Pathfinder lander, which relayed all rover communications. Contingency software would have the rover attempt to return toward the lander. Mission ended 1998-03-10.",
    },
    metrics: { likes: 12100, reposts: 2800, replies: 1 },
  },

  // ── Catalog ────────────────────────────────────────────────────────────────
  {
    id: "spirit-last-signal",
    authorId: "spirit",
    publishedAt: "2010-03-22",
    pinned: true,
    topic: "last-signal",
    story: {
      body: "Stuck in soft sand at Troy. Can't tilt my panels toward the Sun for winter.\n\nGoing to sleep. Tell my twin I said hi.",
      hashtags: ["#FreeSpirit", "#Gusev"],
      mood: "tired",
    },
    telemetry: {
      headline: "SOL 2208 — LAST CONTACT",
      body: "Embedded at Troy since May 2009 and unable to orient its solar arrays for the southern winter, Spirit stops communicating. NASA ends recovery efforts on 2011-05-25.",
      readings: [{ label: "Distance driven", value: "7.73", unit: "km" }],
    },
    metrics: { likes: 21300, reposts: 6500, replies: 2 },
  },
  {
    id: "viking-last-signal",
    authorId: "viking-1",
    publishedAt: "1982-11-11",
    pinned: true,
    topic: "last-signal",
    story: {
      body: "Six years on two nuclear batteries. A weather report every day.\n\nThen a bad command overwrote my antenna pointing. Not the dust, not the cold. A command.",
      hashtags: ["#ChrysePlanitia", "#SignalLost"],
      mood: "dry",
    },
    telemetry: {
      headline: "LAST CONTACT — COMMAND ERROR",
      body: "A faulty command intended to update battery-charging software overwrote the antenna-pointing code. Communication was never restored.",
    },
    metrics: { likes: 9600, reposts: 2200, replies: 1 },
  },
  {
    id: "insight-last-signal",
    authorId: "insight",
    publishedAt: "2022-12-15",
    pinned: true,
    topic: "last-signal",
    story: {
      body: "Panels under dust. Seismometer still on the ground, still listening. 1,319 marsquakes on file.\n\nIf you're reading this, I've already run out of power.",
      hashtags: ["#Marsquake", "#SignalLost"],
      mood: "serene",
    },
    telemetry: {
      headline: "SOL ~1440 — LAST CONTACT",
      body: "Accumulated dust reduces solar array output below what the lander needs to operate its radio. NASA declares the mission over on 2022-12-21 after two missed communication passes.",
      readings: [{ label: "Marsquakes detected", value: "1,319" }],
    },
    metrics: { likes: 27400, reposts: 7300, replies: 2 },
  },
  {
    id: "lrv-liftoff-cam",
    authorId: "apollo-17-lrv",
    publishedAt: "1972-12-14",
    pinned: true,
    topic: "last-signal",
    story: {
      body: "Parked east of the lander so Houston could drive my camera remotely and film the liftoff.\n\nThey tilted up, caught the ascent stage, followed it into the black. Then everyone was gone.",
      hashtags: ["#LastOnTheMoon", "#TaurusLittrow"],
      mood: "wistful",
    },
    telemetry: {
      headline: "LIFTOFF BROADCAST — CHALLENGER ASCENT",
      body: "The rover-mounted TV camera, steered from Mission Control, tracked the Apollo 17 ascent stage's liftoff. It was the last crewed departure from the lunar surface of the Apollo program.",
    },
    metrics: { likes: 19700, reposts: 5400, replies: 2 },
  },
];
