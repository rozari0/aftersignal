import { readStoredMode, writeStoredMode, type DisplayMode } from "@/lib/mode";

/**
 * Tiny external store for the global display mode, read via useSyncExternalStore.
 * Storage is read once on the first client snapshot and cached, so snapshots are stable.
 */
let mode: DisplayMode | null = null;
const listeners = new Set<() => void>();

function safeStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function getModeSnapshot(): DisplayMode {
  if (mode === null) mode = readStoredMode(safeStorage());
  return mode;
}

export function getServerModeSnapshot(): DisplayMode {
  return "story";
}

export function subscribeMode(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setModeValue(next: DisplayMode): void {
  if (next === mode) return;
  mode = next;
  writeStoredMode(safeStorage(), next);
  for (const listener of listeners) listener();
}
