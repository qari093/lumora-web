"use client";

import { useEffect } from "react";

export function usePreload(url?: string, mode?: string) {
  useEffect(() => {
    if (!url) return;

    if (mode === "data_saver") return;

    const v = document.createElement("video");

    v.src = url;
    v.muted = true;

    if (mode === "wifi") {
      v.preload = "auto"; // slightly stronger
    } else {
      v.preload = "metadata"; // light
    }

    return () => {
      v.src = "";
    };
  }, [url, mode]);
}
