import Link from "next/link";

const links = [
  { href: "/", label: "FEED" },
  { href: "/salvage", label: "UPCYCLE" },
  { href: "/locator", label: "LOCATOR" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-void/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[1180px] items-center gap-6 px-4">
        <Link
          href="/"
          className="font-mono text-sm tracking-[0.25em] text-text"
        >
          AFTERSIGNAL
        </Link>

        <nav className="flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <span className="hidden font-mono text-[11px] tracking-wider text-muted min-[900px]:inline">
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-cyan align-middle" />
          CHANNEL OPEN · ARCHIVE UPLINK 2026
        </span>

        <button
          type="button"
          aria-disabled
          className="ml-auto flex cursor-not-allowed items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted"
        >
          <span
            aria-hidden
            className="flex h-4 w-7 items-center rounded-full border border-rule bg-panel px-0.5"
          >
            <span className="h-3 w-3 rounded-full bg-muted" />
          </span>
          Ghost Mode
        </button>
      </div>
    </header>
  );
}
