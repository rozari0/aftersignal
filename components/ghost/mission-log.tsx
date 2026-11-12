import type { MissionLogEntry } from "@/data/types";
import { formatMissionDate } from "@/lib/format";

export function MissionLog({ entries, limit = 4 }: { entries: MissionLogEntry[]; limit?: number }) {
  const shown = entries.slice(-limit);
  return (
    <ol className="relative space-y-3 border-l border-rule pl-4">
      {shown.map((e) => (
        <li key={`${e.date}-${e.title}`} className="relative">
          <span aria-hidden className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full border border-cyan bg-void" />
          <p className="font-mono text-label uppercase tracking-wider text-muted">
            <time dateTime={e.date}>{formatMissionDate(e.date)}</time>
            <span className="mx-1.5 text-rule">/</span>
            <span className="text-cyan">{e.kind.replace("-", " ")}</span>
          </p>
          <p className="font-mono text-small text-text">{e.title}</p>
          <p className="font-mono text-meta leading-relaxed text-muted">{e.detail}</p>
        </li>
      ))}
    </ol>
  );
}
