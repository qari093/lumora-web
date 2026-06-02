"use client";

export default function GravityCoreGhostHand() {
  return (
    <div
      data-gravity-ghost-hand="true"
      aria-hidden="true"
      className="pointer-events-none fixed bottom-24 left-1/2 -translate-x-1/2 text-xs opacity-40"
    >
      Pull to return
    </div>
  );
}
