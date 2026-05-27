"use client";

import { useEffect } from "react";

export function usePlaybackWarmup(url?: string, posterUrl?: string) {
  useEffect(() => {
    if (posterUrl) {
      const img = new Image();
      img.decoding = "async";
      img.src = posterUrl;
    }

    if (!url) return;

    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.src = url;

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [url, posterUrl]);
}
