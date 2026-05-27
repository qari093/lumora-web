import React from "react";

type FypRuntimeShellProps = {
  mode?: string;
  status?: string;
};

export default function FypRuntimeShell({
  mode = "drift",
  status = "active"
}: FypRuntimeShellProps) {
  return (
    <main
      data-testid="fyp-runtime-shell"
      className="min-h-screen bg-black text-white"
      style={{
        padding: "24px",
        display: "grid",
        gap: "18px"
      }}
    >
      <section
        aria-label="Lumora FYP runtime"
        style={{
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: "28px",
          padding: "24px",
          background:
            "radial-gradient(circle at top, rgba(147,51,234,0.35), rgba(0,0,0,0.95))"
        }}
      >
        <p style={{ opacity: 0.72, letterSpacing: "0.18em" }}>
          LUMORA FYP
        </p>

        <h1
          style={{
            fontSize: "clamp(36px, 8vw, 84px)",
            lineHeight: 0.92,
            margin: "10px 0"
          }}
        >
          Emotional Spectrum Feed
        </h1>

        <p style={{ maxWidth: "720px", opacity: 0.82 }}>
          Runtime mode: {mode}. Status: {status}. The feed now has its
          activated shell for resonance, pulse, creator systems, trust,
          privacy, and runtime orchestration.
        </p>
      </section>

      <section
        aria-label="FYP active systems"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px"
        }}
      >
        {[
          "Modes",
          "Echo",
          "Pulse",
          "Creators",
          "Revenue",
          "Culture",
          "Trust",
          "Runtime"
        ].map(item => (
          <article
            key={item}
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "18px",
              padding: "16px",
              background: "rgba(255,255,255,0.06)"
            }}
          >
            <strong>{item}</strong>
            <p style={{ opacity: 0.68, marginBottom: 0 }}>
              online
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
