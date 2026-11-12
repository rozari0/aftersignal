import Image from "next/image";
import type { EquipmentProfile, SignalStatus } from "@/data/types";
import { cn } from "@/lib/cn";

const SIZE = { sm: 32, md: 44, lg: 96 } as const;

export const STATUS_DOT: Record<SignalStatus, string> = {
  "signal-lost": "bg-amber",
  "still-passive": "bg-cyan",
  "partially-salvaged": "bg-rust",
};

export function EquipmentAvatar({
  profile,
  size = "md",
  className,
}: {
  profile: EquipmentProfile;
  size?: keyof typeof SIZE;
  className?: string;
}) {
  const px = SIZE[size];
  return (
    <span className={cn("relative inline-block shrink-0", className)} style={{ width: px, height: px }}>
      <Image
        src={profile.avatar.src}
        alt=""
        width={px}
        height={px}
        sizes={`${px}px`}
        className="h-full w-full rounded-full object-cover ring-1 ring-rule"
      />
      <span
        aria-hidden
        className={cn(
          "absolute bottom-0 right-0 rounded-full ring-2 ring-void",
          size === "lg" ? "h-3.5 w-3.5" : "h-2 w-2",
          STATUS_DOT[profile.status],
        )}
      />
    </span>
  );
}
