export type DisplayMode = "story" | "telemetry";
export type PostModeOverride = "inherit" | DisplayMode;

export const MODE_STORAGE_KEY = "aftersignal:mode";

export function resolvePostMode(global: DisplayMode, override: PostModeOverride): DisplayMode {
  return override === "inherit" ? global : override;
}

const CYCLE: Record<PostModeOverride, PostModeOverride> = {
  inherit: "story",
  story: "telemetry",
  telemetry: "inherit",
};

export function nextOverride(current: PostModeOverride): PostModeOverride {
  return CYCLE[current];
}

export function readStoredMode(storage: Pick<Storage, "getItem"> | null): DisplayMode {
  try {
    return storage?.getItem(MODE_STORAGE_KEY) === "telemetry" ? "telemetry" : "story";
  } catch {
    return "story";
  }
}

export function writeStoredMode(storage: Pick<Storage, "setItem"> | null, mode: DisplayMode): void {
  try {
    storage?.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    // Private mode or quota: the in-memory value still applies for this session.
  }
}
