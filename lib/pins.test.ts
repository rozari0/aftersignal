import { describe, expect, it } from "vitest";
import { profiles } from "@/data";
import { groupPins } from "@/lib/pins";

describe("groupPins", () => {
  it("merges the two Tranquility Base objects and nothing else on the Moon", () => {
    const moon = groupPins(profiles.filter((p) => p.planet === "moon"));
    expect(moon).toHaveLength(3);
    const tranquility = moon.find((g) => g.profiles.length === 2)!;
    expect(tranquility.profiles.map((p) => p.id).sort()).toEqual(["apollo-11-descent-stage", "apollo-11-retroreflector"]);
  });
  it("flips labels away from the right edge and from close neighbours", () => {
    const mars = groupPins(profiles.filter((p) => p.planet === "mars"));
    const side = (id: string) => mars.find((g) => g.key === id)!.labelSide;
    expect(side("spirit")).toBe("left");
    expect(side("viking-1")).toBe("left");
    expect(side("opportunity")).toBe("right");
  });
  it("keeps every Mars site separate", () => {
    expect(groupPins(profiles.filter((p) => p.planet === "mars"))).toHaveLength(6);
  });
});
