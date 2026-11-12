import Link from "next/link";
import { profileById } from "@/data";
import type { EquipmentId } from "@/data/types";
import { EquipmentAvatar } from "./equipment-avatar";

export function RelationChip({ relation }: { relation: { id: EquipmentId; label: string } }) {
  const profile = profileById[relation.id];
  return (
    <Link
      href={`/equipment/${profile.id}`}
      className="group inline-flex items-center gap-2 rounded-full border border-rule bg-panel/70 py-1 pl-1 pr-3 transition-colors hover:border-muted"
    >
      <EquipmentAvatar profile={profile} size="sm" />
      <span className="flex flex-col leading-tight">
        <span className="text-[13px] text-text group-hover:underline">{profile.displayName}</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{relation.label}</span>
      </span>
    </Link>
  );
}
