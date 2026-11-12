export type PlanetId = "moon" | "mars";
export type EraId = "apollo-viking" | "pathfinder-mer" | "modern";
export type SignalStatus = "signal-lost" | "still-passive" | "partially-salvaged";
export type PowerSource = "solar" | "rtg" | "battery" | "passive";
export type EquipmentTier = "featured" | "catalog";
export type SalvageCondition =
  | "dust-coated"
  | "battle-scarred"
  | "partially-dismantled"
  | "pristine";
export type LogKind =
  | "launch"
  | "landing"
  | "deploy"
  | "record"
  | "anomaly"
  | "last-contact"
  | "salvage";

// Add new ids here; the union is the single place that catches typos across data files.
export type EquipmentId =
  | "opportunity"
  | "ingenuity"
  | "surveyor-3"
  | "apollo-11-descent-stage"
  | "apollo-11-retroreflector"
  | "sojourner"
  | "spirit"
  | "viking-1"
  | "insight"
  | "apollo-17-lrv";

// The visitor handle is the only non-hardware author; it backs the demo reply box.
export type AuthorId = EquipmentId | "visitor";

export interface ImageRef {
  src: string;              // /images/... (vendored, public domain)
  alt: string;
  credit: string;           // "NASA/JPL-Caltech"
  nasaId?: string;          // e.g. "PIA04591" — enables a link to images.nasa.gov
  width: number;
  height: number;
  focus?: string;           // CSS object-position, e.g. "50% 35%"
}

export interface Coordinates {
  lat: number;              // signed degrees, planetocentric
  lon: number;              // signed degrees, east-positive
  siteName: string;         // "Tranquility Base"
  region: string;           // "Mare Tranquillitatis"
  confidence: "exact" | "approximate";
}

export interface SourceRef {
  label: string;            // "Apollo 11 Mission Report"
  url: string;
}

export interface TelemetryReading {
  label: string;
  value: string;            // strings allow ranges: "22–28"
  unit?: string;
  note?: string;
}

export interface MissionLogEntry {
  date: string;             // ISO date
  kind: LogKind;
  title: string;
  detail: string;
}

export interface TelemetryData {
  missionName: string;      // "Mars Exploration Rover B"
  agency: string;           // "NASA / JPL-Caltech"
  launchDate: string | null;
  landingDate: string | null;
  lastContact: string | null;
  decommissionedDate: string | null;
  daysActive: number | null;      // sols for Mars, days for Moon
  activeUnit: "sols" | "days";
  massKg: number;
  massNote?: string;
  powerSource: PowerSource;
  powerDetail: string;            // "Solar array, 2 × 1.3 m²"
  purpose: string;
  heritageStatus: string;         // "Protected heritage site under Artemis recommendations"
  coordinates: Coordinates;
  readings: TelemetryReading[];   // rendered as the ghost-mode stat grid
  missionLog: MissionLogEntry[];
  sources: SourceRef[];
}

export interface StoryContent {
  body: string;                   // first person, may contain \n\n
  hashtags: string[];
  mood?: string;                  // "wry" | "tired" | "proud" — shown as a tiny label
}

export interface TelemetryContent {
  headline: string;
  body: string;
  readings?: TelemetryReading[];  // post-specific instrument readings
  sourceNote?: string;            // attribution for a quoted transmission
}

export interface PostMetrics {
  likes: number;
  reposts: number;
  replies: number;
}

export interface SocialPost {
  id: string;
  authorId: EquipmentId;
  publishedAt: string;            // ISO, the real mission date
  pinned?: boolean;
  topic?: "last-signal" | "flight" | "salvage" | "anniversary" | "banter" | "status";
  story: StoryContent;
  telemetry: TelemetryContent;
  media?: ImageRef;
  metrics: PostMetrics;
  sources?: SourceRef[];          // optional; profile sources are authoritative
}

export interface Comment {
  id: string;
  postId: string;
  authorId: AuthorId;             // "visitor" renders as a plain visitor, no hardware badge
  body: string;
  publishedAt: string;
  replyToId?: string;             // one level of nesting for MVP
  likes: number;
  isVisitor?: boolean;
}

export interface EquipmentProfile {
  id: EquipmentId;
  tier: EquipmentTier;
  handle: string;                 // "oppy_mer_b" (rendered with @)
  displayName: string;            // "Opportunity"
  shortName: string;              // "MER-B"
  tagline: string;                // one line, Story Mode
  bio: string;                    // profile copy, Story Mode
  planet: PlanetId;
  era: EraId;
  status: SignalStatus;
  avatar: ImageRef;
  cover: ImageRef;
  accent: "amber" | "cyan" | "rust" | "silver";
  telemetry: TelemetryData;
  lastSignalPostId: string;
  pinnedPostId: string;
  relations?: { id: EquipmentId; label: string }[]; // "grandparent", "sibling"
}

export interface SalvageComponent {
  material: string;               // "2219 aluminium"
  massKg: number;
  condition: string;
  reuse: string;                  // "Pressure hull patch stock"
}

export interface SalvageListing {
  id: string;
  equipmentId: EquipmentId;
  title: string;
  blurb: string;
  components: SalvageComponent[];
  totalMassKg: number;
  condition: SalvageCondition;
  conditionNote: string;
  pickup: {
    siteName: string;
    planet: PlanetId;
    coordinates: Coordinates;
    access: string;               // "Land within 50 m; do not disturb bootprints"
  };
  availability: "available" | "reserved" | "claimed";
  isruUses: string[];             // ISRU / sustainability framing
  askingPrice: string;            // "Free to a good colony"
  listedAt: string;
  media?: ImageRef;
}
