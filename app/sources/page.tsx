import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { collectSources, equipmentName } from "@/lib/sources";

export const metadata: Metadata = {
  title: "Data Sources",
  description:
    "Every NASA archive, image and map Aftersignal draws on: NSSDCA, the NASA Image and Video Library, JPL, the Apollo Lunar Surface Journal, NASA SVS and USGS Astrogeology.",
};

const PLANET_LABEL = { moon: "Moon map", mars: "Mars map" } as const;

export default function Page() {
  const groups = collectSources();
  const recordCount = groups.reduce((n, g) => n + g.records.length, 0);
  const nasaCount = groups.filter((g) => g.kind === "nasa").length;

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <SectionLabel>Data sources · {groups.length} archives · {recordCount} records</SectionLabel>
        <h1 className="font-head text-4xl font-bold tracking-[-0.03em] text-text sm:text-6xl">Where the facts come from.</h1>
        <p className="max-w-2xl text-body leading-relaxed text-text">
          The voices are fiction. The numbers are not. Dates, coordinates, masses, last-contact times and mission logs
          come from the public NASA record below, and every photo and base map is public-domain NASA imagery.
          {" "}{nasaCount} of the {groups.length} archives are run by NASA; the rest are NASA-funded or federal partners
          hosting NASA mission data.
        </p>
      </header>

      <nav aria-label="Archives on this page" className="flex flex-wrap gap-2">
        {groups.map((group) => (
          <a
            key={group.id}
            href={`#${group.id}`}
            className="border-2 border-rule bg-panel px-2.5 py-1 font-mono text-label text-text shadow-nb-xs hover:bg-sunk"
          >
            {group.name} <span className="text-muted">({group.records.length})</span>
          </a>
        ))}
      </nav>

      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`} className="nb-card scroll-mt-24 bg-panel">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-rule p-4 sm:p-5">
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 id={`${group.id}-title`} className="font-head text-2xl font-bold tracking-tight text-text">
                    {group.name}
                  </h2>
                  <span
                    className={
                      group.kind === "nasa"
                        ? "border-2 border-rule bg-cyan px-1.5 py-0.5 font-head text-micro font-bold uppercase text-ink"
                        : "border-2 border-rule bg-lilac px-1.5 py-0.5 font-head text-micro font-bold uppercase text-ink"
                    }
                  >
                    {group.kind === "nasa" ? "NASA" : "Partner"}
                  </span>
                </div>
                <p className="max-w-2xl text-body-sm leading-relaxed text-muted">{group.usedFor}</p>
              </div>
              <a
                href={group.homepage}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1 border-2 border-rule bg-amber px-2.5 py-1 font-head text-label font-bold uppercase text-ink nb-press"
              >
                Visit archive <ArrowUpRight aria-hidden className="size-3.5" />
              </a>
            </div>

            <ul className="divide-y-2 divide-sunk">
              {group.records.map((record) => (
                <li key={record.url} className="flex flex-col gap-1.5 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:px-5">
                  <a
                    href={record.url}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0 break-words text-body-sm font-medium text-text underline decoration-2 underline-offset-4 hover:bg-amber"
                  >
                    {record.label}
                  </a>
                  <span className="flex shrink-0 flex-wrap gap-1.5 sm:justify-end">
                    {record.equipment.map((id) => (
                      <Link
                        key={id}
                        href={`/equipment/${id}`}
                        className="border border-rule bg-sunk px-1.5 py-0.5 font-mono text-micro text-text hover:bg-amber"
                      >
                        {equipmentName(id)}
                      </Link>
                    ))}
                    {record.planets.map((planet) => (
                      <Link
                        key={planet}
                        href="/locator"
                        className="border border-rule bg-sunk px-1.5 py-0.5 font-mono text-micro text-text hover:bg-amber"
                      >
                        {PLANET_LABEL[planet]}
                      </Link>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="max-w-2xl border-2 border-dashed border-rule bg-panel px-3 py-2 font-mono text-label leading-relaxed text-muted">
        Not affiliated with or endorsed by NASA. NASA imagery is public domain; credit lines follow NASA&apos;s media
        usage guidelines. Each equipment profile also lists its own sources in Ghost Mode.
      </p>
    </div>
  );
}
