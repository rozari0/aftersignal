import Link from "next/link";
import { GhostToggle } from "@/components/ghost/ghost-toggle";
import { NavLinks } from "./nav-links";

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-rule bg-panel">
      <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center gap-x-2 gap-y-2.5 px-4 py-2.5 sm:h-16 sm:flex-nowrap sm:gap-6 sm:py-0">
        <Link href="/" className="nb-press-sm shrink-0 border-2 border-rule bg-amber px-2 py-1 font-head text-meta font-bold tracking-tight text-ink sm:px-2.5 sm:text-body">
          AFTERSIGNAL
        </Link>

        <div className="order-last w-full border-t-2 border-rule pt-2.5 sm:order-none sm:w-auto sm:border-t-0 sm:pt-0">
          <NavLinks />
        </div>

        <span className="hidden font-mono text-label uppercase tracking-wider text-muted min-[900px]:inline">
          ARCHIVE UPLINK 2026
        </span>

        <GhostToggle />
      </div>
    </header>
  );
}
