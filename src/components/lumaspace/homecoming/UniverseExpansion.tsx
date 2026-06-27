"use client";

import { moodAtmosphere, type LumaSpaceMood } from "@/src/core/lumaspace/homecoming/runtime";

export default function UniverseExpansion({
  mood = "wonder"
}: {
  mood?: LumaSpaceMood;
}) {
  return (
    <div
      data-testid="lumaspace-universe-expansion"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        background: moodAtmosphere[mood],
        opacity: 0.96,
        transition: "opacity 600ms ease"
      }}
    />
  );
}
