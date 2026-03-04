import React from "react";

type Props = {
  title?: string;
  lines?: number;
};

export default function PortalLoading({ title = "Loading", lines = 6 }: Props) {
  const n = Math.max(3, Math.min(12, Math.trunc(lines)));
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full rounded-xl border border-white/10 bg-black/40 p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
        <div className="h-4 w-16 rounded bg-white/10 animate-pulse" />
      </div>

      <div className="mt-4 space-y-2">
        {Array.from({ length: n }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded bg-white/10 animate-pulse"
            style={{ width: `${70 + ((i * 7) % 25)}%` }}
          />
        ))}
      </div>

      <div className="mt-4 text-xs opacity-60">{title}…</div>
    </div>
  );
}
