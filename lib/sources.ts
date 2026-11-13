import { posts, profileById, profiles } from "@/data";
import { SURFACE_MAPS } from "@/data/maps";
import type { EquipmentId, PlanetId } from "@/data/types";

export type ProviderId =
  | "nasa-images"
  | "nssdca"
  | "nasa-science"
  | "nasa-gov"
  | "jpl"
  | "alsj"
  | "nasa-svs"
  | "usgs"
  | "lpi";

export interface Provider {
  id: ProviderId;
  name: string;
  homepage: string;
  /** "nasa" = run by NASA or a NASA centre; "partner" = NASA-funded or a federal partner archive. */
  kind: "nasa" | "partner";
  usedFor: string;
}

/** Ordered as the page lists them. */
export const PROVIDERS: Provider[] = [
  {
    id: "nasa-images",
    name: "NASA Image and Video Library",
    homepage: "https://images.nasa.gov/",
    kind: "nasa",
    usedFor: "Every avatar, cover and post photo. Public-domain stills, cropped and re-encoded as WebP.",
  },
  {
    id: "nssdca",
    name: "NSSDCA Master Catalog",
    homepage: "https://nssdc.gsfc.nasa.gov/nmc/",
    kind: "nasa",
    usedFor: "Launch and landing dates, COSPAR IDs and spacecraft masses.",
  },
  {
    id: "nasa-science",
    name: "NASA Science mission pages",
    homepage: "https://science.nasa.gov/",
    kind: "nasa",
    usedFor: "Mission timelines, purpose and end-of-mission status.",
  },
  {
    id: "nasa-gov",
    name: "NASA.gov mission overviews",
    homepage: "https://www.nasa.gov/",
    kind: "nasa",
    usedFor: "Apollo mission summaries and surface timelines.",
  },
  {
    id: "jpl",
    name: "NASA JPL news releases",
    homepage: "https://www.jpl.nasa.gov/news/",
    kind: "nasa",
    usedFor: "Last-contact dates and the official end-of-mission announcements.",
  },
  {
    id: "alsj",
    name: "Apollo Lunar Surface Journal",
    homepage: "https://www.hq.nasa.gov/alsj/",
    kind: "nasa",
    usedFor: "Apollo surface activity, deployment details and site descriptions.",
  },
  {
    id: "nasa-svs",
    name: "NASA Scientific Visualization Studio",
    homepage: "https://svs.gsfc.nasa.gov/",
    kind: "nasa",
    usedFor: "Lunar base map for the Surface Locator (LRO / LROC WAC colour mosaic).",
  },
  {
    id: "usgs",
    name: "USGS Astrogeology Science Center",
    homepage: "https://astrogeology.usgs.gov/",
    kind: "partner",
    usedFor: "Mars base map for the Surface Locator (Viking MDIM 2.1 colour mosaic, NASA/JPL data).",
  },
  {
    id: "lpi",
    name: "Lunar and Planetary Institute",
    homepage: "https://www.lpi.usra.edu/",
    kind: "partner",
    usedFor: "Apollo experiment descriptions (laser ranging retroreflector).",
  },
];

export function providerFor(url: string): ProviderId {
  const { hostname, pathname } = new URL(url);
  if (hostname === "images.nasa.gov") return "nasa-images";
  if (hostname === "nssdc.gsfc.nasa.gov") return "nssdca";
  if (hostname === "science.nasa.gov") return "nasa-science";
  if (hostname === "www.jpl.nasa.gov") return "jpl";
  if (hostname === "www.hq.nasa.gov" && pathname.startsWith("/alsj")) return "alsj";
  if (hostname === "www.nasa.gov") return "nasa-gov";
  if (hostname === "svs.gsfc.nasa.gov") return "nasa-svs";
  if (hostname === "astrogeology.usgs.gov") return "usgs";
  if (hostname === "www.lpi.usra.edu") return "lpi";
  throw new Error(`No provider registered for source URL: ${url}`);
}

export interface CitedRecord {
  label: string;
  url: string;
  /** Equipment whose profile or posts cite this record. */
  equipment: EquipmentId[];
  /** Set for base maps, which belong to a planet rather than a machine. */
  planets: PlanetId[];
}

export interface ProviderGroup extends Provider {
  records: CitedRecord[];
}

const imageUrl = (nasaId: string) => `https://images.nasa.gov/details/${nasaId}`;

/**
 * Every external record the site draws on, deduplicated by URL and grouped by provider.
 * Built from the data files, so a new profile source or image shows up here automatically.
 */
export function collectSources(): ProviderGroup[] {
  const byUrl = new Map<string, CitedRecord>();

  const add = (label: string, url: string, ref: { equipment?: EquipmentId; planet?: PlanetId }) => {
    const key = url.toLowerCase();
    let record = byUrl.get(key);
    if (!record) {
      record = { label, url, equipment: [], planets: [] };
      byUrl.set(key, record);
    }
    if (ref.equipment && !record.equipment.includes(ref.equipment)) record.equipment.push(ref.equipment);
    if (ref.planet && !record.planets.includes(ref.planet)) record.planets.push(ref.planet);
  };

  for (const profile of profiles) {
    for (const source of profile.telemetry.sources) add(source.label, source.url, { equipment: profile.id });
  }
  for (const post of posts) {
    for (const source of post.sources ?? []) add(source.label, source.url, { equipment: post.authorId });
  }

  // Images: profile avatars/covers and post media. Labelled by NASA ID and credit.
  for (const profile of profiles) {
    for (const image of [profile.avatar, profile.cover]) {
      if (image.nasaId) add(`${image.nasaId} — ${image.credit}`, imageUrl(image.nasaId), { equipment: profile.id });
    }
  }
  for (const post of posts) {
    const image = post.media;
    if (image?.nasaId) add(`${image.nasaId} — ${image.credit}`, imageUrl(image.nasaId), { equipment: post.authorId });
  }

  for (const [planet, map] of Object.entries(SURFACE_MAPS) as [PlanetId, (typeof SURFACE_MAPS)[PlanetId]][]) {
    add(map.sourceLabel, map.sourceUrl, { planet });
  }

  const grouped = new Map<ProviderId, CitedRecord[]>();
  for (const record of byUrl.values()) {
    const id = providerFor(record.url);
    grouped.set(id, [...(grouped.get(id) ?? []), record]);
  }

  return PROVIDERS.filter((p) => grouped.has(p.id)).map((provider) => ({
    ...provider,
    records: grouped.get(provider.id)!.sort((a, b) => a.label.localeCompare(b.label, "en", { numeric: true })),
  }));
}

export const equipmentName = (id: EquipmentId) => profileById[id].displayName;
