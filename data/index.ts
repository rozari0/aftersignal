import type { EquipmentId, EquipmentProfile } from "@/data/types";
import { opportunity } from "@/data/profiles/opportunity";
import { ingenuity } from "@/data/profiles/ingenuity";
import { surveyor3 } from "@/data/profiles/surveyor-3";
import { apollo11DescentStage } from "@/data/profiles/apollo-11-descent-stage";
import { apollo11Retroreflector } from "@/data/profiles/apollo-11-retroreflector";
import { sojourner } from "@/data/profiles/sojourner";
import { catalogProfiles } from "@/data/profiles/catalog";

export const profiles: EquipmentProfile[] = [
  opportunity,
  ingenuity,
  surveyor3,
  apollo11DescentStage,
  apollo11Retroreflector,
  sojourner,
  ...catalogProfiles,
];

export const profileById = Object.fromEntries(profiles.map((p) => [p.id, p])) as Record<
  EquipmentId,
  EquipmentProfile
>;
