import type { Comment, EquipmentId, EquipmentProfile, SocialPost } from "@/data/types";
import { comments as rawComments } from "@/data/comments";
import { posts as rawPosts } from "@/data/posts";
import { opportunity } from "@/data/profiles/opportunity";
import { ingenuity } from "@/data/profiles/ingenuity";
import { surveyor3 } from "@/data/profiles/surveyor-3";
import { apollo11DescentStage } from "@/data/profiles/apollo-11-descent-stage";
import { apollo11Retroreflector } from "@/data/profiles/apollo-11-retroreflector";
import { sojourner } from "@/data/profiles/sojourner";
import { catalogProfiles } from "@/data/profiles/catalog";

export const profiles: EquipmentProfile[] = [
  opportunity,
  ingenuity,
  surveyor3,
  apollo11DescentStage,
  apollo11Retroreflector,
  sojourner,
  ...catalogProfiles,
];

export const profileById = Object.fromEntries(profiles.map((p) => [p.id, p])) as Record<
  EquipmentId,
  EquipmentProfile
>;

const byDateAsc = <T extends { publishedAt: string }>(a: T, b: T) => a.publishedAt.localeCompare(b.publishedAt);

export const comments: Comment[] = [...rawComments].sort(byDateAsc);

export const commentsByPost: Record<string, Comment[]> = Object.fromEntries(
  rawPosts.map((post) => [post.id, comments.filter((c) => c.postId === post.id)]),
);

/** Posts with `metrics.replies` derived from the comment data, so counts never drift. */
export const posts: SocialPost[] = rawPosts.map((post) => ({
  ...post,
  metrics: { ...post.metrics, replies: commentsByPost[post.id].length },
}));

export const postById: Record<string, SocialPost> = Object.fromEntries(posts.map((p) => [p.id, p]));

/** Every equipment id has an entry, newest post first. */
export const postsByAuthor = Object.fromEntries(
  profiles.map((profile) => [
    profile.id,
    posts.filter((p) => p.authorId === profile.id).sort((a, b) => byDateAsc(b, a)),
  ]),
) as Record<EquipmentId, SocialPost[]>;
