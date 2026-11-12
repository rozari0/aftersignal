export interface PercentPoint {
  x: number;
  y: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Project planetocentric lat/lon (east-positive) onto an equirectangular map as 0–100 percentages. */
export function projectToPercent({ lat, lon }: { lat: number; lon: number }): PercentPoint {
  // Wrap into [-180, 180); keep +180 itself so the right edge stays reachable.
  const wrapped = lon === 180 ? 180 : ((((lon + 180) % 360) + 360) % 360) - 180;
  return {
    x: ((wrapped + 180) / 360) * 100,
    y: ((90 - clamp(lat, -90, 90)) / 180) * 100,
  };
}
