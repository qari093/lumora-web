"use client";

import { useEffect } from "react";

/**
 * BootMark
 * Records precise timestamps for:
 * - splash_end
 * - first_interactive
 * Stored in performance marks for later analysis.
 */
export default function BootMark() {
  useEffect(() => {
    try {
      performance.mark("lumora:splash_end");
      // Schedule first-interactive after next frame
      requestAnimationFrame(() => {
        performance.mark("lumora:first_interactive");
        performance.measure(
          "lumora:boot_to_interactive",
          "navigationStart",
          "lumora:first_interactive"
        );
      });
    } catch {
      // ignore
    }
  }, []);

  return null;
}
