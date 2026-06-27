"use client";

import { createNexaGuidance, getNexaWhisper, type NexaMood } from "@/src/core/lumaspace/nexa/runtime";

export default function NexaWhisperPanel({
  mood = "wonder"
}: {
  mood?: NexaMood;
}) {
  const whisper = getNexaWhisper("homecoming", mood);
  const guidance = createNexaGuidance(mood);

  return (
    <section
      data-testid="lumaspace-nexa-whisper-panel"
      style={{
        borderRadius: 30,
        border: "1px solid rgba(103,232,249,.18)",
        background:
          "radial-gradient(circle at 20% 20%, rgba(34,211,238,.12), transparent 38%), rgba(255,255,255,.045)",
        padding: 18,
        color: "white",
        display: "grid",
        gap: 12
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: ".22em", color: "rgba(103,232,249,.82)" }}>
        NEXA WHISPER
      </div>
      <p style={{ margin: 0, fontSize: 17, lineHeight: 1.45 }}>{whisper.message}</p>
      <p style={{ margin: 0, color: "rgba(255,255,255,.64)", fontSize: 13 }}>
        {guidance.gardenHint}
      </p>
      <p style={{ margin: 0, color: "rgba(255,255,255,.54)", fontSize: 12 }}>
        {guidance.storyHint}
      </p>
    </section>
  );
}
