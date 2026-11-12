import type { MissionLogEntry } from "@/data/types";
import { formatMissionDate } from "@/lib/format";

export function MissionLog({ entries, limit = 4 }: { entries: MissionLogEntry[]; limit?: number }) {
  const shown = entries.slice(-limit);
  return (
    <ol className="relative space-y-4 border-l-2 border-rule pl-5">
      {shown.map((e) => (
        <li key={`${e.date}-${e.title}`} className="relative">
          <span aria-hidden className="absolute -left-[27px] top-1 h-3 w-3 border-2 border-rule bg-cyan" />
          <p className="font-mono text-label uppercase tracking-wider text-muted">
            <time dateTime={e.date}>{formatMissionDate(e.date)}</time>
            <span className="mx-1.5">/</span>
            <span className="bg-cyan px-1 font-bold text-ink">{e.kind.replace("-", " ")}</span>
          </p>
          <p className="mt-0.5 font-mono text-small font-bold text-text">{e.title}</p>
          <p className="font-mono text-meta leading-relaxed text-text">{e.detail}</p>
        </li>
      ))}
    </ol>
  );
}
