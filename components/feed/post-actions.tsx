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
    <div className="flex items-center gap-6 font-mono text-[12px] text-muted">
      <button
        type="button"
        aria-pressed={liked}
        onClick={() => setLiked((v) => !v)}
        className={cn("flex items-center gap-1.5 rounded-[2px] transition-colors hover:text-amber", liked && "text-amber")}
      >
        <Heart aria-hidden size={15} fill={liked ? "currentColor" : "none"} />
        <span className="sr-only">Like, </span>
        {formatCount(metrics.likes + (liked ? 1 : 0))}
      </button>
      <button
        type="button"
        aria-pressed={reposted}
        onClick={() => setReposted((v) => !v)}
        className={cn("flex items-center gap-1.5 rounded-[2px] transition-colors hover:text-cyan", reposted && "text-cyan")}
      >
        <Repeat2 aria-hidden size={16} />
        <span className="sr-only">Rebroadcast, </span>
        {formatCount(metrics.reposts + (reposted ? 1 : 0))}
      </button>
      <span className="flex items-center gap-1.5" aria-label={`${replies} replies`}>
        <MessageSquare aria-hidden size={14} />
        {formatCount(replies)}
      </span>
    </div>
  );
}
