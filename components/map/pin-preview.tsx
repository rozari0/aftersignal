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
      className="nb-card relative space-y-3 bg-panel p-4 shadow-nb-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="pin-preview-heading" aria-live="polite" className="font-head text-body-lg font-bold uppercase text-text">
            {site.siteName}
          </h2>
          <p className="font-mono text-label text-muted">
            {site.region} · {formatSiteCoords(profiles[0])}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="nb-press-sm border-2 border-rule bg-panel p-1 text-ink hover:bg-rust"
        >
          <X aria-hidden size={14} />
        </button>
      </div>
      <ul className="space-y-3">
        {profiles.map((p) => (
          <li key={p.id} className="flex gap-3">
            <EquipmentAvatar profile={p} />
            <div className="min-w-0 flex-1 space-y-1">
              <p className="font-head text-body-sm font-bold text-text">
                {p.displayName} <span className="font-mono text-label font-normal text-muted">@{p.handle}</span>
              </p>
              <p className="font-mono text-micro uppercase tracking-wider text-muted">
                {statusLabel(p.status)} · Active {formatActive(p)}
              </p>
              <p className="text-meta leading-snug text-text">{p.telemetry.purpose}</p>
              <Link
                href={`/equipment/${p.id}`}
                className="nb-press-sm inline-flex items-center gap-1 border-2 border-rule bg-amber px-2 py-0.5 font-mono text-label font-bold uppercase tracking-wider text-ink hover:bg-amber-hover"
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
