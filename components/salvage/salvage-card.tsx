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
        "nb-card flex min-w-0 scroll-mt-32 flex-col sm:scroll-mt-24 gap-4 p-4 target:shadow-nb-xl target:outline-4 target:outline-amber sm:p-5",
        telemetry ? "bg-cyan-wash" : "bg-panel",
      )}
    >
      <header className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 font-mono text-micro font-bold uppercase tracking-wider text-muted">
          <span>
            {telemetry ? "Salvage manifest" : "For local pickup"} · {listing.pickup.planet === "moon" ? "🌙 Moon" : "🔴 Mars"}
          </span>
          <time dateTime={listing.listedAt}>Listed {formatMissionDate(listing.listedAt)}</time>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2
            id={`${listing.id}-title`}
            className={cn(telemetry ? "font-mono text-body font-bold uppercase tracking-wide" : "font-head text-[26px] font-bold leading-tight tracking-[-0.02em]", "text-text")}
          >
            {listing.title}
          </h2>
          <p className={cn("border-2 border-rule px-2 py-0.5 font-mono text-meta font-bold text-ink shadow-nb-sm", telemetry ? "bg-cyan" : "bg-amber")}>
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
              <div className="border-2 border-rule bg-panel p-3">
                <ComponentTable components={listing.components} totalMassKg={listing.totalMassKg} />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-head text-label font-bold uppercase tracking-wide text-text">ISRU applications</h3>
                <ul className="space-y-1 font-mono text-meta text-text">
                  {listing.isruUses.map((use) => (
                    <li key={use} className="flex gap-2">
                      <span aria-hidden className="font-bold">›</span>
                      {use}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="font-mono text-label leading-relaxed text-muted">
                <span className="uppercase tracking-wider text-text">{CONDITION[listing.condition]}.</span> {listing.conditionNote}
              </p>
            </>
          ) : (
            <>
              <p className="font-head text-[18px] font-medium leading-[1.5] text-text">{listing.blurb}</p>
              <p className="text-body-sm leading-relaxed text-text">
                <span className="mr-2 border-2 border-rule bg-lilac px-2 py-0.5 font-mono text-micro font-bold uppercase tracking-wider text-ink">
                  {CONDITION[listing.condition]}
                </span>
                {listing.conditionNote}
              </p>
              <div className="space-y-1">
                <h3 className="font-head text-label font-bold uppercase tracking-wide text-text">Included</h3>
                <p className="text-small leading-relaxed text-text">
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
          className="group flex items-center gap-2 font-mono text-label uppercase tracking-wider text-text"
        >
          <EquipmentAvatar profile={profile} size="sm" />
          <span>
            Seller: <span className="font-bold group-hover:underline">{profile.displayName}</span> <span className="normal-case tracking-normal">@{profile.handle}</span>
          </span>
          <ArrowUpRight aria-hidden size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
