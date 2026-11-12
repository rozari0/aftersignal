"use client";

import { Radio, Send, Square, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { EquipmentAvatar } from "@/components/equipment/equipment-avatar";
import { useDisplayMode } from "@/components/ghost/mode-provider";
import type { EquipmentProfile } from "@/data/types";
import { CHAT_LIMITS, type ChatMessage } from "@/lib/chat/validate";
import { cn } from "@/lib/cn";

const STARTERS = [
  "What was your last day like?",
  "What are you made of?",
  "What would you tell the next mission?",
];

/**
 * Floating "Talk to …" button plus a session-only chat panel, in character as `profile`.
 * Render with `key={profile.id}` so moving to another profile starts a fresh conversation.
 */
export function EquipmentChat({ profile }: { profile: EquipmentProfile }) {
  const { mode } = useDisplayMode();
  const reduce = useReducedMotion();
  const telemetry = mode === "telemetry";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => () => abortRef.current?.abort(), []);

  // Focus the input on open; return focus to the launcher once it is visible again on close.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) inputRef.current?.focus();
    else if (wasOpen.current) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  const close = () => setOpen(false);

  async function send(text: string) {
    const content = text.trim();
    if (!content || streaming) return;
    const history: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setDraft("");
    setError(null);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipmentId: profile.id, mode, messages: history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Signal lost. Try again.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: reply }]);
      }
      if (!reply.trim()) throw new Error("Only static came back. Try again.");
    } catch (err) {
      if (controller.signal.aborted) {
        // Keep whatever arrived; drop an empty placeholder.
        setMessages((m) => (m.at(-1)?.content ? m : m.slice(0, -1)));
      } else {
        setMessages(history);
        setError(err instanceof Error ? err.message : "Signal lost. Try again.");
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  const accent = telemetry ? "text-cyan" : "text-amber";

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        hidden={open}
        className={cn(
          "fixed right-4 z-40 inline-flex items-center gap-2 rounded-full border bg-panel/95 px-4 py-2.5 font-mono text-[12px] uppercase tracking-wider text-text shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors sm:right-6",
          "bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:bottom-6",
          telemetry ? "border-cyan/50 hover:border-cyan" : "border-amber/50 hover:border-amber",
        )}
      >
        <Radio aria-hidden size={15} className={accent} />
        Talk to {profile.displayName}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.section
            role="dialog"
            aria-labelledby={titleId}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
            }}
            className={cn(
              "fixed inset-x-2 bottom-[calc(0.5rem+env(safe-area-inset-bottom,0px))] z-50 flex max-h-[min(640px,calc(100dvh-5rem))] flex-col rounded-[3px] border bg-panel shadow-[0_12px_40px_rgba(0,0,0,0.6)]",
              "sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[400px]",
              telemetry ? "border-cyan/30" : "border-rule",
            )}
          >
            <header className="flex items-center gap-3 border-b border-rule px-4 py-3">
              <EquipmentAvatar profile={profile} size="sm" />
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="truncate text-[14px] text-text">
                  {profile.displayName}
                </h2>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  AI voice · {telemetry ? "telemetry readout" : "story channel"}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close chat"
                className="rounded-[2px] p-1.5 text-muted hover:text-text"
              >
                <X aria-hidden size={16} />
              </button>
            </header>

            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              aria-busy={streaming}
              className={cn("min-h-[200px] flex-1 space-y-3 overflow-y-auto px-4 py-4", telemetry && "scanlines")}
            >
              {messages.length === 0 ? (
                <div className="space-y-3">
                  <p className={cn("text-[15px] leading-relaxed text-text/90", telemetry ? "font-mono text-[12px]" : "font-serif text-[17px]")}>
                    {telemetry ? `> CHANNEL OPEN: ${profile.shortName.toUpperCase()}. AWAITING QUERY.` : profile.tagline}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-full border border-rule px-3 py-1.5 text-left text-[12px] text-muted hover:border-muted hover:text-text"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                    <p
                      className={cn(
                        "max-w-[85%] whitespace-pre-wrap rounded-[3px] px-3 py-2 text-[14px] leading-relaxed",
                        m.role === "user"
                          ? "bg-rule/70 text-text"
                          : cn("border border-rule bg-void/60 text-text/95", telemetry ? "font-mono text-[12px]" : "font-serif text-[16px]"),
                      )}
                    >
                      <span className="sr-only">{m.role === "user" ? "You: " : `${profile.displayName}: `}</span>
                      {m.content || (
                        <span aria-label="Receiving" className={cn("inline-flex gap-1", accent)}>
                          <span className="animate-pulse">·</span>
                          <span className="animate-pulse [animation-delay:150ms]">·</span>
                          <span className="animate-pulse [animation-delay:300ms]">·</span>
                        </span>
                      )}
                    </p>
                  </div>
                ))
              )}
              {error ? (
                <p role="alert" className="font-mono text-[12px] text-rust">
                  {error}
                </p>
              ) : null}
            </div>

            <form
              className="flex items-end gap-2 border-t border-rule p-3"
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
            >
              <label htmlFor={`${titleId}-input`} className="sr-only">
                Message {profile.displayName}
              </label>
              <textarea
                id={`${titleId}-input`}
                ref={inputRef}
                rows={1}
                value={draft}
                maxLength={CHAT_LIMITS.maxMessageChars}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send(draft);
                  }
                }}
                placeholder={`Ask ${profile.displayName} something…`}
                className="max-h-32 min-h-9 flex-1 resize-none rounded-[2px] border border-rule bg-void/60 px-3 py-2 text-[14px] text-text placeholder:text-muted focus:border-muted focus:outline-none"
              />
              {streaming ? (
                <button
                  type="button"
                  onClick={() => abortRef.current?.abort()}
                  aria-label="Stop reply"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[2px] border border-rule text-text hover:border-muted"
                >
                  <Square aria-hidden size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={!draft.trim()}
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-[2px] text-void disabled:opacity-40",
                    telemetry ? "bg-cyan" : "bg-amber",
                  )}
                >
                  <Send aria-hidden size={15} />
                </button>
              )}
            </form>
            <p className="px-4 pb-3 font-mono text-[10px] leading-snug text-muted">
              AI-generated character, not a real transmission. Facts come from the public mission record and can still be wrong.
            </p>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  );
}
