import Link from "next/link";
import { profileById } from "@/data";
import type { EquipmentId } from "@/data/types";
import { EquipmentAvatar } from "./equipment-avatar";

export function RelationChip({ relation }: { relation: { id: EquipmentId; label: string } }) {
  const profile = profileById[relation.id];
  return (
    <Link
      href={`/equipment/${profile.id}`}
      className="nb-press-sm group inline-flex items-center gap-2 border-2 border-rule bg-panel py-1 pl-1 pr-3 hover:bg-amber"
    >
      <EquipmentAvatar profile={profile} size="sm" />
      <span className="flex flex-col leading-tight">
        <span className="text-small font-bold text-text">{profile.displayName}</span>
        <span className="font-mono text-micro uppercase tracking-wider text-muted">{relation.label}</span>
      </span>
    </Link>
  );
}
