import { media } from "@/data/media";
import type { EquipmentProfile } from "@/data/types";

export const opportunity = {
  id: "opportunity",
  tier: "featured",
  handle: "oppy_mer_b",
  displayName: "Opportunity",
  shortName: "MER-B",
  tagline: "Built for 90 sols. Stayed for 5,111. Ran a marathon on the way.",
  bio: "Solar-powered geologist parked on the western rim of Endeavour Crater. Found the hematite, the gypsum veins, and the proof that Meridiani was once wet. Outlasted my warranty nearly fifty-seven times over. Currently dusty, permanently on standby.",
  planet: "mars",
  era: "pathfinder-mer",
  status: "signal-lost",
  avatar: media.opportunity.avatar,
  cover: media.opportunity.cover,
  accent: "rust",
  pinnedPostId: "oppy-last-signal",
  lastSignalPostId: "oppy-last-signal",
  relations: [
    { id: "spirit", label: "twin" },
    { id: "sojourner", label: "grandparent" },
    { id: "ingenuity", label: "successor's passenger" },
  ],
  telemetry: {
    missionName: "Mars Exploration Rover B",
    agency: "NASA / JPL-Caltech",
    launchDate: "2003-07-08",
    landingDate: "2004-01-25",
    lastContact: "2018-06-10",
    decommissionedDate: "2019-02-13",
    daysActive: 5111,
    activeUnit: "sols",
    massKg: 185,
    massNote: "Rover mass at landing",
    powerSource: "solar",
    powerDetail: "Triple-junction solar arrays, ~1.3 m², charging two lithium-ion batteries",
    purpose:
      "Search rocks and soils for evidence of past water activity at Meridiani Planum, the site orbiters flagged for grey hematite.",
    heritageStatus:
      "Mission concluded. Rover rests in Perseverance Valley; no salvage or heritage framework currently applies to Mars hardware.",
    coordinates: {
      lat: -2.28,
      lon: -5.41,
      siteName: "Perseverance Valley",
      region: "Endeavour Crater rim, Meridiani Planum",
      confidence: "approximate",
    },
    readings: [
      { label: "Distance driven", value: "45.16", unit: "km", note: "Off-world driving record when the mission ended" },
      { label: "Designed lifetime", value: "90", unit: "sols" },
      { label: "Final atmospheric opacity", value: "10.8", unit: "τ", note: "Planet-encircling dust storm, June 2018" },
      { label: "Landing site", value: "Eagle crater", note: "1.9462°S, 5.5266°W — the 'hole in one'" },
    ],
    missionLog: [
      { date: "2003-07-08", kind: "launch", title: "Launch", detail: "Delta II Heavy from Cape Canaveral." },
      {
        date: "2004-01-25",
        kind: "landing",
        title: "Airbag landing in Eagle crater",
        detail: "Bounced roughly 200 m and rolled into a 22 m crater with exposed bedrock in view.",
      },
      {
        date: "2004-03-02",
        kind: "record",
        title: "Evidence of past water announced",
        detail: "Rock chemistry and textures at Eagle crater indicate the area was once soaked in liquid water.",
      },
      {
        date: "2015-03-24",
        kind: "record",
        title: "Marathon distance passed",
        detail: "Cumulative odometry exceeds 42.195 km.",
      },
      {
        date: "2018-06-10",
        kind: "last-contact",
        title: "Last contact",
        detail: "Dust storm cuts solar input; rover enters low-power fault mode and falls silent.",
      },
      {
        date: "2019-02-13",
        kind: "last-contact",
        title: "Mission declared complete",
        detail: "Final recovery commands sent after more than 1,000 attempts. No response.",
      },
    ],
    sources: [
      { label: "NASA Science — Opportunity mission page", url: "https://science.nasa.gov/mission/mer-opportunity/" },
      {
        label: "JPL — NASA's record-setting Opportunity rover mission on Mars comes to end",
        url: "https://www.jpl.nasa.gov/news/nasas-record-setting-opportunity-rover-mission-on-mars-comes-to-end",
      },
      {
        label: "NSSDCA — MER-B Opportunity (2003-032A)",
        url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A",
      },
    ],
  },
} satisfies EquipmentProfile;
