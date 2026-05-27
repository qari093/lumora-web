"use client";

import React from "react";
import { pushClientSignal } from "@/src/runtime/clientSignal";
export default function FypRuntimeVideoSignalBridge({
  currentTimeMs = 0,
}: {
  currentTimeMs?: number;
}) {
  function emitSignals() {
    pushClientSignal({ type: "present", currentTimeMs });
    setTimeout(() => pushClientSignal({ type: "hold", currentTimeMs }), 1200);
    setTimeout(() => pushClientSignal({ type: "rewatch", currentTimeMs }), 2400);
  }
  return (
    <span data-runtime-video-signal-bridge onClick={emitSignals}>
      FypRuntimeVideoSignalBridge {currentTimeMs}
    </span>
  );
}
