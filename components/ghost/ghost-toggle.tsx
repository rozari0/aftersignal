"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { useDisplayMode } from "./mode-provider";

export function GhostToggle() {
  const { mode, toggle } = useDisplayMode();
  const telemetry = mode === "telemetry";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={telemetry}
      aria-label="Ghost Mode: switch between story and telemetry"
      onClick={toggle}
      className="group ml-auto flex items-center gap-2.5 py-1 font-head text-label font-bold uppercase tracking-wide"
    >
      <span className="hidden text-ink sm:inline">Ghost Mode</span>
      <span
        aria-hidden
        className={cn(
          "relative flex h-7 w-12 shrink-0 items-center border-2 border-rule p-0.5 shadow-nb-sm transition-colors duration-200 sm:w-13",
          telemetry ? "justify-end bg-cyan" : "justify-start bg-amber",
        )}
      >
        <motion.span
          layout
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="h-5 w-5 border-2 border-rule bg-panel"
        />
      </span>
      <span className="hidden w-[9ch] text-left text-ink min-[480px]:inline">
        {telemetry ? "Telemetry" : "Story"}
      </span>
    </button>
  );
}
