import { PERSONA_RULES, personas } from "@/data/personas";
import type { EquipmentProfile } from "@/data/types";
import type { DisplayMode } from "@/lib/mode";

/** Compact, model-readable fact sheet built from the same data the profile page renders. */
export function factSheet(profile: EquipmentProfile): string {
  const t = profile.telemetry;
  const c = t.coordinates;
  const lines = [
    `Name: ${profile.displayName} (${profile.shortName}), @${profile.handle}`,
    `Mission: ${t.missionName}, ${t.agency}`,
    `World: ${profile.planet === "moon" ? "the Moon" : "Mars"}; resting at ${c.siteName}, ${c.region} (${c.lat}, ${c.lon}, ${c.confidence})`,
    t.launchDate && `Launched: ${t.launchDate}`,
    t.landingDate && `Landed: ${t.landingDate}`,
    `Last contact: ${t.lastContact ?? "none recorded"}`,
    t.daysActive != null && `Active: ${t.daysActive} ${t.activeUnit}`,
    `Mass: about ${t.massKg} kg${t.massNote ? ` (${t.massNote})` : ""}`,
    `Power: ${t.powerSource}, ${t.powerDetail}`,
    `Purpose: ${t.purpose}`,
    `Heritage status: ${t.heritageStatus}`,
    `Readings: ${t.readings.map((r) => `${r.label} ${r.value}${r.unit ? ` ${r.unit}` : ""}`).join("; ")}`,
    "Mission log:",
    ...t.missionLog.map((e) => `- ${e.date}: ${e.title}. ${e.detail}`),
    profile.relations?.length &&
      `Relations: ${profile.relations.map((r) => `${r.id} (${r.label})`).join(", ")}`,
  ];
  return lines.filter(Boolean).join("\n");
}

const MODE_STYLE: Record<DisplayMode, string> = {
  story: "The visitor has Story Mode on: answer in your personal, social voice.",
  telemetry:
    "The visitor has Telemetry Mode on: answer as a terse instrument readout. Lead with facts and figures, keep personality to a dry aside at most.",
};

export function buildSystemPrompt(profile: EquipmentProfile, mode: DisplayMode = "story"): string {
  return [personas[profile.id], PERSONA_RULES, MODE_STYLE[mode], `Fact sheet:\n${factSheet(profile)}`].join("\n\n");
}
