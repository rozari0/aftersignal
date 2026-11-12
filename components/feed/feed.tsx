"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCrossfade } from "@/lib/motion";
import { useMemo, useState } from "react";
import { posts } from "@/data";
import { DEFAULT_FILTERS, filterPosts, isDefaultFilters, normalizeTag, sortForFeed, type FeedFilters } from "@/lib/filters";
import { Button } from "@/components/ui/button";
import { FeedSidebar } from "./feed-sidebar";
import { FilterBar } from "./filter-bar";
import { PostCard } from "./post-card";

export function Feed() {
  const [filters, setFilters] = useState<FeedFilters>(DEFAULT_FILTERS);
  const fade = useCrossfade();
  const visible = useMemo(() => sortForFeed(filterPosts(posts, filters)), [filters]);

  const selectHashtag = (tag: string) => {
    setFilters((f) => ({ ...f, hashtag: normalizeTag(tag) }));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
      <div className="min-w-0 space-y-4">
        <FilterBar filters={filters} onChange={setFilters} />

        <div className="flex min-h-8 flex-wrap items-center gap-3 font-mono text-label font-bold uppercase tracking-wider text-text">
          <span aria-live="polite">
            {visible.length} {visible.length === 1 ? "transmission" : "transmissions"}
          </span>
          {filters.hashtag ? (
            <button
              type="button"
              onClick={() => setFilters((f) => ({ ...f, hashtag: undefined }))}
              className="nb-press-sm flex items-center gap-1 border-2 border-rule bg-amber px-2 py-0.5 normal-case text-ink"
              aria-label={`Remove hashtag filter #${filters.hashtag}`}
            >
              #{filters.hashtag}
              <X aria-hidden size={12} />
            </button>
          ) : null}
          {!isDefaultFilters(filters) ? (
            <button type="button" onClick={() => setFilters(DEFAULT_FILTERS)} className="underline underline-offset-4 hover:bg-amber">
              Reset filters
            </button>
          ) : null}
        </div>

        {visible.length === 0 ? (
          <div className="space-y-4 border-2 border-dashed border-rule bg-panel p-8 text-center">
            <p className="font-head text-body-lg font-bold uppercase text-text">No signal on this frequency</p>
            <p className="text-body-sm text-muted">Nothing matches every filter at once. Widen the search.</p>
            <Button variant="ghost" onClick={() => setFilters(DEFAULT_FILTERS)}>
              Reset filters
            </Button>
          </div>
        ) : (
          <ul className="space-y-6">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((post) => (
                <motion.li
                  key={post.id}
                  layout="position"
                  {...fade}
                >
                  <PostCard post={post} commentLimit={2} onHashtag={selectHashtag} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <FeedSidebar onHashtag={selectHashtag} />
    </div>
  );
}
