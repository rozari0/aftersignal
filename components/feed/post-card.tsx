"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCrossfade } from "@/lib/motion";
import { useState } from "react";
import { CommentThread } from "@/components/comments/comment-thread";
import { TelemetryStrip } from "@/components/equipment/telemetry-strip";
import { MissionLog } from "@/components/ghost/mission-log";
import { useDisplayMode } from "@/components/ghost/mode-provider";
import { StoryBody } from "@/components/ghost/story-body";
import { TelemetryBody } from "@/components/ghost/telemetry-body";
import { profileById } from "@/data";
import type { SocialPost } from "@/data/types";
import { cn } from "@/lib/cn";
import { logAsOf } from "@/lib/telemetry";
import { Hashtag } from "./hashtag";
import { PostActions } from "./post-actions";
import { PostHeader } from "./post-header";
import { PostMedia } from "./post-media";

export function PostCard({
  post,
  commentLimit,
  onHashtag,
  hideStrip = false,
}: {
  post: SocialPost;
  /** Top-level comments shown before "+ N more". Omit to show the whole thread. */
  commentLimit?: number;
  onHashtag?: (tag: string) => void;
  /** Hide the per-post instrument strip where the page already shows the profile's status bar. */
  hideStrip?: boolean;
}) {
  const { resolvePostMode } = useDisplayMode();
  const fade = useCrossfade();
  const mode = resolvePostMode(post.id);
  const profile = profileById[post.authorId];
  const [transmitted, setTransmitted] = useState(0);
  const telemetry = mode === "telemetry";
  const log = telemetry ? logAsOf(profile.telemetry.missionLog, post.publishedAt) : [];

  return (
    <article
      aria-labelledby={`post-${post.id}`}
      className={cn(
        "relative space-y-4 rounded-[3px] border bg-panel/70 p-4 sm:p-5",
        telemetry ? "border-cyan/20" : "border-rule",
        post.pinned && "border-l-2 border-l-amber",
      )}
    >
      <h2 id={`post-${post.id}`} className="sr-only">
        {profile.displayName}, {post.publishedAt}
      </h2>
      {post.pinned ? (
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-amber">
          {post.topic === "last-signal" ? "Pinned · Last known signal" : "Pinned"}
        </p>
      ) : null}

      <PostHeader post={post} profile={profile} mode={mode} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          {...fade}
          className="space-y-4"
        >
          {telemetry ? (
            <>
              {hideStrip ? null : <TelemetryStrip profile={profile} />}
              <div className="scanlines -mx-1 rounded-[2px] px-1 py-1">
                <TelemetryBody telemetry={post.telemetry} />
              </div>
              {post.media ? <PostMedia media={post.media} muted /> : null}
              {log.length ? (
                <div className="space-y-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Mission log · as of this entry</p>
                  <MissionLog entries={log} limit={3} />
                </div>
              ) : null}
            </>
          ) : (
            <>
              <StoryBody story={post.story} />
              {post.media ? <PostMedia media={post.media} /> : null}
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {post.story.hashtags.map((tag) => (
                  <Hashtag key={tag} tag={tag} onSelect={onHashtag} />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <PostActions metrics={post.metrics} replies={post.metrics.replies + transmitted} />

      {/* Telemetry mode replaces the social channel with the mission log above.
          Hidden rather than unmounted so local visitor replies survive a mode flip. */}
      <div hidden={telemetry}>
        <CommentThread postId={post.id} limit={commentLimit} onTransmit={() => setTransmitted((n) => n + 1)} />
      </div>
    </article>
  );
}
