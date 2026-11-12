import type { EraId, PlanetId, SignalStatus } from "@/data/types";

export const PLANETS: { id: PlanetId; label: string; glyph: string }[] = [
  { id: "moon", label: "Moon", glyph: "🌙" },
  { id: "mars", label: "Mars", glyph: "🔴" },
];

export const ERAS: { id: EraId; label: string; range: string; years: [number, number] }[] = [
  { id: "apollo-viking", label: "Apollo / Viking", range: "1960s–1970s", years: [1960, 1979] },
  { id: "pathfinder-mer", label: "Pathfinder / MER", range: "1990s–2000s", years: [1990, 2009] },
  { id: "modern", label: "Curiosity / Perseverance / Ingenuity", range: "2010s–2020s", years: [2010, 2029] },
];

export const STATUSES: { id: SignalStatus; label: string; hint: string }[] = [
  { id: "signal-lost", label: "Signal Lost", hint: "Decommissioned, no carrier" },
  { id: "still-passive", label: "Still Passive", hint: "No power, still responding" },
  { id: "partially-salvaged", label: "Partially Salvaged", hint: "Components removed" },
];

export function eraForYear(year: number): EraId {
  const match = ERAS.find(({ years: [from, to] }) => year >= from && year <= to);
  if (!match) throw new RangeError(`No mission era covers ${year}`);
  return match.id;
}
