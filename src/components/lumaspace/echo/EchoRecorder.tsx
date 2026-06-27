"use client";

export default function EchoRecorder() {
  return (
    <button
      type="button"
      data-testid="lumaspace-echo-recorder"
      style={{
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,.18)",
        background: "rgba(34,211,238,.14)",
        color: "white",
        padding: "12px 18px"
      }}
    >
      Record 15s Echo
    </button>
  );
}
