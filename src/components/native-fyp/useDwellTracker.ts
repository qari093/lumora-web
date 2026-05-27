"use client";

import { useEffect, useRef } from "react";

export function useDwellTracker(activeId?: string, onDwell?: (id: string, ms: number) => void) {
  const startRef = useRef<number>(Date.now());
  const lastIdRef = useRef<string | undefined>(activeId);

  useEffect(() => {
    const now = Date.now();

    if (lastIdRef.current && lastIdRef.current !== activeId) {
      onDwell?.(lastIdRef.current, now - startRef.current);
    }

    lastIdRef.current = activeId;
    startRef.current = now;

    return () => {
      if (activeId) onDwell?.(activeId, Date.now() - startRef.current);
    };
  }, [activeId, onDwell]);
}
