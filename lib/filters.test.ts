import { describe, expect, it } from "vitest";
import { DEFAULT_FILTERS, extractHashtags, filterPosts, isDefaultFilters, sortForFeed } from "@/lib/filters";
import type { SocialPost } from "@/data/types";

function makePost(
  id: string,
  authorId: SocialPost["authorId"],
  publishedAt: string,
  opts: Partial<SocialPost> = {},
): SocialPost {
  return {
    id,
    authorId,
    publishedAt,
    metrics: { likes: 0, reposts: 0, replies: 0 },
    story: { body: "test body", hashtags: ["#TestTag"] },
    telemetry: { headline: "test", body: "test telemetry" },
    ...opts,
  };
}

const fixture = [
  makePost("a", "opportunity", "2018-06-10", { pinned: true }),
  makePost("b", "ingenuity", "2024-01-25"),
  makePost("c", "surveyor-3", "1969-11-19", { story: { body: "x", hashtags: ["#Apollo12", "#TestTag"] } }),
];

describe("filterPosts", () => {
  it("returns all for the default filters", () => expect(filterPosts(fixture, DEFAULT_FILTERS)).toHaveLength(3));
  it("filters by planet", () =>
    expect(filterPosts(fixture, { ...DEFAULT_FILTERS, planet: "moon" }).map((p) => p.id)).toEqual(["c"]));
  it("filters by era", () =>
    expect(filterPosts(fixture, { ...DEFAULT_FILTERS, era: "modern" }).map((p) => p.id)).toEqual(["b"]));
  it("filters by status", () =>
    expect(filterPosts(fixture, { ...DEFAULT_FILTERS, status: "partially-salvaged" }).map((p) => p.id)).toEqual(["c"]));
  it("matches hashtags case-insensitively with or without #", () => {
    expect(filterPosts(fixture, { ...DEFAULT_FILTERS, hashtag: "#testtag" })).toHaveLength(3);
    expect(filterPosts(fixture, { ...DEFAULT_FILTERS, hashtag: "apollo12" }).map((p) => p.id)).toEqual(["c"]);
  });
  it("ANDs two filters", () =>
    expect(filterPosts(fixture, { ...DEFAULT_FILTERS, planet: "moon", era: "modern" })).toHaveLength(0));
});

describe("sortForFeed", () => {
  it("puts pinned first, then newest, without mutating", () => {
    const input = [fixture[2], fixture[1], fixture[0]];
    expect(sortForFeed(input).map((p) => p.id)).toEqual(["a", "b", "c"]);
    expect(input.map((p) => p.id)).toEqual(["c", "b", "a"]);
  });
});

describe("extractHashtags", () => {
  it("counts descending, then alphabetically", () =>
    expect(extractHashtags(fixture)).toEqual([
      { tag: "testtag", count: 3 },
      { tag: "apollo12", count: 1 },
    ]));
});

describe("isDefaultFilters", () => {
  it("detects untouched filters", () => {
    expect(isDefaultFilters(DEFAULT_FILTERS)).toBe(true);
    expect(isDefaultFilters({ ...DEFAULT_FILTERS, hashtag: "x" })).toBe(false);
  });
});
