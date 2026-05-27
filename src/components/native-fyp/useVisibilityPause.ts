"use client";

import { useEffect } from "react";

export function useVisibilityPause(video?: HTMLVideoElement | null) {
  useEffect(() => {
    if (!video) return;

    function onVisibilityChange() {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [video]);
}
