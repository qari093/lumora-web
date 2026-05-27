import React from "react";

export function Fyp94Overlay({ children }: { children?: React.ReactNode }) {
  return (
    <div data-testid="fyp94-overlay" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {children}
    </div>
  );
}
