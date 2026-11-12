import type { PlanetId } from "@/data/types";

export interface SurfaceMapSource {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
  sourceLabel: string;
  sourceUrl: string;
}

/**
 * Global equirectangular base maps, centred on 0° longitude (east-positive), north up.
 * Orientation was checked against known landmarks before vendoring.
 */
export const SURFACE_MAPS: Record<PlanetId, SurfaceMapSource> = {
  moon: {
    src: "/images/maps/moon-equirect.webp",
    width: 2048,
    height: 1024,
    alt: "Global colour map of the Moon from the Lunar Reconnaissance Orbiter, equirectangular projection centred on the near side",
    credit: "NASA's Scientific Visualization Studio · LRO / LROC WAC",
    sourceLabel: "NASA SVS — CGI Moon Kit",
    sourceUrl: "https://svs.gsfc.nasa.gov/4720",
  },
  mars: {
    src: "/images/maps/mars-equirect.webp",
    width: 2048,
    height: 1024,
    alt: "Global colourised Viking mosaic of Mars, equirectangular projection centred on 0° longitude",
    credit: "NASA / JPL / USGS · Viking MDIM 2.1 colourised mosaic (NASA Ames)",
    sourceLabel: "USGS Astrogeology — Mars Viking MDIM 2.1 colour mosaic",
    sourceUrl:
      "https://astrogeology.usgs.gov/search/details/Mars/Viking/MDIM21/Mars_Viking_MDIM21_ClrMosaic_global_232m/cub",
  },
};
