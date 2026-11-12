"use client";

import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { EquipmentAvatar } from "@/components/equipment/equipment-avatar";
import type { EquipmentProfile } from "@/data/types";
import { formatActive, formatSiteCoords, statusLabel } from "@/lib/telemetry";

export function PinPreview({ profiles, onClose }: { profiles: EquipmentProfile[]; onClose: () => void }) {
  const site = profiles[0].telemetry.coordinates;
  return (
    <section
      aria-labelledby="pin-preview-heading"
      className="relative space-y-3 rounded-[3px] border border-rule bg-panel/95 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="pin-preview-heading" aria-live="polite" className="font-mono text-[12px] uppercase tracking-[0.12em] text-text">
            {site.siteName}
          </h2>
          <p className="font-mono text-[11px] text-muted">
            {site.region} · {formatSiteCoords(profiles[0])}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="rounded-[2px] p-1 text-muted hover:text-text"
        >
          <X aria-hidden size={14} />
        </button>
      </div>
      <ul className="space-y-3">
        {profiles.map((p) => (
          <li key={p.id} className="flex gap-3">
            <EquipmentAvatar profile={p} />
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-[14px] font-semibold text-text">
                {p.displayName} <span className="font-mono text-[11px] font-normal text-muted">@{p.handle}</span>
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                {statusLabel(p.status)} · Active {formatActive(p)}
              </p>
              <p className="text-[12px] leading-snug text-muted">{p.telemetry.purpose}</p>
              <Link
                href={`/equipment/${p.id}`}
                className="inline-flex items-center gap-1 rounded-[2px] font-mono text-[11px] uppercase tracking-wider text-amber hover:text-text"
              >
                Open telemetry bio <ArrowUpRight aria-hidden size={12} />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
