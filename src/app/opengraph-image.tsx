import { ImageResponse } from "next/og";

export const alt =
  "ArkyHub — Your architecture projects, in one place. Plans, models, stakeholders, always current.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(60% 50% at 50% 0%, rgba(15, 137, 131, 0.22), transparent 70%)",
          fontFamily: "sans-serif",
          color: "#f7f8f8",
          position: "relative",
        }}
      >
        {/* Hairline grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            display: "flex",
          }}
        />

        {/* Top: brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            position: "relative",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
            <rect
              x="6"
              y="6"
              width="14"
              height="14"
              rx="2.5"
              stroke="#f7f8f8"
              strokeWidth="1.75"
            />
            <rect
              x="12"
              y="12"
              width="14"
              height="14"
              rx="2.5"
              stroke="#0f8983"
              strokeWidth="1.75"
            />
          </svg>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            ArkyHub
          </div>
        </div>

        {/* Middle: headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#56c1ba",
              display: "flex",
            }}
          >
            The first product from Arkytech
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 0.98,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Your architecture projects,</span>
            <span style={{ color: "#56c1ba" }}>in one place.</span>
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#a8aeae",
              maxWidth: 900,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            Plans. Models. Stakeholders. Always current.
          </div>
        </div>

        {/* Bottom: micro footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#707677",
              display: "flex",
            }}
          >
            arkyhub.app
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#707677",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: "#0f8983",
                display: "flex",
              }}
            />
            Early access · 2026
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
