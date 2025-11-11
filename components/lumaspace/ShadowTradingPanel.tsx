// FILE: components/lumaspace/ShadowTradingPanel.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

// ──────────────────────────────── Types ────────────────────────────────
interface ShadowTradingPanelProps {
  debugTag?: string;
  refreshIntervalMs?: number;
}

// ──────────────────────────────── Component ────────────────────────────────
export default function ShadowTradingPanel({
  debugTag = "shadow-trading",
  refreshIntervalMs = 5000,
}: ShadowTradingPanelProps) {
  const [shadowState, setShadowState] = useState<null | {
    depth: number;
    activeTraps: number;
    marketTemp: number;
    lastSync: string;
  }>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ──────────────────────────────── Fetch Shadow State ────────────────────────────────
  const fetchShadowState = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/lumaspace/shadow", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setShadowState({
        depth: data.depth ?? 0,
        activeTraps: data.activeTraps ?? 0,
        marketTemp: data.marketTemp ?? 0,
        lastSync: new Date().toLocaleTimeString(),
      });
    } catch (err: any) {
      setError(err.message || "Failed to load shadow state");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ──────────────────────────────── Periodic Refresh ────────────────────────────────
  useEffect(() => {
    fetchShadowState();
    const timer = setInterval(fetchShadowState, refreshIntervalMs);
    return () => clearInterval(timer);
  }, [fetchShadowState, refreshIntervalMs]);

  // ──────────────────────────────── UI ────────────────────────────────
  return (
    <div className="rounded-xl border border-neutral-800 bg-black/30 p-4 backdrop-blur-md shadow-lg text-sm text-neutral-200 space-y-3">
      <header className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-amber-400">
          Shadow Trading Surface
        </h2>
        <span className="text-xs opacity-70">
          {shadowState?.lastSync ? `Synced: ${shadowState.lastSync}` : "Loading..."}
        </span>
      </header>

      {error && (
        <p className="text-xs text-red-400 bg-red-900/40 p-2 rounded-md">
          {error}
        </p>
      )}

      {isLoading && !shadowState && (
        <p className="text-xs text-muted-foreground">Loading shadow metrics...</p>
      )}

      {shadowState && (
        <div className="grid grid-cols-3 gap-3">
          <Metric label="Depth" value={shadowState.depth.toFixed(2)} unit="m" />
          <Metric label="Active Traps" value={shadowState.activeTraps} />
          <Metric
            label="Market Temp"
            value={shadowState.marketTemp.toFixed(1)}
            unit="°"
          />
        </div>
      )}

      <div className="pt-3 flex justify-between items-center">
        <button
          onClick={fetchShadowState}
          disabled={isLoading}
          className="rounded-md border border-neutral-600 bg-neutral-900 px-3 py-1 text-xs hover:bg-neutral-800 active:scale-[0.98] transition disabled:opacity-40"
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>

        <motion.span
          className="text-[0.65rem] text-neutral-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {debugTag}
        </motion.span>
      </div>
    </div>
  );
}

// ──────────────────────────────── Metric Component ────────────────────────────────
function Metric({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <motion.div
      className="rounded-md bg-neutral-800/50 p-3 text-center border border-neutral-700 hover:border-amber-500/50 transition"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-xs text-neutral-400">{label}</div>
      <div className="text-lg font-semibold text-amber-300">
        {value}
        {unit && <span className="text-xs text-neutral-500 ml-0.5">{unit}</span>}
      </div>
    </motion.div>
  );
}