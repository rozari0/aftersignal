import type { EquipmentId } from "@/data/types";
import type { DisplayMode } from "@/lib/mode";

export type ChatRole = "user" | "assistant";
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  equipmentId: EquipmentId;
  mode: DisplayMode;
  messages: ChatMessage[];
}

/** Limits keep a public, unauthenticated endpoint cheap to run. */
export const CHAT_LIMITS = {
  maxMessages: 20,
  maxMessageChars: 1000,
} as const;

type Result = { ok: true; value: ChatRequest } | { ok: false; error: string };

/** Validates an untrusted request body. `knownIds` is passed in so this stays a pure function. */
export function parseChatRequest(body: unknown, knownIds: ReadonlySet<string>): Result {
  if (!body || typeof body !== "object") return { ok: false, error: "Body must be a JSON object." };
  const { equipmentId, mode, messages } = body as Record<string, unknown>;

  if (typeof equipmentId !== "string" || !knownIds.has(equipmentId)) {
    return { ok: false, error: "Unknown equipment." };
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, error: "Send at least one message." };
  }

  // Older turns are dropped rather than rejected, so long conversations keep working.
  const recent = messages.slice(-CHAT_LIMITS.maxMessages);
  const clean: ChatMessage[] = [];
  for (const m of recent) {
    if (!m || typeof m !== "object") return { ok: false, error: "Malformed message." };
    const { role, content } = m as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return { ok: false, error: "Malformed message." };
    if (typeof content !== "string" || !content.trim()) return { ok: false, error: "Empty message." };
    if (content.length > CHAT_LIMITS.maxMessageChars) {
      return { ok: false, error: `Messages are limited to ${CHAT_LIMITS.maxMessageChars} characters.` };
    }
    clean.push({ role, content: content.trim() });
  }
  if (clean[clean.length - 1].role !== "user") return { ok: false, error: "The last message must be yours." };

  return {
    ok: true,
    value: {
      equipmentId: equipmentId as EquipmentId,
      mode: mode === "telemetry" ? "telemetry" : "story",
      messages: clean,
    },
  };
}
