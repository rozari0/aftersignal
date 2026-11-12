import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { comments, commentsByPost, postById, posts, postsByAuthor, profileById, profiles } from "@/data";
import { eraForYear } from "@/data/taxonomy";

describe("profile integrity", () => {
  it("has unique ids and a complete lookup", () => {
    expect(new Set(profiles.map((p) => p.id)).size).toBe(profiles.length);
    expect(Object.keys(profileById)).toHaveLength(profiles.length);
    expect(new Set(profiles.map((p) => p.handle)).size).toBe(profiles.length);
  });

  it("has six featured and four catalog profiles", () => {
    expect(profiles.filter((p) => p.tier === "featured")).toHaveLength(6);
    expect(profiles.filter((p) => p.tier === "catalog")).toHaveLength(4);
  });

  it("has complete, sourced telemetry", () => {
    for (const p of profiles) {
      const minSources = p.tier === "featured" ? 3 : 2;
      expect(p.telemetry.sources.length, p.id).toBeGreaterThanOrEqual(minSources);
      expect(p.telemetry.purpose.length, p.id).toBeGreaterThan(20);
      expect(p.telemetry.readings.length, p.id).toBeGreaterThan(0);
      expect(p.telemetry.missionLog.length, p.id).toBeGreaterThanOrEqual(2);
      expect(p.telemetry.coordinates.lat).toBeGreaterThanOrEqual(-90);
      expect(p.telemetry.coordinates.lat).toBeLessThanOrEqual(90);
      expect(p.telemetry.coordinates.lon).toBeGreaterThanOrEqual(-180);
      expect(p.telemetry.coordinates.lon).toBeLessThanOrEqual(180);
      expect(p.bio.length, p.id).toBeGreaterThan(40);
      for (const s of p.telemetry.sources) expect(s.url, p.id).toMatch(/^https:\/\//);
    }
  });

  it("keeps mission logs chronological and within the timeline", () => {
    for (const p of profiles) {
      const dates = p.telemetry.missionLog.map((e) => e.date);
      expect([...dates].sort(), p.id).toEqual(dates);
      if (p.telemetry.launchDate && p.telemetry.landingDate) {
        expect(p.telemetry.launchDate < p.telemetry.landingDate, p.id).toBe(true);
      }
      if (p.telemetry.lastContact && p.telemetry.landingDate) {
        expect(p.telemetry.landingDate <= p.telemetry.lastContact, p.id).toBe(true);
      }
    }
  });

  it("matches each era to the landing year", () => {
    for (const p of profiles) {
      const year = new Date(p.telemetry.landingDate!).getUTCFullYear();
      expect(eraForYear(year), p.id).toBe(p.era);
    }
  });

  it("vendors every image with a NASA credit", () => {
    for (const image of profiles.flatMap((p) => [p.avatar, p.cover])) {
      expect(image.src.startsWith("/images/")).toBe(true);
      expect(image.credit).toMatch(/NASA/);
      expect(existsSync(join(process.cwd(), "public", image.src)), image.src).toBe(true);
    }
  });
});

describe("post and comment integrity", () => {
  it("has a full content set", () => {
    expect(posts.length).toBeGreaterThanOrEqual(26);
    expect(comments.length).toBeGreaterThanOrEqual(45);
    expect(new Set(posts.map((p) => p.id)).size).toBe(posts.length);
    expect(new Set(comments.map((c) => c.id)).size).toBe(comments.length);
  });

  it("resolves every post author and pinned reference", () => {
    for (const post of posts) {
      expect(profileById[post.authorId], post.id).toBeDefined();
      expect(post.story.body.trim().length, post.id).toBeGreaterThan(20);
      expect(post.telemetry.body.trim().length, post.id).toBeGreaterThan(20);
      expect(post.story.hashtags.length, post.id).toBeGreaterThan(0);
      for (const tag of post.story.hashtags) expect(tag, post.id).toMatch(/^#[A-Za-z0-9]+$/);
    }
    for (const profile of profiles) {
      expect(postById[profile.pinnedPostId], profile.id).toBeDefined();
      expect(postById[profile.lastSignalPostId], profile.id).toBeDefined();
      expect(postById[profile.pinnedPostId].authorId, profile.id).toBe(profile.id);
      expect(postById[profile.pinnedPostId].pinned, profile.id).toBe(true);
      if (profile.status === "signal-lost") {
        expect(postById[profile.lastSignalPostId].topic, profile.id).toBe("last-signal");
      }
      expect(postById[profile.lastSignalPostId].authorId, profile.id).toBe(profile.id);
      expect(posts.filter((p) => p.authorId === profile.id && p.pinned), profile.id).toHaveLength(1);
    }
  });

  it("dates every post inside its author's timeline", () => {
    for (const post of posts) {
      const t = profileById[post.authorId].telemetry;
      expect(post.publishedAt >= (t.launchDate ?? t.landingDate!), post.id).toBe(true);
    }
  });

  it("resolves every comment", () => {
    for (const comment of comments) {
      const post = postById[comment.postId];
      expect(post, comment.id).toBeDefined();
      expect(comment.authorId === "visitor" || profileById[comment.authorId], comment.id).toBeTruthy();
      expect(comment.authorId === "visitor", comment.id).toBe(Boolean(comment.isVisitor));
      expect(comment.publishedAt >= post.publishedAt, comment.id).toBe(true);
      if (comment.replyToId) {
        const parent = comments.find((c) => c.id === comment.replyToId);
        expect(parent?.postId, comment.id).toBe(comment.postId);
        expect(parent?.replyToId, comment.id).toBeUndefined();
      }
    }
    for (const post of posts) expect(commentsByPost[post.id]?.length ?? 0, post.id).toBeGreaterThanOrEqual(1);
  });

  it("indexes posts for every author, newest first", () => {
    for (const profile of profiles) {
      const list = postsByAuthor[profile.id];
      expect(list, profile.id).toBeDefined();
      const dates = list.map((p) => p.publishedAt);
      expect(dates, profile.id).toEqual([...dates].sort().reverse());
    }
  });

  it("labels the Opportunity last transmission as a paraphrase", () => {
    const post = postById[profileById.opportunity.lastSignalPostId];
    expect(post.telemetry.sourceNote ?? "").toMatch(/paraphrase/i);
  });
});
