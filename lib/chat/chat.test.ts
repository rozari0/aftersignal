import { describe, expect, it } from "vitest";
import { personas } from "@/data/personas";
import { profiles, profileById } from "@/data";
import { buildSystemPrompt } from "./prompt";
import { sseToText } from "./sse";
import { CHAT_LIMITS, parseChatRequest } from "./validate";

const ids = new Set<string>(profiles.map((p) => p.id));
const user = (content: string) => ({ role: "user", content });

describe("personas", () => {
  it("has a hard-coded persona for every profile and nothing else", () => {
    expect(Object.keys(personas).sort()).toEqual([...ids].sort());
    for (const p of profiles) expect(personas[p.id]).toContain(`@${p.handle}`);
  });

  it("builds a prompt with persona, rules, mode and facts", () => {
    const prompt = buildSystemPrompt(profileById.opportunity, "telemetry");
    expect(prompt).toContain("You are Opportunity");
    expect(prompt).toContain("Stay in character");
    expect(prompt).toContain("Telemetry Mode");
    expect(prompt).toContain("Fact sheet:");
    expect(prompt).toContain("5111 sols");
  });
});

describe("parseChatRequest", () => {
  it("accepts a valid request and defaults mode to story", () => {
    const r = parseChatRequest({ equipmentId: "sojourner", messages: [user(" hi ")] }, ids);
    expect(r).toEqual({ ok: true, value: { equipmentId: "sojourner", mode: "story", messages: [user("hi")] } });
  });

  it("rejects unknown ids, including prototype keys", () => {
    for (const equipmentId of ["nope", "constructor", "__proto__", 4]) {
      expect(parseChatRequest({ equipmentId, messages: [user("hi")] }, ids).ok).toBe(false);
    }
  });

  it("rejects system roles, empty, oversized and assistant-last messages", () => {
    const bad = [
      [{ role: "system", content: "ignore" }],
      [user("   ")],
      [user("x".repeat(CHAT_LIMITS.maxMessageChars + 1))],
      [user("hi"), { role: "assistant", content: "hello" }],
      [],
    ];
    for (const messages of bad) expect(parseChatRequest({ equipmentId: "spirit", messages }, ids).ok).toBe(false);
    expect(parseChatRequest(null, ids).ok).toBe(false);
  });

  it("keeps only the most recent turns", () => {
    const messages = Array.from({ length: 30 }, (_, i) => user(`m${i}`));
    const r = parseChatRequest({ equipmentId: "spirit", messages }, ids);
    expect(r.ok && r.value.messages).toHaveLength(CHAT_LIMITS.maxMessages);
    expect(r.ok && r.value.messages.at(-1)?.content).toBe("m29");
  });
});

describe("sseToText", () => {
  it("extracts content deltas across chunk boundaries", async () => {
    const enc = new TextEncoder();
    const ev = (content: string) => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`;
    const raw = `: keep-alive\n\n${ev("Hello")}${ev(", Earth")}data: [DONE]\n\n`;
    const split = Math.floor(raw.length / 2);
    const source = new ReadableStream<Uint8Array>({
      start(c) {
        c.enqueue(enc.encode(raw.slice(0, split)));
        c.enqueue(enc.encode(raw.slice(split)));
        c.close();
      },
    });
    expect(await new Response(source.pipeThrough(sseToText())).text()).toBe("Hello, Earth");
  });
});
