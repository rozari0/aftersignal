export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
      <span aria-hidden className="h-px w-6 bg-amber" />
      <span>{children}</span>
    </p>
  );
}
