"use client";

import { Heart, MessageSquare, Repeat2 } from "lucide-react";
import { useState } from "react";
import type { PostMetrics } from "@/data/types";
import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format";

/** Local-only reactions: nothing is persisted or sent anywhere. */
export function PostActions({ metrics, replies }: { metrics: PostMetrics; replies: number }) {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-meta font-bold text-ink">
      <button
        type="button"
        aria-pressed={liked}
        onClick={() => setLiked((v) => !v)}
        className={cn("nb-press-sm flex min-h-8 items-center gap-1.5 border-2 border-rule px-2.5", liked ? "bg-amber" : "bg-panel")}
      >
        <Heart aria-hidden size={15} fill={liked ? "currentColor" : "none"} />
        <span className="sr-only">Like, </span>
        {formatCount(metrics.likes + (liked ? 1 : 0))}
      </button>
      <button
        type="button"
        aria-pressed={reposted}
        onClick={() => setReposted((v) => !v)}
        className={cn("nb-press-sm flex min-h-8 items-center gap-1.5 border-2 border-rule px-2.5", reposted ? "bg-cyan" : "bg-panel")}
      >
        <Repeat2 aria-hidden size={16} />
        <span className="sr-only">Rebroadcast, </span>
        {formatCount(metrics.reposts + (reposted ? 1 : 0))}
      </button>
      <span className="flex min-h-8 items-center gap-1.5 px-2.5" aria-label={`${replies} replies`}>
        <MessageSquare aria-hidden size={14} />
        {formatCount(replies)}
      </span>
    </div>
  );
}
