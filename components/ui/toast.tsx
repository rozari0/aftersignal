"use client";

import { useEffect } from "react";

/**
 * Always-mounted polite live region; announces `message` when it changes and clears itself.
 * Mount once per page so screen readers register the region before the first message.
 */
export function Toast({ message, onDone, duration = 2500 }: { message: string | null; onDone: () => void; duration?: number }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, duration);
    return () => clearTimeout(t);
  }, [message, onDone, duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      {message ? (
        <p className="pointer-events-auto rounded-[3px] border border-amber/60 bg-panel px-4 py-2.5 font-mono text-[12px] tracking-wide text-text shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <span aria-hidden className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-amber align-middle" />
          {message}
        </p>
      ) : null}
    </div>
  );
}
