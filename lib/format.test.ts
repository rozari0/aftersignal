import { describe, expect, it } from "vitest";
import { formatCoord, formatCount, formatMass, formatMissionDate } from "@/lib/format";

describe("format", () => {
  it("formats mass", () => expect(formatMass(185)).toBe("185 kg"));
  it("formats counts with separators", () => expect(formatCount(5111)).toBe("5,111"));
  it("formats dates without timezone drift", () => expect(formatMissionDate("2018-06-10")).toBe("10 Jun 2018"));
  it("formats signed coordinates", () => {
    expect(formatCoord(0.6741, "lat")).toBe("0.6741°N");
    expect(formatCoord(-1.9462, "lat")).toBe("1.9462°S");
    expect(formatCoord(-5.5266, "lon")).toBe("5.5266°W");
    expect(formatCoord(77.4508, "lon")).toBe("77.4508°E");
  });
});
