"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";

export function CommentComposer({ onSubmit }: { onSubmit: (body: string) => void }) {
  const [body, setBody] = useState("");
  const id = useId();
  const trimmed = body.trim();

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!trimmed) return;
        onSubmit(trimmed);
        setBody("");
      }}
    >
      <label htmlFor={id} className="sr-only">
        Reply as a visitor
      </label>
      <input
        id={id}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={280}
        placeholder="Add a transmission…"
        autoComplete="off"
        className="min-h-8 min-w-0 flex-1 rounded-[2px] border border-rule bg-void/60 px-3 font-mono text-[12px] text-text placeholder:text-muted focus:border-muted focus:outline-none"
      />
      <Button type="submit" variant="ghost" disabled={!trimmed} className="disabled:cursor-not-allowed disabled:opacity-40">
        Transmit
      </Button>
    </form>
  );
}
