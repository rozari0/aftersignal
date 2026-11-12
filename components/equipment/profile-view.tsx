"use client";

import { ArrowLeft, ArrowRight, Recycle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCrossfade } from "@/lib/motion";
import Link from "next/link";
import { EquipmentChat } from "@/components/chat/equipment-chat";
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
  <h2 className="font-head text-body font-bold uppercase tracking-wide text-text">{children}</h2>
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
  const fade = useCrossfade();
  const telemetry = mode === "telemetry";
  const lastSignal = posts.find((p) => p.id === profile.lastSignalPostId);
  const rest = sortForFeed(posts.filter((p) => p.id !== profile.lastSignalPostId));
  const t = profile.telemetry;

  return (
    <div className="space-y-8">
      <ProfileHeader profile={profile} mode={mode} />
      <TelemetryStatusBar profile={profile} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          {...fade}
        >
          {telemetry ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-w-0 space-y-6">
                <section className="nb-card space-y-3 bg-cyan-wash p-4 sm:p-5">
                  <Label>Engineering purpose</Label>
                  <p className="font-mono text-small leading-relaxed text-text">{t.purpose}</p>
                  <Label>Heritage status</Label>
                  <p className="font-mono text-small leading-relaxed text-text">{t.heritageStatus}</p>
                </section>
                <section className="space-y-3">
                  <Label>Instrument readings</Label>
                  <TelemetryGrid readings={t.readings} />
                </section>
                <section className="nb-card space-y-3 bg-panel p-4 sm:p-5">
                  <Label>Full mission log</Label>
                  <MissionLog entries={t.missionLog} limit={t.missionLog.length} />
                </section>
              </div>
              <aside className="nb-card space-y-3 bg-panel p-4 lg:self-start">
                <Label>Sources · {t.sources.length}</Label>
                <ol className="space-y-2.5">
                  {t.sources.map((s, i) => (
                    <li key={s.url} className="flex gap-2 font-mono text-meta leading-snug">
                      <span className="font-bold text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <a href={s.url} target="_blank" rel="noreferrer" className="font-bold text-ink underline decoration-2 underline-offset-2 hover:bg-cyan">
                        {s.label} ↗
                      </a>
                    </li>
                  ))}
                </ol>
              </aside>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <p className="max-w-[68ch] font-head text-[20px] font-medium leading-[1.55] tracking-[-0.01em] text-text">{profile.bio}</p>
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
          <ul className="space-y-6">
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
          className="nb-press group flex items-center gap-4 border-2 border-rule bg-amber p-4"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-rule bg-panel"><Recycle aria-hidden size={20} className="text-ink" /></span>
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-micro font-bold uppercase tracking-wider text-ink">
              Upcycle Me · {salvage.availability} · {formatMass(salvage.totalMassKg)}
            </span>
            <span className="block truncate font-head text-body-lg font-bold text-ink">{salvage.title}</span>
          </span>
          <ArrowRight aria-hidden size={20} className="shrink-0 text-ink" />
        </Link>
      ) : null}

      <nav aria-label="Adjacent hardware" className="flex justify-between gap-4">
        <Link
          href={`/equipment/${prev.id}`}
          rel="prev"
          className="nb-press group flex items-center gap-2 border-2 border-rule bg-panel px-3 py-2 font-mono text-label uppercase tracking-wider text-muted hover:bg-sunk"
        >
          <ArrowLeft aria-hidden size={14} />
          <span>
            <span className="block text-micro">Previous</span>
            <span className="font-head font-bold normal-case text-text">{prev.displayName}</span>
          </span>
        </Link>
        <Link
          href={`/equipment/${next.id}`}
          rel="next"
          className="nb-press group flex items-center gap-2 border-2 border-rule bg-panel px-3 py-2 text-right font-mono text-label uppercase tracking-wider text-muted hover:bg-sunk"
        >
          <span>
            <span className="block text-micro">Next</span>
            <span className="font-head font-bold normal-case text-text">{next.displayName}</span>
          </span>
          <ArrowRight aria-hidden size={14} />
        </Link>
      </nav>

      <EquipmentChat key={profile.id} profile={profile} />
    </div>
  );
}
