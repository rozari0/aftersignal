import type { TelemetryReading } from "@/data/types";

export function TelemetryGrid({ readings }: { readings: TelemetryReading[] }) {
  if (readings.length === 0) return null;
  return (
    <dl className="grid grid-cols-2 gap-[2px] overflow-hidden border-2 border-rule bg-rule shadow-nb-sm sm:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
      {readings.map((r) => (
        <div key={r.label} className="bg-panel px-3 py-2">
          <dt className="font-mono text-micro font-bold uppercase tracking-wider text-muted">{r.label}</dt>
          <dd className="mt-0.5 font-mono text-body font-bold tabular-nums text-text">
            {r.value}
            {r.unit ? <span className="ml-1 text-label text-muted">{r.unit}</span> : null}
          </dd>
          {r.note ? <dd className="mt-0.5 font-mono text-micro leading-snug text-muted">{r.note}</dd> : null}
        </div>
      ))}
    </dl>
  );
}
