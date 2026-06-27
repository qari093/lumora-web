"use client";

export default function PublicUniverse() {
  return (
    <section
      data-testid="lumaspace-public-universe"
      style={{
        borderRadius: 30,
        padding: 20,
        border: "1px solid rgba(103,232,249,.22)",
        background: "radial-gradient(circle at 40% 20%, rgba(34,211,238,.16), transparent 42%), rgba(255,255,255,.04)",
        color: "white"
      }}
    >
      <h2 style={{ margin: 0, fontSize: 20 }}>Public Self</h2>
      <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,.66)" }}>
        Bright stars, shared worlds, open memories.
      </p>
    </section>
  );
}
