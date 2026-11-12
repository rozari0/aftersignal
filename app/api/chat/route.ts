import { profileById, profiles } from "@/data";
import { buildSystemPrompt } from "@/lib/chat/prompt";
import { sseToText } from "@/lib/chat/sse";
import { parseChatRequest } from "@/lib/chat/validate";

const KNOWN_IDS = new Set<string>(profiles.map((p) => p.id));

/**
 * POST /api/chat — streams an in-character reply from DeepSeek as plain text.
 * Env (server only): DEEPSEEK_API_KEY (required), DEEPSEEK_MODEL, DEEPSEEK_BASE_URL.
 */
export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "The chat channel isn't configured yet (missing DEEPSEEK_API_KEY)." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const parsed = parseChatRequest(body, KNOWN_IDS);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  const { equipmentId, mode, messages } = parsed.value;

  const baseUrl = (process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com").replace(/\/+$/, "");
  const upstream = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
      stream: true,
      max_tokens: 400,
      temperature: 0.8,
      messages: [{ role: "system", content: buildSystemPrompt(profileById[equipmentId], mode) }, ...messages],
    }),
    signal: request.signal,
  }).catch(() => null);

  if (!upstream?.ok || !upstream.body) {
    // Log the provider's status for the operator; never forward its body (may echo request details).
    console.error("[chat] upstream failed", upstream?.status);
    return Response.json({ error: "Signal lost. The relay didn't answer, try again." }, { status: 502 });
  }

  return new Response(upstream.body.pipeThrough(sseToText()), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
