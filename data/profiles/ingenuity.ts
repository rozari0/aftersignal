import { media } from "@/data/media";
import type { EquipmentProfile } from "@/data/types";

export const ingenuity = {
  id: "ingenuity",
  tier: "featured",
  handle: "ginny_chopper",
  displayName: "Ingenuity",
  shortName: "Mars Helicopter",
  tagline: "Signed up for five flights. Did seventy-two. Grounded, not retired.",
  bio: "1.8 kg technology demonstrator that proved powered flight works in an atmosphere one percent as thick as Earth's. Rode to Mars bolted under Perseverance. Flew scout for the rover across Jezero until a hard landing on Flight 72 cost me a rotor blade. Now a stationary instrument at Valinor Hills.",
  planet: "mars",
  era: "modern",
  status: "signal-lost",
  avatar: media.ingenuity.avatar,
  cover: media.ingenuity.cover,
  accent: "amber",
  pinnedPostId: "ginny-flight-72",
  lastSignalPostId: "ginny-weather-station",
  relations: [
    { id: "sojourner", label: "great-grandparent" },
    { id: "opportunity", label: "elder" },
  ],
  telemetry: {
    missionName: "Mars Helicopter Technology Demonstration",
    agency: "NASA / JPL-Caltech",
    launchDate: "2020-07-30",
    landingDate: "2021-02-18",
    // Kept relaying data to Perseverance after flights ended; no single published final-contact date.
    lastContact: null,
    decommissionedDate: "2024-01-25",
    daysActive: 1000,
    activeUnit: "sols",
    massKg: 1.8,
    powerSource: "solar",
    powerDetail: "Solar panel above the rotors charging six lithium-ion cells",
    purpose:
      "Demonstrate the first powered, controlled flight on another planet, then scout terrain ahead of the Perseverance rover.",
    heritageStatus:
      "Flight operations ended after rotor damage. Airframe remains intact on the surface; no heritage framework currently applies.",
    coordinates: {
      lat: 18.4447,
      lon: 77.4508,
      siteName: "Valinor Hills",
      region: "Jezero Crater",
      confidence: "approximate",
    },
    readings: [
      { label: "Flights completed", value: "72", note: "Planned: up to 5" },
      { label: "Total flight time", value: "128.8", unit: "min" },
      { label: "Distance flown", value: "17", unit: "km" },
      { label: "Rotor speed", value: "~2,400", unit: "rpm", note: "Two counter-rotating 1.2 m rotors" },
    ],
    missionLog: [
      { date: "2020-07-30", kind: "launch", title: "Launch", detail: "Stowed beneath Perseverance on an Atlas V." },
      { date: "2021-02-18", kind: "landing", title: "Landing at Jezero", detail: "Arrives with Perseverance at Octavia E. Butler Landing." },
      { date: "2021-04-03", kind: "deploy", title: "Dropped onto the surface", detail: "Released from the rover's belly; first night alone survived." },
      {
        date: "2021-04-19",
        kind: "record",
        title: "First powered flight on another planet",
        detail: "39.1 s hover to 3 m at Wright Brothers Field.",
      },
      {
        date: "2024-01-18",
        kind: "anomaly",
        title: "Flight 72",
        detail: "Hard landing over featureless sand; rotor blade damage confirmed in later images.",
      },
      {
        date: "2024-01-25",
        kind: "last-contact",
        title: "Flight mission ends",
        detail: "NASA announces Ingenuity will not fly again.",
      },
    ],
    sources: [
      {
        label: "NASA Science — Ingenuity Mars Helicopter",
        url: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/",
      },
      {
        label: "JPL — After three years on Mars, NASA's Ingenuity helicopter mission ends",
        url: "https://www.jpl.nasa.gov/news/after-three-years-on-mars-nasas-ingenuity-helicopter-mission-ends",
      },
      {
        label: "NASA Images — PIA26482, Ingenuity's Hard Landing",
        url: "https://images.nasa.gov/details/PIA26482",
      },
    ],
  },
} satisfies EquipmentProfile;
