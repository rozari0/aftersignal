import Link from "next/link";
import { EquipmentAvatar } from "@/components/equipment/equipment-avatar";
import { PostModeToggle } from "@/components/ghost/post-mode-toggle";
import type { EquipmentProfile, SocialPost } from "@/data/types";
import type { DisplayMode } from "@/lib/mode";
import { cn } from "@/lib/cn";
import { formatMissionDate } from "@/lib/format";
import { formatSiteCoords, statusLabel } from "@/lib/telemetry";

const STATUS_TEXT = { "signal-lost": "text-amber", "still-passive": "text-cyan", "partially-salvaged": "text-rust" } as const;

export function PostHeader({
  post,
  profile,
  mode,
}: {
  post: SocialPost;
  profile: EquipmentProfile;
  mode: DisplayMode;
}) {
  const href = `/equipment/${profile.id}`;
  const telemetry = mode === "telemetry";

  return (
    <header className="flex items-start gap-3">
      <Link href={href} aria-label={`${profile.displayName} profile`} className="rounded-full">
        <EquipmentAvatar profile={profile} />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <Link
            href={href}
            className={cn(
              "truncate hover:underline",
              telemetry ? "font-mono text-[13px] uppercase tracking-wider text-text" : "font-semibold text-text",
            )}
          >
            {telemetry && profile.shortName !== profile.displayName
              ? `${profile.displayName} · ${profile.shortName}`
              : profile.displayName}
          </Link>
          {telemetry ? (
            <span className={cn("font-mono text-[10px] uppercase tracking-wider", STATUS_TEXT[profile.status])}>
              {statusLabel(profile.status)}
            </span>
          ) : (
            <span className="font-mono text-[12px] text-muted">@{profile.handle}</span>
          )}
        </div>
        <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-muted">
          {telemetry ? (
            <>
              {profile.telemetry.coordinates.siteName}
              <span className="mx-1.5 text-rule">/</span>
              {formatSiteCoords(profile)}
            </>
          ) : (
            <>
              <time dateTime={post.publishedAt}>{formatMissionDate(post.publishedAt)}</time>
              {post.story.mood ? <span className="ml-2 normal-case tracking-normal text-muted">feeling {post.story.mood}</span> : null}
            </>
          )}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <PostModeToggle postId={post.id} />
        {telemetry ? (
          <time dateTime={post.publishedAt} className="font-mono text-[11px] text-muted">
            {post.publishedAt}
          </time>
        ) : null}
      </div>
    </header>
  );
}
