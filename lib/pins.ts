import type { EquipmentProfile } from "@/data/types";
import { projectToPercent } from "@/lib/geo";

export interface PinGroup {
  key: string;
  x: number;
  y: number;
  profiles: EquipmentProfile[];
  /** Which side of the pin its text label sits on, chosen to avoid edges and neighbours. */
  labelSide: "left" | "right";
}

/** Merge profiles whose projected positions fall within `threshold` percent of each other. */
export function groupPins(profiles: EquipmentProfile[], threshold = 1): PinGroup[] {
  const groups: PinGroup[] = [];
  for (const profile of profiles) {
    const { x, y } = projectToPercent(profile.telemetry.coordinates);
    const near = groups.find((g) => Math.hypot(g.x - x, (g.y - y) * 0.5) < threshold);
    if (near) {
      near.profiles.push(profile);
      near.key = near.profiles.map((p) => p.id).join("+");
    } else {
      groups.push({ key: profile.id, x, y, profiles: [profile], labelSide: "right" });
    }
  }
  for (const g of groups) {
    const crowdedRight = groups.some((o) => o !== g && o.x > g.x && o.x - g.x < 14 && Math.abs(o.y - g.y) < 6);
    g.labelSide = g.x > 82 || crowdedRight ? "left" : "right";
  }
  return groups;
}
