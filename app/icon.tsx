import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 30% 20%, rgba(120,180,255,0.35), rgba(10,14,26,1) 55%)",
        }}
      >
        <div
          style={{
            width: 360,
            height: 360,
            borderRadius: 96,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, rgba(120,180,255,0.25), rgba(180,120,255,0.12))",
            border: "2px solid rgba(170,220,255,0.35)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
          }}
        >
          <div
            style={{
              fontSize: 128,
              fontWeight: 800,
              letterSpacing: -2,
              color: "rgba(235,245,255,0.92)",
            }}
          >
            L
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
