import type { TelemetryContent } from "@/data/types";
import { TelemetryGrid } from "./telemetry-grid";

export function TelemetryBody({ telemetry }: { telemetry: TelemetryContent }) {
  return (
    <div className="space-y-3">
      <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-cyan">{telemetry.headline}</p>
      <p className="font-mono text-[13px] leading-relaxed text-text/90">{telemetry.body}</p>
      {telemetry.readings?.length ? <TelemetryGrid readings={telemetry.readings} /> : null}
      {telemetry.sourceNote ? (
        <p className="border-l-2 border-amber/50 pl-3 font-mono text-[11px] italic leading-relaxed text-muted">
          {telemetry.sourceNote}
        </p>
      ) : null}
    </div>
  );
}
