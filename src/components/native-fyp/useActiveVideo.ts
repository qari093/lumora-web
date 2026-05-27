"use client";

import { useRef, useEffect } from "react";

export function useActiveVideo(isActive: boolean) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    if (isActive) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.removeAttribute("src");
      v.load();
    }
  }, [isActive]);

  return ref;
}
