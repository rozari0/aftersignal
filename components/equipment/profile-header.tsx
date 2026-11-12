import Image from "next/image";
import { ERAS } from "@/data/taxonomy";
import type { EquipmentProfile } from "@/data/types";
import type { DisplayMode } from "@/lib/mode";
import { cn } from "@/lib/cn";
import { statusLabel } from "@/lib/telemetry";
import { EquipmentAvatar } from "./equipment-avatar";
import { VerifiedBadge } from "./verified-badge";

const STATUS_PILL = {
  "signal-lost": "bg-amber",
  "still-passive": "bg-cyan",
  "partially-salvaged": "bg-rust",
} as const;

export function ProfileHeader({ profile, mode }: { profile: EquipmentProfile; mode: DisplayMode }) {
  const telemetry = mode === "telemetry";
  const era = ERAS.find((e) => e.id === profile.era)!;

  return (
    <header className="nb-card overflow-hidden bg-panel">
      <div className="relative aspect-[16/9] border-b-2 border-rule sm:aspect-[8/3]">
        <Image
          src={profile.cover.src}
          alt={profile.cover.alt}
          fill
          preload
          sizes="(min-width: 1180px) 1148px, 100vw"
          className={cn(
            "object-cover transition-[filter] duration-300",
            telemetry && "grayscale contrast-125",
          )}
          style={{ objectPosition: profile.cover.focus }}
        />
                <p className="absolute right-3 top-3 border-2 border-rule bg-panel px-2 py-0.5 font-mono text-micro uppercase tracking-wider text-text">
          {profile.cover.credit}
          {profile.cover.nasaId ? ` · ${profile.cover.nasaId}` : ""}
        </p>
      </div>

      <div className="relative space-y-4 px-4 pb-6 sm:px-6">
        <div className="flex flex-wrap items-end gap-4">
          <EquipmentAvatar profile={profile} size="lg" className="-mt-12 rounded-full bg-panel" />
          <div className="min-w-0 flex-1 pt-3 pb-1">
            <div className="flex flex-wrap items-center gap-x-2">
              <h1
                className={cn(
                  "text-text",
                  telemetry ? "font-mono text-2xl font-bold uppercase tracking-wider" : "font-head text-4xl font-bold tracking-[-0.03em] sm:text-5xl",
                )}
              >
                {profile.displayName}
              </h1>
              <VerifiedBadge size={18} />
            </div>
            <p className="font-mono text-meta text-muted">
              @{profile.handle}
              <span className="mx-1.5">/</span>
              {profile.shortName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-micro font-bold uppercase tracking-wider text-ink">
          <span className={cn("border-2 border-rule px-2.5 py-0.5 shadow-nb-xs", STATUS_PILL[profile.status])}>
            {statusLabel(profile.status)}
          </span>
          <span className="border-2 border-rule bg-panel px-2.5 py-0.5 shadow-nb-xs">
            {profile.planet === "moon" ? "🌙 Moon" : "🔴 Mars"}
          </span>
          <span className="border-2 border-rule bg-panel px-2.5 py-0.5 shadow-nb-xs" title={era.label}>
            {era.range}
          </span>
        </div>

        {telemetry ? (
          <p className="font-mono text-small leading-relaxed text-text">
            {profile.telemetry.missionName}
            <span className="mx-1.5">/</span>
            <span className="text-muted">{profile.telemetry.agency}</span>
          </p>
        ) : (
          <p className="max-w-3xl font-head text-[21px] font-medium leading-snug text-text">{profile.tagline}</p>
        )}
      </div>
    </header>
  );
}
