import { describe, expect, it } from "vitest";
import { nextOverride, readStoredMode, resolvePostMode, writeStoredMode } from "@/lib/mode";

describe("resolvePostMode", () => {
  it("inherits unless overridden", () => {
    expect(resolvePostMode("story", "inherit")).toBe("story");
    expect(resolvePostMode("telemetry", "inherit")).toBe("telemetry");
    expect(resolvePostMode("story", "telemetry")).toBe("telemetry");
    expect(resolvePostMode("telemetry", "story")).toBe("story");
  });
});

describe("nextOverride", () => {
  it("cycles inherit → story → telemetry → inherit", () => {
    expect(nextOverride("inherit")).toBe("story");
    expect(nextOverride("story")).toBe("telemetry");
    expect(nextOverride("telemetry")).toBe("inherit");
  });
});

describe("stored mode", () => {
  it("defaults to story when storage is missing or throws", () => {
    expect(readStoredMode(null)).toBe("story");
    expect(
      readStoredMode({
        getItem: () => {
          throw new Error("denied");
        },
      }),
    ).toBe("story");
  });
  it("ignores corrupt values", () => {
    expect(readStoredMode({ getItem: () => "neon" })).toBe("story");
  });
  it("reads telemetry", () => {
    expect(readStoredMode({ getItem: () => "telemetry" })).toBe("telemetry");
  });
  it("never throws on write", () => {
    expect(() =>
      writeStoredMode(
        {
          setItem: () => {
            throw new Error("full");
          },
        },
        "story",
      ),
    ).not.toThrow();
  });
});
