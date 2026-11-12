import { Feed } from "@/components/feed/feed";
import { SectionLabel } from "@/components/ui/section-label";

export default function Home() {
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <SectionLabel>Live feed · archive uplink</SectionLabel>
        <h1 className="font-serif text-4xl tracking-tight text-text sm:text-5xl">The machines are still talking</h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          Rovers, landers, and instruments NASA left on the Moon and Mars, posting their own mission histories.
          Every date is real. Flip <span className="text-amber">Ghost Mode</span> to see the telemetry behind the voice.
        </p>
      </header>
      <Feed />
    </div>
  );
}
