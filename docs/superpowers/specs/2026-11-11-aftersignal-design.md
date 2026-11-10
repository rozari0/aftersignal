# Aftersignal — Design & Build Plan

**Challenge:** 2026 NASA Space Apps Challenge — *Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars*
**Status:** Draft for approval. No implementation until approved.
**Repo:** `/home/el/Projects/aftersignal` — existing Next.js 16.4.6 scaffold.

---

## 1. Intent

Aftersignal is a fictional-but-fact-checked social network for dead NASA hardware. Every rover,
lander, descent stage, and retroreflector has a handle, a voice, a post history, and a telemetry
record. Visitors scroll a feed of first-person posts, open a profile, and can flip a **Ghost Mode**
switch that strips the personality away and shows the machine: coordinates, mass, power source,
mission log, last contact.

The emotional hook is that these objects are still out there. The scientific hook is that the
telemetry is real. The design challenge is to hold both at once without letting one undercut the
other.

**Who it is for:** Space Apps judges first (5–10 minutes with the app), then the public. It must be
legible in a 90-second screen recording and rewarding to click around for five minutes.

**Why now:** Artemis, the Mars Sample Return debate, and the renewal of lunar laser ranging make
"what we left behind" a live heritage question, not nostalgia.

---

## 2. Goals / Non-goals / Anti-goals

### Goals

- A feed that reads as a real product, not a card grid demo: dense, fast, confident typography.
- Ghost Mode that changes **information architecture**, not just copy. Story Mode shows a voice;
  Telemetry Mode shows the instrument behind it.
- Every factual claim traceable to a source entry in the data file.
- Six deeply written featured profiles + four lighter catalog entries so the map feels populated.
- Deployable to Vercel with zero environment variables.

### Non-goals

- Auth, accounts, real posting, real likes persisted to a server.
- A CMS. All content is typed TypeScript, versioned in git.
- 3D globe. A projected 2D surface map is faster, clearer, and more "mission control."
- Live NASA API dependency at runtime. The API is an optional enhancement, not a load-bearing wall.

### Anti-goals (would count as failure)

- Personality that fabricates facts. Jokes are allowed; fake telemetry is not.
- Ghost Mode that is a theme toggle. If the layout does not change, it has failed.
- Neon-purple "AI space app" gradients, glassmorphism everywhere, generic Orbitron headings.
- A map with decorative pins that do not correspond to real landing coordinates.
- Content that only exists for the six named objects and leaves the rest of the app feeling empty.

---

## 3. Constraints

| Constraint | Consequence |
|---|---|
| 48-hour hackathon | No database, no auth, no background jobs. Static data, client state. |
| Next.js 16.4.6 with `cacheComponents` + `partialPrefetching` | Pages are static by default; dynamic APIs must sit inside `<Suspense>`. `params` is a Promise. |
| Tailwind 4.3.3 via `@tailwindcss/turbopack` | Tokens live in `@theme` in `globals.css`; no `tailwind.config.js`. |
| Public-domain NASA imagery | Curate and vendor images into `/public`; record credit + NASA ID per image. |
| No API keys | NASA Images API is public, but optional and wrapped in a graceful fallback. |
| Judges may be on a laptop, projected | 1280×720 must be the primary composition; mobile is responsive, not the design target. |
| "Works offline" means no runtime API dependency | Every asset is vendored and every route is static. A service worker is out of scope. |

---

## 4. Approaches considered

Four forks were real. Each is recorded with the call made.

### 4.1 Surface map

| Option | Trade-off |
|---|---|
| **A. Equirectangular image + absolute-positioned pins (chosen)** | One image per body, lat/lon → percentage projection, CSS transform pan/zoom. No tile server exists for Moon/Mars, so this is also the only honest option. Fast, offline, full art direction. |
| B. Leaflet with `L.CRS.Simple` | Real pan/zoom and marker clustering for free, but drags in a tile/CRS layer we do not need and fights our styling. |
| C. Three.js globe | Impressive for 10 seconds, then hard to read coordinates, heavy on a projector laptop, and steals time from content. |

**Call: A.** Custom `SurfaceMap` with a baked equirectangular mosaic (NASA/USGS, public domain),
pins from real coordinates, keyboard-focusable, with a preview card on select. Pan/zoom is ~60
lines of pointer + wheel handling; no library.

### 4.2 Feed data flow

| Option | Trade-off |
|---|---|
| **A. Static TS modules imported into client components (chosen)** | Instant filtering, no network waterfall, works on a plane, trivial deploy. |
| B. Server-rendered filters via `searchParams` | Shareable URLs, but every chip click is a navigation and dynamic rendering inside Suspense. Slower demo, more Next 16 surface area. |
| C. Route handlers + client fetch | Simulates a backend we do not need and adds loading states to a zero-latency product. |

**Call: A**, with an optional `history.replaceState` sync for shareable filter state (stretch, not
v1). Content is small enough (≈25 posts) that everything can be in memory.

### 4.3 Ghost Mode scope

| Option | Trade-off |
|---|---|
| **A. Global mode + per-post override (chosen)** | One switch in the header flips the whole app; each post also has a small local toggle for the "look at this one" moment. Shared context, persisted to `localStorage`. |
| B. Per-post only | Loses the "the whole network goes quiet" demo beat. |
| C. Global only | Judges will try to flip a single post. Give them both. |

**Call: A.** In Telemetry Mode, comments are replaced by the mission log and instrument readings.
That is the structural difference that makes the feature feel designed rather than skinned.

**Override semantics (settled):** each post has a tri-state override — `inherit` (default), `story`,
`telemetry`. Overrides are session-only, reset when the global switch changes, and never persisted.
That keeps the global switch authoritative and the demo predictable. Only the post body and its
comment/log region change; the header and actions stay put.

**Coverage by route (settled):**

| Route | Story Mode | Telemetry Mode |
|---|---|---|
| `/` | Serif post bodies, comments, hashtags | Mono post bodies, mission-log excerpt, readings; comments hidden |
| `/equipment/[id]` | Bio, tagline, pinned post, cross-mission thread | Status bar leads, full mission log, source list, thread hidden |
| `/salvage` | Classified-ad copy, "free to a good colony" | Raw composition table, mass breakdown, ISRU notes; same layout |
| `/locator` | Already telemetric; pins show site + status | Mode-invariant except accent/typography; no duplicate layout |

`/locator` is mode-invariant by design and this is stated in the UI ("always telemetry") so the
switch never feels broken.

### 4.4 Profile presentation

| Option | Trade-off |
|---|---|
| **A. Dedicated route `/equipment/[id]` (chosen)** | Deep-linkable for judges, full-page room for the status bar and pinned post, simpler with `cacheComponents` + partial prefetching. |
| B. Intercepting-route modal over the feed | Cinematic, but Next 16 parallel/intercepting routes plus cache components is a large risk budget for a small payoff. |

**Call: A**, with a fast "peek" card on avatar hover/tap that links to the full profile.

---

## 5. Visual direction

**Concept: the human voice inside the machine.** Story Mode is warm, handwritten-feeling, a little
tired. Telemetry Mode is cold, gridded, monospaced. The transition between them is the product.

- **Palette:** void `#06080D`, panel `#0C1118`, rule `#1C2530`, text `#E9E5DA`, muted `#8C97A3`.
  Accents: signal amber `#F5A524` (Story / attention), telemetry cyan `#5AD2E6` (Telemetry / data),
  Mars rust `#C4553B`, Moon silver `#B9C4CF`. Two accent colors per view maximum.
- **Type:** Geist (UI), Geist Mono (telemetry, handles, timestamps, coordinates), and one
  **Instrument Serif** for Story Mode post bodies. Serif vs. mono is the mode difference made
  visible before a single word is read.
- **Texture:** 1px rules, faint grid, a static starfield generated in CSS (no particles.js), subtle
  scanline only inside telemetry panels. No glassmorphism.
- **Motion:** Framer Motion (`motion` package) for mode crossfade (opacity + 4px rise, 180ms),
  staggered post entrance on first paint, layout-stable chip filtering. All motion respects
  `prefers-reduced-motion`.
- **Voice:** dry, specific, unsentimental. Opportunity is not quirky; it is a machine that ran a
  marathon and then went quiet. Humor comes from competence and rivalry (Surveyor 3 vs. Apollo 12),
  never from cutesy punctuation.

**Text sketch — feed, Story Mode:**

```
┌──────────────────────────────────────────────────────────────┐
│  AFTERSIGNAL        FEED   UPCYCLE   LOCATOR     [ ◐ GHOST ] │
├──────────────────────────────────────────────────────────────┤
│  ALL   MOON   MARS        1960s–70s  1990s–00s  2010s–20s    │
│  STATUS: SIGNAL LOST · STILL PASSIVE · PARTIALLY SALVAGED    │
├──────────────────────────────────────────────────────────────┤
│  ◉ @oppy_mer_b  Opportunity · MER-B           sol 5111  ⋯    │
│    My battery is low and it's getting dark.                  │
│    Perseverance, keep the odometer warm for me.              │
│    #DustStormSurvivor #StillHere                             │
│    ▢ 14.2k   ⇄ 3.1k   ◌ 892                                  │
│    ┌ @sojourner_og: 83 sols was supposed to be enough ... ┐  │
└──────────────────────────────────────────────────────────────┘
```

**Text sketch — same post, Telemetry Mode:**

```
│  OPPORTUNITY · MER-B                        SIGNAL LOST      │
│  MERIDIANI PLANUM   1.9462°S  354.4734°E                     │
│  ┌ MASS 185 kg ┬ POWER SOLAR ┬ ACTIVE 5,111 sols ┬ 45.16 km ┐│
│  LAST CONTACT  2018-06-10 · solar array output 22%           │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│  MISSION LOG  2004-01-25 LANDING · 2018-06-10 LAST CONTACT   │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Information architecture

**In-world framing (proposal): the archive is presented as live, but nothing is fictionalised in
time.** Every post carries its real mission date. The feed sorts pinned-first, then newest real
date, so Ingenuity (2024) sits above Opportunity (2018). The header indicator reads `CHANNEL OPEN`
rather than implying the hardware is alive, and a small line under it reads `ARCHIVE UPLINK · 2026`.
Era filters key off the equipment's landing year, not the post date. No post refers to events after
its own timestamp. This preserves the emotional "still out there" reading without inventing a
present-day Mars mission.

| Route | Purpose |
|---|---|
| `/` | Feed: filters, ghost toggle, post cards, inline comment threads |
| `/equipment/[id]` | Telemetry bio: header, status bar, pinned last signal, posts, cross-mission thread |
| `/salvage` | Upcycle Me: salvage listings, component tables, pickup panel |
| `/locator` | Surface map: Moon/Mars toggle, pins, selected-pin preview |

Global chrome: wordmark, three nav tabs, Ghost Mode switch, "live link" indicator that reads
`SIGNAL ACTIVE` in Story Mode and `TELEMETRY LINK` in Telemetry Mode.

---

## 7. Data model

All content lives in `data/` as typed modules. `data/types.ts` is the contract; every profile file
uses `satisfies` so typos and missing fields fail at compile time.

```ts
// data/types.ts

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
```

### Taxonomy

```ts
// data/taxonomy.ts
export const PLANETS = [
  { id: "moon", label: "Moon", glyph: "🌙" },
  { id: "mars", label: "Mars", glyph: "🔴" },
] as const;

export const ERAS: { id: EraId; label: string; range: string; years: [number, number] }[] = [
  { id: "apollo-viking", label: "Apollo / Viking", range: "1960s–1970s", years: [1960, 1979] },
  { id: "pathfinder-mer", label: "Pathfinder / MER", range: "1990s–2000s", years: [1990, 2009] },
  { id: "modern", label: "Curiosity / Artemis", range: "2010s–2020s", years: [2010, 2029] },
];

export const STATUSES: { id: SignalStatus; label: string; hint: string }[] = [
  { id: "signal-lost", label: "Signal Lost", hint: "Decommissioned, no carrier" },
  { id: "still-passive", label: "Still Passive", hint: "No power, still responding" },
  { id: "partially-salvaged", label: "Partially Salvaged", hint: "Components removed" },
];
```

### Selectors

`data/index.ts` exports precomputed maps so no component filters the whole array per render:

```ts
export const profiles: EquipmentProfile[];
export const profileById: Record<EquipmentId, EquipmentProfile>;
export const posts: SocialPost[];
export const postById: Record<string, SocialPost>;
export const postsByAuthor: Record<EquipmentId, SocialPost[]>;
export const commentsByPost: Record<string, Comment[]>;
export const salvageListings: SalvageListing[];
export function filterPosts(filters: FeedFilters): SocialPost[];
```

---

## 8. Content inventory (scope of writing work)

| Item | Count | Notes |
|---|---|---|
| Featured profiles | 6 | Opportunity, Ingenuity, Surveyor 3, Apollo 11 descent stage, Apollo 11 LRRS, Sojourner |
| Catalog profiles | 4 | Spirit, Viking 1, InSight, Apollo 17 LRV — telemetry + 1 post each, populate the map |
| Posts | 26–30 | 4–5 per featured, 1 per catalog, 1 pinned last-signal each |
| Comments | 45–60 | Cross-mission banter; Sojourner replies on Opportunity + Ingenuity |
| Salvage listings | 6 | One per featured profile, component tables grounded in real materials |
| Map pins | 10 | Every profile has coordinates; Moon/Mars datasets |

**Production split (proposal)**

- **Copy:** I write all posts, comments, bios, and listings from primary NASA/JPL sources. You get a
  single fact-check pass before submission, focused on numbers, dates, and the Opportunity quote.
- **Images:** I source and vendor them. Priority is NASA/JPL and NASA SVS imagery with a recorded
  credit and NASA ID. The two map mosaics are the long-lead item, so they are downloaded in Phase 1,
  not Phase 5. Fallback if a usable 2:1 mosaic stalls: NASA SVS equirectangular stills, downscaled
  to 2048×1024 WebP. Pins are projected from coordinates either way.
- **Content freeze:** after Phase 3, copy changes are bug fixes only. Facts outrank jokes.

**Factual guardrails**

- The Opportunity line is **not a literal tweet**. "My battery is low and it's getting dark" is
  Jacob Margolis' paraphrase of the final telemetry. Render it as a quoted transmission with a
  source note in the post's telemetry view, not as a fabricated social post.
- Every number carries a `sources` entry. Where a figure is uncertain, use an approximation and
  say so (`massNote: "approx., descent stage dry mass"`).
- Do not invent quotes from living people or agencies. In-character hardware posts are clearly
  fiction; mission facts are not.
- Coordinates use planetocentric lat/lon, east-positive. Apollo 11: 0.6741°N, 23.4730°E.
  Opportunity: 1.9462°S, 354.4734°E. Ingenuity: 18.4447°N, 77.4508°E. Verify before shipping.

---

## 9. File & folder architecture

```
aftersignal/
├─ app/
│  ├─ layout.tsx                    # shell: fonts, background, nav, mode provider
│  ├─ page.tsx                      # Feed
│  ├─ globals.css                   # @theme tokens, base, texture, reduced motion
│  ├─ equipment/[id]/page.tsx       # Telemetry bio
│  ├─ salvage/page.tsx              # Upcycle Me
│  ├─ locator/page.tsx              # Surface Locator
│  ├─ not-found.tsx
│  └─ opengraph-image.tsx           # social card for the demo
├─ components/
│  ├─ layout/
│  │  ├─ app-shell.tsx
│  │  ├─ top-nav.tsx
│  │  ├─ starfield.tsx
│  │  └─ footer.tsx
│  ├─ feed/
│  │  ├─ feed.tsx                   # client: filter + mode orchestration
│  │  ├─ post-card.tsx
│  │  ├─ post-header.tsx
│  │  ├─ post-media.tsx
│  │  ├─ post-actions.tsx
│  │  ├─ filter-bar.tsx
│  │  └─ hashtag.tsx
│  ├─ ghost/
│  │  ├─ mode-provider.tsx          # context + localStorage, no-flash inline script
│  │  ├─ ghost-toggle.tsx            # global switch
│  │  ├─ post-mode-toggle.tsx        # per-post override
│  │  ├─ story-body.tsx
│  │  ├─ telemetry-body.tsx
│  │  ├─ telemetry-grid.tsx
│  │  └─ mission-log.tsx
│  ├─ equipment/
│  │  ├─ equipment-avatar.tsx
│  │  ├─ verified-badge.tsx
│  │  ├─ profile-header.tsx
│  │  ├─ telemetry-status-bar.tsx
│  │  ├─ last-known-signal.tsx
│  │  └─ relation-chip.tsx
│  ├─ comments/
│  │  ├─ comment-thread.tsx
│  │  ├─ comment-item.tsx
│  │  └─ comment-composer.tsx       # fake composer, local echo
│  ├─ salvage/
│  │  ├─ salvage-grid.tsx
│  │  ├─ salvage-card.tsx
│  │  ├─ component-table.tsx
│  │  └─ pickup-panel.tsx
│  ├─ map/
│  │  ├─ surface-map.tsx            # pan/zoom shell
│  │  ├─ map-body.tsx               # moon/mars image + pins
│  │  ├─ map-pin.tsx
│  │  └─ pin-preview.tsx
│  └─ ui/
│     ├─ badge.tsx
│     ├─ button.tsx
│     ├─ panel.tsx
│     ├─ stat.tsx
│     ├─ section-label.tsx
│     └─ toast.tsx
├─ data/
│  ├─ types.ts
│  ├─ taxonomy.ts
│  ├─ index.ts                      # selectors + precomputed indexes
│  ├─ profiles/
│  │  ├─ opportunity.ts
│  │  ├─ ingenuity.ts
│  │  ├─ surveyor-3.ts
│  │  ├─ apollo-11-descent-stage.ts
│  │  ├─ apollo-11-retroreflector.ts
│  │  ├─ sojourner.ts
│  │  └─ catalog.ts                 # spirit, viking-1, insight, apollo-17-lrv
│  ├─ posts.ts
│  ├─ comments.ts
│  └─ salvage.ts
├─ lib/
│  ├─ filters.ts                    # FeedFilters type + predicate
│  ├─ geo.ts                        # latLonToPercent, pin grouping, map bounds
│  ├─ mode.ts                       # resolvePostMode + storage helpers
│  ├─ mode-store.ts                 # localStorage read/write with failure guards
│  ├─ format.ts                     # number/date/mass formatting
│  ├─ cn.ts                         # clsx + tailwind-merge
│  ├─ motion.ts                     # shared variants, reduced-motion guard
│  └─ nasa.ts                       # optional images-api.nasa.gov client
├─ public/
│  ├─ images/equipment/*.webp
│  ├─ images/maps/moon-equirect.webp
│  ├─ images/maps/mars-equirect.webp
│  └─ textures/noise.png
└─ docs/superpowers/specs/2026-11-11-aftersignal-design.md
```

**Rules**

- `data/` never imports React. `components/` never imports another component's internals.
- Server Components by default; `"use client"` only at `feed.tsx`, `mode-provider.tsx`,
  `surface-map.tsx`, and leaf interactives.
- No component fetches. All data is passed down or imported from selectors.
- Every route renders statically; no `cookies()`, no `headers()`, no runtime API calls.

---

## 10. Implementation phases

Five prompts, each ending in a working app. Stop and screenshot after each.

### Phase 1 — Foundation and design system

Install `motion`, `lucide-react`, `clsx`, `tailwind-merge`. Replace `globals.css` with the token
system and base styles. Add fonts (Geist, Geist Mono, Instrument Serif). Build `layout.tsx`,
`top-nav.tsx`, `starfield.tsx`, `app-shell.tsx`. Add placeholder routes so nav works.
**Done when:** every route loads a black, gridded shell with nav, on desktop and mobile, and
`npm run build` passes.

### Phase 2 — Data contract and telemetry

Write `data/types.ts` and `data/taxonomy.ts`. Write the six featured profiles with full
`TelemetryData` (dates, mass, power, coordinates, readings, mission log, sources) and the four
catalog profiles. Implement `lib/format.ts`, `lib/geo.ts`, and `data/index.ts` selectors.
**Done when:** `npx tsc --noEmit` passes, every profile has ≥3 sources, and the map projection puts
Apollo 11 and Opportunity in the correct hemispheres.

### Phase 3 — Voice, feed, and Ghost Mode

Write posts, comments, and salvage listings. Build `feed.tsx`, `filter-bar.tsx`, `post-card.tsx`,
`post-actions.tsx`, and the ghost primitives (`mode-provider`, toggles, story/telemetry bodies,
grid, mission log). Wire filters (planet, era, status) and hashtag filtering. Add per-post and
global mode switching with the serif→mono transition.
**Done when:** filtering is instant, Ghost Mode changes layout not just copy, and reloading
preserves the mode.

### Phase 4 — Profiles and cross-mission threads

Build `equipment/[id]/page.tsx` with `profile-header`, `telemetry-status-bar`,
`last-known-signal`, the author's posts, and comment threads. Add the peek card on avatars and
relation chips (Sojourner → Opportunity → Ingenuity). Add adjacent-profile navigation.
**Done when:** all ten profiles resolve, deep links work, and every featured profile has a pinned
last signal.

### Phase 5 — Salvage, locator, polish, ship

Build `/salvage` (grid, card, component table, pickup panel, reserve toast) and `/locator`
(equirectangular map, pan/zoom, pins, preview card, Moon/Mars switch). Then: responsive pass,
focus states, reduced motion, 404, OG image, metadata, README, deploy to Vercel, record the
90-second demo.
**Done when:** `npm run build` is clean, Lighthouse accessibility ≥ 95 on `/`, and the demo runs with
no runtime API calls (a reload still needs the network for assets, which is fine).

---

## 11. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Ghost Mode reads as a skin | Comments disappear in Telemetry Mode; mission log and readings take their place; typography and grid change. |
| Factual errors embarrass the entry | `sources` is required on every profile; the Opportunity quote is labeled as a paraphrase; coordinates verified before Phase 4. |
| Content writing eats the clock | Phases 2–3 are content-heavy by design; UI phases are small. If behind, ship 6 featured profiles and drop catalog posts, never drop sources. |
| Map looks like a placeholder | Use real NASA global mosaics, real coordinates, and a restrained pin system with a selected-state preview. |
| Next 16 surprises | Read `node_modules/next/dist/docs/` before touching routing, caching, or images. `params` is a Promise; use `PageProps<"/equipment/[id]">`. |
| 48-hour fatigue | Each phase is independently demoable; if time runs out at Phase 3, the feed + Ghost Mode is still a complete story. |

---

## 12. Decisions (locked 2026-11-11)

Approved by the product owner with the builder's picks:

1. **In-world framing:** the archive is presented as live, with real post dates. No fictional present.
2. **Tone:** dry and restrained. Humour comes from competence and rivalry, never from cuteness.
3. **Catalog depth:** four extra map profiles with one post each, in addition to the six featured.
4. **Story Mode type:** Instrument Serif for post bodies.

Everything else is settled in this document as a builder call: content is drafted here and
fact-checked once; images are sourced and vendored here; Ghost Mode coverage is per the table in
§4.3; per-post overrides are session-only tri-state; the reply box posts a local `@visitor`
comment; profile-level sources are authoritative and post-level sources are additive.
