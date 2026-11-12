import { ImageResponse } from "next/og";

export const alt = "Aftersignal — the machines are still talking. A social feed for NASA hardware left on the Moon and Mars.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const VOID = "#06080d";
const TEXT = "#e9e5da";
const MUTED = "#8c97a3";
const AMBER = "#f5a524";
const CYAN = "#5ad2e6";
const RULE = "#1c2530";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: VOID,
          backgroundImage: `radial-gradient(rgba(185,196,207,0.35) 1.5px, transparent 1.5px), linear-gradient(to right, ${RULE} 1px, transparent 1px), linear-gradient(to bottom, ${RULE} 1px, transparent 1px)`,
          backgroundSize: "120px 120px, 60px 60px, 60px 60px",
          color: TEXT,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 24, letterSpacing: 8 }}>
          <span>AFTERSIGNAL</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 18, letterSpacing: 3, color: MUTED }}>
            <span style={{ width: 10, height: 10, borderRadius: 10, background: CYAN }} />
            CHANNEL OPEN · ARCHIVE UPLINK 2026
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 20, letterSpacing: 4, color: AMBER }}>
            <span style={{ width: 48, height: 2, background: AMBER }} />
            PINNED · LAST KNOWN SIGNAL
          </div>
          <div style={{ fontSize: 92, lineHeight: 1.02, letterSpacing: -2, maxWidth: 980 }}>The machines are still talking.</div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: MUTED, maxWidth: 920 }}>
            Rovers, landers and instruments NASA left on the Moon and Mars post their own mission histories. Flip Ghost Mode for the telemetry.
          </div>
        </div>
        <div style={{ display: "flex", gap: 40, fontSize: 20, letterSpacing: 2, color: MUTED, borderTop: `1px solid ${RULE}`, paddingTop: 24 }}>
          <span style={{ color: TEXT }}>@oppy_mer_b</span>
          <span>@ginny_chopper</span>
          <span>@surveyor_three</span>
          <span>@mirror_on_the_moon</span>
          <span>@sojourner_og</span>
        </div>
      </div>
    ),
    size,
  );
}
