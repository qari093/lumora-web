// FILE: app/_client/gestures.ts
// LumaSpace Mobile Gestures — robust, leak-free hook with Touch + Pointer fallback
// Features:
//  • Horizontal swipe detection with threshold + vertical guard
//  • Pull-down gesture limited to top area
//  • Cleans up listeners on unmount
//  • Works on touch-capable devices; falls back to pointer events when touch is unavailable

"use client";

import { useEffect } from "react";

type Fn = () => void;

export type GestureOptions = {
  minSwipeX?: number;      // px required for horizontal swipe
  minPullY?: number;       // px required for pull-down
  topZone?: number;        // px from top to allow pull-down
  verticalGuard?: number;  // max vertical/horizontal ratio to consider swipe
};

export function useLumaGestures(
  onSwipeLeft?: Fn,
  onSwipeRight?: Fn,
  onPullDown?: Fn,
  opts: GestureOptions = {}
) {
  const {
    minSwipeX = 60,
    minPullY = 80,
    topZone = 150,
    verticalGuard = 1.2, // if |dy| > |dx|*verticalGuard, treat as vertical intent
  } = opts;

  useEffect(() => {
    let startX = 0,
      startY = 0,
      endX = 0,
      endY = 0,
      tracking = false;

    const begin = (x: number, y: number) => {
      startX = endX = x;
      startY = endY = y;
      tracking = true;
    };

    const move = (x: number, y: number) => {
      if (!tracking) return;
      endX = x;
      endY = y;
    };

    const finish = () => {
      if (!tracking) return;

      const dx = endX - startX;
      const dy = endY - startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      // Horizontal swipe: ensure horizontal dominance with guard
      if (absX >= minSwipeX && absX >= absY * verticalGuard) {
        if (dx > 0) onSwipeRight && onSwipeRight();
        else onSwipeLeft && onSwipeLeft();
        tracking = false;
        return;
      }

      // Pull-down only when starting near top
      if (dy >= minPullY && absY > absX && startY <= topZone) {
        onPullDown && onPullDown();
      }

      tracking = false;
    };

    // Touch handlers (primary path on mobile)
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches?.[0];
      if (!t) return;
      begin(t.clientX, t.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches?.[0];
      if (!t) return;
      move(t.clientX, t.clientY);
    };
    const onTouchEnd = () => finish();

    // Pointer fallback (for hybrid devices / emulators)
    let pointerDown = false;
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // touch path already handles
      pointerDown = true;
      begin(e.clientX, e.clientY);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!pointerDown) return;
      move(e.clientX, e.clientY);
    };
    const onPointerUp = () => {
      if (!pointerDown) return;
      pointerDown = false;
      finish();
    };

    // Register listeners
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("touchstart", onTouchStart as EventListener);
      window.removeEventListener("touchmove", onTouchMove as EventListener);
      window.removeEventListener("touchend", onTouchEnd as EventListener);

      window.removeEventListener("pointerdown", onPointerDown as EventListener);
      window.removeEventListener("pointermove", onPointerMove as EventListener);
      window.removeEventListener("pointerup", onPointerUp as EventListener);
    };
  }, [onSwipeLeft, onSwipeRight, onPullDown, minSwipeX, minPullY, topZone, verticalGuard]);
}

export default useLumaGestures;