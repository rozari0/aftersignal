export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center border-2 border-rule bg-amber px-2.5 py-1 font-head text-label font-bold uppercase tracking-wide text-ink shadow-nb-sm">
      {children}
    </p>
  );
}
