"use client";

import { useReducedMotion } from "motion/react";

const FADE = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.18, ease: "easeOut" },
} as const;

const INSTANT = {
  initial: false,
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 1, y: 0 },
  transition: { duration: 0 },
} as const;

/**
 * Shared Ghost Mode crossfade (opacity + 4px rise, 180ms). Under prefers-reduced-motion it
 * becomes an instant swap; MotionConfig alone would still run the opacity fade and the wait.
 */
export function useCrossfade() {
  return useReducedMotion() ? INSTANT : FADE;
}
