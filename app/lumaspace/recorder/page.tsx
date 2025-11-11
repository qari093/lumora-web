// app/lumaspace/recorder/page.tsx
"use client";

import React from "react";
import RecorderEngine, {
  RecorderResult,
} from "@/components/lumaspace/RecorderEngine";

export default function LumaSpaceRecorderPage() {
  const handleStop = async (result: RecorderResult) => {
    // In mock mode or if browser recording fails, blob may be undefined
    if (!result.blob) return;

    const formData = new FormData();
    formData.append("recording", result.blob, "lumaspace-recording.webm");

    try {
      await fetch("/api/lumaspace/recorder/upload", {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      // Non-fatal — recorder UX must not crash on upload failure
      console.error("Failed to upload LumaSpace recording", err);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          LumaSpace Recorder
        </h1>
        <p className="text-sm text-muted-foreground">
          Capture a quick voice reflection. Your audio stays in your LumaSpace unless
          you choose to share it.
        </p>
      </header>

      <section className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Tip: use this to record short memory notes or shadow impressions. You can
          link these recordings from your Memory Palace later.
        </p>

        <RecorderEngine
          debugTag="lumaspace-recorder"
          maxDurationSec={300}
          tickIntervalMs={500}
          onStop={handleStop}
          onError={(err) => console.error("Recorder error", err)}
        />
      </section>
    </main>
  );
}
