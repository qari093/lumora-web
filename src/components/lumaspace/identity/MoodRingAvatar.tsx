"use client";

import type { LumaIdentityMood } from "@/src/core/lumaspace/identity/runtime";

export default function MoodRingAvatar({
  mood = "wonder"
}: {
  mood?: LumaIdentityMood;
}) {
  const colors: Record<LumaIdentityMood, string> = {
    wonder: "rgba(168,85,247,.86)",
    calm: "rgba(147,197,253,.86)",
    dream: "rgba(251,191,36,.82)",
    focus: "rgba(52,211,153,.82)",
    healing: "rgba(244,114,182,.82)",
    shadow: "rgba(129,140,248,.76)"
  };

  return (
    <div
      data-testid="lumaspace-mood-ring-avatar"
      aria-label={`Mood ring avatar: ${mood}`}
      style={{
        width: 96,
        height: 96,
        borderRadius: 999,
        background: `radial-gradient(circle, rgba(255,255,255,.96), ${colors[mood]}, rgba(15,23,42,.18))`,
        boxShadow: `0 0 34px ${colors[mood]}, 0 0 96px rgba(34,211,238,.20)`,
        border: "1px solid rgba(255,255,255,.28)"
      }}
    />
  );
}
