"use client";

import { ERAS, PLANETS, STATUSES } from "@/data/taxonomy";
import type { FeedFilters } from "@/lib/filters";
import { cn } from "@/lib/cn";

type Option<V extends string> = { value: V | "all"; label: string; hint?: string; keepCase?: boolean };

function ChipRow<K extends "planet" | "era" | "status">({
  label,
  field,
  options,
  filters,
  onChange,
}: {
  label: string;
  field: K;
  options: Option<Exclude<FeedFilters[K], undefined>>[];
  filters: FeedFilters;
  onChange: (next: FeedFilters) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-1.5">
      <span className="w-full font-head text-label font-bold uppercase tracking-wide text-text sm:w-32">{label}</span>
      {options.map((opt) => {
        const active = filters[field] === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            title={opt.hint}
            onClick={() => onChange({ ...filters, [field]: opt.value })}
            className={cn(
              "border-2 px-2 py-0.5 font-mono text-label font-bold tracking-wider",
              opt.keepCase ? "normal-case" : "uppercase",
              active ? "border-rule bg-amber text-ink shadow-nb-sm" : "border-transparent text-ink hover:border-rule hover:bg-sunk",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function FilterBar({ filters, onChange }: { filters: FeedFilters; onChange: (next: FeedFilters) => void }) {
  return (
    <div className="nb-card space-y-2.5 bg-panel p-3 sm:p-4">
      <ChipRow
        label="Planetary body"
        field="planet"
        filters={filters}
        onChange={onChange}
        options={[{ value: "all", label: "All" }, ...PLANETS.map((p) => ({ value: p.id, label: `${p.glyph} ${p.label}` }))]}
      />
      <ChipRow
        label="Mission era"
        field="era"
        filters={filters}
        onChange={onChange}
        options={[{ value: "all", label: "All" }, ...ERAS.map((e) => ({ value: e.id, label: e.range, hint: e.label, keepCase: true }))]}
      />
      <ChipRow
        label="Status"
        field="status"
        filters={filters}
        onChange={onChange}
        options={[{ value: "all", label: "All" }, ...STATUSES.map((s) => ({ value: s.id, label: s.label, hint: s.hint }))]}
      />
    </div>
  );
}
