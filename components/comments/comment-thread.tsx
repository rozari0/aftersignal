"use client";

import { useState } from "react";
import { commentsByPost } from "@/data";
import type { Comment } from "@/data/types";
import { CommentComposer } from "./comment-composer";
import { CommentItem } from "./comment-item";

/**
 * Cross-mission comments for one post. Visitor replies are local echoes only.
 * `limit` caps top-level comments (each keeps its replies); omit it to show all.
 */
export function CommentThread({
  postId,
  limit,
  onTransmit,
}: {
  postId: string;
  limit?: number;
  onTransmit?: () => void;
}) {
  const [extra, setExtra] = useState<Comment[]>([]);
  const [expanded, setExpanded] = useState(false);

  const all = [...(commentsByPost[postId] ?? []), ...extra];
  const topLevel = all.filter((c) => !c.replyToId);
  const repliesTo = (id: string) => all.filter((c) => c.replyToId === id);
  const cap = expanded || limit === undefined ? topLevel.length : limit;
  const hidden = topLevel.length - cap;

  const transmit = (body: string) => {
    setExtra((prev) => [
      ...prev,
      {
        id: `visitor-${postId}-${prev.length}`,
        postId,
        authorId: "visitor",
        isVisitor: true,
        body,
        publishedAt: new Date().toISOString(),
        likes: 0,
      },
    ]);
    setExpanded(true);
    onTransmit?.();
  };

  return (
    <section aria-label="Cross-mission channel" className="space-y-3 border-t border-rule pt-3">
      <p className="font-mono text-micro uppercase tracking-[0.14em] text-muted">Cross-mission channel</p>
      <ul className="space-y-3">
        {topLevel.slice(0, cap).map((comment) => (
          <li key={comment.id} className="space-y-2.5">
            <CommentItem comment={comment} />
            {repliesTo(comment.id).length ? (
              <ul className="ml-4 space-y-2.5 border-l border-rule pl-4">
                {repliesTo(comment.id).map((reply) => (
                  <li key={reply.id}>
                    <CommentItem comment={reply} />
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
      {hidden > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="rounded-[2px] font-mono text-label uppercase tracking-wider text-muted hover:text-text"
        >
          + {hidden} more {hidden === 1 ? "transmission" : "transmissions"}
        </button>
      ) : null}
      <CommentComposer onSubmit={transmit} />
    </section>
  );
}
