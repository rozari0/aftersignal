import Link from "next/link";
import { GhostToggle } from "@/components/ghost/ghost-toggle";

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

        <GhostToggle />
      </div>
    </header>
  );
}
