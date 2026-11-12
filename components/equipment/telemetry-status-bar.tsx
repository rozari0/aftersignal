import type { EquipmentProfile } from "@/data/types";
import { formatMissionDate } from "@/lib/format";
import { formatActive, formatMass, formatSiteCoords, powerLabel } from "@/lib/telemetry";

function lastContactValue(profile: EquipmentProfile): { value: string; note?: string } {
  const { lastContact } = profile.telemetry;
  if (lastContact) return { value: formatMissionDate(lastContact) };
  if (profile.status === "still-passive") return { value: "Still responding", note: "Passive: answers every laser pulse" };
  return { value: "—", note: "No single published final-contact date" };
}

/** Always-visible instrument readout: the "Telemetry Status Bar" from the brief. */
export function TelemetryStatusBar({ profile }: { profile: EquipmentProfile }) {
  const t = profile.telemetry;
  const last = lastContactValue(profile);
  const cells = [
    { label: "Mass", value: formatMass(t.massKg), note: t.massNote },
    { label: "Power source", value: powerLabel(t.powerSource), note: t.powerDetail },
    { label: "Landing site", value: t.coordinates.siteName, note: `${t.coordinates.region} · ${formatSiteCoords(profile)}` },
    { label: "Active", value: formatActive(profile), note: t.landingDate ? `Landed ${formatMissionDate(t.landingDate)}` : undefined },
    { label: "Last contact", value: last.value, note: last.note },
    { label: "Launched", value: t.launchDate ? formatMissionDate(t.launchDate) : "—", note: t.agency },
  ];

  return (
    <section aria-label="Telemetry status" className="nb-card overflow-hidden bg-rule">
      <dl className="grid grid-cols-1 gap-[2px] min-[480px]:grid-cols-2 lg:grid-cols-3">
        {cells.map((c) => (
          <div key={c.label} className="bg-panel px-4 py-3">
            <dt className="font-mono text-micro font-bold uppercase tracking-[0.1em] text-muted">{c.label}</dt>
            <dd className="mt-1 font-head text-body-lg font-bold tabular-nums text-text">{c.value}</dd>
            {c.note ? <dd className="mt-0.5 font-mono text-label leading-snug text-muted">{c.note}</dd> : null}
          </div>
        ))}
      </dl>
    </section>
  );
}
