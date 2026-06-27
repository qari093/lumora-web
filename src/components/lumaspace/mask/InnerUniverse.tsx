"use client";

export default function InnerUniverse() {
  return (
    <section
      data-testid="lumaspace-inner-universe"
      style={{
        borderRadius: 30,
        padding: 20,
        border: "1px solid rgba(168,85,247,.24)",
        background: "radial-gradient(circle at 40% 20%, rgba(129,140,248,.16), transparent 42%), rgba(2,3,10,.62)",
        color: "white"
      }}
    >
      <h2 style={{ margin: 0, fontSize: 20 }}>Inner Self</h2>
      <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,.66)" }}>
        Dark nebula, hidden echoes, private dreams.
      </p>
    </section>
  );
}
