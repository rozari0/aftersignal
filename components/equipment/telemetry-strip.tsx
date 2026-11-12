import type { EquipmentProfile } from "@/data/types";
import { formatActive, formatMass, powerLabel } from "@/lib/telemetry";

/** Compact one-row instrument readout used on feed cards in telemetry mode. */
export function TelemetryStrip({ profile }: { profile: EquipmentProfile }) {
  const items = [
    { label: "Mass", value: formatMass(profile.telemetry.massKg) },
    { label: "Power", value: powerLabel(profile.telemetry.powerSource) },
    { label: "Active", value: formatActive(profile) },
    { label: "Planet", value: profile.planet === "moon" ? "Moon" : "Mars" },
  ];
  return (
    <dl className="grid grid-cols-2 border-2 border-rule bg-panel sm:grid-cols-4">
      {items.map((item, i) => (
        <div key={item.label} className={i > 0 ? "border-rule px-3 py-2 sm:border-l-2" : "px-3 py-2"}>
          <dt className="font-mono text-micro font-bold uppercase tracking-wider text-muted">{item.label}</dt>
          <dd className="font-mono text-small font-bold text-text">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
