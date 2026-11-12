export function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[3px] border border-rule bg-panel">{children}</div>
  );
}
