import { describe, expect, it } from "vitest";
import { eraForYear } from "@/data/taxonomy";

describe("eraForYear", () => {
  it.each([[1969, "apollo-viking"], [1997, "pathfinder-mer"], [2004, "pathfinder-mer"], [2021, "modern"]])(
    "maps %i to %s", (year, era) => expect(eraForYear(year)).toBe(era)
  );
});
