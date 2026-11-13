import { describe, expect, it } from "vitest";
import { collectSources, providerFor } from "@/lib/sources";

describe("collectSources", () => {
  const groups = collectSources();
  const urls = groups.flatMap((g) => g.records.map((r) => r.url.toLowerCase()));

  it("assigns every cited URL to a known provider", () => {
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) expect(() => providerFor(url)).not.toThrow();
  });

  it("lists each record once", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("ties every record to equipment or a base map", () => {
    for (const record of groups.flatMap((g) => g.records)) {
      expect(record.equipment.length + record.planets.length).toBeGreaterThan(0);
    }
  });

  it("includes both surface base maps and the image library", () => {
    const ids = groups.map((g) => g.id);
    expect(ids).toEqual(expect.arrayContaining(["nasa-images", "nasa-svs", "usgs", "nssdca"]));
  });
});
