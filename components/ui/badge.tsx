import clsx from "clsx";

type BadgeTone = "amber" | "cyan" | "rust" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  amber: "bg-amber",
  cyan: "bg-cyan",
  rust: "bg-rust",
  neutral: "bg-panel",
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
        "inline-flex items-center border-2 border-rule px-2 py-0.5 font-head text-label font-bold uppercase tracking-wide text-ink shadow-nb-sm",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
