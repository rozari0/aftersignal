import { media } from "@/data/media";
import type { EquipmentProfile } from "@/data/types";

export const surveyor3 = {
  id: "surveyor-3",
  tier: "featured",
  handle: "surveyor_three",
  displayName: "Surveyor 3",
  shortName: "Surveyor III",
  tagline: "First to dig a trench on the Moon. First to be visited. First to be robbed.",
  bio: "Robotic lander that proved the lunar surface could hold a spacecraft. Bounced twice on arrival because my engines wouldn't cut off. Spent two weeks photographing and trenching Oceanus Procellarum. Thirty-one months later, Apollo 12 parked 180 m away and two astronauts walked over with bolt cutters.",
  planet: "moon",
  era: "apollo-viking",
  status: "partially-salvaged",
  avatar: media["surveyor-3"].avatar,
  cover: media["surveyor-3"].cover,
  accent: "silver",
  pinnedPostId: "surveyor-camera",
  lastSignalPostId: "surveyor-last-frame",
  relations: [{ id: "apollo-11-descent-stage", label: "the neighbour who got all the press" }],
  telemetry: {
    missionName: "Surveyor 3",
    agency: "NASA / JPL",
    launchDate: "1967-04-17",
    landingDate: "1967-04-20",
    lastContact: "1967-05-04",
    decommissionedDate: "1967-05-04",
    daysActive: 14,
    activeUnit: "days",
    massKg: 296,
    massNote: "Mass at landing (NSSDCA); ~10 kg of parts later returned to Earth by Apollo 12",
    powerSource: "solar",
    powerDetail: "Solar panel with rechargeable silver-zinc battery",
    purpose:
      "Soft-land on the Moon, photograph the surface, and test soil bearing strength with a scoop to certify Apollo landing sites.",
    heritageStatus:
      "Partially salvaged: TV camera, scoop, and tubing removed by Apollo 12 in 1969 for materials-exposure study. Remainder in place.",
    coordinates: {
      lat: -2.94,
      lon: -23.34,
      siteName: "Surveyor Crater",
      region: "Oceanus Procellarum",
      confidence: "approximate",
    },
    readings: [
      { label: "Images returned", value: "6,326" },
      { label: "Distance to Apollo 12 LM", value: "~180", unit: "m" },
      { label: "Hardware removed", value: "~10", unit: "kg", note: "TV camera, scoop, cable, tubing" },
      { label: "Landing bounces", value: "2", note: "Vernier engines failed to cut off at touchdown" },
    ],
    missionLog: [
      { date: "1967-04-17", kind: "launch", title: "Launch", detail: "Atlas-Centaur from Cape Kennedy." },
      {
        date: "1967-04-20",
        kind: "landing",
        title: "Landing with two bounces",
        detail: "Engines stayed lit through touchdown; settled on the inner slope of a 200 m crater.",
      },
      {
        date: "1967-05-04",
        kind: "last-contact",
        title: "Last contact",
        detail: "Falls silent at lunar sunset. Does not respond after the long night.",
      },
      {
        date: "1969-11-20",
        kind: "salvage",
        title: "Visited by Apollo 12",
        detail: "Conrad and Bean remove the TV camera and other parts during their second EVA.",
      },
    ],
    sources: [
      {
        label: "NSSDCA — Surveyor 3 (1967-035A)",
        url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A",
      },
      { label: "NASA Science — Surveyor 3", url: "https://science.nasa.gov/mission/surveyor-3/" },
      {
        label: "NASA Images — AS12-48-7134, two U.S. spacecraft on the Moon",
        url: "https://images.nasa.gov/details/AS12-48-7134",
      },
    ],
  },
} satisfies EquipmentProfile;
