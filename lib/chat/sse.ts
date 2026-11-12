/**
 * Turns an OpenAI-compatible SSE stream (DeepSeek's chat completions) into a plain-text stream
 * of the assistant's content deltas. Reasoning deltas, keep-alives and [DONE] are dropped.
 */
export function sseToText(): TransformStream<Uint8Array, Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const handle = (line: string, controller: TransformStreamDefaultController<Uint8Array>) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) return;
    const data = trimmed.slice(5).trim();
    if (!data || data === "[DONE]") return;
    try {
      const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
      if (typeof delta === "string" && delta) controller.enqueue(encoder.encode(delta));
    } catch {
      // Ignore malformed or partial events; the provider occasionally sends comments.
    }
  };

  return new TransformStream({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) handle(line, controller);
    },
    flush(controller) {
      buffer += decoder.decode();
      if (buffer) handle(buffer, controller);
    },
  });
}
