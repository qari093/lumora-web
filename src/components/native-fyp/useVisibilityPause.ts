"use client";

import { useEffect } from "react";

export function useVisibilityPause(video?: HTMLVideoElement | null) {
  useEffect(() => {
    if (!video) return;
    const currentVideo = video;

    function onVisibilityChange() {
      if (document.hidden) {
        currentVideo.pause();
      } else {
        currentVideo.play().catch(() => {});
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [video]);
}
