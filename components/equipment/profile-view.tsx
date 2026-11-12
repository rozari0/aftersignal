"use client";

import { ArrowLeft, ArrowRight, Recycle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { PostCard } from "@/components/feed/post-card";
import { MissionLog } from "@/components/ghost/mission-log";
import { useDisplayMode } from "@/components/ghost/mode-provider";
import { TelemetryGrid } from "@/components/ghost/telemetry-grid";
import type { EquipmentProfile, SalvageListing, SocialPost } from "@/data/types";
import { sortForFeed } from "@/lib/filters";
import { formatMass } from "@/lib/format";
import { LastKnownSignal } from "./last-known-signal";
import { ProfileHeader } from "./profile-header";
import { RelationChip } from "./relation-chip";
import { TelemetryStatusBar } from "./telemetry-status-bar";

type Neighbour = Pick<EquipmentProfile, "id" | "displayName">;

const Label = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{children}</h2>
);

export function ProfileView({
  profile,
  posts,
  salvage,
  prev,
  next,
}: {
  profile: EquipmentProfile;
  posts: SocialPost[];
  salvage?: SalvageListing;
  prev: Neighbour;
  next: Neighbour;
}) {
  const { mode } = useDisplayMode();
  const telemetry = mode === "telemetry";
  const lastSignal = posts.find((p) => p.id === profile.lastSignalPostId);
  const rest = sortForFeed(posts.filter((p) => p.id !== profile.lastSignalPostId));
  const t = profile.telemetry;

  return (
    <div className="space-y-6">
      <ProfileHeader profile={profile} mode={mode} />
      <TelemetryStatusBar profile={profile} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {telemetry ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-w-0 space-y-6">
                <section className="scanlines space-y-3 rounded-[3px] border border-cyan/20 bg-panel/70 p-4 sm:p-5">
                  <Label>Engineering purpose</Label>
                  <p className="font-mono text-[13px] leading-relaxed text-text/90">{t.purpose}</p>
                  <Label>Heritage status</Label>
                  <p className="font-mono text-[13px] leading-relaxed text-text/90">{t.heritageStatus}</p>
                </section>
                <section className="space-y-3">
                  <Label>Instrument readings</Label>
                  <TelemetryGrid readings={t.readings} />
                </section>
                <section className="space-y-3 rounded-[3px] border border-rule bg-panel/70 p-4 sm:p-5">
                  <Label>Full mission log</Label>
                  <MissionLog entries={t.missionLog} limit={t.missionLog.length} />
                </section>
              </div>
              <aside className="space-y-3 rounded-[3px] border border-rule bg-panel/70 p-4 lg:self-start">
                <Label>Sources · {t.sources.length}</Label>
                <ol className="space-y-2.5">
                  {t.sources.map((s, i) => (
                    <li key={s.url} className="flex gap-2 font-mono text-[12px] leading-snug">
                      <span className="text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <a href={s.url} target="_blank" rel="noreferrer" className="text-cyan hover:underline">
                        {s.label} ↗
                      </a>
                    </li>
                  ))}
                </ol>
              </aside>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <p className="font-serif text-[20px] leading-[1.55] text-text/95">{profile.bio}</p>
              {profile.relations?.length ? (
                <section className="space-y-3 lg:self-start">
                  <Label>Cross-mission relations</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.relations.map((r) => (
                      <RelationChip key={r.id} relation={r} />
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {lastSignal ? <LastKnownSignal post={lastSignal} /> : null}

      {rest.length ? (
        <section className="space-y-3">
          <Label>
            Transmissions · {rest.length}
          </Label>
          <ul className="space-y-4">
            {rest.map((post) => (
              <li key={post.id}>
                <PostCard post={post} hideStrip />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {salvage ? (
        <Link
          href={`/salvage#${salvage.id}`}
          className="group flex items-center gap-4 rounded-[3px] border border-rule bg-panel/70 p-4 transition-colors hover:border-muted"
        >
          <Recycle aria-hidden size={20} className="shrink-0 text-amber" />
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Upcycle Me · {salvage.availability} · {formatMass(salvage.totalMassKg)}
            </span>
            <span className="block truncate text-[15px] text-text group-hover:underline">{salvage.title}</span>
          </span>
          <ArrowRight aria-hidden size={16} className="shrink-0 text-muted" />
        </Link>
      ) : null}

      <nav aria-label="Adjacent hardware" className="flex justify-between gap-4 border-t border-rule pt-4">
        <Link
          href={`/equipment/${prev.id}`}
          rel="prev"
          className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted hover:text-text"
        >
          <ArrowLeft aria-hidden size={14} />
          <span>
            <span className="block text-[10px]">Previous</span>
            <span className="text-text group-hover:underline">{prev.displayName}</span>
          </span>
        </Link>
        <Link
          href={`/equipment/${next.id}`}
          rel="next"
          className="group flex items-center gap-2 text-right font-mono text-[11px] uppercase tracking-wider text-muted hover:text-text"
        >
          <span>
            <span className="block text-[10px]">Next</span>
            <span className="text-text group-hover:underline">{next.displayName}</span>
          </span>
          <ArrowRight aria-hidden size={14} />
        </Link>
      </nav>
    </div>
  );
}
