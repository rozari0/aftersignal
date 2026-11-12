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

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 4;

export function clampZoom(zoom: number): number {
  return clamp(zoom, MIN_ZOOM, MAX_ZOOM);
}

/**
 * Clamp a pan offset (px, applied after scaling about the centre) so the map edge never
 * pulls inside the viewport: at most half of the overflow on each axis.
 */
export function clampTranslate(t: { x: number; y: number }, zoom: number, width: number, height: number): { x: number; y: number } {
  const maxX = (width * (zoom - 1)) / 2;
  const maxY = (height * (zoom - 1)) / 2;
  // `+ 0` normalises -0 to 0 so callers (and tests) see a clean zero.
  return { x: clamp(t.x, -maxX, maxX) + 0, y: clamp(t.y, -maxY, maxY) + 0 };
}
