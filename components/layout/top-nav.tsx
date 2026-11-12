import Link from "next/link";
import { GhostToggle } from "@/components/ghost/ghost-toggle";
import { NavLinks } from "./nav-links";

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-rule bg-panel">
      <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center gap-2 px-4 sm:gap-6">
        <Link href="/" className="nb-press-sm shrink-0 border-2 border-rule bg-amber px-1.5 py-1 font-head text-label font-bold tracking-tight text-ink sm:px-2.5 sm:text-body">
          AFTERSIGNAL
        </Link>

        <NavLinks />

        <span className="hidden font-mono text-label uppercase tracking-wider text-muted min-[900px]:inline">
          ARCHIVE UPLINK 2026
        </span>

        <GhostToggle />
      </div>
    </header>
  );
}
