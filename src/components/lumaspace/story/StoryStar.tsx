"use client";

import type { StoryStar as StoryStarType } from "@/src/core/lumaspace/story/runtime";

export default function StoryStar({ star }: { star: StoryStarType }) {
  const size = star.weight === "core" ? 22 : star.weight === "planet" ? 18 : star.weight === "bright" ? 14 : 10;

  return (
    <button
      type="button"
      data-testid="lumaspace-story-star"
      aria-label={star.title}
      style={{
        position: "absolute",
        left: `${star.x}%`,
        top: `${star.y}%`,
        width: size,
        height: size,
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,.44)",
        background: "radial-gradient(circle, rgba(255,255,255,.96), rgba(103,232,249,.62), rgba(168,85,247,.12))",
        boxShadow: star.weight === "core" ? "0 0 44px rgba(103,232,249,.72)" : "0 0 24px rgba(103,232,249,.38)",
        transform: "translate(-50%, -50%)"
      }}
    />
  );
}
