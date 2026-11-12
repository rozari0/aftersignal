export function Stat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div>
      <p className="font-mono text-label uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="font-mono text-[20px] text-text">
        {value}
        {unit ? (
          <span className="ml-1 text-meta text-muted">{unit}</span>
        ) : null}
      </p>
    </div>
  );
}
