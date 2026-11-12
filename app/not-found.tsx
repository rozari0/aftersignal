import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Signal lost" };

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-5 py-16">
      <p className="inline-flex items-center gap-2 border-2 border-rule bg-rust px-2.5 py-1 font-head text-label font-bold uppercase tracking-wide text-ink shadow-nb-sm">
        <span aria-hidden className="h-2 w-2 animate-pulse bg-ink" />
        Error 404 · no carrier
      </p>
      <h1 className="font-head text-5xl font-bold tracking-[-0.03em] text-text sm:text-7xl">SIGNAL LOST</h1>
      <p className="text-body leading-relaxed text-text">
        No hardware at this address. It may never have launched, or it may be somewhere we haven&apos;t mapped yet.
        Try the feed.
      </p>
      <div className="nb-card w-full bg-cyan-wash p-4 font-mono text-meta leading-relaxed text-text">
        <p>
          <span className="font-bold">LAST CONTACT</span> — unknown
        </p>
        <p>
          <span className="font-bold">RECOVERY</span> — return to a known frequency
        </p>
      </div>
      <nav aria-label="Recovery links" className="flex flex-wrap gap-4">
        <Link
          href="/"
          className="nb-press inline-flex min-h-10 items-center border-2 border-rule bg-amber px-4 font-head text-meta font-bold uppercase text-ink hover:bg-amber-hover"
        >
          Return to feed
        </Link>
        <Link
          href="/locator"
          className="nb-press inline-flex min-h-10 items-center border-2 border-rule bg-panel px-4 font-head text-meta font-bold uppercase text-ink hover:bg-sunk"
        >
          Open the locator
        </Link>
      </nav>
    </div>
  );
}
