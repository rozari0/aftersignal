"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Feed" },
  { href: "/salvage", label: "Upcycle" },
  { href: "/locator", label: "Locator" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="flex items-center gap-0.5 sm:gap-2">
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" || pathname.startsWith("/equipment") : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "border-2 px-1.5 py-1 font-head text-label font-bold uppercase transition-colors sm:px-3 sm:text-meta sm:tracking-wide",
              active ? "border-rule bg-ink text-panel" : "border-transparent text-ink hover:border-rule hover:bg-sunk",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
