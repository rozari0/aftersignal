"use client";

import Link from "next/link";
import { EquipmentAvatar } from "@/components/equipment/equipment-avatar";
import { useDisplayMode } from "@/components/ghost/mode-provider";
import { posts, profiles } from "@/data";
import { extractHashtags, normalizeTag } from "@/lib/filters";
import { statusLabel } from "@/lib/telemetry";

// Display each trending tag with the casing its authors used ("#SignalLost", not "#signallost").
const DISPLAY = new Map(posts.flatMap((p) => p.story.hashtags).map((h) => [normalizeTag(h), h] as const));
const TRENDING = extractHashtags(posts)
  .slice(0, 8)
  .map((t) => ({ ...t, label: DISPLAY.get(t.tag) ?? `#${t.tag}` }));

export function FeedSidebar({ onHashtag }: { onHashtag: (tag: string) => void }) {
  const { mode } = useDisplayMode();

  return (
    <aside className="hidden space-y-6 lg:block" aria-label="Network overview">
      <section className="nb-card space-y-3 bg-panel p-4">
        <p className="font-head text-body font-bold uppercase text-text">Ghost Mode</p>
        <p className="text-small leading-relaxed text-text">
          {mode === "story"
            ? "You're reading the network as the machines tell it. Flip Ghost Mode to strip the voice and see the instrument: coordinates, mass, power, mission log."
            : "Telemetry view. Personality off, instruments on. Every figure here is sourced on the hardware's profile."}
        </p>
      </section>

      <section className="nb-card space-y-3 bg-panel p-4">
        <p className="font-head text-body font-bold uppercase text-text">Trending frequencies</p>
        <ul className="flex flex-wrap gap-2">
          {TRENDING.map(({ tag, label, count }) => (
            <li key={tag}>
              <button
                type="button"
                onClick={() => onHashtag(tag)}
                className="nb-press-sm border-2 border-rule bg-panel px-1.5 font-mono text-meta font-bold text-ink hover:bg-amber"
              >
                {label}
                <span className="ml-1 font-normal text-muted">{count}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="nb-card space-y-3 bg-panel p-4">
        <p className="font-head text-body font-bold uppercase text-text">On the network · {profiles.length}</p>
        <ul className="space-y-2.5">
          {profiles.map((p) => (
            <li key={p.id}>
              <Link href={`/equipment/${p.id}`} className="group flex items-center gap-2.5">
                <EquipmentAvatar profile={p} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-small font-bold text-text group-hover:underline">{p.displayName}</span>
                  <span className="block font-mono text-micro uppercase tracking-wider text-muted">
                    {p.planet === "moon" ? "Moon" : "Mars"} · {statusLabel(p.status)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
