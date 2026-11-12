import { STATUSES } from "@/data/taxonomy";
import type { EquipmentProfile, MissionLogEntry, PowerSource, SignalStatus } from "@/data/types";
import { formatCoord, formatCount, formatMass } from "@/lib/format";

export const statusLabel = (status: SignalStatus) => STATUSES.find((s) => s.id === status)!.label;

const POWER: Record<PowerSource, string> = { solar: "Solar", rtg: "RTG", battery: "Battery", passive: "None (passive)" };
export const powerLabel = (power: PowerSource) => POWER[power];

export function formatActive(profile: EquipmentProfile): string {
  const { daysActive, activeUnit } = profile.telemetry;
  if (daysActive === null) return profile.status === "still-passive" ? "Ongoing" : "—";
  return `${formatCount(daysActive)} ${activeUnit}`;
}

export function formatSiteCoords(profile: EquipmentProfile): string {
  const { lat, lon, confidence } = profile.telemetry.coordinates;
  return `${formatCoord(lat, "lat")}  ${formatCoord(lon, "lon")}${confidence === "approximate" ? " (approx.)" : ""}`;
}

export { formatMass };

/** Mission-log entries on or before a date: the context a post was written in. */
export function logAsOf(entries: MissionLogEntry[], isoDate: string): MissionLogEntry[] {
  return entries.filter((e) => e.date <= isoDate.slice(0, 10));
}
