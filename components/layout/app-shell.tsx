import { ModeProvider } from "@/components/ghost/mode-provider";
import { Footer } from "./footer";
import { TopNav } from "./top-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ModeProvider>
      <a
        href="#main"
        className="sr-only z-[60] border-2 border-rule bg-amber px-3 py-2 font-head text-meta font-bold uppercase text-ink shadow-nb focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
      >
        Skip to content
      </a>
      <TopNav />
      <main id="main" tabIndex={-1} className="mx-auto w-full flex-1 max-w-[1180px] px-4 pb-20 pt-8 focus:outline-none">
        {children}
      </main>
      <Footer />
    </ModeProvider>
  );
}
