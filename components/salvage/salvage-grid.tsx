"use client";

import { useCallback, useState } from "react";
import { useDisplayMode } from "@/components/ghost/mode-provider";
import { Toast } from "@/components/ui/toast";
import { salvageListings } from "@/data";
import type { PlanetId, SalvageListing } from "@/data/types";
import { cn } from "@/lib/cn";
import { SalvageCard } from "./salvage-card";

const FILTERS: { value: PlanetId | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "moon", label: "🌙 Moon" },
  { value: "mars", label: "🔴 Mars" },
];

const REPLIES = [
  "Reserved. Bring your own dust brush.",
  "Reserved. Pickup window opens at local sunrise.",
  "Reserved. Seller asks that you mind the tracks.",
];

export function SalvageGrid() {
  const { mode } = useDisplayMode();
  const [planet, setPlanet] = useState<PlanetId | "all">("all");
  const [reserved, setReserved] = useState<ReadonlySet<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);

  const visible = planet === "all" ? salvageListings : salvageListings.filter((l) => l.pickup.planet === planet);

  const reserve = (listing: SalvageListing) => {
    setReserved((prev) => new Set(prev).add(listing.id));
    setToast(`${REPLIES[reserved.size % REPLIES.length]} (${listing.pickup.siteName})`);
  };

  return (
    <div className="space-y-4">
      <div role="group" aria-label="Filter listings by planet" className="flex flex-wrap items-center gap-1">
        <span className="mr-2 font-mono text-micro uppercase tracking-[0.14em] text-muted">Pickup location</span>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={planet === f.value}
            onClick={() => setPlanet(f.value)}
            className={cn(
              "rounded-[2px] border-b px-2 py-1 font-mono text-label uppercase tracking-wider transition-colors",
              planet === f.value ? "border-amber text-amber" : "border-transparent text-muted hover:text-text",
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto font-mono text-label uppercase tracking-wider text-muted" aria-live="polite">
          {visible.length} listings
        </span>
      </div>

      <div className="grid gap-4 min-[900px]:grid-cols-2">
        {visible.map((listing) => (
          <SalvageCard
            key={listing.id}
            listing={listing}
            mode={mode}
            reservedByYou={reserved.has(listing.id)}
            onReserve={reserve}
          />
        ))}
      </div>

      <Toast message={toast} onDone={clearToast} />
    </div>
  );
}
