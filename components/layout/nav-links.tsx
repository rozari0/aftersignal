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
    <nav aria-label="Primary" className="flex items-center gap-3 sm:gap-4">
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" || pathname.startsWith("/equipment") : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "border-b py-1 font-mono text-label uppercase tracking-wider transition-colors sm:text-meta",
              active ? "border-amber text-text" : "border-transparent text-muted hover:text-text",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
