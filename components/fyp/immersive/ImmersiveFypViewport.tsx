import React from "react";

import {
  createFypVisualTheme
} from "@/src/core/fyp/ui-runtime/visualTheme";

import {
  createFypInteractionRail
} from "@/src/core/fyp/ui-runtime/interactionRail";

type ImmersiveFypViewportProps = {
  mode?: "calm" | "drift" | "chaos" | "pulse";
  title?: string;
  creator?: string;
};

export default function ImmersiveFypViewport({
  mode = "drift",
  title = "Lumora Signal",
  creator = "@lumora"
}: ImmersiveFypViewportProps) {
  const theme = createFypVisualTheme(mode);
  const rail = createFypInteractionRail({
    saved: false,
    shared: false,
    resonanceOpen: false
  });

  return (
    <main
      data-testid="immersive-fyp-viewport"
      data-mode={mode}
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(circle at 50% 0%, rgba(168,85,247,0.34), rgba(0,0,0,0.96) 46%, #000 100%)",
        color: "white",
        overflow: "hidden",
        position: "relative",
        display: "grid",
        placeItems: "center",
        padding: "20px"
      }}
    >
      <section
        aria-label="Active FYP card"
        style={{
          width: "min(460px, 100%)",
          minHeight: "78vh",
          borderRadius: "36px",
          border: "1px solid rgba(255,255,255,0.18)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
          boxShadow: "0 0 60px rgba(168,85,247,0.22)",
          padding: "22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <header>
          <p
            style={{
              margin: 0,
              opacity: 0.7,
              letterSpacing: "0.18em",
              textTransform: "uppercase"
            }}
          >
            {theme.aura} · {theme.motion}
          </p>

          <h1
            style={{
              fontSize: "clamp(34px, 10vw, 72px)",
              lineHeight: 0.92,
              margin: "14px 0 8px"
            }}
          >
            {title}
          </h1>

          <p style={{ opacity: 0.78 }}>{creator}</p>
        </header>

        <div
          aria-label="Runtime atmosphere"
          style={{
            height: "220px",
            borderRadius: "28px",
            background:
              mode === "chaos"
                ? "radial-gradient(circle, rgba(239,68,68,0.8), rgba(0,0,0,0.2))"
                : mode === "pulse"
                  ? "radial-gradient(circle, rgba(250,204,21,0.8), rgba(0,0,0,0.2))"
                  : "radial-gradient(circle, rgba(139,92,246,0.72), rgba(0,0,0,0.2))",
            display: "grid",
            placeItems: "center"
          }}
        >
          <strong style={{ fontSize: "22px" }}>
            Intensity {theme.intensity}
          </strong>
        </div>

        <nav
          aria-label="FYP interaction rail"
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap"
          }}
        >
          {rail.map(item => (
            <button
              key={item.id}
              type="button"
              data-active={item.active}
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.08)",
                color: "white",
                borderRadius: "999px",
                padding: "10px 14px"
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </section>
    </main>
  );
}
