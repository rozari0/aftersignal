import { profileById } from "@/data";
import type { EraId, PlanetId, SignalStatus, SocialPost } from "@/data/types";

export interface FeedFilters {
  planet: PlanetId | "all";
  era: EraId | "all";
  status: SignalStatus | "all";
  hashtag?: string;
}

export const DEFAULT_FILTERS: FeedFilters = { planet: "all", era: "all", status: "all" };

/** Lowercase and strip a leading '#', so "#StillHere", "stillhere" and "#stillhere" all match. */
export const normalizeTag = (tag: string) => tag.replace(/^#/, "").toLowerCase();

export function isDefaultFilters(filters: FeedFilters): boolean {
  return filters.planet === "all" && filters.era === "all" && filters.status === "all" && !filters.hashtag;
}

export function filterPosts(posts: SocialPost[], filters: FeedFilters): SocialPost[] {
  const tag = filters.hashtag ? normalizeTag(filters.hashtag) : null;
  return posts.filter((post) => {
    const author = profileById[post.authorId];
    if (filters.planet !== "all" && author.planet !== filters.planet) return false;
    if (filters.era !== "all" && author.era !== filters.era) return false;
    if (filters.status !== "all" && author.status !== filters.status) return false;
    if (tag && !post.story.hashtags.some((h) => normalizeTag(h) === tag)) return false;
    return true;
  });
}

/** Pinned first, then newest. Returns a new array. */
export function sortForFeed(posts: SocialPost[]): SocialPost[] {
  return [...posts].sort(
    (a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || b.publishedAt.localeCompare(a.publishedAt),
  );
}

export function extractHashtags(posts: SocialPost[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) for (const h of post.story.hashtags) counts.set(normalizeTag(h), (counts.get(normalizeTag(h)) ?? 0) + 1);
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
