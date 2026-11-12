import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Signal lost" };

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-5 py-16">
      <p className="flex items-center gap-2 font-mono text-label uppercase tracking-[0.14em] text-amber">
        <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber" />
        Error 404 · no carrier
      </p>
      <h1 className="font-mono text-4xl tracking-[0.25em] text-text sm:text-5xl">SIGNAL LOST</h1>
      <p className="text-body leading-relaxed text-muted">
        No hardware at this address. It may never have launched, or it may be somewhere we haven&apos;t mapped yet.
        Try the feed.
      </p>
      <div className="scanlines w-full rounded-[3px] border border-rule bg-panel/70 p-4 font-mono text-meta leading-relaxed text-muted">
        <p>
          <span className="text-cyan">LAST CONTACT</span> — unknown
        </p>
        <p>
          <span className="text-cyan">RECOVERY</span> — return to a known frequency
        </p>
      </div>
      <nav aria-label="Recovery links" className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex min-h-8 items-center rounded-[2px] bg-amber px-4 font-mono text-meta uppercase tracking-wider text-void hover:bg-amber/90"
        >
          Return to feed
        </Link>
        <Link
          href="/locator"
          className="inline-flex min-h-8 items-center rounded-[2px] border border-rule px-4 font-mono text-meta uppercase tracking-wider text-text hover:border-muted"
        >
          Open the locator
        </Link>
      </nav>
    </div>
  );
}
