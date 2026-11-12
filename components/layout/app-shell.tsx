import { ModeProvider } from "@/components/ghost/mode-provider";
import { Footer } from "./footer";
import { TopNav } from "./top-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ModeProvider>
      <a
        href="#main"
        className="sr-only z-[60] rounded-[2px] bg-amber px-3 py-2 font-mono text-meta uppercase tracking-wider text-void focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
      >
        Skip to content
      </a>
      <TopNav />
      <main id="main" tabIndex={-1} className="mx-auto w-full flex-1 max-w-[1180px] px-4 pb-16 pt-6 focus:outline-none">
        {children}
      </main>
      <Footer />
    </ModeProvider>
  );
}
