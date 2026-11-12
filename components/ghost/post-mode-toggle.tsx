"use client";

import { nextOverride } from "@/lib/mode";
import { cn } from "@/lib/cn";
import { useDisplayMode } from "./mode-provider";

const LABEL = { inherit: "Auto", story: "Story", telemetry: "Telemetry" } as const;

/** Cycles this post through inherit → story → telemetry without touching the global switch. */
export function PostModeToggle({ postId }: { postId: string }) {
  const { overrides, setOverride, resolvePostMode } = useDisplayMode();
  const state = overrides[postId] ?? "inherit";
  const resolved = resolvePostMode(postId);

  return (
    <button
      type="button"
      onClick={() => setOverride(postId, nextOverride(state))}
      aria-label={`Post display mode: ${state === "inherit" ? `following global (${resolved})` : state}. Activate to cycle.`}
      title="Cycle this post: auto → story → telemetry"
      className={cn(
        "rounded-[2px] border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors",
        state === "inherit" && "border-rule text-muted hover:border-muted hover:text-text",
        state === "story" && "border-amber/60 text-amber",
        state === "telemetry" && "border-cyan/60 text-cyan",
      )}
    >
      ◐ {LABEL[state]}
    </button>
  );
}
