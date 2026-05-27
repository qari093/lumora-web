"use client";

import { useRef } from "react";

export function useSwipe(onUp: () => void, onDown: () => void) {
  const startY = useRef<number | null>(null);

  function onTouchStart(e: TouchEvent) {
    startY.current = e.touches[0].clientY;
  }

  function onTouchEnd(e: TouchEvent) {
    if (startY.current === null) return;

    const endY = e.changedTouches[0].clientY;
    const delta = startY.current - endY;

    if (delta > 50) onUp();
    if (delta < -50) onDown();

    startY.current = null;
  }

  return { onTouchStart, onTouchEnd };
}
