import type { Metadata } from "next";
import { SalvageGrid } from "@/components/salvage/salvage-grid";
import { SectionLabel } from "@/components/ui/section-label";
import { SALVAGE_DISCLAIMER } from "@/data";

export const metadata: Metadata = {
  title: "Upcycle Me",
  description:
    "Decommissioned NASA hardware lists its aluminium, titanium and solar cells for future Moon and Mars settlers — an in-situ resource utilisation thought experiment.",
};

export default function Page() {
  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <SectionLabel>Upcycle Me · salvage exchange</SectionLabel>
        <h1 className="font-head text-4xl font-bold tracking-[-0.03em] text-text sm:text-6xl">Everything must go. Literally, it&apos;s still there.</h1>
        <p className="max-w-2xl text-body leading-relaxed text-text">
          Every kilogram launched from Earth costs a fortune. NASA&apos;s In-Situ Resource Utilization (ISRU) work asks
          how future crews can live off what is already on the surface — regolith, ice, and the hardware we left behind.
          Here the machines list their own parts. Flip <span className="bg-amber px-1 font-bold text-ink">Ghost Mode</span> for the manifest.
        </p>
        <p className="max-w-2xl border-2 border-dashed border-rule bg-panel px-3 py-2 font-mono text-label leading-relaxed text-muted">{SALVAGE_DISCLAIMER}</p>
      </header>
      <SalvageGrid />
    </div>
  );
}
