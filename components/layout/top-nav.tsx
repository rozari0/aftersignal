import Link from "next/link";
import { GhostToggle } from "@/components/ghost/ghost-toggle";
import { NavLinks } from "./nav-links";

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-void/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[1180px] items-center gap-3 px-4 sm:gap-6">
        <Link href="/" className="font-mono text-meta tracking-[0.18em] text-text sm:text-body-sm sm:tracking-[0.25em]">
          AFTERSIGNAL
        </Link>

        <NavLinks />

        <span className="hidden font-mono text-label tracking-wider text-muted min-[900px]:inline">
          ARCHIVE UPLINK 2026
        </span>

        <GhostToggle />
      </div>
    </header>
  );
}
