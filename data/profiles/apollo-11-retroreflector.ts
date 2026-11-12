import { media } from "@/data/media";
import type { EquipmentProfile } from "@/data/types";

export const apollo11Retroreflector = {
  id: "apollo-11-retroreflector",
  tier: "featured",
  handle: "mirror_on_the_moon",
  displayName: "Mirror on the Moon",
  shortName: "LR-3",
  tagline: "No batteries. No moving parts. Still answering every laser since 1969.",
  bio: "The Apollo 11 Laser Ranging Retroreflector: a panel of 100 fused-silica corner cubes that sends laser light straight back to where it came from. Observatories on Earth time the round trip to measure the Earth–Moon distance to millimetres. I'm the only thing at Tranquility Base still doing my job.",
  planet: "moon",
  era: "apollo-viking",
  status: "still-passive",
  avatar: media["apollo-11-retroreflector"].avatar,
  cover: media["apollo-11-retroreflector"].cover,
  accent: "cyan",
  pinnedPostId: "mirror-still-reflecting",
  lastSignalPostId: "mirror-still-reflecting",
  relations: [{ id: "apollo-11-descent-stage", label: "roommate" }],
  telemetry: {
    missionName: "Apollo 11 Laser Ranging Retroreflector (EASEP)",
    agency: "NASA",
    launchDate: "1969-07-16",
    landingDate: "1969-07-21",
    lastContact: null,
    decommissionedDate: null,
    daysActive: null,
    activeUnit: "days",
    massKg: 30,
    massNote: "Approx. deployed package mass",
    powerSource: "passive",
    powerDetail: "None required. Corner cubes reflect incident laser light.",
    purpose:
      "Return laser pulses fired from Earth so observatories can measure the Earth–Moon distance, the Moon's orbit and interior, and tests of general relativity.",
    heritageStatus:
      "Active scientific instrument at a protected heritage site. Still targeted by lunar laser ranging stations.",
    coordinates: {
      lat: 0.6734,
      lon: 23.473,
      siteName: "Tranquility Base",
      region: "Mare Tranquillitatis",
      confidence: "approximate",
    },
    readings: [
      { label: "Corner cubes", value: "100", note: "Fused silica, 3.8 cm each" },
      { label: "Power required", value: "0", unit: "W" },
      { label: "Lunar recession measured", value: "~3.8", unit: "cm/yr" },
      { label: "First confirmed return", value: "1 Aug 1969", note: "Lick Observatory" },
    ],
    missionLog: [
      { date: "1969-07-16", kind: "launch", title: "Launch", detail: "Stowed in Eagle's scientific equipment bay." },
      {
        date: "1969-07-21",
        kind: "deploy",
        title: "Deployed by Buzz Aldrin",
        detail: "Set up during the EVA alongside the passive seismometer, levelled and aimed at Earth.",
      },
      {
        date: "1969-08-01",
        kind: "record",
        title: "First laser return",
        detail: "Lick Observatory detects reflected pulses.",
      },
    ],
    sources: [
      {
        label: "LPI — Apollo 11 Laser Ranging Retroreflector",
        url: "https://www.lpi.usra.edu/lunar/missions/apollo/apollo_11/experiments/lrr/",
      },
      { label: "NASA — Apollo 11 mission overview", url: "https://www.nasa.gov/mission/apollo-11/" },
      { label: "Apollo Lunar Surface Journal — Apollo 11", url: "https://www.hq.nasa.gov/alsj/a11/a11.html" },
    ],
  },
} satisfies EquipmentProfile;
