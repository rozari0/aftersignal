import { ModeProvider } from "@/components/ghost/mode-provider";
import { TopNav } from "./top-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ModeProvider>
      <TopNav />
      <main className="mx-auto w-full max-w-[1180px] px-4 pb-24 pt-6">{children}</main>
    </ModeProvider>
  );
}
