"use client";

export default function NexaOrb() {
  return (
    <button
      type="button"
      data-testid="lumaspace-nexa-orb"
      aria-label="Open NEXA companion"
      style={{
        position: "relative",
        width: 68,
        height: 68,
        borderRadius: 999,
        border: "1px solid rgba(103,232,249,.38)",
        background:
          "radial-gradient(circle, rgba(255,255,255,.92), rgba(34,211,238,.38), rgba(168,85,247,.18))",
        boxShadow:
          "0 0 34px rgba(34,211,238,.42), 0 0 90px rgba(168,85,247,.16)",
        color: "white"
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 14,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,.34)"
        }}
      />
    </button>
  );
}
