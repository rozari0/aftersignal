import type { SalvageListing } from "@/data/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatCoord } from "@/lib/format";

export const AVAILABILITY = {
  available: { label: "Available", className: "border-amber/70 text-amber" },
  reserved: { label: "Reserved", className: "border-cyan/70 text-cyan" },
  claimed: { label: "Claimed", className: "border-muted text-muted" },
} as const;

export function PickupPanel({
  pickup,
  availability,
  reservedByYou,
  onReserve,
  title,
}: {
  pickup: SalvageListing["pickup"];
  availability: SalvageListing["availability"];
  reservedByYou: boolean;
  onReserve: () => void;
  title: string;
}) {
  const { lat, lon, confidence } = pickup.coordinates;
  const canReserve = availability === "available" && !reservedByYou;

  return (
    <div className="space-y-3 rounded-[2px] border border-rule bg-void/50 p-3">
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-label">
        <dt className="uppercase tracking-wider text-muted">Pickup</dt>
        <dd className="text-text">
          {pickup.siteName} · {pickup.planet === "moon" ? "Moon" : "Mars"}
        </dd>
        <dt className="uppercase tracking-wider text-muted">Coords</dt>
        <dd className="text-text">
          {formatCoord(lat, "lat")} {formatCoord(lon, "lon")}
          {confidence === "approximate" ? <span className="text-muted"> (approx.)</span> : null}
        </dd>
        <dt className="uppercase tracking-wider text-muted">Access</dt>
        <dd className="text-muted">{pickup.access}</dd>
      </dl>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 font-mono text-micro uppercase tracking-wider",
            reservedByYou ? AVAILABILITY.reserved.className : AVAILABILITY[availability].className,
          )}
        >
          {reservedByYou ? "Reserved by you" : AVAILABILITY[availability].label}
        </span>
        <Button
          variant={canReserve ? "primary" : "ghost"}
          disabled={!canReserve}
          onClick={onReserve}
          aria-label={canReserve ? `Reserve for pickup: ${title}` : undefined}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          {reservedByYou ? "Reserved" : availability === "available" ? "Reserve for pickup" : "Unavailable"}
        </Button>
      </div>
    </div>
  );
}
