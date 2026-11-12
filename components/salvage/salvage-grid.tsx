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
    <div className="space-y-6">
      <div role="group" aria-label="Filter listings by planet" className="flex flex-wrap items-center gap-1.5">
        <span className="mr-2 font-head text-label font-bold uppercase tracking-wide text-text">Pickup location</span>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={planet === f.value}
            onClick={() => setPlanet(f.value)}
            className={cn(
              "border-2 px-2.5 py-1 font-mono text-label font-bold uppercase tracking-wider",
              planet === f.value ? "border-rule bg-amber text-ink shadow-nb-sm" : "border-transparent text-ink hover:border-rule hover:bg-panel",
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto font-mono text-label font-bold uppercase tracking-wider text-text" aria-live="polite">
          {visible.length} listings
        </span>
      </div>

      <div className="grid gap-6 min-[900px]:grid-cols-2">
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
