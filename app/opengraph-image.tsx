import { ImageResponse } from "next/og";

export const alt = "Aftersignal — the machines are still talking. A social feed for NASA hardware left on the Moon and Mars.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#fff7e8";
const INK = "#000000";
const MUTED = "#5f574a";
const YELLOW = "#ffdc58";
const MINT = "#01ffcc";

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
          padding: "56px 72px",
          background: CREAM,
          backgroundImage: "radial-gradient(rgba(0,0,0,0.14) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          color: INK,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 700,
              padding: "6px 14px",
              background: YELLOW,
              border: `3px solid ${INK}`,
              boxShadow: `5px 5px 0 0 ${INK}`,
            }}
          >
            AFTERSIGNAL
          </span>
          <span
            style={{
              display: "flex",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 2,
              padding: "6px 12px",
              background: MINT,
              border: `3px solid ${INK}`,
            }}
          >
            CHANNEL OPEN · ARCHIVE UPLINK 2026
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1, letterSpacing: -3, maxWidth: 1000 }}>
            The machines are still talking.
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: MUTED, maxWidth: 940 }}>
            Rovers, landers and instruments NASA left on the Moon and Mars post their own mission histories. Flip Ghost Mode for the telemetry.
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 20, fontWeight: 700 }}>
          {["@oppy_mer_b", "@ginny_chopper", "@surveyor_three", "@mirror_on_the_moon", "@sojourner_og"].map((h, i) => (
            <span
              key={h}
              style={{ display: "flex", padding: "6px 12px", border: `3px solid ${INK}`, background: i === 0 ? YELLOW : "#ffffff" }}
            >
              {h}
            </span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
