import { media } from "@/data/media";
import type { EquipmentProfile } from "@/data/types";

export const sojourner = {
  id: "sojourner",
  tier: "featured",
  handle: "sojourner_og",
  displayName: "Sojourner",
  shortName: "MFEX",
  tagline: "First wheels on Mars. 10.6 kg. Seven-sol warranty. Lasted eighty-three.",
  bio: "Microrover of the Mars Pathfinder mission, the first rover to drive on another planet. Roughly the size of a microwave oven. Drove about 100 metres around the lander, sniffing rocks named Yogi and Barnacle Bill with an X-ray spectrometer. Every rover after me is bigger. I like to remind them who went first.",
  planet: "mars",
  era: "pathfinder-mer",
  status: "signal-lost",
  avatar: media.sojourner.avatar,
  cover: media.sojourner.cover,
  accent: "amber",
  pinnedPostId: "sojourner-grandparent",
  lastSignalPostId: "sojourner-last-signal",
  relations: [
    { id: "opportunity", label: "grandkid" },
    { id: "spirit", label: "grandkid" },
    { id: "ingenuity", label: "great-grandkid" },
  ],
  telemetry: {
    missionName: "Mars Pathfinder Microrover Flight Experiment",
    agency: "NASA / JPL",
    launchDate: "1996-12-04",
    landingDate: "1997-07-04",
    lastContact: "1997-09-27",
    decommissionedDate: "1998-03-10",
    daysActive: 83,
    activeUnit: "sols",
    massKg: 10.6,
    powerSource: "solar",
    powerDetail: "0.22 m² gallium-arsenide solar panel plus non-rechargeable lithium batteries",
    purpose:
      "Demonstrate that a small rover could drive on Mars, and analyse nearby rocks and soil with an alpha proton X-ray spectrometer.",
    heritageStatus:
      "Mission concluded. Rover location near the Carl Sagan Memorial Station lander is not precisely known.",
    coordinates: {
      lat: 19.13,
      lon: -33.22,
      siteName: "Carl Sagan Memorial Station",
      region: "Ares Vallis, Chryse Planitia",
      confidence: "approximate",
    },
    readings: [
      { label: "Distance driven", value: "~100", unit: "m" },
      { label: "Designed lifetime", value: "7", unit: "sols" },
      { label: "Images returned", value: "~550" },
      { label: "Top speed", value: "1", unit: "cm/s" },
    ],
    missionLog: [
      { date: "1996-12-04", kind: "launch", title: "Launch", detail: "Delta II from Cape Canaveral, aboard Mars Pathfinder." },
      { date: "1997-07-04", kind: "landing", title: "Airbag landing in Ares Vallis", detail: "Lander bounces to rest; rover still latched to a petal." },
      { date: "1997-07-06", kind: "deploy", title: "Roll-off", detail: "Drives down the rear ramp. First wheels on Mars." },
      {
        date: "1997-09-27",
        kind: "last-contact",
        title: "Last contact",
        detail: "Final transmission from the Pathfinder lander, which relayed all rover communications.",
      },
      { date: "1998-03-10", kind: "last-contact", title: "Mission ended", detail: "NASA ends attempts to re-establish contact." },
    ],
    sources: [
      { label: "NASA Science — Mars Pathfinder", url: "https://science.nasa.gov/mission/mars-pathfinder/" },
      {
        label: "NSSDCA — Mars Pathfinder (1996-068A)",
        url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A",
      },
      { label: "NASA Images — PIA04318, Sojourner near 'Wedge'", url: "https://images.nasa.gov/details/PIA04318" },
    ],
  },
} satisfies EquipmentProfile;
