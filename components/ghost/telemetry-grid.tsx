import type { TelemetryReading } from "@/data/types";

export function TelemetryGrid({ readings }: { readings: TelemetryReading[] }) {
  if (readings.length === 0) return null;
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[2px] border border-rule bg-rule sm:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
      {readings.map((r) => (
        <div key={r.label} className="bg-panel px-3 py-2">
          <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">{r.label}</dt>
          <dd className="mt-0.5 font-mono text-[15px] text-text">
            {r.value}
            {r.unit ? <span className="ml-1 text-[11px] text-muted">{r.unit}</span> : null}
          </dd>
          {r.note ? <dd className="mt-0.5 font-mono text-[10px] leading-snug text-muted">{r.note}</dd> : null}
        </div>
      ))}
    </dl>
  );
}
