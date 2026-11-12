"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { STATUS_DOT } from "@/components/equipment/equipment-avatar";
import { profiles } from "@/data";
import { SURFACE_MAPS } from "@/data/maps";
import { STATUSES } from "@/data/taxonomy";
import type { PlanetId } from "@/data/types";
import { cn } from "@/lib/cn";
import { clampZoom } from "@/lib/geo";
import { groupPins } from "@/lib/pins";
import { formatSiteCoords } from "@/lib/telemetry";
import { MapBody, type MapView } from "./map-body";
import { PinPreview } from "./pin-preview";

const RESET: MapView = { zoom: 1, translate: { x: 0, y: 0 } };
const PLANETS: { id: PlanetId; label: string }[] = [
  { id: "moon", label: "🌙 Moon" },
  { id: "mars", label: "🔴 Mars" },
];

export function SurfaceMap() {
  const [planet, setPlanet] = useState<PlanetId>("moon");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [view, setView] = useState<MapView>(RESET);

  const bodyProfiles = useMemo(() => profiles.filter((p) => p.planet === planet), [planet]);
  const groups = useMemo(() => groupPins(bodyProfiles), [bodyProfiles]);
  const selected = groups.find((g) => g.key === selectedKey) ?? null;
  const map = SURFACE_MAPS[planet];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedKey(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const switchPlanet = (next: PlanetId) => {
    setPlanet(next);
    setSelectedKey(null);
    setView(RESET);
  };

  // Zoom buttons scale the current pan proportionally; MapBody re-clamps on the next interaction.
  const zoomButton = (factor: number) =>
    setView((v) => {
      const zoom = clampZoom(v.zoom * factor);
      const r = zoom / v.zoom;
      return zoom === 1 ? RESET : { zoom, translate: { x: v.translate.x * r, y: v.translate.y * r } };
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <div role="group" aria-label="Planetary body" className="flex items-center gap-1.5">
          {PLANETS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={planet === p.id}
              onClick={() => switchPlanet(p.id)}
              className={cn(
                "border-2 px-2.5 py-1 font-mono text-label font-bold uppercase tracking-wider",
                planet === p.id ? "border-rule bg-amber text-ink shadow-nb-sm" : "border-transparent text-ink hover:border-rule hover:bg-panel",
              )}
            >
              {p.label} <span className="font-normal">{profiles.filter((x) => x.planet === p.id).length}</span>
            </button>
          ))}
        </div>
        <p className="border-2 border-rule bg-cyan px-2 py-0.5 font-mono text-micro font-bold uppercase tracking-wider text-ink">
          Always telemetry · Ghost Mode does not change this view
        </p>
        <div className="ml-auto flex items-center gap-2" role="group" aria-label="Map zoom">
          <button type="button" onClick={() => zoomButton(1.4)} disabled={view.zoom >= 4} aria-label="Zoom in" className="nb-press-sm flex h-9 w-9 items-center justify-center border-2 border-rule bg-panel text-ink hover:bg-amber disabled:opacity-40 disabled:shadow-none">
            <Plus aria-hidden size={14} />
          </button>
          <button type="button" onClick={() => zoomButton(1 / 1.4)} disabled={view.zoom <= 1} aria-label="Zoom out" className="nb-press-sm flex h-9 w-9 items-center justify-center border-2 border-rule bg-panel text-ink hover:bg-amber disabled:opacity-40 disabled:shadow-none">
            <Minus aria-hidden size={14} />
          </button>
          <button type="button" onClick={() => setView(RESET)} aria-label="Reset map view" className="nb-press-sm flex h-9 items-center gap-1.5 border-2 border-rule bg-panel px-2.5 font-mono text-micro font-bold uppercase tracking-wider text-ink hover:bg-amber">
            <RotateCcw aria-hidden size={12} /> Reset
          </button>
        </div>
      </div>

      <div className="relative">
        <MapBody
          planet={planet}
          groups={groups}
          selectedKey={selectedKey}
          onSelect={(key) => setSelectedKey((k) => (k === key ? null : key))}
          view={view}
          onViewChange={setView}
        />
        {selected ? (
          <div className="mt-3 sm:absolute sm:bottom-3 sm:left-3 sm:mt-0 sm:w-[340px]">
            <PinPreview profiles={selected.profiles} onClose={() => setSelectedKey(null)} />
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section aria-labelledby="hardware-list" className="space-y-3">
          <h2 id="hardware-list" className="font-head text-body font-bold uppercase text-text">
            Resting on {planet === "moon" ? "the Moon" : "Mars"} · {bodyProfiles.length}
          </h2>
          <ul className="nb-card grid gap-[2px] overflow-hidden bg-rule sm:grid-cols-2">
            {bodyProfiles.map((p) => {
              const key = groups.find((g) => g.profiles.includes(p))!.key;
              return (
                <li key={p.id} className="bg-panel">
                  <button
                    type="button"
                    onClick={() => setSelectedKey(key)}
                    aria-pressed={selectedKey === key}
                    className={cn("flex h-full w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-sunk", selectedKey === key && "bg-amber hover:bg-amber")}
                  >
                    <span aria-hidden className={cn("mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-rule", STATUS_DOT[p.status])} />
                    <span className="min-w-0">
                      <span className="block text-small font-bold text-text">{p.displayName}</span>
                      <span className="block font-mono text-label uppercase tracking-wider text-muted">
                        {p.telemetry.coordinates.siteName} · {formatSiteCoords(p)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
        <aside className="nb-card space-y-3 self-start bg-panel p-4 font-mono text-meta text-text">
          <h2 className="font-head text-body font-bold uppercase">Legend</h2>
          <ul className="space-y-1">
            {STATUSES.map((s) => (
              <li key={s.id} className="flex items-center gap-2">
                <span aria-hidden className={cn("h-3 w-3 rounded-full border-2 border-rule", STATUS_DOT[s.id])} />
                {s.label}
              </li>
            ))}
          </ul>
          <p className="leading-relaxed">
            Planetocentric coordinates, east-positive. Pins marked “approx.” are estimated resting places. Drag to pan when
            zoomed; scroll or use + / − to zoom.
          </p>
          <p className="leading-relaxed">
            Base map: {map.credit}.{" "}
            <a href={map.sourceUrl} target="_blank" rel="noreferrer" className="font-bold underline decoration-2 underline-offset-2 hover:bg-amber">
              {map.sourceLabel}
            </a>
            . Public domain.
          </p>
        </aside>
      </div>
    </div>
  );
}
