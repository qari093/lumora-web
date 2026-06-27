"use client";

import { storyStars } from "@/src/core/lumaspace/memory/runtime";

export default function LumaMemoryCivilization() {
  return (
    <section
      data-testid="lumaspace-memory-civilization"
      style={{ display: "grid", gap: 18, color: "white" }}
    >
      <div
        data-testid="lumaspace-story-constellation"
        style={{
          position: "relative",
          minHeight: 360,
          borderRadius: 34,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,.12)",
          background:
            "radial-gradient(circle at 50% 50%, rgba(34,211,238,.12), transparent 32%), radial-gradient(circle at 30% 70%, rgba(168,85,247,.14), transparent 36%), #02030a"
        }}
      >
        <h2 style={{ position: "absolute", left: 22, top: 18, margin: 0, fontSize: 22 }}>
          Your Story
        </h2>

        {storyStars.map((star) => {
          const size =
            star.weight === "core"
              ? 22
              : star.weight === "planet"
                ? 18
                : star.weight === "bright"
                  ? 14
                  : 10;

          return (
            <button
              key={star.id}
              type="button"
              aria-label={star.title}
              data-story-star={star.id}
              style={{
                position: "absolute",
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: size,
                height: size,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,.44)",
                background:
                  "radial-gradient(circle, rgba(255,255,255,.96), rgba(103,232,249,.62), rgba(168,85,247,.12))",
                boxShadow:
                  star.weight === "core"
                    ? "0 0 44px rgba(103,232,249,.72)"
                    : "0 0 24px rgba(103,232,249,.38)",
                transform: "translate(-50%, -50%)"
              }}
            />
          );
        })}
      </div>

      <div
        data-testid="lumaspace-echo-memory"
        style={{
          borderRadius: 28,
          border: "1px solid rgba(103,232,249,.22)",
          background: "rgba(255,255,255,.055)",
          padding: 18
        }}
      >
        <strong>Echo Memory</strong>
        <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,.68)" }}>
          This memory belongs to my story.
        </p>
      </div>

      <div
        data-testid="lumaspace-memory-spark"
        style={{
          borderRadius: 28,
          border: "1px solid rgba(255,255,255,.12)",
          background: "linear-gradient(135deg, rgba(34,211,238,.12), rgba(168,85,247,.12))",
          padding: 18
        }}
      >
        <strong>2026 Memory Spark</strong>
        <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,.66)" }}>
          Homecoming · Story Constellation · Echoes · People · Worlds
        </p>
      </div>
    </section>
  );
}
