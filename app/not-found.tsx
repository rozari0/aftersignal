import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-mono text-3xl tracking-[0.25em] text-text">
        SIGNAL LOST
      </h1>
      <p className="text-muted">No carrier on this frequency.</p>
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-wider text-amber hover:text-text"
      >
        Return to feed
      </Link>
    </div>
  );
}
