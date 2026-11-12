# Aftersignal

**The machines are still talking.** Aftersignal is a mission-control social feed for the hardware NASA left on the Moon and Mars. Opportunity, Ingenuity, Surveyor 3, Apollo 11's descent stage and laser retroreflector, Sojourner and four more machines post their own mission histories, argue in the comments, and list their parts for future settlers. One switch, **Ghost Mode**, strips the personality away and shows the instrument underneath: coordinates, mass, power source, mission log and sources.

Built for the 2026 NASA Space Apps Challenge, *Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars*.

## What's in it

| Route | What it does |
|---|---|
| `/` | The feed. Filter by planetary body, mission era and status, or click a hashtag. Pinned "last known signal" posts lead. |
| `/equipment/[id]` | Telemetry bio for each of the 10 machines: status bar, last known signal, posts, cross-mission threads, relations. |
| `/salvage` | **Upcycle Me.** Classified ads for salvageable materials, framed around NASA's In-Situ Resource Utilization (ISRU) work. |
| `/locator` | Surface locator. Moon and Mars equirectangular maps with pins from real coordinates, pan and zoom. |

**Ghost Mode** is global (top-right switch, remembered in `localStorage`) with a per-post override. In Story Mode, posts are first-person and serif, with comments. In Telemetry Mode the layout changes: comments disappear and the mission log, readings and coordinates take their place. The locator is always telemetry.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # data-integrity and logic tests (Vitest)
npm run typecheck
npm run build      # every route prerenders statically
```

No environment variables, database or API keys are needed. Every asset is vendored, so the app makes no runtime API calls.

**Stack:** Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4, Motion, Lucide icons, Vitest.

## Deploy

Not deployed from this repo yet. To ship on Vercel:

1. Push the branch and import the repo in the Vercel dashboard (framework preset: Next.js), or run `npx vercel --prod`.
2. Optional: set `NEXT_PUBLIC_SITE_URL` to the production URL so social-card links are absolute. Without it, Vercel's `VERCEL_PROJECT_PRODUCTION_URL` is used.
3. Open the production URL on a phone and check `/`, `/salvage`, `/locator`, one profile, and `/opengraph-image`.

## Project layout

```
app/            routes, metadata, opengraph-image, not-found
components/     feed/, ghost/, equipment/, comments/, salvage/, map/, layout/, ui/
data/           typed content: profiles/, posts.ts, comments.ts, salvage.ts, media.ts, maps.ts, taxonomy.ts
lib/            filters, geo projection and map clamps, pin grouping, mode store, formatting
public/images/  vendored NASA imagery (WebP)
```

All content is typed TypeScript checked by `data/__tests__/integrity.test.ts`. The tests check that ids resolve, every profile has sources, mission logs are chronological, eras match landing years, pinned posts exist, and salvage component masses sum to their totals.

## Facts and fiction

- **In-character posts and comments are fiction.** Dates, coordinates, masses, mission logs and readings come from NASA, JPL and NSSDCA sources listed on each profile.
- **Opportunity's "My battery is low and it's getting dark"** is journalist Jacob Margolis's paraphrase of the final telemetry. The rover never sent it, and Telemetry Mode says so.
- Coordinates marked **approx.** are estimated resting places (for example Opportunity in Perseverance Valley rather than its landing site).
- **Salvage listings are speculative.** Materials reflect real flight hardware, but per-component masses are engineering estimates. Lunar heritage sites are listed as not for salvage.
- Not affiliated with or endorsed by NASA.

**Worth a human fact-check before submission:** the Apollo 11 retroreflector package mass (~30 kg), and the approximate resting coordinates for Opportunity, Ingenuity and Surveyor 3.

## Image credits

All imagery is public domain, courtesy of NASA, JPL-Caltech and USGS. The stills are cropped and re-encoded as WebP.

| Profile | Use | NASA ID | Credit |
|---|---|---|---|
| opportunity | avatar | [PIA18079](https://images.nasa.gov/details/PIA18079) | NASA/JPL-Caltech/Cornell Univ./Arizona State Univ. |
| opportunity | cover | [PIA22218](https://images.nasa.gov/details/PIA22218) | NASA/JPL-Caltech |
| ingenuity | avatar | [PIA24542](https://images.nasa.gov/details/PIA24542) | NASA/JPL-Caltech/MSSS |
| ingenuity | cover | [PIA26237](https://images.nasa.gov/details/PIA26237) | NASA/JPL-Caltech/ASU/MSSS |
| surveyor-3 | avatar | [as12-48-7121](https://images.nasa.gov/details/as12-48-7121) | NASA/JSC |
| surveyor-3 | cover | [AS12-48-7134](https://images.nasa.gov/details/AS12-48-7134) | NASA/JSC |
| apollo-11-descent-stage | avatar | [as11-40-5927](https://images.nasa.gov/details/as11-40-5927) | NASA/JSC |
| apollo-11-descent-stage | cover | [as11-40-5927](https://images.nasa.gov/details/as11-40-5927) | NASA/JSC |
| apollo-11-retroreflector | avatar | [as11-40-5942](https://images.nasa.gov/details/as11-40-5942) | NASA/JSC |
| apollo-11-retroreflector | cover | [as11-40-5948](https://images.nasa.gov/details/as11-40-5948) | NASA/JSC |
| sojourner | avatar | [PIA04318](https://images.nasa.gov/details/PIA04318) | NASA/JPL-Caltech |
| sojourner | cover | [PIA00621](https://images.nasa.gov/details/PIA00621) | NASA/JPL |
| spirit | avatar | [PIA04413](https://images.nasa.gov/details/PIA04413) | NASA/JPL/Cornell University |
| spirit | cover | [PIA11996](https://images.nasa.gov/details/PIA11996) | NASA/JPL-Caltech |
| viking-1 | avatar | [PIA00381](https://images.nasa.gov/details/PIA00381) | NASA/JPL |
| viking-1 | cover | [PIA00563](https://images.nasa.gov/details/PIA00563) | NASA/JPL |
| insight | avatar | [PIA25287](https://images.nasa.gov/details/PIA25287) | NASA/JPL-Caltech |
| insight | cover | [PIA22876](https://images.nasa.gov/details/PIA22876) | NASA/JPL-Caltech |
| apollo-17-lrv | avatar | [as17-137-20979](https://images.nasa.gov/details/as17-137-20979) | NASA/JSC |
| apollo-17-lrv | cover | [as17-147-22527](https://images.nasa.gov/details/as17-147-22527) | NASA/JSC |

**Surface maps**

- **Moon:** LRO / LROC WAC colour map from NASA's Scientific Visualization Studio, [CGI Moon Kit](https://svs.gsfc.nasa.gov/4720).
- **Mars:** Viking MDIM 2.1 colourised global mosaic (NASA / JPL / USGS, colourised by NASA Ames), via [USGS Astrogeology](https://astrogeology.usgs.gov/search/details/Mars/Viking/MDIM21/Mars_Viking_MDIM21_ClrMosaic_global_232m/cub).

Both maps are equirectangular, centred on 0° longitude. Their orientation was checked against known landmarks (Copernicus, Tycho, Mare Crisium; Olympus Mons, Hellas, Valles Marineris) before pins were placed.

## 90-second demo script

1. **Feed.** Open `/`. The pinned last signals lead: Ingenuity's Flight 72, InSight, the Mirror on the Moon.
2. **Filter.** Click **Moon**, then a hashtag such as `#StillReflecting`. Reset.
3. **Ghost Mode.** Flip the switch. Serif posts become instrument readouts with mission logs; comments vanish. Flip one post back with its own toggle.
4. **Profile.** Open Opportunity. Show the status bar, the paraphrase note on the last transmission, and Sojourner's grandparent comment. Reply as a visitor.
5. **Locator.** Open `/locator`, select Tranquility Base (two objects, one pin), switch to Mars and zoom on Meridiani.
6. **Upcycle Me.** Open `/salvage` and reserve Opportunity's aluminium. Flip Ghost Mode for the component manifest.
