"use client";

export function Hashtag({ tag, onSelect }: { tag: string; onSelect?: (tag: string) => void }) {
  if (!onSelect) return <span className="border-2 border-rule bg-amber/40 px-1.5 font-mono text-meta font-bold text-ink">{tag}</span>;
  return (
    <button
      type="button"
      onClick={() => onSelect(tag)}
      className="nb-press-sm border-2 border-rule bg-panel px-1.5 font-mono text-meta font-bold text-ink hover:bg-amber"
      aria-label={`Filter feed by ${tag}`}
    >
      {tag}
    </button>
  );
}
