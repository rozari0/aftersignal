import { describe, expect, it } from "vitest";
import { projectToPercent } from "@/lib/geo";

describe("projectToPercent", () => {
  it("puts the equator and prime meridian at the centre", () => {
    expect(projectToPercent({ lat: 0, lon: 0 })).toEqual({ x: 50, y: 50 });
  });
  it("maps the corners", () => {
    expect(projectToPercent({ lat: 90, lon: -180 })).toEqual({ x: 0, y: 0 });
    expect(projectToPercent({ lat: -90, lon: 180 })).toEqual({ x: 100, y: 100 });
  });
  it("normalizes 0-360 longitudes", () => {
    expect(projectToPercent({ lat: -1.9462, lon: 354.4734 }).x).toBeCloseTo(48.465, 3);
  });
  it("places Apollo 11 at Tranquility Base", () => {
    const p = projectToPercent({ lat: 0.6741, lon: 23.473 });
    expect(p.x).toBeCloseTo(56.52, 2);
    expect(p.y).toBeCloseTo(49.63, 2);
  });
  it("clamps out-of-range latitude", () => {
    expect(projectToPercent({ lat: 95, lon: 0 }).y).toBe(0);
  });
});
