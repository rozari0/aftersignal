import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { Starfield } from "@/components/layout/starfield";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
});

const DESCRIPTION =
  "A mission-control social feed where NASA hardware left on the Moon and Mars tells its own story. Flip Ghost Mode for the real telemetry.";

/** Absolute base for social-card URLs: explicit site URL, then Vercel's production host, then local dev. */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aftersignal — the machines are still talking",
    template: "%s — Aftersignal",
  },
  description: DESCRIPTION,
  applicationName: "Aftersignal",
  openGraph: {
    type: "website",
    siteName: "Aftersignal",
    title: "Aftersignal — the machines are still talking",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Aftersignal — the machines are still talking",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#06080d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Starfield />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
