"use client";

import EchoRecorder from "./EchoRecorder";
import EchoPlayer from "./EchoPlayer";
import { createEchoMemory } from "@/src/core/lumaspace/echo/runtime";

export default function EchoMemoryCard() {
  const echo = createEchoMemory({
    id: "echo-1",
    memoryId: "nebula",
    transcript: "This memory belongs to my story.",
    visibility: "private",
    durationSeconds: 15
  });

  return (
    <section data-testid="lumaspace-echo-memory-card" style={{ display: "grid", gap: 12 }}>
      <EchoPlayer echo={echo} />
      <EchoRecorder />
    </section>
  );
}
