const countFormat = new Intl.NumberFormat("en-US");
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatCount(n: number): string {
  return countFormat.format(n);
}

export function formatMass(kg: number): string {
  return `${countFormat.format(kg)} kg`;
}

/** Format an ISO date (YYYY-MM-DD or full ISO) as "10 Jun 2018", pinned to UTC. */
export function formatMissionDate(iso: string): string {
  const date = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  return dateFormat.format(date);
}

export function formatCoord(value: number, axis: "lat" | "lon"): string {
  const hemisphere = axis === "lat" ? (value < 0 ? "S" : "N") : value < 0 ? "W" : "E";
  return `${Math.abs(value).toFixed(4)}°${hemisphere}`;
}
