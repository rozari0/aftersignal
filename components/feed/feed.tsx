"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { posts } from "@/data";
import { DEFAULT_FILTERS, filterPosts, isDefaultFilters, normalizeTag, sortForFeed, type FeedFilters } from "@/lib/filters";
import { Button } from "@/components/ui/button";
import { FeedSidebar } from "./feed-sidebar";
import { FilterBar } from "./filter-bar";
import { PostCard } from "./post-card";

export function Feed() {
  const [filters, setFilters] = useState<FeedFilters>(DEFAULT_FILTERS);
  const visible = useMemo(() => sortForFeed(filterPosts(posts, filters)), [filters]);

  const selectHashtag = (tag: string) => {
    setFilters((f) => ({ ...f, hashtag: normalizeTag(tag) }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-4">
        <FilterBar filters={filters} onChange={setFilters} />

        <div className="flex min-h-7 flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-muted">
          <span aria-live="polite">
            {visible.length} {visible.length === 1 ? "transmission" : "transmissions"}
          </span>
          {filters.hashtag ? (
            <button
              type="button"
              onClick={() => setFilters((f) => ({ ...f, hashtag: undefined }))}
              className="flex items-center gap-1 rounded-full border border-amber/60 px-2 py-0.5 normal-case text-amber"
              aria-label={`Remove hashtag filter #${filters.hashtag}`}
            >
              #{filters.hashtag}
              <X aria-hidden size={12} />
            </button>
          ) : null}
          {!isDefaultFilters(filters) ? (
            <button type="button" onClick={() => setFilters(DEFAULT_FILTERS)} className="rounded-[2px] hover:text-text">
              Reset filters
            </button>
          ) : null}
        </div>

        {visible.length === 0 ? (
          <div className="space-y-3 rounded-[3px] border border-dashed border-rule p-8 text-center">
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">No signal on this frequency</p>
            <p className="text-[14px] text-muted">Nothing matches every filter at once. Widen the search.</p>
            <Button variant="ghost" onClick={() => setFilters(DEFAULT_FILTERS)}>
              Reset filters
            </Button>
          </div>
        ) : (
          <ul className="space-y-4">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((post) => (
                <motion.li
                  key={post.id}
                  layout="position"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
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
