"use client";

import React from "react";

function formatSeconds(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const r = totalSeconds % 60;
  return m > 0 ? `${m}m ${r}s` : `${r}s`;
}

type EnergyStormBannerProps = {
  secondsLeft?: number;
};

export default function EnergyStormBanner({
  secondsLeft = 0,
}: EnergyStormBannerProps) {
  if (secondsLeft <= 0) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-400 bg-amber-50 px-4 py-2 text-sm text-amber-900 shadow-sm">
      <span>
        ⚡ Energy storm in progress —{" "}
        <strong>{formatSeconds(secondsLeft)}</strong> remaining
      </span>
    </div>
  );
}
