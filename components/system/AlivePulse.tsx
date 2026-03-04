import React from "react";

export type AlivePulseProps = {
  portal: string;
};

/**
 * Lightweight "alive marker" used by portal contract/smoke tests.
 * Renders a deterministic hidden marker element.
 */
export default function AlivePulse({ portal }: AlivePulseProps) {
  const key = String(portal || "Portal")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return (
    <div
      id={`LUMORA_PORTAL_ALIVE_${key}`}
      style={{ display: "none" }}
      aria-hidden="true"
      suppressHydrationWarning
    >
      alive
    </div>
  );
}
