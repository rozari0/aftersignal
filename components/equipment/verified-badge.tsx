import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/cn";

export function VerifiedBadge({ size = 13, className }: { size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex text-ink [&>svg]:fill-cyan", className)} title="Verified NASA hardware">
      <BadgeCheck aria-hidden size={size} />
      <span className="sr-only">Verified NASA hardware</span>
    </span>
  );
}
