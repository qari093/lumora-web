"use client";

import { useEffect, useState } from "react";

export function usePlaybackHealth(isActive: boolean, ready: boolean) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setSlow(false);
      return;
    }

    const timer = window.setTimeout(() => {
      if (!ready) setSlow(true);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [isActive, ready]);

  return { slow };
}
