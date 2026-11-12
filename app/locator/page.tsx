import type { Metadata } from "next";
import { SurfaceMap } from "@/components/map/surface-map";
import { SectionLabel } from "@/components/ui/section-label";
import { profiles } from "@/data";

export const metadata: Metadata = {
  title: "Surface Locator",
  description: "Where NASA's decommissioned rovers, landers and instruments rest today on the Moon and Mars, plotted from real coordinates.",
};

export default function Page() {
  const moon = profiles.filter((p) => p.planet === "moon").length;
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <SectionLabel>Surface locator</SectionLabel>
        <h1 className="font-serif text-4xl tracking-tight text-text sm:text-5xl">Where they rest</h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          {profiles.length} pieces of hardware, {moon} on the Moon and {profiles.length - moon} on Mars, plotted from their
          published coordinates on public-domain global mosaics.
        </p>
      </header>
      <SurfaceMap />
    </div>
  );
}
