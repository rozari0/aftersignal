"use client";

import { MotionConfig } from "motion/react";
import { createContext, use, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { resolvePostMode as resolve, type DisplayMode, type PostModeOverride } from "@/lib/mode";
import { getModeSnapshot, getServerModeSnapshot, setModeValue, subscribeMode } from "@/lib/mode-store";

interface ModeContextValue {
  mode: DisplayMode;
  setMode: (next: DisplayMode) => void;
  toggle: () => void;
  overrides: Record<string, PostModeOverride>;
  setOverride: (postId: string, override: PostModeOverride) => void;
  resolvePostMode: (postId: string) => DisplayMode;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore(subscribeMode, getModeSnapshot, getServerModeSnapshot);
  // Per-post overrides are session-only and reset whenever the global switch moves.
  const [overrides, setOverrides] = useState<Record<string, PostModeOverride>>({});

  const setMode = useCallback((next: DisplayMode) => {
    setOverrides({});
    setModeValue(next);
  }, []);

  const toggle = useCallback(() => setMode(mode === "story" ? "telemetry" : "story"), [mode, setMode]);

  const setOverride = useCallback((postId: string, override: PostModeOverride) => {
    setOverrides((prev) => {
      const next = { ...prev };
      if (override === "inherit") delete next[postId];
      else next[postId] = override;
      return next;
    });
  }, []);

  const resolvePostMode = useCallback(
    (postId: string) => resolve(mode, overrides[postId] ?? "inherit"),
    [mode, overrides],
  );

  // Expose the mode to CSS (accent colours, scanlines) without prop drilling.
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  const value = useMemo(
    () => ({ mode, setMode, toggle, overrides, setOverride, resolvePostMode }),
    [mode, setMode, toggle, overrides, setOverride, resolvePostMode],
  );

  // reducedMotion="user": Motion skips transform/layout animations when the OS asks for reduced motion.
  return (
    <ModeContext value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ModeContext>
  );
}

export function useDisplayMode(): ModeContextValue {
  const ctx = use(ModeContext);
  if (!ctx) throw new Error("useDisplayMode must be used inside <ModeProvider>");
  return ctx;
}
