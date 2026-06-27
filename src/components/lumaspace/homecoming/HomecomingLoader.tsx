"use client";

import { useEffect, useState } from "react";
import LivingStar from "./LivingStar";
import NexaWhisper from "./NexaWhisper";
import UniverseExpansion from "./UniverseExpansion";
import { getHomecomingPhase, type HomecomingPhase, type LumaSpaceMood } from "@/src/core/lumaspace/homecoming/runtime";

export default function HomecomingLoader({
  name = "home",
  mood = "wonder"
}: {
  name?: string;
  mood?: LumaSpaceMood;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = window.setInterval(() => setElapsed(Date.now() - start), 120);
    return () => window.clearInterval(timer);
  }, []);

  const phase: HomecomingPhase = getHomecomingPhase(elapsed);
  const whisper =
    name === "home"
      ? "Welcome home. Your story continues."
      : `Welcome home, ${name}. Your story continues.`;

  return (
    <main
      data-testid="lumaspace-homecoming"
      style={{
        position: "fixed",
        inset: 0,
        minHeight: "100svh",
        width: "100vw",
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        background: "#02030a",
        color: "#fff",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        isolation: "isolate"
      }}
    >
      <UniverseExpansion mood={mood} />

      <section
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          opacity: phase === "dark" ? 0 : 1,
          transition: "opacity 420ms ease"
        }}
      >
        <LivingStar expanded={phase === "universe"} />
        {(phase === "whisper" || phase === "universe") && (
          <NexaWhisper text={whisper} />
        )}
      </section>
    </main>
  );
}
