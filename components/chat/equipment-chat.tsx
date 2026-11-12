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

  const accent = telemetry ? "bg-cyan" : "bg-amber";

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
          "nb-press fixed right-4 z-40 inline-flex items-center gap-2 border-2 border-rule px-4 py-2.5 font-head text-meta font-bold uppercase text-ink sm:right-6",
          "bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:bottom-6",
          accent,
        )}
      >
        <Radio aria-hidden size={16} />
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
              "fixed inset-x-2 bottom-[calc(0.5rem+env(safe-area-inset-bottom,0px))] z-50 flex max-h-[min(640px,calc(100dvh-5rem))] flex-col border-2 border-rule bg-panel shadow-nb-xl",
              "sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[400px]",
                          )}
          >
            <header className={cn("flex items-center gap-3 border-b-2 border-rule px-4 py-3", accent)}>
              <EquipmentAvatar profile={profile} size="sm" />
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="truncate font-head text-body font-bold text-ink">
                  {profile.displayName}
                </h2>
                <p className="font-mono text-micro font-bold uppercase tracking-wider text-ink">
                  AI voice · {telemetry ? "telemetry readout" : "story channel"}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close chat"
                className="nb-press-sm border-2 border-rule bg-panel p-1 text-ink hover:bg-rust"
              >
                <X aria-hidden size={16} />
              </button>
            </header>

            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              aria-busy={streaming}
              className={cn("min-h-[200px] flex-1 space-y-3 overflow-y-auto px-4 py-4", telemetry ? "bg-cyan-wash" : "bg-void")}
            >
              {messages.length === 0 ? (
                <div className="space-y-3">
                  <p className={cn("text-body leading-relaxed text-text", telemetry ? "font-mono text-meta" : "font-head text-[17px] font-medium")}>
                    {telemetry ? `> CHANNEL OPEN: ${profile.shortName.toUpperCase()}. AWAITING QUERY.` : profile.tagline}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="nb-press-sm border-2 border-rule bg-panel px-3 py-1.5 text-left text-meta font-bold text-ink hover:bg-amber"
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
                        "max-w-[85%] whitespace-pre-wrap border-2 border-rule px-3 py-2 text-body-sm leading-relaxed text-ink shadow-nb-sm",
                        m.role === "user"
                          ? "bg-lilac"
                          : cn("bg-panel", telemetry ? "font-mono text-meta" : "font-head text-body-lg font-medium"),
                      )}
                    >
                      <span className="sr-only">{m.role === "user" ? "You: " : `${profile.displayName}: `}</span>
                      {m.content || (
                        <span aria-label="Receiving" className="inline-flex gap-1 font-bold">
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
                <p role="alert" className="border-2 border-rule bg-rust px-3 py-2 font-mono text-meta font-bold text-ink">
                  {error}
                </p>
              ) : null}
            </div>

            <form
              className="flex items-end gap-2 border-t-2 border-rule p-3"
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
                className="max-h-32 min-h-10 flex-1 resize-none border-2 border-rule bg-panel px-3 py-2 text-body-sm text-text shadow-nb-sm placeholder:text-muted focus:shadow-nb focus:outline-none"
              />
              {streaming ? (
                <button
                  type="button"
                  onClick={() => abortRef.current?.abort()}
                  aria-label="Stop reply"
                  className="nb-press-sm inline-flex h-10 w-10 items-center justify-center border-2 border-rule bg-panel text-ink hover:bg-rust"
                >
                  <Square aria-hidden size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={!draft.trim()}
                  className={cn(
                    "nb-press-sm inline-flex h-10 w-10 items-center justify-center border-2 border-rule text-ink disabled:opacity-40 disabled:shadow-none",
                    accent,
                  )}
                >
                  <Send aria-hidden size={15} />
                </button>
              )}
            </form>
            <p className="px-4 pb-3 font-mono text-micro leading-snug text-muted">
              AI-generated character, not a real transmission. Facts come from the public mission record and can still be wrong.
            </p>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  );
}
