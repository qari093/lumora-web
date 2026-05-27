"use client";

import { useRef } from "react";

export function useSwipeIntent(onIntent?: (direction: "up" | "down") => void) {
  const startY = useRef<number | null>(null);

  function onPointerDown(y: number) {
    startY.current = y;
  }

  function onPointerMove(y: number) {
    if (startY.current === null) return;

    const delta = startY.current - y;
    if (Math.abs(delta) > 24) {
      onIntent?.(delta > 0 ? "up" : "down");
    }
  }

  function resetIntent() {
    startY.current = null;
  }

  return { onPointerDown, onPointerMove, resetIntent };
}
