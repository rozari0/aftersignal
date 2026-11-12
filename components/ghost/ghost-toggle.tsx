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
      className="group ml-auto flex items-center gap-2.5 rounded-[2px] px-1 py-1 font-mono text-[11px] uppercase tracking-wider"
    >
      <span className="hidden text-muted transition-colors group-hover:text-text sm:inline">Ghost Mode</span>
      <span
        aria-hidden
        className={cn(
          "relative flex h-5 w-9 items-center rounded-full border px-0.5 transition-colors duration-200",
          telemetry ? "justify-end border-cyan/60 bg-cyan/10" : "justify-start border-amber/50 bg-amber/10",
        )}
      >
        <motion.span
          layout
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={cn("h-3.5 w-3.5 rounded-full", telemetry ? "bg-cyan" : "bg-amber")}
        />
      </span>
      <span className={cn("w-[9ch] text-left", telemetry ? "text-cyan" : "text-amber")}>
        {telemetry ? "Telemetry" : "Story"}
      </span>
    </button>
  );
}
