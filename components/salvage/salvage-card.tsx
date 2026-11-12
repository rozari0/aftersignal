"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCrossfade } from "@/lib/motion";
import Link from "next/link";
import { EquipmentAvatar } from "@/components/equipment/equipment-avatar";
import { PostMedia } from "@/components/feed/post-media";
import { profileById } from "@/data";
import type { SalvageListing } from "@/data/types";
import type { DisplayMode } from "@/lib/mode";
import { cn } from "@/lib/cn";
import { formatMass, formatMissionDate } from "@/lib/format";
import { ComponentTable } from "./component-table";
import { PickupPanel } from "./pickup-panel";

const CONDITION: Record<SalvageListing["condition"], string> = {
  "dust-coated": "Dust-coated",
  "battle-scarred": "Battle-scarred",
  "partially-dismantled": "Partially dismantled",
  pristine: "Pristine",
};

export function SalvageCard({
  listing,
  mode,
  reservedByYou,
  onReserve,
}: {
  listing: SalvageListing;
  mode: DisplayMode;
  reservedByYou: boolean;
  onReserve: (listing: SalvageListing) => void;
}) {
  const profile = profileById[listing.equipmentId];
  const fade = useCrossfade();
  const telemetry = mode === "telemetry";

  return (
    <article
      id={listing.id}
      aria-labelledby={`${listing.id}-title`}
      className={cn(
        "flex min-w-0 scroll-mt-20 flex-col gap-4 rounded-[3px] border bg-panel/70 p-4 target:border-amber/70 sm:p-5",
        telemetry ? "border-cyan/20" : "border-rule",
      )}
    >
      <header className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          <span>
            {telemetry ? "Salvage manifest" : "For local pickup"} · {listing.pickup.planet === "moon" ? "🌙 Moon" : "🔴 Mars"}
          </span>
          <time dateTime={listing.listedAt}>Listed {formatMissionDate(listing.listedAt)}</time>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2
            id={`${listing.id}-title`}
            className={cn(telemetry ? "font-mono text-[15px] uppercase tracking-wide" : "font-serif text-[24px] leading-tight", "text-text")}
          >
            {listing.title}
          </h2>
          <p className={cn("font-mono text-[12px]", telemetry ? "text-cyan" : "text-amber")}>
            {telemetry ? formatMass(listing.totalMassKg) : listing.askingPrice}
          </p>
        </div>
      </header>

      {listing.media ? <PostMedia media={listing.media} muted={telemetry} /> : null}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          {...fade}
          className="space-y-4"
        >
          {telemetry ? (
            <>
              <div className="scanlines -mx-1 rounded-[2px] px-1 py-1">
                <ComponentTable components={listing.components} totalMassKg={listing.totalMassKg} />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">ISRU applications</h3>
                <ul className="space-y-1 font-mono text-[12px] text-text/90">
                  {listing.isruUses.map((use) => (
                    <li key={use} className="flex gap-2">
                      <span aria-hidden className="text-cyan">›</span>
                      {use}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="font-mono text-[11px] leading-relaxed text-muted">
                <span className="uppercase tracking-wider text-text">{CONDITION[listing.condition]}.</span> {listing.conditionNote}
              </p>
            </>
          ) : (
            <>
              <p className="font-serif text-[18px] leading-[1.5] text-text">{listing.blurb}</p>
              <p className="text-[14px] leading-relaxed text-muted">
                <span className="mr-2 rounded-full border border-rule px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text">
                  {CONDITION[listing.condition]}
                </span>
                {listing.conditionNote}
              </p>
              <div className="space-y-1">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Included</h3>
                <p className="text-[13px] leading-relaxed text-text/85">
                  {listing.components.map((c) => c.material).join(" · ")}
                </p>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-auto space-y-3">
        <PickupPanel
          pickup={listing.pickup}
          availability={listing.availability}
          reservedByYou={reservedByYou}
          onReserve={() => onReserve(listing)}
          title={listing.title}
        />
        <Link
          href={`/equipment/${profile.id}`}
          className="group flex items-center gap-2 rounded-[2px] font-mono text-[11px] uppercase tracking-wider text-muted hover:text-text"
        >
          <EquipmentAvatar profile={profile} size="sm" />
          <span>
            Seller: {profile.displayName} <span className="normal-case tracking-normal">@{profile.handle}</span>
          </span>
          <ArrowUpRight aria-hidden size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
