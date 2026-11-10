# Aftersignal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Aftersignal, a static, story-driven social network for decommissioned NASA hardware on the Moon and Mars, with a Ghost Mode that swaps voice for telemetry.

**Architecture:** All content is typed TypeScript in `data/`, imported into a small number of client components. Routes are statically rendered; no database, auth, or runtime API. Ghost Mode is a context boolean that changes layout, typography, and which regions render (comments vs. mission log).

**Tech Stack:** Next.js 16.4.6 (App Router, `cacheComponents` + `partialPrefetching`), React 19, TypeScript strict, Tailwind 4.3.3 (`@theme` tokens), `motion`, `lucide-react`, `clsx`, `tailwind-merge`, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-11-aftersignal-design.md`

## Global Constraints

- Next.js **16.4.6**, React **19.3.0**, Tailwind **4.3.3** via `@tailwindcss/turbopack`. Do not upgrade or add a Tailwind config file.
- `params` is a Promise. Type pages with the global `PageProps<"/route">` helper.
- Tailwind tokens live in `@theme` inside `app/globals.css`. No `tailwind.config.*`.
- `data/` and `lib/` must not import React or Next.
- `"use client"` only in `feed.tsx`, `mode-provider.tsx`, `thread`/composer components, `surface-map.tsx`, and leaf interactive components.
- No runtime network calls. All images live under `public/images/` and carry `credit` + `nasaId` where known.
- Post timestamps are real mission dates. No post references an event after its own date.
- The Opportunity line "My battery is low and it's getting dark" is a **paraphrase**, never presented as a tweet; its post sets `telemetry.sourceNote` containing the word "paraphrase".
- Palette: void `#06080D`, panel `#0C1118`, rule `#1C2530`, text `#E9E5DA`, muted `#8C97A3`, amber `#F5A524`, cyan `#5AD2E6`, rust `#C4553B`, silver `#B9C4CF`.
- Fonts: Geist (UI), Geist Mono (telemetry), Instrument Serif (story bodies).
- Every route must be static. `npm run build` and `npm run typecheck` must pass at the end of every task.
- Respect `prefers-reduced-motion` in every animated component.
- Coordinates are stored signed, east-positive: latitude **[-90, 90]**, longitude **[-180, 180]**. NASA 0–360 longitudes must be normalized when entered (Opportunity is **-5.5266**, not 354.4734).

## Review Focus

These are the failure modes most likely to reach a judge. Each is pinned by a test in the task that owns the code.

1. **A mistyped id** in any `authorId`, `postId`, or `equipmentId` → blank card or crash. Owned by Task 3–6 integrity tests.
2. **A post missing its story or telemetry variant** → blank Ghost Mode. Owned by Task 5 integrity test.
3. **A 0–360 longitude** (NASA convention) → pin renders off the map. Owned by Task 2 `projectToPercent` test using Opportunity's 354.4734.
4. **`localStorage` unavailable or corrupt** (private mode, stale value) → app fails at load. Owned by Task 8 `readStoredMode` tests.
5. **`/equipment/unknown`** → must 404, not throw. Owned by Task 11 `notFound()` check.

---

### Task 1: Foundation, tokens, and app shell

**Files:**
- Modify: `package.json`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`
- Create: `vitest.config.ts`, `components/layout/app-shell.tsx`, `components/layout/top-nav.tsx`, `components/layout/starfield.tsx`, `components/ui/section-label.tsx`, `components/ui/badge.tsx`, `components/ui/button.tsx`, `components/ui/panel.tsx`, `components/ui/stat.tsx`, `app/salvage/page.tsx`, `app/locator/page.tsx`, `app/equipment/[id]/page.tsx`, `app/not-found.tsx`
- Test: none (scaffolding task)

**Interfaces:**
- Consumes: existing scaffold.
- Produces: `AppShell({ children }: { children: React.ReactNode })`, `TopNav()`, `Starfield()`, `SectionLabel({ children })`, `Badge({ children, tone })`, `Button({ children, variant })`, `Panel({ children })`, `Stat({ label, value, unit? })`, npm scripts `test`, `test:watch`, `typecheck`, `validate` (alias of `test`).

- [ ] **Step 1: Install dependencies**

```bash
npm i motion lucide-react clsx tailwind-merge
npm i -D vitest
npm pkg set scripts.test="vitest run" scripts.test:watch="vitest" scripts.typecheck="tsc --noEmit" scripts.validate="vitest run"
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: { environment: "node", include: ["**/*.test.ts"] },
});
```

- [ ] **Step 3: Replace `app/globals.css` with the token system**

Define `@theme` tokens for the palette and fonts. Add: `body` background void + text; a fixed starfield layer using two radial-gradient dot patterns at different sizes; a 32px grid overlay at 4% opacity; `::selection` amber; `*:focus-visible` 2px cyan outline with 2px offset; and a `@media (prefers-reduced-motion: reduce)` block that sets `animation-duration` and `transition-duration` to `0.01ms`. Remove the light-mode `prefers-color-scheme` block.

- [ ] **Step 4: Build the shell**

`layout.tsx`: add `Instrument_Serif` from `next/font/google` with `weight: "400"` and variable `--font-serif`, keep Geist/Geist Mono, set metadata title `"Aftersignal — the machines are still talking"` and description. Render `<Starfield /><AppShell>{children}</AppShell>` in the body. `AppShell` renders `<TopNav />` and `<main className="mx-auto w-full max-w-[1180px] px-4 pb-24 pt-6">`.

`TopNav`: wordmark `AFTERSIGNAL` (mono, letterspaced), links `/` `FEED`, `/salvage` `UPCYCLE`, `/locator` `LOCATOR`, a `CHANNEL OPEN · ARCHIVE UPLINK 2026` status line (hidden under 900px), and a disabled-looking `Ghost Mode` switch placeholder (`aria-disabled`, no handler yet). Sticky, 56px, bottom rule `#1C2530`, backdrop blur.

`Starfield`: a `aria-hidden` fixed div with the CSS class, no JS.

- [ ] **Step 5: Create the five UI primitives**

`SectionLabel`: mono, 11px, uppercase, 0.14em tracking, muted, with a 24px amber rule before the text.
`Badge`: pill, 11px mono uppercase; `tone` selects amber/cyan/rust/neutral border + text.
`Button`: 32px min height, 2px radius, mono uppercase 12px; variants `primary` (amber fill, void text), `ghost` (rule border, text), `quiet` (text only). Forwards button props.
`Panel`: `bg-panel border border-rule rounded-[3px]`.
`Stat`: label (11px mono muted) above value (20px mono text) with optional unit.

- [ ] **Step 6: Replace the scaffold home page**

`app/page.tsx` renders a `SectionLabel` "LIVE FEED", an `h1` "The machines are still talking", a one-line intro, and `<p>Feed arriving.</p>`. Delete the `next.svg`/`vercel.svg` markup.

- [ ] **Step 7: Stub the remaining routes**

Each of `/salvage`, `/locator`, `/equipment/[id]` renders `<h1>` with its name and a `SectionLabel`. The dynamic stub signature is:

```tsx
export default async function Page({ params }: PageProps<"/equipment/[id]">) {
  const { id } = await params;
  return <h1>{id}</h1>;
}
```

- [ ] **Step 8: Verify**

Run: `npm run build && npm run typecheck`
Expected: clean build; `/`, `/salvage`, `/locator` listed as static; dynamic route builds.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold aftersignal shell, tokens, and test harness"
```

---

### Task 2: Geo projection, formatting, and era taxonomy

**Files:**
- Create: `lib/geo.ts`, `lib/format.ts`, `data/taxonomy.ts`, `data/types.ts`, `lib/geo.test.ts`, `lib/format.test.ts`, `data/taxonomy.test.ts`

**Interfaces:**
- Consumes: `PlanetId`, `EraId`, `SignalStatus` from `data/types.ts`.
- Produces:
  - `projectToPercent(coords: { lat: number; lon: number }): { x: number; y: number }` — x/y are 0–100 percentages, longitude normalized into [-180, 180], latitude clamped.
  - `formatMass(kg: number): string`, `formatCount(n: number): string`, `formatMissionDate(iso: string): string`, `formatCoord(value: number, axis: "lat" | "lon"): string`.
  - `PLANETS`, `ERAS`, `STATUSES`, `eraForYear(year: number): EraId`.

- [ ] **Step 1: Write the failing tests**

`lib/geo.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { projectToPercent } from "@/lib/geo";

describe("projectToPercent", () => {
  it("puts the equator and prime meridian at the centre", () => {
    expect(projectToPercent({ lat: 0, lon: 0 })).toEqual({ x: 50, y: 50 });
  });
  it("maps the corners", () => {
    expect(projectToPercent({ lat: 90, lon: -180 })).toEqual({ x: 0, y: 0 });
    expect(projectToPercent({ lat: -90, lon: 180 })).toEqual({ x: 100, y: 100 });
  });
  it("normalizes 0-360 longitudes", () => {
    expect(projectToPercent({ lat: -1.9462, lon: 354.4734 }).x).toBeCloseTo(48.465, 3);
  });
  it("places Apollo 11 at Tranquility Base", () => {
    const p = projectToPercent({ lat: 0.6741, lon: 23.473 });
    expect(p.x).toBeCloseTo(56.52, 2);
    expect(p.y).toBeCloseTo(49.63, 2);
  });
  it("clamps out-of-range latitude", () => {
    expect(projectToPercent({ lat: 95, lon: 0 }).y).toBe(0);
  });
});
```

`lib/format.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatCoord, formatCount, formatMass, formatMissionDate } from "@/lib/format";

describe("format", () => {
  it("formats mass", () => expect(formatMass(185)).toBe("185 kg"));
  it("formats counts with separators", () => expect(formatCount(5111)).toBe("5,111"));
  it("formats dates without timezone drift", () => expect(formatMissionDate("2018-06-10")).toBe("10 Jun 2018"));
  it("formats signed coordinates", () => {
    expect(formatCoord(0.6741, "lat")).toBe("0.6741°N");
    expect(formatCoord(-1.9462, "lat")).toBe("1.9462°S");
    expect(formatCoord(-5.5266, "lon")).toBe("5.5266°W");
    expect(formatCoord(77.4508, "lon")).toBe("77.4508°E");
  });
});
```

`data/taxonomy.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { eraForYear } from "@/data/taxonomy";

describe("eraForYear", () => {
  it.each([[1969, "apollo-viking"], [1997, "pathfinder-mer"], [2004, "pathfinder-mer"], [2021, "modern"]])(
    "maps %i to %s", (year, era) => expect(eraForYear(year)).toBe(era)
  );
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — modules not found.

- [ ] **Step 3: Create `data/types.ts`**

Copy the complete contract from spec §7 verbatim (all exported types and interfaces). Do not add fields.

- [ ] **Step 4: Implement the three modules**

`projectToPercent`: normalize longitude with `((lon + 180) % 360 + 360) % 360 - 180`, then `x = ((lon + 180) / 360) * 100`, `y = ((90 - clamp(lat, -90, 90)) / 180) * 100`.

`formatMissionDate`: append `T00:00:00Z` and use `Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" })`, then strip the leading zero from the day (`10 Jun 2018`).

`formatCoord`: `Math.abs(value).toFixed(4)` + `°` + hemisphere letter (`N/S`, `E/W`); zero renders `N`/`E`.

`taxonomy.ts`: export the arrays from spec §7 and `eraForYear` using the `years` tuples.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS, 13 tests.

- [ ] **Step 6: Commit**

```bash
git add data lib
git commit -m "feat: add domain types, geo projection, formatting, and era taxonomy"
```

---

### Task 3: Featured profiles I — Opportunity, Ingenuity, Surveyor 3

**Files:**
- Create: `data/profiles/opportunity.ts`, `data/profiles/ingenuity.ts`, `data/profiles/surveyor-3.ts`, `data/index.ts`, `data/__tests__/integrity.test.ts`, `public/images/equipment/*.webp`
- Test: `data/__tests__/integrity.test.ts`

**Interfaces:**
- Consumes: `EquipmentProfile` from `data/types.ts`.
- Produces: `profiles: EquipmentProfile[]` (3 at this point), `profileById: Record<EquipmentId, EquipmentProfile>` from `data/index.ts` (will grow in Tasks 4–6).

- [ ] **Step 1: Write the failing integrity test**

`data/__tests__/integrity.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { profiles, profileById } from "@/data";
import { eraForYear } from "@/data/taxonomy";

describe("profile integrity", () => {
  it("has unique ids and a complete lookup", () => {
    expect(new Set(profiles.map((p) => p.id)).size).toBe(profiles.length);
    expect(Object.keys(profileById)).toHaveLength(profiles.length);
  });

  it("has complete, sourced telemetry", () => {
    for (const p of profiles) {
      expect(p.telemetry.sources.length, p.id).toBeGreaterThanOrEqual(3);
      expect(p.telemetry.purpose.length, p.id).toBeGreaterThan(20);
      expect(p.telemetry.readings.length, p.id).toBeGreaterThan(0);
      expect(p.telemetry.coordinates.lat).toBeGreaterThanOrEqual(-90);
      expect(p.telemetry.coordinates.lat).toBeLessThanOrEqual(90);
      expect(p.telemetry.coordinates.lon).toBeGreaterThanOrEqual(-180);
      expect(p.telemetry.coordinates.lon).toBeLessThanOrEqual(180);
      expect(p.bio.length, p.id).toBeGreaterThan(40);
    }
  });

  it("matches each era to the landing year", () => {
    for (const p of profiles) {
      const year = new Date(p.telemetry.landingDate!).getUTCFullYear();
      expect(eraForYear(year), p.id).toBe(p.era);
    }
  });

  it("vendors every image with a NASA credit", () => {
    for (const image of profiles.flatMap((p) => [p.avatar, p.cover])) {
      expect(image.src.startsWith("/images/")).toBe(true);
      expect(image.credit).toMatch(/NASA/);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- data/__tests__/integrity.test.ts`
Expected: FAIL — `@/data` not found.

- [ ] **Step 3: Source and stage the images**

For each of the three objects, find a public-domain NASA/JPL still (images.nasa.gov or the mission page), download it, convert to WebP at max 1600px wide (`cwebp -q 82` or ImageMagick), and save as `public/images/equipment/<id>-avatar.webp` and `<id>-cover.webp`. Record the real `credit` and `nasaId` in the data. If a distinct avatar is unavailable, reuse a tight crop of the cover. No generated or stock imagery.

- [ ] **Step 4: Write the three profile modules**

Each file exports a named const typed `EquipmentProfile`. Use these exact values:

| Field | Opportunity | Ingenuity | Surveyor 3 |
|---|---|---|---|
| id | `opportunity` | `ingenuity` | `surveyor-3` |
| handle | `oppy_mer_b` | `ginny_chopper` | `surveyor_three` |
| displayName / shortName | Opportunity / MER-B | Ingenuity / Mars Helicopter | Surveyor 3 / Surveyor III |
| tier / planet / era | featured / mars / pathfinder-mer | featured / mars / modern | featured / moon / apollo-viking |
| status | signal-lost | signal-lost | partially-salvaged |
| accent | rust | amber | silver |
| massKg | 185 | 1.8 | 302 |
| landingDate | 2004-01-25 | 2021-02-18 | 1967-04-20 |
| lastContact | 2018-06-10 | 2024-01-25 | 1967-05-04 |
| daysActive / activeUnit | 5111 / sols | 1011 / days | 14 / days |
| powerSource | solar | solar | solar |
| coords (lat, lon) | -1.9462, -5.5266 | 18.4447, 77.4508 | -2.99, -23.34 |
| siteName / region | Meridiani Planum / Terra Meridiani | Wright Brothers Field / Jezero Crater | Surveyor Crater / Oceanus Procellarum |

Add 3–4 readings each, e.g. Opportunity: `Distance driven 45.16 km`, `Solar array output 22 %`, `Sols since landing 5,111`. Ingenuity: `Flights 72`, `Total flight time 128.8 min`, `Distance flown 17.0 km`. Surveyor 3: `Camera removed 1969 by Apollo 12`, `Lunar nights survived 2`.

Mission logs: 3–5 entries each with real dates (launch, landing, record, anomaly, last contact / salvage). Sources: at least three real NASA/JPL URLs per profile.

`pinnedPostId` and `lastSignalPostId` are placeholders at this stage (`"oppy-last-signal"`, etc.); Task 5 adds the posts and the integrity test will enforce them.

- [ ] **Step 5: Create `data/index.ts`**

```ts
import type { EquipmentId, EquipmentProfile } from "@/data/types";
import { opportunity } from "@/data/profiles/opportunity";
import { ingenuity } from "@/data/profiles/ingenuity";
import { surveyor3 } from "@/data/profiles/surveyor-3";

export const profiles: EquipmentProfile[] = [opportunity, ingenuity, surveyor3];
export const profileById = Object.fromEntries(
  profiles.map((p) => [p.id, p])
) as Record<EquipmentId, EquipmentProfile>;
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- data/__tests__/integrity.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 7: Commit**

```bash
git add data public/images
git commit -m "feat: add Opportunity, Ingenuity, and Surveyor 3 telemetry profiles"
```

---

### Task 4: Featured profiles II and catalog

**Files:**
- Create: `data/profiles/apollo-11-descent-stage.ts`, `data/profiles/apollo-11-retroreflector.ts`, `data/profiles/sojourner.ts`, `data/profiles/catalog.ts`
- Modify: `data/index.ts`, `data/__tests__/integrity.test.ts`
- Test: `data/__tests__/integrity.test.ts`

**Interfaces:**
- Consumes: same contract as Task 3.
- Produces: `profiles` grows to 10; `profileById` covers all 10 ids.

- [ ] **Step 1: Extend the failing test**

Append:

```ts
it("has six featured and four catalog profiles", () => {
  expect(profiles.filter((p) => p.tier === "featured")).toHaveLength(6);
  expect(profiles.filter((p) => p.tier === "catalog")).toHaveLength(4);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- data/__tests__/integrity.test.ts`
Expected: FAIL, expected 6 received 3.

- [ ] **Step 3: Add the remaining featured profiles**

| Field | Apollo 11 descent | Apollo 11 LRRS | Sojourner |
|---|---|---|---|
| id | `apollo-11-descent-stage` | `apollo-11-retroreflector` | `sojourner` |
| handle | `eagle_base_stage` | `mirror_on_the_moon` | `sojourner_og` |
| displayName / shortName | Eagle's Legs / LM-5 Descent Stage | Mirror on the Moon / LR-3 | Sojourner / MFEX |
| tier / planet / era | featured / moon / apollo-viking | featured / moon / apollo-viking | featured / mars / pathfinder-mer |
| status | signal-lost | still-passive | signal-lost |
| accent | silver | cyan | amber |
| massKg | 2034 (note: dry, approx.) | 0.65 (note: array assembly, approx.) | 10.6 |
| landingDate | 1969-07-20 | 1969-07-21 | 1997-07-04 |
| lastContact | null | null | 1997-09-27 |
| daysActive / unit | null / days | null / days | 83 / sols |
| powerSource | battery | passive | solar |
| coords | 0.6741, 23.4730 | 0.6734, 23.4730 | 19.13, -33.22 |
| site / region | Tranquility Base / Mare Tranquillitatis | Tranquility Base / Mare Tranquillitatis | Ares Vallis / Chryse Planitia |

Descent stage readings: `Residual propellant unknown`, `Landing legs 4`, `Plaque "We came in peace..." yes`. LRRS: `Corner cubes 100`, `Power required 0 W`, `Years returning signal 56`. Sojourner: `Distance driven ~100 m`, `Sols operated 83`, `Designed lifetime 7 sols`.

- [ ] **Step 4: Add the four catalog profiles**

`catalog.ts` exports `export const catalogProfiles: EquipmentProfile[]`:

| id / handle | display / short | planet / era | status | mass | landing | lastContact | coords | site |
|---|---|---|---|---|---|---|---|---|
| `spirit` / `spirit_of_gusev` | Spirit / MER-A | mars / pathfinder-mer | signal-lost | 185 | 2004-01-04 | 2010-03-22 | -14.5718, 175.4784 | Gusev Crater |
| `viking-1` / `viking_one` | Viking 1 Lander / Viking 1 | mars / apollo-viking | signal-lost | 576 | 1976-07-20 | 1982-11-13 | 22.697, -48.222 | Chryse Planitia |
| `insight` / `insight_lander` | InSight / InSight | mars / modern | signal-lost | 358 | 2018-11-26 | 2022-12-15 | 4.502, 135.623 | Elysium Planitia |
| `apollo-17-lrv` / `lunar_rover_17` | Apollo 17 LRV / LRV-3 | moon / apollo-viking | signal-lost | 210 | 1972-12-11 | null | 20.1908, 30.7717 | Taurus-Littrow |

Catalog profiles use `tier: "catalog"`, `accent: "silver"` (Moon) or `"rust"` (Mars), a 1–2 sentence bio, 2 readings, a 2-entry mission log, and 2+ sources. `pinnedPostId`/`lastSignalPostId` are placeholders filled in Task 5.

- [ ] **Step 5: Extend `data/index.ts`**

Import the three files plus `catalogProfiles`; build `profiles` as the six featured in this order followed by the four catalog entries. Keep `profileById` derived.

- [ ] **Step 6: Verify**

Run: `npm test && npm run typecheck`
Expected: PASS, 5 integrity tests.

- [ ] **Step 7: Commit**

```bash
git add data public/images
git commit -m "feat: add Apollo 11 hardware, Sojourner, and four catalog profiles"
```

---

### Task 5: Posts, comments, and cross-references

**Files:**
- Create: `data/posts.ts`, `data/comments.ts`
- Modify: `data/index.ts`, `data/__tests__/integrity.test.ts`
- Test: `data/__tests__/integrity.test.ts`

**Interfaces:**
- Consumes: `profileById`, `profiles`; `SocialPost`, `Comment`.
- Produces: `posts: SocialPost[]`, `postById: Record<string, SocialPost>`, `postsByAuthor: Record<EquipmentId, SocialPost[]>`, `comments: Comment[]`, `commentsByPost: Record<string, Comment[]>`.

- [ ] **Step 1: Extend the failing test**

```ts
import { comments, posts, postById, postsByAuthor, commentsByPost } from "@/data";

it("has a full content set", () => {
  expect(posts.length).toBeGreaterThanOrEqual(26);
  expect(comments.length).toBeGreaterThanOrEqual(45);
});

it("resolves every post author and pinned reference", () => {
  for (const post of posts) {
    expect(profileById[post.authorId], post.id).toBeDefined();
    expect(post.story.body.trim().length, post.id).toBeGreaterThan(20);
    expect(post.telemetry.body.trim().length, post.id).toBeGreaterThan(20);
    expect(post.story.hashtags.length, post.id).toBeGreaterThan(0);
  }
  for (const profile of profiles) {
    expect(postById[profile.pinnedPostId], profile.id).toBeDefined();
    expect(postById[profile.lastSignalPostId], profile.id).toBeDefined();
    expect(postById[profile.pinnedPostId].authorId, profile.id).toBe(profile.id);
    expect(postById[profile.pinnedPostId].pinned, profile.id).toBe(true);
    if (profile.status === "signal-lost") {
      expect(postById[profile.lastSignalPostId].topic, profile.id).toBe("last-signal");
    }
    expect(postById[profile.lastSignalPostId].authorId, profile.id).toBe(profile.id);
  }
});

it("resolves every comment", () => {
  for (const comment of comments) {
    expect(postById[comment.postId], comment.id).toBeDefined();
    expect(comment.authorId === "visitor" || profileById[comment.authorId], comment.id).toBeDefined();
  }
  for (const post of posts) expect(commentsByPost[post.id]?.length ?? 0).toBeGreaterThanOrEqual(1);
});

it("labels the Opportunity last transmission as a paraphrase", () => {
  const post = postById[profileById.opportunity.lastSignalPostId];
  expect(post.telemetry.sourceNote ?? "").toMatch(/paraphrase/i);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- data/__tests__/integrity.test.ts`
Expected: FAIL — `@/data` has no `posts`.

- [ ] **Step 3: Write `data/posts.ts`**

4–5 posts per featured profile, 1 per catalog profile (≥26 total). Each post: real `publishedAt` date, non-empty `story.body` and `telemetry.body`, 1–3 hashtags, plausible metrics, and a `pinned` last-signal post per profile. Required beats:

- `oppy-last-signal`: the paraphrase, `telemetry.sourceNote` naming Jacob Margolis/NPR, hashtags `#DustStormSurvivor #StillHere`, pinned.
- `ginny-flight-72`: rotor damage on Flight 72, becoming a stationary weather/avionics station.
- `surveyor-camera`: Apollo 12 removing the TV camera in 1969; salty but factual.
- `eagle-plaque`: watching the plaque and bootprints; the ascent stage leaving.
- `mirror-still-reflecting`: no batteries, still returning laser pulses 50+ years on.
- `sojourner-grandparent`: 83 sols against a 7-sol design life; replying to the younger rovers in comments.
- One catalog post each (Spirit, Viking 1, InSight, Apollo 17 LRV).

Dates must be consistent with the profile timeline and must not reference later events. Telemetry bodies are log-style prose, not the same text as the story.

- [ ] **Step 4: Write `data/comments.ts`**

≥45 comments across the posts, one level of nesting max. Include the canonical threads: Sojourner on Opportunity's last signal and on Ingenuity's Flight 72 post; Surveyor 3 ↔ Apollo 11 descent stage (the neighbours); retroreflector ↔ Apollo 17 LRV; Spirit ↔ Opportunity. Every author must be in `profileById` or literally `"visitor"` — no off-cast handles. Dry, competent voices. No fake quotes attributed to real people.

- [ ] **Step 5: Extend `data/index.ts`**

Add `posts`, `postById`, `postsByAuthor`, `comments`, and `commentsByPost`. `postsByAuthor` must contain a key for **all ten** `EquipmentId`s (initialize missing authors to `[]`), sorted by `publishedAt` descending. `commentsByPost` must contain a key for **every** post (initialize to `[]`), sorted by `publishedAt` ascending. Precompute once at module scope; do not filter inside a component render.

- [ ] **Step 6: Verify**

Run: `npm test`
Expected: PASS, 9 tests.

- [ ] **Step 7: Commit**

```bash
git add data
git commit -m "feat: add posts, comments, and cross-mission threads"
```

---

### Task 6: Salvage listings

**Files:**
- Create: `data/salvage.ts`
- Modify: `data/index.ts`, `data/__tests__/integrity.test.ts`
- Test: `data/__tests__/integrity.test.ts`

**Interfaces:**
- Consumes: `profileById`; `SalvageListing`, `SalvageComponent`.
- Produces: `salvageListings: SalvageListing[]`, `salvageByEquipment: Record<EquipmentId, SalvageListing | undefined>`.

- [ ] **Step 1: Extend the failing test**

```ts
import { salvageListings, salvageByEquipment } from "@/data";

it("has one consistent salvage listing per featured profile", () => {
  expect(salvageListings).toHaveLength(6);
  for (const listing of salvageListings) {
    const profile = profileById[listing.equipmentId];
    expect(profile.tier).toBe("featured");
    expect(salvageByEquipment[listing.equipmentId]?.id).toBe(listing.id);
    expect(listing.components.length).toBeGreaterThanOrEqual(3);
    const sum = listing.components.reduce((n, c) => n + c.massKg, 0);
    expect(Math.abs(sum - listing.totalMassKg)).toBeLessThanOrEqual(0.5);
    expect(listing.isruUses.length).toBeGreaterThanOrEqual(2);
    expect(listing.pickup.coordinates.lat).toBe(profile.telemetry.coordinates.lat);
  }
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- data/__tests__/integrity.test.ts`
Expected: FAIL — no `salvageListings`.

- [ ] **Step 3: Write the six listings**

One per featured profile. Each has a dry classified-ad `title` and `blurb`, 3–6 components with real materials (2219 aluminium, Ti-6Al-4V, copper harness, fused silica, kapton), masses that sum to `totalMassKg` within 0.5, a `condition`, `conditionNote`, `pickup` reusing the profile's site + coordinates, `availability` (`available` for four, `reserved` for one, `claimed` for one), 2–3 `isruUses`, and an `askingPrice` line such as `"Free to a good colony"` or `"Trade for 40 m² of pressurised hab"`. No component may claim a part that was actually returned to Earth (Surveyor 3's camera is gone).

- [ ] **Step 4: Extend `data/index.ts`**

Add `salvageListings` and derive `salvageByEquipment` with `Object.fromEntries`.

- [ ] **Step 5: Verify**

Run: `npm test && npm run typecheck`
Expected: PASS, 10 tests.

- [ ] **Step 6: Commit**

```bash
git add data
git commit -m "feat: add ISRU salvage listings for featured hardware"
```

---

### Task 7: Feed filters and sorting

**Files:**
- Create: `lib/filters.ts`, `lib/filters.test.ts`
- Modify: none

**Interfaces:**
- Consumes: `SocialPost`, `PlanetId`, `EraId`, `SignalStatus`, `profileById`.
- Produces:
  - `interface FeedFilters { planet: PlanetId | "all"; era: EraId | "all"; status: SignalStatus | "all"; hashtag?: string }`
  - `DEFAULT_FILTERS: FeedFilters`
  - `filterPosts(posts: SocialPost[], filters: FeedFilters): SocialPost[]`
  - `sortForFeed(posts: SocialPost[]): SocialPost[]`
  - `extractHashtags(posts: SocialPost[]): { tag: string; count: number }[]`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { DEFAULT_FILTERS, extractHashtags, filterPosts, sortForFeed } from "@/lib/filters";
import type { SocialPost } from "@/data/types";

function makePost(
  id: string,
  authorId: SocialPost["authorId"],
  publishedAt: string,
  opts: Partial<SocialPost> = {}
): SocialPost {
  return {
    id,
    authorId,
    publishedAt,
    metrics: { likes: 0, reposts: 0, replies: 0 },
    story: { body: "test body", hashtags: ["TestTag"] },
    telemetry: { headline: "test", body: "test telemetry" },
    ...opts,
  };
}

const fixture = [
  makePost("a", "opportunity", "2018-06-10", { pinned: true }),
  makePost("b", "ingenuity", "2024-01-25"),
  makePost("c", "surveyor-3", "1969-11-19"),
];

describe("filterPosts", () => {
  it("returns all for the default filters", () => expect(filterPosts(fixture, DEFAULT_FILTERS)).toHaveLength(3));
  it("filters by planet", () => expect(filterPosts(fixture, { ...DEFAULT_FILTERS, planet: "moon" }).map((p) => p.id)).toEqual(["c"]));
  it("filters by era", () => expect(filterPosts(fixture, { ...DEFAULT_FILTERS, era: "modern" }).map((p) => p.id)).toEqual(["b"]));
  it("filters by status", () => expect(filterPosts(fixture, { ...DEFAULT_FILTERS, status: "partially-salvaged" }).map((p) => p.id)).toEqual(["c"]));
  it("matches hashtags case-insensitively without #", () => expect(filterPosts(fixture, { ...DEFAULT_FILTERS, hashtag: "#testtag" })).toHaveLength(3));
  it("ANDs two filters", () => expect(filterPosts(fixture, { ...DEFAULT_FILTERS, planet: "moon", era: "modern" })).toHaveLength(0));
});

describe("sortForFeed", () => {
  it("puts pinned first, then newest", () => expect(sortForFeed(fixture).map((p) => p.id)).toEqual(["a", "b", "c"]));
});

describe("extractHashtags", () => {
  it("counts descending", () => expect(extractHashtags(fixture)).toEqual([{ tag: "testtag", count: 3 }]));
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- lib/filters.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/filters.ts`**

`filterPosts` looks up the author profile for planet/era/status. `sortForFeed` is a non-mutating copy sorted by `(b.pinned?1:0)-(a.pinned?1:0) || Date.parse(b.publishedAt)-Date.parse(a.publishedAt)`. `extractHashtags` lowercases and counts.

- [ ] **Step 4: Run to verify it passes**

Run: `npm test`
Expected: PASS; every suite green.

- [ ] **Step 5: Commit**

```bash
git add lib
git commit -m "feat: add feed filtering, sorting, and hashtag extraction"
```

---

### Task 8: Ghost Mode state

**Files:**
- Create: `lib/mode.ts`, `lib/mode-store.ts`, `lib/mode.test.ts`, `components/ghost/mode-provider.tsx`, `components/ghost/ghost-toggle.tsx`, `components/ghost/post-mode-toggle.tsx`
- Modify: `app/layout.tsx`, `components/layout/top-nav.tsx`

**Interfaces:**
- Consumes: nothing from earlier except React.
- Produces:
  - `type DisplayMode = "story" | "telemetry"`, `type PostModeOverride = "inherit" | DisplayMode`
  - `resolvePostMode(global: DisplayMode, override: PostModeOverride): DisplayMode`
  - `readStoredMode(storage: Pick<Storage, "getItem"> | null): DisplayMode`
  - `writeStoredMode(storage: Pick<Storage, "setItem"> | null, mode: DisplayMode): void`
  - `ModeProvider`, `useDisplayMode(): { mode; setMode; toggle; overrides; setOverride; resolvePostMode(postId): DisplayMode }`
  - `<GhostToggle />`, `<PostModeToggle postId: string />`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { readStoredMode, resolvePostMode, writeStoredMode } from "@/lib/mode";

describe("resolvePostMode", () => {
  it("inherits unless overridden", () => {
    expect(resolvePostMode("story", "inherit")).toBe("story");
    expect(resolvePostMode("telemetry", "inherit")).toBe("telemetry");
    expect(resolvePostMode("story", "telemetry")).toBe("telemetry");
    expect(resolvePostMode("telemetry", "story")).toBe("story");
  });
});

describe("stored mode", () => {
  it("defaults to story when storage is missing or throws", () => {
    expect(readStoredMode(null)).toBe("story");
    expect(readStoredMode({ getItem: () => { throw new Error("denied"); } })).toBe("story");
  });
  it("ignores corrupt values", () => {
    expect(readStoredMode({ getItem: () => "neon" })).toBe("story");
  });
  it("reads telemetry", () => {
    expect(readStoredMode({ getItem: () => "telemetry" })).toBe("telemetry");
  });
  it("never throws on write", () => {
    expect(() => writeStoredMode({ setItem: () => { throw new Error("full"); } }, "story")).not.toThrow();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- lib/mode.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/mode.ts` and `lib/mode-store.ts`**

`mode.ts`: the types, `resolvePostMode`, `readStoredMode` (try/catch, whitelist), `writeStoredMode` (try/catch). Storage key `aftersignal:mode`.

`mode-store.ts`: module-level `mode: DisplayMode | null` + a listener set for `useSyncExternalStore`. `getModeSnapshot()` reads storage **once** on first client call, caches the result in `mode`, and returns it (never returns a new value per call). `getServerModeSnapshot()` returns `"story"`. `subscribeMode(cb)` adds/removes a listener. `setModeValue(next)` updates `mode`, writes storage, and notifies. All storage access goes through `readStoredMode`/`writeStoredMode`.

- [ ] **Step 4: Build the provider and toggles**

`ModeProvider` is `"use client"`, uses `useSyncExternalStore(subscribeMode, getModeSnapshot, getServerModeSnapshot)`, holds `overrides` in `useState<Record<string, PostModeOverride>>({})`, and resets overrides in `setMode` (which also calls `setModeValue`). `useDisplayMode` throws if used outside the provider.

`GhostToggle`: a button with `role="switch"` and `aria-checked`, labels `STORY` / `TELEMETRY`, amber/cyan indicator, 180ms crossfade of the knob via `motion`.

`PostModeToggle`: a **cycling** button (`INHERIT` → `STORY` → `TELEMETRY` → `INHERIT`), mono 10px label, `aria-label={`Post display mode: ${state}`}`, calls `setOverride(postId, next)`. No popover.

- [ ] **Step 5: Wire into the layout**

Wrap `{children}` in `<ModeProvider>` inside `AppShell`. Replace the nav placeholder with `<GhostToggle />`.

- [ ] **Step 6: Verify**

Run: `npm test && npm run build`
Expected: PASS; no hydration warnings in `npm run dev` on a hard reload with telemetry stored.

- [ ] **Step 7: Commit**

```bash
git add app components lib
git commit -m "feat: add ghost mode provider, persistence, and toggles"
```

---

### Task 9: Feed UI

**Files:**
- Create: `components/feed/feed.tsx`, `components/feed/filter-bar.tsx`, `components/feed/post-card.tsx`, `components/feed/post-header.tsx`, `components/feed/post-media.tsx`, `components/feed/post-actions.tsx`, `components/feed/hashtag.tsx`, `components/ghost/story-body.tsx`, `components/ghost/telemetry-body.tsx`, `components/ghost/telemetry-grid.tsx`, `components/ghost/mission-log.tsx`, `components/equipment/equipment-avatar.tsx`
- Modify: `app/page.tsx`
- Test: none (verified by build + page checks)

**Interfaces:**
- Consumes: `posts`, `profileById`, `filterPosts`, `sortForFeed`, `extractHashtags`, `useDisplayMode`, `formatMissionDate`, `formatCount`.
- Produces:
  - `Feed()` — client component, no props.
  - `FilterBar({ filters, onChange }: { filters: FeedFilters; onChange: (next: FeedFilters) => void })`
  - `PostCard({ post }: { post: SocialPost })`
  - `StoryBody({ story }: { story: StoryContent })`
  - `TelemetryBody({ telemetry }: { telemetry: TelemetryContent })`
  - `TelemetryGrid({ readings }: { readings: TelemetryReading[] })`
  - `MissionLog({ entries, limit }: { entries: MissionLogEntry[]; limit?: number })`
  - `EquipmentAvatar({ profile, size }: { profile: EquipmentProfile; size?: "sm" | "md" | "lg" })`

- [ ] **Step 1: Build the primitives**

`EquipmentAvatar` uses `next/image` with the profile's avatar, a 1px ring, and a status dot (amber lost, cyan passive, rust salvaged). `StoryBody` renders paragraphs with the serif token at `text-[19px] leading-[1.55]`; it renders hashtags as plain muted spans, and `PostCard` renders the clickable `Hashtag` row beneath it. `TelemetryBody` renders a mono headline + body at `text-[13px] leading-relaxed`, plus an optional readings grid and `sourceNote` in muted italic. `MissionLog` renders a vertical rule with `date — kind — title` and detail; `limit` defaults to 4.

- [ ] **Step 2: Build `PostCard`**

`const { resolvePostMode } = useDisplayMode()` and select the body with `resolvePostMode(post.id)`. Layout: header (avatar, display name, `@handle`, timestamp right-aligned as `DD MMM YYYY`, `PostModeToggle`), body, media (`next/image`, 16:9, only if present), clickable hashtags, actions, then `<CommentThread postId={post.id} limit={2} />` (created in Task 10; temporarily render a placeholder div that is hidden when the resolved mode is `"telemetry"`, so this task builds). Pinned posts get a 2px amber left border and a `PINNED` label.

`PostActions`: like/repost/reply buttons with Lucide icons, local `useState` counters seeded from `metrics`, `aria-pressed` on like. No network.

- [ ] **Step 3: Build `Feed`**

`"use client"`. State: `filters` (`DEFAULT_FILTERS`). Derive `visible = sortForFeed(filterPosts(posts, filters))`. Render three filter rows: `PLANETARY BODY: ALL | MOON | MARS`, `ERA: ALL | 1960s–70s | 1990s–00s | 2010s–20s`, `STATUS: ALL | SIGNAL LOST | STILL PASSIVE | PARTIALLY SALVAGED`. Active chip: amber underline + amber text. Hashtag filter shows a removable `#tag` chip above the feed. Render `<AnimatePresence>` over posts with a 180ms opacity/4px rise, staggered 20ms, `initial={false}`.

`app/page.tsx` renders `<Feed />` inside a page header (`SectionLabel` "LIVE FEED", h1 "The machines are still talking", one-line intro).

- [ ] **Step 4: Verify**

Run: `npm run build && npm run dev`
Expected: `/` renders 26+ posts; each chip filters instantly; Ghost Mode swaps serif story text for mono telemetry and hides the comment area (placeholder); no horizontal scroll at 1280px or 390px.

- [ ] **Step 5: Commit**

```bash
git add app components
git commit -m "feat: build the aftersignal feed with filters and ghost bodies"
```

---

### Task 10: Comment threads and visitor replies

**Files:**
- Create: `components/comments/comment-thread.tsx`, `components/comments/comment-item.tsx`, `components/comments/comment-composer.tsx`
- Modify: `components/feed/post-card.tsx`
- Test: none (verified by interaction)

**Interfaces:**
- Consumes: `commentsByPost`, `profileById`, `useDisplayMode`, `formatMissionDate`.
- Produces:
  - `CommentThread({ postId, limit }: { postId: string; limit?: number })`
  - `CommentItem({ comment }: { comment: Comment })`
  - `CommentComposer({ onSubmit }: { onSubmit: (body: string) => void })`

- [ ] **Step 1: Build `CommentItem`**

Hardware authors show avatar + display name + `@handle` + `VERIFIED` badge (a small cyan check). Visitor comments show a generic `@visitor` label, no avatar image (initials disc), and no badge. One level of nesting: replies indent 16px with a left rule. Render body at 14px sans (not serif — this is dialogue, not the post).

- [ ] **Step 2: Build `CommentComposer`**

Text input + `TRANSMIT` button. Disabled when empty. On submit: clear, call `onSubmit`. `aria-label="Reply as a visitor"`. Mono 12px placeholder `"Add a transmission…"`.

- [ ] **Step 3: Build `CommentThread`**

`"use client"`. Reads `commentsByPost[postId]`, keeps `extra: Comment[]` in state. In telemetry mode, renders nothing (the mission log in the post body replaces it). In story mode: heading `CROSS-MISSION CHANNEL`, shows `limit` comments (default all), `+ N more` expands. Visitor submissions append a `Comment` with `authorId: "visitor"`, `isVisitor: true`, `publishedAt: new Date().toISOString()`, `likes: 0`.

- [ ] **Step 4: Wire into `PostCard`**

Replace the placeholder. On the feed pass `limit={2}`; on the profile page pass no limit.

- [ ] **Step 5: Verify**

Run: `npm run build && npm run dev`
Expected: threads render on every post; replying adds a `@visitor` comment; Ghost Mode hides the thread entirely; keyboard-only reply works.

- [ ] **Step 6: Commit**

```bash
git add components
git commit -m "feat: add cross-mission comment threads and visitor replies"
```

---

### Task 11: Profile pages

**Files:**
- Create: `components/equipment/profile-header.tsx`, `components/equipment/telemetry-status-bar.tsx`, `components/equipment/last-known-signal.tsx`, `components/equipment/relation-chip.tsx`, `components/equipment/verified-badge.tsx`, `components/equipment/profile-view.tsx`
- Modify: `app/equipment/[id]/page.tsx`, `data/__tests__/integrity.test.ts`
- Test: `data/__tests__/integrity.test.ts` + route check

**Interfaces:**
- Consumes: `profileById`, `postsByAuthor`, `commentsByPost`, `salvageByEquipment`, `useDisplayMode`.
- Produces:
  - `ProfileView({ profile, posts, salvage }: { profile: EquipmentProfile; posts: SocialPost[]; salvage?: SalvageListing })`
  - `ProfileHeader({ profile }: { profile: EquipmentProfile })`
  - `TelemetryStatusBar({ profile }: { profile: EquipmentProfile })`
  - `LastKnownSignal({ post }: { post: SocialPost })`
  - `RelationChip({ relation }: { relation: { id: EquipmentId; label: string } })`

- [ ] **Step 1: Extend the failing test**

```ts
it("has the expected cross-mission relations", () => {
  for (const profile of profiles) {
    for (const relation of profile.relations ?? []) {
      expect(profileById[relation.id], `${profile.id} -> ${relation.id}`).toBeDefined();
    }
  }
  expect(profileById.opportunity.relations?.some((r) => r.id === "sojourner")).toBe(true);
  expect(profileById.sojourner.relations?.some((r) => r.id === "opportunity")).toBe(true);
  expect(
    profileById["apollo-11-descent-stage"].relations?.some(
      (r) => r.id === "apollo-11-retroreflector"
    )
  ).toBe(true);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- data/__tests__/integrity.test.ts`
Expected: FAIL — no relations on Opportunity yet.

Then add `relations` to the six featured profiles: Sojourner → Opportunity (`grandparent`), Opportunity → Sojourner and Spirit (`predecessor`, `sibling`), Ingenuity → Sojourner (`predecessor`), Surveyor 3 → Apollo 11 descent stage (`neighbour`), retroreflector → descent stage (`same site`), descent stage → retroreflector (`same site`). Run the test again; expected PASS.

- [ ] **Step 3: Build the page**

`app/equipment/[id]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import type { EquipmentId } from "@/data/types";
import { postsByAuthor, profileById, profiles, salvageByEquipment } from "@/data";
import { ProfileView } from "@/components/equipment/profile-view";

export function generateStaticParams() {
  return profiles.map((p) => ({ id: p.id }));
}

export default async function Page({ params }: PageProps<"/equipment/[id]">) {
  const { id } = await params;
  const profile = profileById[id as EquipmentId];
  if (!profile) notFound();
  return <ProfileView profile={profile} posts={postsByAuthor[profile.id] ?? []} salvage={salvageByEquipment[profile.id]} />;
}
```

`ProfileView` is `"use client"` (it reads display mode). Hero: cover image 21:9 with a bottom gradient, avatar overlapping, name + handle + status pill, tagline. Then `TelemetryStatusBar` (always visible: mass, power, site + formatted coords, days active, last contact; in telemetry mode expand to the readings grid and full mission log). Then pinned `LastKnownSignal`, then the post list with full `CommentThread`, then `RelationChip`s and a salvage teaser linking to `/salvage`. Footer prev/next between featured profiles.

- [ ] **Step 4: Verify the 404 path**

Run: `npm run build && npm run start` in one shell, then `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/equipment/not-a-real-id`
Expected: `404`. Stop the server.

- [ ] **Step 5: Verify the pages**

Run: `npm test && npm run build`
Expected: PASS; all 10 ids prerender; deep link `/equipment/opportunity` shows the pinned paraphrase with its source note.

- [ ] **Step 6: Commit**

```bash
git add app components data
git commit -m "feat: add telemetry profile pages, status bars, and relations"
```

---

### Task 12: Upcycle Me salvage marketplace

**Files:**
- Create: `components/salvage/salvage-grid.tsx`, `components/salvage/salvage-card.tsx`, `components/salvage/component-table.tsx`, `components/salvage/pickup-panel.tsx`, `components/ui/toast.tsx`
- Modify: `app/salvage/page.tsx`
- Test: none (verified by build + interaction)

**Interfaces:**
- Consumes: `salvageListings`, `profileById`, `formatMass`, `formatCoord`, `useDisplayMode`.
- Produces: `SalvageGrid()`, `SalvageCard({ listing }: { listing: SalvageListing })`, `ComponentTable({ components, totalMassKg })`, `PickupPanel({ pickup, availability, onReserve })`, `Toast({ message, onDone })`.

- [ ] **Step 1: Build the card**

Header: `FOR LOCAL PICKUP` label, planet glyph, title, asking price right-aligned in amber. Blurb in serif (story) or mono (telemetry). Condition badge. `ComponentTable` lists material / mass / condition / reuse with a total row. In telemetry mode, replace the blurb with `isruUses` and the condition note. `PickupPanel`: site, planet, formatted coordinates, access note, availability, and a `RESERVE FOR PICKUP` button. On click: set local `reserved`, show `Toast` "Reserved. Bring your own dust brush." Last-known-signal link to the profile.

- [ ] **Step 2: Build the grid**

`"use client"` for the reserve state and mode. Planet filter `ALL / MOON / MARS`; show 6 cards in a 2-column grid (1 column under 900px). Page header: `UPCYCLE ME`, h1 "Everything must go. Literally, it's still there.", intro about ISRU.

- [ ] **Step 3: Verify**

Run: `npm run build && npm run dev`
Expected: 6 listings; component masses visibly sum to the total; reserving shows the toast (auto-dismiss after 2.5s); Moon filter shows 3, Mars 3; Ghost Mode swaps ad copy for ISRU notes.

- [ ] **Step 4: Commit**

```bash
git add app components
git commit -m "feat: build the upcycle salvage marketplace"
```

---

### Task 13: Surface locator

**Files:**
- Create: `components/map/surface-map.tsx`, `components/map/map-body.tsx`, `components/map/map-pin.tsx`, `components/map/pin-preview.tsx`, `public/images/maps/moon-equirect.webp`, `public/images/maps/mars-equirect.webp`
- Modify: `lib/geo.ts`, `app/locator/page.tsx`, `lib/geo.test.ts` (extend)
- Test: `lib/geo.test.ts`

**Interfaces:**
- Consumes: `profiles`, `profileById`, `projectToPercent`, `formatCoord`, `status` labels.
- Produces:
  - `clampZoom(zoom: number): number` (1–4)
  - `clampTranslate(t: { x: number; y: number }, zoom: number, width: number, height: number): { x: number; y: number }`
  - `SurfaceMap()`, `MapBody({ planet, selectedId, onSelect })`, `MapPin({ profile, selected, onSelect })`, `PinPreview({ profile, onClose })`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { clampTranslate, clampZoom } from "@/lib/geo";

describe("map bounds", () => {
  it("clamps zoom to 1-4", () => {
    expect(clampZoom(0.5)).toBe(1);
    expect(clampZoom(9)).toBe(4);
  });
  it("centres at zoom 1", () => {
    expect(clampTranslate({ x: 500, y: 200 }, 1, 1000, 500)).toEqual({ x: 0, y: 0 });
  });
  it("clamps pan to half the overflow", () => {
    expect(clampTranslate({ x: 900, y: 300 }, 2, 1000, 500)).toEqual({ x: 500, y: 125 });
    expect(clampTranslate({ x: -900, y: -300 }, 2, 1000, 500)).toEqual({ x: -500, y: -125 });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- lib/geo.test.ts`
Expected: FAIL — `clampTranslate` not exported.

- [ ] **Step 3: Implement the clamps**

`clampZoom` clamps to `[1, 4]`. `clampTranslate` clamps x to `±(width * (zoom - 1)) / 2` and y to `±(height * (zoom - 1)) / 2`; zoom 1 returns `{ x: 0, y: 0 }`.

- [ ] **Step 4: Stage the mosaics**

Download public-domain 2:1 equirectangular mosaics for the Moon (LRO WAC) and Mars (MOLA/Viking) from NASA SVS, USGS Astrogeology, or Wikimedia Commons (NASA public domain). Resize to 2048×1024, convert to WebP under 350 KB, save to `public/images/maps/`. Record the credit in the page footer.

- [ ] **Step 5: Build the map**

`SurfaceMap` is `"use client"`. State: `planet` (`"moon" | "mars"`), `selectedId`, `zoom`, `translate`, drag ref. `MapBody` renders a `relative aspect-[2/1] overflow-hidden` container with the image (`next/image` `fill`, `priority`) inside a transformed layer. Pins are absolutely positioned buttons at `left: x%`, `top: y%`, `translate(-50%,-50%)`, colored by status (lost amber, passive cyan, salvaged rust), with `aria-label={`${displayName} at ${siteName}`}` and `aria-pressed`.

Wheel zoom (with `preventDefault` on the map only), pointer drag with `setPointerCapture`, and `+ / − / RESET` buttons for keyboard users. Clamp every update. Selecting a pin opens `PinPreview` in the bottom-left: name, status, site, formatted coords, one-line telemetry purpose, and a link to `/equipment/[id]`. `Escape` closes. Planet switch rebuilds the pin set and resets zoom/translate. `MapBody` notes "always telemetry" in the legend.

Tranquility Base has two pins 0.0007° apart, so `SurfaceMap` keeps a local `PIN_OFFSETS: Partial<Record<EquipmentId, { x: number; y: number }>>` and nudges `apollo-11-retroreflector` by `+1.5%` x and `-1%` y, with a 1px leader line back to the true position.

`app/locator/page.tsx`: header `SURFACE LOCATOR`, h1 "Where they rest", subtitle with the count, then `<SurfaceMap />`.

- [ ] **Step 6: Verify**

Run: `npm test && npm run build && npm run dev`
Expected: PASS; 4 Moon and 6 Mars pins; the Apollo 11 cluster sits in the Moon's upper-right quadrant; Opportunity sits just below the Martian equator; pins remain inside the map at zoom 4; dragging past an edge snaps back.

- [ ] **Step 7: Commit**

```bash
git add app components lib public/images/maps
git commit -m "feat: add the equirectangular surface locator"
```

---

### Task 14: Polish, accessibility, metadata, and ship

**Files:**
- Create: `public/og.png`, `README.md`
- Modify: `app/layout.tsx`, `app/page.tsx`, `app/salvage/page.tsx`, `app/locator/page.tsx`, `app/equipment/[id]/page.tsx`, `app/not-found.tsx`, `components/layout/top-nav.tsx`
- Test: none (final verification)

**Interfaces:**
- Consumes: everything.
- Produces: shippable app.

- [ ] **Step 1: Metadata and social card**

Per-route `export const metadata` (title template `%s — Aftersignal`, descriptions). Root `openGraph` + `twitter` pointing at `/og.png` (1200×630, dark, wordmark + tagline). Profile pages set the title to the display name and the description to the tagline.

- [ ] **Step 2: 404**

`app/not-found.tsx`: mono `SIGNAL LOST`, short line "No hardware at this address. Try the feed.", links to `/` and `/locator` in the same shell.

- [ ] **Step 3: Accessibility pass**

- Every icon-only button has an `aria-label`; decorative icons are `aria-hidden`.
- Focus rings visible on pin buttons, chips, toggles, and links.
- `aria-live="polite"` on the toast and pin preview heading.
- Headings run h1 → h2 → h3 with no skips.
- All images have meaningful `alt` (the data already carries it).
- Tab through `/`, `/salvage`, `/locator`, and one profile with no mouse; all interactive elements reachable.
- With `prefers-reduced-motion: reduce` forced in devtools, no crossfade/stagger plays.

- [ ] **Step 4: Responsive pass**

At 390px: nav collapses to wordmark + icon links, filter chips scroll horizontally without page overflow, post media is full-bleed, status bar wraps to two columns, salvage is one column, map pins are ≥ 28px touch targets. At 1280px: the feed is a single 720px centered column with no sidebar; the nav and filter bar span the content width.

- [ ] **Step 5: README and demo script**

`README.md`: one-paragraph pitch, stack, `npm i && npm run dev`, `npm test`, data layout, image credits, and a 6-beat demo script (feed → filter to Moon → flip Ghost Mode → open Opportunity → reply as visitor → locator pin → salvage reserve). Include the factual note about the Opportunity paraphrase.

- [ ] **Step 6: Final verification**

Run: `npm run typecheck && npm test && npm run build`
Expected: all clean. Then `npm run start` and check `/`, `/salvage`, `/locator`, `/equipment/opportunity`, `/equipment/not-a-real-id` (404), and `/og.png` (200).

- [ ] **Step 7: Commit and deploy**

```bash
git add -A
git commit -m "chore: polish, metadata, accessibility, and docs"
```

Deploy with `vercel --prod` (or connect the repo in the Vercel dashboard). Confirm the production URL on a phone before submitting.
