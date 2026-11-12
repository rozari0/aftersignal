import { describe, expect, it } from "vitest";
import { clampTranslate, clampZoom, projectToPercent } from "@/lib/geo";

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

describe("map bounds", () => {
  it("clamps zoom to 1-4", () => {
    expect(clampZoom(0.5)).toBe(1);
    expect(clampZoom(9)).toBe(4);
    expect(clampZoom(2.5)).toBe(2.5);
  });
  it("centres at zoom 1", () => {
    expect(clampTranslate({ x: 500, y: 200 }, 1, 1000, 500)).toEqual({ x: 0, y: 0 });
  });
  it("clamps pan to half the overflow", () => {
    expect(clampTranslate({ x: 900, y: 300 }, 2, 1000, 500)).toEqual({ x: 500, y: 250 });
    expect(clampTranslate({ x: -900, y: -300 }, 2, 1000, 500)).toEqual({ x: -500, y: -250 });
  });
  it("keeps in-range pans untouched", () => {
    expect(clampTranslate({ x: 100, y: -50 }, 2, 1000, 500)).toEqual({ x: 100, y: -50 });
  });
});
