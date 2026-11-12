import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto grid w-full max-w-[1180px] gap-4 px-4 py-8 font-mono text-[11px] leading-relaxed text-muted sm:grid-cols-[1fr_auto]">
        <div className="space-y-2">
          <p className="tracking-[0.2em] text-text">AFTERSIGNAL</p>
          <p className="max-w-xl">
            Built for the 2026 NASA Space Apps Challenge, “Abandoned but not Forgotten”. In-character posts are fiction;
            dates, coordinates, masses and mission logs are drawn from NASA, JPL and NSSDCA sources listed on each profile.
            Imagery is public domain courtesy of NASA, JPL-Caltech and USGS. Not affiliated with or endorsed by NASA.
          </p>
        </div>
        <nav aria-label="Footer" className="flex gap-4 sm:flex-col sm:items-end sm:gap-1">
          <Link href="/" className="hover:text-text">Feed</Link>
          <Link href="/salvage" className="hover:text-text">Upcycle Me</Link>
          <Link href="/locator" className="hover:text-text">Surface Locator</Link>
        </nav>
      </div>
    </footer>
  );
}
