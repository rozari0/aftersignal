"use client";

import { PostCard } from "@/components/feed/post-card";
import type { SocialPost } from "@/data/types";

export function LastKnownSignal({ post }: { post: SocialPost }) {
  return (
    <section aria-labelledby="last-known-signal" className="space-y-3">
      <h2 id="last-known-signal" className="inline-flex items-center gap-2 border-2 border-rule bg-amber px-2.5 py-1 font-head text-label font-bold uppercase tracking-wide text-ink shadow-nb-sm">
        <span aria-hidden className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping bg-ink/50 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 bg-ink" />
        </span>
        Last known signal
      </h2>
      <PostCard post={post} hideStrip />
    </section>
  );
}
