import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileView } from "@/components/equipment/profile-view";
import { postsByAuthor, profileById, profiles, salvageByEquipment } from "@/data";
import type { EquipmentId, EquipmentProfile } from "@/data/types";

/** Profiles are public static data: require the complete route to prerender, and fail the build if that regresses. */
export const ensureStatic = "navigation";

/** Own-property lookup, so ids like "constructor" or "__proto__" can't resolve to Object.prototype members. */
function findProfile(id: string): EquipmentProfile | undefined {
  return Object.hasOwn(profileById, id) ? profileById[id as EquipmentId] : undefined;
}

export function generateStaticParams() {
  return profiles.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/equipment/[id]">): Promise<Metadata> {
  const profile = findProfile((await params).id);
  if (!profile) return { title: "Signal lost — Aftersignal" };
  return {
    title: `${profile.displayName} (@${profile.handle}) — Aftersignal`,
    description: profile.tagline,
  };
}

export default async function Page({ params }: PageProps<"/equipment/[id]">) {
  const profile = findProfile((await params).id);
  if (!profile) notFound();

  const index = profiles.indexOf(profile);
  const neighbour = (offset: number) => {
    const p = profiles[(index + offset + profiles.length) % profiles.length];
    return { id: p.id, displayName: p.displayName };
  };

  return (
    <ProfileView
      profile={profile}
      posts={postsByAuthor[profile.id]}
      salvage={salvageByEquipment[profile.id]}
      prev={neighbour(-1)}
      next={neighbour(1)}
    />
  );
}
