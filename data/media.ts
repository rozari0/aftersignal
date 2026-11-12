import type { ImageRef } from "@/data/types";

/**
 * Every image is a public-domain NASA still, cropped and re-encoded as WebP.
 * `nasaId` resolves on https://images.nasa.gov/details/<nasaId>.
 */
const avatar = (id: string, nasaId: string, credit: string, alt: string, size = 480): ImageRef => ({
  src: `/images/equipment/${id}-avatar.webp`,
  alt,
  credit,
  nasaId,
  width: size,
  height: size,
});

const cover = (
  id: string,
  nasaId: string,
  credit: string,
  alt: string,
  width = 1600,
  height = 600,
): ImageRef => ({
  src: `/images/equipment/${id}-cover.webp`,
  alt,
  credit,
  nasaId,
  width,
  height,
});

export const media = {
  opportunity: {
    avatar: avatar(
      "opportunity",
      "PIA18079",
      "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ.",
      "Opportunity's self-portrait from March 2014, solar panels freshly cleaned by wind",
    ),
    cover: cover(
      "opportunity",
      "PIA22218",
      "NASA/JPL-Caltech",
      "Opportunity's robotic arm over striped ground inside Perseverance Valley, February 2018",
    ),
  },
  ingenuity: {
    avatar: avatar(
      "ingenuity",
      "PIA24542",
      "NASA/JPL-Caltech/MSSS",
      "Ingenuity standing on the floor of Jezero Crater, photographed by Perseverance in April 2021",
      420,
    ),
    cover: cover(
      "ingenuity",
      "PIA26237",
      "NASA/JPL-Caltech/ASU/MSSS",
      "Ingenuity as a speck among sand ripples at Valinor Hills, seen by Perseverance in February 2024",
    ),
  },
  "surveyor-3": {
    avatar: avatar(
      "surveyor-3",
      "as12-48-7121",
      "NASA/JSC",
      "Surveyor 3 resting inside its crater, photographed by the Apollo 12 crew",
    ),
    cover: cover(
      "surveyor-3",
      "AS12-48-7134",
      "NASA/JSC",
      "Alan Bean examining Surveyor 3, with the Apollo 12 lunar module on the horizon",
    ),
  },
  "apollo-11-descent-stage": {
    avatar: avatar(
      "apollo-11-descent-stage",
      "as11-40-5927",
      "NASA/JSC",
      "The Apollo 11 lunar module Eagle on the surface at Tranquility Base",
    ),
    cover: cover(
      "apollo-11-descent-stage",
      "as11-40-5927",
      "NASA/JSC",
      "Eagle's gold-foil descent stage and landing legs, with Buzz Aldrin unloading experiments",
    ),
  },
  "apollo-11-retroreflector": {
    avatar: avatar(
      "apollo-11-retroreflector",
      "as11-40-5942",
      "NASA/JSC",
      "Buzz Aldrin carrying the laser ranging retroreflector and seismometer to their deployment site",
    ),
    cover: cover(
      "apollo-11-retroreflector",
      "as11-40-5948",
      "NASA/JSC",
      "The deployed Apollo 11 experiments: seismometer in front, laser retroreflector beyond it",
    ),
  },
  sojourner: {
    avatar: avatar(
      "sojourner",
      "PIA04318",
      "NASA/JPL-Caltech",
      "Sojourner approaching the rock 'Wedge' in Ares Vallis",
      300,
    ),
    cover: cover(
      "sojourner",
      "PIA00621",
      "NASA/JPL",
      "Sojourner still latched to the Pathfinder lander petal on sol 1, ramps not yet deployed",
    ),
  },
  spirit: {
    avatar: avatar(
      "spirit",
      "PIA04413",
      "NASA/JPL/Cornell University",
      "Artist's concept of a Mars Exploration Rover, the design Spirit and Opportunity shared",
    ),
    cover: cover(
      "spirit",
      "PIA11996",
      "NASA/JPL-Caltech",
      "Spirit's navigation-camera view toward Von Braun mound, 2009",
      1024,
      384,
    ),
  },
  "viking-1": {
    avatar: avatar(
      "viking-1",
      "PIA00381",
      "NASA/JPL",
      "Viking 1's footpad in the first photograph ever taken on the surface of Mars, July 1976",
    ),
    cover: cover(
      "viking-1",
      "PIA00563",
      "NASA/JPL",
      "Rocks and red soil of Chryse Planitia in Viking Lander 1's first colour image",
      563,
      211,
    ),
  },
  insight: {
    avatar: avatar(
      "insight",
      "PIA25287",
      "NASA/JPL-Caltech",
      "InSight's final selfie in 2022, its solar panels heavily coated in dust",
    ),
    cover: cover(
      "insight",
      "PIA22876",
      "NASA/JPL-Caltech",
      "InSight's first selfie in December 2018, solar panels clean after landing",
    ),
  },
  "apollo-17-lrv": {
    avatar: avatar(
      "apollo-17-lrv",
      "as17-137-20979",
      "NASA/JSC",
      "Close-up of the Apollo 17 lunar roving vehicle's fender and wheel at Taurus-Littrow",
    ),
    cover: cover(
      "apollo-17-lrv",
      "as17-147-22527",
      "NASA/JSC",
      "Eugene Cernan driving the lunar roving vehicle beside the lunar module during the first EVA",
    ),
  },
} as const satisfies Record<string, { avatar: ImageRef; cover: ImageRef }>;
