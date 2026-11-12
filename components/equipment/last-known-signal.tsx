"use client";

import { PostCard } from "@/components/feed/post-card";
import type { SocialPost } from "@/data/types";

export function LastKnownSignal({ post }: { post: SocialPost }) {
  return (
    <section aria-labelledby="last-known-signal" className="space-y-2">
      <h2 id="last-known-signal" className="flex items-center gap-2 font-mono text-label uppercase tracking-[0.14em] text-amber">
        <span aria-hidden className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber/60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
        </span>
        Last known signal
      </h2>
      <PostCard post={post} hideStrip />
    </section>
  );
}
