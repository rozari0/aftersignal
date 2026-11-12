import { SectionLabel } from "@/components/ui/section-label";

export default function Home() {
  return (
    <div className="relative flex flex-col gap-4">
      <SectionLabel>LIVE FEED</SectionLabel>
      <h1 className="font-serif text-4xl tracking-tight text-text">
        The machines are still talking
      </h1>
      <p className="max-w-xl text-muted">
        A mission-control feed for decommissioned NASA hardware.
      </p>
      <p className="text-muted">Feed arriving.</p>
    </div>
  );
}
