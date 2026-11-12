import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { profiles, profileById } from "@/data";
import { eraForYear } from "@/data/taxonomy";

describe("profile integrity", () => {
  it("has unique ids and a complete lookup", () => {
    expect(new Set(profiles.map((p) => p.id)).size).toBe(profiles.length);
    expect(Object.keys(profileById)).toHaveLength(profiles.length);
    expect(new Set(profiles.map((p) => p.handle)).size).toBe(profiles.length);
  });

  it("has six featured and four catalog profiles", () => {
    expect(profiles.filter((p) => p.tier === "featured")).toHaveLength(6);
    expect(profiles.filter((p) => p.tier === "catalog")).toHaveLength(4);
  });

  it("has complete, sourced telemetry", () => {
    for (const p of profiles) {
      const minSources = p.tier === "featured" ? 3 : 2;
      expect(p.telemetry.sources.length, p.id).toBeGreaterThanOrEqual(minSources);
      expect(p.telemetry.purpose.length, p.id).toBeGreaterThan(20);
      expect(p.telemetry.readings.length, p.id).toBeGreaterThan(0);
      expect(p.telemetry.missionLog.length, p.id).toBeGreaterThanOrEqual(2);
      expect(p.telemetry.coordinates.lat).toBeGreaterThanOrEqual(-90);
      expect(p.telemetry.coordinates.lat).toBeLessThanOrEqual(90);
      expect(p.telemetry.coordinates.lon).toBeGreaterThanOrEqual(-180);
      expect(p.telemetry.coordinates.lon).toBeLessThanOrEqual(180);
      expect(p.bio.length, p.id).toBeGreaterThan(40);
      for (const s of p.telemetry.sources) expect(s.url, p.id).toMatch(/^https:\/\//);
    }
  });

  it("keeps mission logs chronological and within the timeline", () => {
    for (const p of profiles) {
      const dates = p.telemetry.missionLog.map((e) => e.date);
      expect([...dates].sort(), p.id).toEqual(dates);
      if (p.telemetry.launchDate && p.telemetry.landingDate) {
        expect(p.telemetry.launchDate < p.telemetry.landingDate, p.id).toBe(true);
      }
      if (p.telemetry.lastContact && p.telemetry.landingDate) {
        expect(p.telemetry.landingDate <= p.telemetry.lastContact, p.id).toBe(true);
      }
    }
  });

  it("matches each era to the landing year", () => {
    for (const p of profiles) {
      const year = new Date(p.telemetry.landingDate!).getUTCFullYear();
      expect(eraForYear(year), p.id).toBe(p.era);
    }
  });

  it("vendors every image with a NASA credit", () => {
    for (const image of profiles.flatMap((p) => [p.avatar, p.cover])) {
      expect(image.src.startsWith("/images/")).toBe(true);
      expect(image.credit).toMatch(/NASA/);
      expect(existsSync(join(process.cwd(), "public", image.src)), image.src).toBe(true);
    }
  });
});
