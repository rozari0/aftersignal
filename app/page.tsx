import { Feed } from "@/components/feed/feed";
import { SectionLabel } from "@/components/ui/section-label";

export default function Home() {
  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <SectionLabel>Live feed · archive uplink</SectionLabel>
        <h1 className="font-head text-4xl font-bold tracking-[-0.03em] text-text sm:text-6xl">The machines are still talking</h1>
        <p className="max-w-2xl text-body leading-relaxed text-text">
          Rovers, landers, and instruments NASA left on the Moon and Mars, posting their own mission histories.
          Every date is real. Flip <span className="bg-amber px-1 font-bold text-ink">Ghost Mode</span> to see the telemetry behind the voice.
        </p>
      </header>
      <Feed />
    </div>
  );
}
