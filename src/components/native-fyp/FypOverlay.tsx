"use client";

export default function FypOverlay({
  title,
  index,
  total,
  muted,
}: {
  title: string;
  index: number;
  total: number;
  muted: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 24,
        zIndex: 10,
        color: "#fff",
        textShadow: "0 2px 12px rgba(0,0,0,0.75)",
        pointerEvents: "none",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>
        {index + 1}/{total} · {muted ? "Muted" : "Sound On"}
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2 }}>
        {title}
      </div>
    </div>
  );
}
