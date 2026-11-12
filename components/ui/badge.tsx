import clsx from "clsx";

type BadgeTone = "amber" | "cyan" | "rust" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  amber: "border-amber text-amber",
  cyan: "border-cyan text-cyan",
  rust: "border-rust text-rust",
  neutral: "border-muted text-muted",
};

export function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: BadgeTone;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
