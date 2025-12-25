"use client";

export type MemResult = {
  usedMB: number | null;
  totalMB: number | null;
  limitMB: number | null;
};

export function sampleMemory(): MemResult {
  const mem = (performance as any)?.memory;
  if (!mem) return { usedMB: null, totalMB: null, limitMB: null };
  const used = typeof mem.usedJSHeapSize === "number" ? mem.usedJSHeapSize : null;
  const total = typeof mem.totalJSHeapSize === "number" ? mem.totalJSHeapSize : null;
  const limit = typeof mem.jsHeapSizeLimit === "number" ? mem.jsHeapSizeLimit : null;

  const toMB = (v: number | null) => (typeof v === "number" ? Math.round((v / (1024 * 1024)) * 10) / 10 : null);
  return { usedMB: toMB(used), totalMB: toMB(total), limitMB: toMB(limit) };
}
