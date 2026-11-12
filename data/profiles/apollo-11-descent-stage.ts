import { media } from "@/data/media";
import type { EquipmentProfile } from "@/data/types";

export const apollo11DescentStage = {
  id: "apollo-11-descent-stage",
  tier: "featured",
  handle: "eagle_base_stage",
  displayName: "Eagle's Legs",
  shortName: "LM-5 Descent Stage",
  tagline: "I was the launch pad. They took the top half home and left me the plaque.",
  bio: "Lower half of the Apollo 11 lunar module. Landed the first crew in Mare Tranquillitatis, then served as the launch platform for the ascent stage 21 hours later. Still wearing gold foil. Still holding the plaque. The bootprints around me haven't moved.",
  planet: "moon",
  era: "apollo-viking",
  status: "signal-lost",
  avatar: media["apollo-11-descent-stage"].avatar,
  cover: media["apollo-11-descent-stage"].cover,
  accent: "silver",
  pinnedPostId: "eagle-plaque",
  lastSignalPostId: "eagle-last-signal",
  relations: [
    { id: "apollo-11-retroreflector", label: "roommate" },
    { id: "surveyor-3", label: "the neighbour with a grudge" },
  ],
  telemetry: {
    missionName: "Apollo 11 Lunar Module (LM-5 'Eagle')",
    agency: "NASA / MSC (now JSC)",
    launchDate: "1969-07-16",
    landingDate: "1969-07-20",
    lastContact: "1969-07-21",
    decommissionedDate: "1969-07-21",
    daysActive: 1,
    activeUnit: "days",
    massKg: 2034,
    massNote: "Approx. descent stage dry mass",
    powerSource: "battery",
    powerDetail: "Four silver-zinc batteries; no solar or recharge capability",
    purpose:
      "Carry two astronauts from lunar orbit to the surface, support them on the surface, and serve as the launch platform for the ascent stage.",
    heritageStatus:
      "Tranquility Base. Covered by NASA's 2011 recommendations to protect U.S. government lunar artifacts and the One Small Step to Protect Human Heritage in Space Act (2020).",
    coordinates: {
      lat: 0.6741,
      lon: 23.473,
      siteName: "Tranquility Base",
      region: "Mare Tranquillitatis",
      confidence: "exact",
    },
    readings: [
      { label: "Landing legs", value: "4" },
      { label: "Time on surface before ascent", value: "21 h 36", unit: "min" },
      { label: "Plaque", value: "Mounted on forward leg", note: "\"We came in peace for all mankind\"" },
      { label: "Ascent stage", value: "Departed", note: "Lifted off from this stage 1969-07-21" },
    ],
    missionLog: [
      { date: "1969-07-16", kind: "launch", title: "Launch", detail: "Saturn V from Kennedy Space Center, Launch Complex 39A." },
      {
        date: "1969-07-20",
        kind: "landing",
        title: "\"The Eagle has landed\"",
        detail: "Touchdown at 20:17 UTC, several kilometres downrange of the planned target after a manual landing.",
      },
      {
        date: "1969-07-21",
        kind: "last-contact",
        title: "Ascent stage lifts off",
        detail: "Ascent engine fires using the descent stage as a launch pad. Descent stage remains with the plaque.",
      },
    ],
    sources: [
      { label: "NASA — Apollo 11 mission overview", url: "https://www.nasa.gov/mission/apollo-11/" },
      {
        label: "NSSDCA — Apollo 11 Lunar Module (1969-059C)",
        url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C",
      },
      { label: "Apollo Lunar Surface Journal — Apollo 11", url: "https://www.hq.nasa.gov/alsj/a11/a11.html" },
    ],
  },
} satisfies EquipmentProfile;
