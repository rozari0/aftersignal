import Image from "next/image";
import { ERAS } from "@/data/taxonomy";
import type { EquipmentProfile } from "@/data/types";
import type { DisplayMode } from "@/lib/mode";
import { cn } from "@/lib/cn";
import { statusLabel } from "@/lib/telemetry";
import { EquipmentAvatar } from "./equipment-avatar";
import { VerifiedBadge } from "./verified-badge";

const STATUS_PILL = {
  "signal-lost": "border-amber/60 text-amber",
  "still-passive": "border-cyan/60 text-cyan",
  "partially-salvaged": "border-rust/70 text-rust",
} as const;

export function ProfileHeader({ profile, mode }: { profile: EquipmentProfile; mode: DisplayMode }) {
  const telemetry = mode === "telemetry";
  const era = ERAS.find((e) => e.id === profile.era)!;

  return (
    <header className="overflow-hidden rounded-[3px] border border-rule bg-panel/70">
      <div className="relative aspect-[16/9] sm:aspect-[8/3]">
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
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent" />
        <p className="absolute right-3 top-3 rounded-[2px] bg-void/70 px-2 py-0.5 font-mono text-micro uppercase tracking-wider text-muted">
          {profile.cover.credit}
          {profile.cover.nasaId ? ` · ${profile.cover.nasaId}` : ""}
        </p>
      </div>

      <div className="relative space-y-3 px-4 pb-5 sm:px-6">
        <div className="-mt-12 flex flex-wrap items-end gap-4">
          <EquipmentAvatar profile={profile} size="lg" className="rounded-full ring-4 ring-panel" />
          <div className="min-w-0 flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-x-2">
              <h1
                className={cn(
                  "text-text",
                  telemetry ? "font-mono text-2xl uppercase tracking-wider" : "font-serif text-4xl tracking-tight",
                )}
              >
                {profile.displayName}
              </h1>
              <VerifiedBadge size={18} />
            </div>
            <p className="font-mono text-meta text-muted">
              @{profile.handle}
              <span className="mx-1.5 text-rule">/</span>
              {profile.shortName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-micro uppercase tracking-wider">
          <span className={cn("rounded-full border px-2.5 py-0.5", STATUS_PILL[profile.status])}>
            {statusLabel(profile.status)}
          </span>
          <span className="rounded-full border border-rule px-2.5 py-0.5 text-muted">
            {profile.planet === "moon" ? "🌙 Moon" : "🔴 Mars"}
          </span>
          <span className="rounded-full border border-rule px-2.5 py-0.5 text-muted" title={era.label}>
            {era.range}
          </span>
        </div>

        {telemetry ? (
          <p className="font-mono text-small leading-relaxed text-text/90">
            {profile.telemetry.missionName}
            <span className="mx-1.5 text-rule">/</span>
            <span className="text-muted">{profile.telemetry.agency}</span>
          </p>
        ) : (
          <p className="max-w-3xl font-serif text-[21px] leading-snug text-text">{profile.tagline}</p>
        )}
      </div>
    </header>
  );
}
