"use client";

export function Hashtag({ tag, onSelect }: { tag: string; onSelect?: (tag: string) => void }) {
  if (!onSelect) return <span className="font-mono text-meta text-amber/80">{tag}</span>;
  return (
    <button
      type="button"
      onClick={() => onSelect(tag)}
      className="rounded-[2px] font-mono text-meta text-amber/80 transition-colors hover:text-amber"
      aria-label={`Filter feed by ${tag}`}
    >
      {tag}
    </button>
  );
}
