import type { TelemetryContent } from "@/data/types";
import { TelemetryGrid } from "./telemetry-grid";

export function TelemetryBody({ telemetry }: { telemetry: TelemetryContent }) {
  return (
    <div className="space-y-3">
      <p className="inline-block bg-ink px-1.5 py-0.5 font-mono text-meta font-bold uppercase tracking-[0.08em] text-cyan">{telemetry.headline}</p>
      <p className="font-mono text-small leading-relaxed text-text">{telemetry.body}</p>
      {telemetry.readings?.length ? <TelemetryGrid readings={telemetry.readings} /> : null}
      {telemetry.sourceNote ? (
        <p className="border-2 border-dashed border-rule px-3 py-2 font-mono text-label italic leading-relaxed text-muted">
          {telemetry.sourceNote}
        </p>
      ) : null}
    </div>
  );
}
