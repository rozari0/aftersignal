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
    <section aria-label="Telemetry status" className="overflow-hidden rounded-[3px] border border-rule bg-rule">
      <dl className="grid grid-cols-1 gap-px min-[480px]:grid-cols-2 lg:grid-cols-3">
        {cells.map((c) => (
          <div key={c.label} className="bg-panel px-4 py-3">
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{c.label}</dt>
            <dd className="mt-1 font-mono text-[16px] text-text">{c.value}</dd>
            {c.note ? <dd className="mt-0.5 font-mono text-[11px] leading-snug text-muted">{c.note}</dd> : null}
          </div>
        ))}
      </dl>
    </section>
  );
}
