// FILE: app/_client/gesture-runtime.tsx
// Unified Gesture Runtime Mount — combines gesture hooks, bridge, and logger
// Central point for all gesture-related modules under RuntimeRoot

"use client";

import { Suspense } from "react";
import GesturesProvider from "./gestures-provider";
import GestureBridge from "./gesture-bridge";
import GestureLogger from "./gesture-logger";

export default function GestureRuntime() {
  return (
    <Suspense fallback={null}>
      <GesturesProvider />
      <GestureBridge />
      <GestureLogger />
    </Suspense>
  );
}