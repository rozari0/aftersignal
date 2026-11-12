import { SectionLabel } from "@/components/ui/section-label";

export const instant = false;

export default async function Page({
  params,
}: PageProps<"/equipment/[id]">) {
  const { id } = await params;
  return (
    <div className="flex flex-col gap-4">
      <SectionLabel>EQUIPMENT</SectionLabel>
      <h1 className="font-serif text-3xl text-text">{id}</h1>
    </div>
  );
}
