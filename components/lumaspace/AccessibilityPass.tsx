// FILE: components/lumaspace/AccessibilityPass.tsx
"use client";

import { useEffect, useState } from "react";

interface AccessibilityPassProps {
  debugTag?: string;
}

export default function AccessibilityPass({ debugTag }: AccessibilityPassProps) {
  const [status, setStatus] = useState<"idle" | "applied" | "error">("idle");
  const [prefs, setPrefs] = useState({
    highContrast: false,
    reducedMotion: false,
    largeText: false,
  });

  useEffect(() => {
    try {
      const prefersContrast = window.matchMedia("(prefers-contrast: more)").matches;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const prefersLargeText = window.matchMedia("(min-resolution: 2dppx)").matches;

      const detected = {
        highContrast: prefersContrast,
        reducedMotion: prefersReducedMotion,
        largeText: prefersLargeText,
      };
      setPrefs(detected);

      document.body.classList.toggle("high-contrast", prefersContrast);
      document.body.classList.toggle("reduced-motion", prefersReducedMotion);
      document.body.classList.toggle("large-text", prefersLargeText);

      setStatus("applied");
      console.debug(`[${debugTag || "accessibility"}] pass applied`, detected);
    } catch (err) {
      console.error("AccessibilityPass error", err);
      setStatus("error");
    }
  }, [debugTag]);

  return (
    <section className="p-4 rounded-xl border border-border/60 bg-background/60 text-sm space-y-1">
      <h2 className="font-medium">Accessibility Mode</h2>
      <p className="text-xs text-muted-foreground">
        {status === "applied"
          ? "Your accessibility preferences have been automatically applied."
          : status === "error"
          ? "An error occurred while applying accessibility preferences."
          : "Detecting your accessibility preferences..."}
      </p>
      <ul className="text-xs text-muted-foreground list-disc pl-4">
        <li>High Contrast: {prefs.highContrast ? "Yes" : "No"}</li>
        <li>Reduced Motion: {prefs.reducedMotion ? "Yes" : "No"}</li>
        <li>Large Text: {prefs.largeText ? "Yes" : "No"}</li>
      </ul>
    </section>
  );
}