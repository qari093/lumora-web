"use client";

import { useEffect } from "react";

export function useNativeFypKeyboard(input: {
  onNext: () => void;
  onPrev: () => void;
  onMuteToggle: () => void;
}) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "ArrowDown") input.onNext();
      if (e.key === "ArrowUp") input.onPrev();
      if (e.key.toLowerCase() === "m") input.onMuteToggle();
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [input]);
}
