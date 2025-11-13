// FILE: app/_client/gestures-mount.tsx
// Stable, leak-free gesture mount with touch event lifecycle management and adaptive refresh

"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLumaGestures } from "./gestures";

type Props = {
  enableNav?: boolean; // swipe left/right → history nav
  enableDrawers?: boolean; // edge swipes emit drawer events
  pullDownAction?: "reload" | "event"; // what to do on pull-down
  edgePx?: number; // edge zone width in px
  minSwipeX?: number; // horizontal swipe threshold
  minPullY?: number; // vertical pull threshold
};

export default function GesturesMount({
  enableNav = true,
  enableDrawers = true,
  pullDownAction = "reload",
  edgePx = 28,
  minSwipeX = 60,
  minPullY = 80,
}: Props) {
  const router = useRouter();

  const cfg = useMemo(
    () => ({
      edgePx: Math.max(8, edgePx),
      minSwipeX: Math.max(40, minSwipeX),
      minPullY: Math.max(60, minPullY),
    }),
    [edgePx, minSwipeX, minPullY]
  );

  const startX = useRef(0);
  const viewportW = useRef(0);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches?.[0];
      if (!t) return;
      startX.current = t.clientX;
      viewportW.current =
        window.innerWidth || document.documentElement.clientWidth || 0;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    return () => window.removeEventListener("touchstart", onTouchStart);
  }, []);

  useLumaGestures(
    // onSwipeLeft
    () => {
      const fromRightEdge =
        viewportW.current && startX.current >= viewportW.current - cfg.edgePx;
      if (enableDrawers && fromRightEdge) {
        dispatchEvent(
          new CustomEvent("lumora:open-right-drawer", {
            detail: { via: "edge-swipe" },
          })
        );
        return;
      }
      if (enableNav) router.forward();
    },
    // onSwipeRight
    () => {
      const fromLeftEdge = startX.current <= cfg.edgePx;
      if (enableDrawers && fromLeftEdge) {
        dispatchEvent(
          new CustomEvent("lumora:open-left-drawer", {
            detail: { via: "edge-swipe" },
          })
        );
        return;
      }
      if (enableNav) router.back();
    },
    // onPullDown
    () => {
      if (pullDownAction === "reload") {
        try {
          if ("navigation" in window && (window as any).navigation?.reload) {
            (window as any).navigation.reload();
          } else {
            window.location.reload();
          }
        } catch {
          window.location.reload();
        }
      } else {
        dispatchEvent(
          new CustomEvent("lumora:pull-down", { detail: { via: "gesture" } })
        );
      }
    }
  );

  return null;
}