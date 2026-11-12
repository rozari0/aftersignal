"use client";

import { STATUS_DOT } from "@/components/equipment/equipment-avatar";
import type { PinGroup } from "@/lib/pins";
import { cn } from "@/lib/cn";

export function MapPin({
  group,
  selected,
  zoom,
  translate,
  onSelect,
}: {
  group: PinGroup;
  selected: boolean;
  zoom: number;
  translate: { x: number; y: number };
  onSelect: (key: string) => void;
}) {
  const [lead] = group.profiles;
  const label =
    group.profiles.length > 1
      ? `${lead.telemetry.coordinates.siteName}, ${group.profiles.length} objects: ${group.profiles.map((p) => p.displayName).join(" and ")}`
      : `${lead.displayName} at ${lead.telemetry.coordinates.siteName}`;

  // Positions are computed in the untransformed overlay so pins keep a constant size at any zoom.
  const left = `calc(50% + ${(group.x / 100 - 0.5) * zoom * 100}% + ${translate.x}px)`;
  const top = `calc(50% + ${(group.y / 100 - 0.5) * zoom * 100}% + ${translate.y}px)`;

  return (
    <button
      type="button"
      data-pin={group.key}
      aria-label={label}
      aria-pressed={selected}
      onClick={() => onSelect(group.key)}
      className="group absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
      style={{ left, top }}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 rounded-full border transition-transform duration-200",
          selected ? "scale-100 border-text" : "scale-75 border-text/40 group-hover:scale-90 group-hover:border-text/80",
        )}
      />
      <span aria-hidden className={cn("h-2.5 w-2.5 rounded-full ring-2 ring-void", STATUS_DOT[lead.status])} />
      {group.profiles.length > 1 ? (
        <span
          aria-hidden
          className="absolute -right-1.5 -top-1.5 rounded-full bg-text px-1 font-mono text-micro leading-[14px] text-void"
        >
          {group.profiles.length}
        </span>
      ) : null}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute hidden whitespace-nowrap rounded-[2px] bg-void/80 px-1.5 py-0.5 font-mono text-micro uppercase tracking-wider sm:block",
          group.labelSide === "left" ? "right-full mr-1.5" : "left-full ml-1.5",
          selected ? "text-text" : "text-text/70",
        )}
      >
        {group.profiles.length > 1 ? lead.telemetry.coordinates.siteName : lead.displayName}
      </span>
    </button>
  );
}
