import Link from "next/link";
import { EquipmentAvatar } from "@/components/equipment/equipment-avatar";
import { VerifiedBadge } from "@/components/equipment/verified-badge";
import { profileById } from "@/data";
import type { Comment } from "@/data/types";
import { formatMissionDate } from "@/lib/format";

export function CommentItem({ comment }: { comment: Comment }) {
  const profile = comment.authorId === "visitor" ? null : profileById[comment.authorId];

  return (
    <div className="flex gap-2.5">
      {profile ? (
        <Link href={`/equipment/${profile.id}`} aria-label={`${profile.displayName} profile`} className="rounded-full">
          <EquipmentAvatar profile={profile} size="sm" />
        </Link>
      ) : (
        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-dashed border-muted/60 font-mono text-body-sm text-muted"
        >
          ⊕
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-1.5 text-small">
          {profile ? (
            <>
              <Link href={`/equipment/${profile.id}`} className="font-semibold text-text hover:underline">
                {profile.displayName}
              </Link>
              <VerifiedBadge />
              <span className="font-mono text-label text-muted">@{profile.handle}</span>
            </>
          ) : (
            <span className="font-mono text-meta text-muted">@visitor · Earth</span>
          )}
          <span className="font-mono text-label text-muted">
            · <time dateTime={comment.publishedAt}>{formatMissionDate(comment.publishedAt)}</time>
          </span>
        </p>
        <p className="mt-0.5 text-body-sm leading-relaxed text-text/90">{comment.body}</p>
      </div>
    </div>
  );
}
