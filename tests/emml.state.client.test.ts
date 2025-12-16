// @ts-nocheck
// FILE: app/_client/emml-state-client.ts
"use client";

import { useEffect, useRef, useState } from "react";

export type EmmlStateHealth = "ok" | "degraded" | "down";

export interface EmmlStateSnapshot {
  updatedAt: string;
  marketsOnline: number;
  indicesTracked: number;
  heatSampleSize: number;
  health: EmmlStateHealth;
}

const EMML_STATE_ENDPOINT = "/api/emml/state";

// ───────────────────────── helpers ─────────────────────────

function toNumberSafe(...candidates: unknown[]): number {
  for (const c of candidates) {
    const n = typeof c === "string" || typeof c === "number" ? Number(c) : NaN;
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function normaliseEmmlState(raw: unknown): EmmlStateSnapshot {
  const obj = (raw ?? {}) as Record<string, unknown>;
  const nowIso = new Date().toISOString();

  const marketsOnline = toNumberSafe(
    obj.marketsOnline,
    obj.markets_count,
    obj.markets,
  );

  const indicesTracked = toNumberSafe(
    obj.indicesTracked,
    obj.indices_count,
    obj.indices,
  );

  const heatSampleSize = toNumberSafe(
    obj.heatSampleSize,
    obj.samples,
    obj.heat_samples,
  );

  const rawHealth = typeof obj.health === "string" ? obj.health : undefined;
  const health: EmmlStateHealth =
    rawHealth === "degraded" || rawHealth === "down" ? rawHealth : "ok";

  const updatedAt =
    typeof obj.updatedAt === "string" && obj.updatedAt.trim().length > 0
      ? obj.updatedAt
      : nowIso;

  return {
    updatedAt,
    marketsOnline,
    indicesTracked,
    heatSampleSize,
    health,
  };
}

// ──────────────────────── fetch API ────────────────────────

/**
 * Lightweight client-side fetcher for EMML state snapshot.
 * This is the function asserted by tests/emml.state.client.test.ts.
 */
export async function fetchEmmlState(
  signal?: AbortSignal,
): Promise<EmmlStateSnapshot> {
  const res = await fetch(EMML_STATE_ENDPOINT, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch EMML state: ${res.status} ${res.statusText}`,
    );
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch (err) {
    throw new Error(
      `Failed to parse EMML state JSON: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }

  return normaliseEmmlState(json);
}

// ───────────────────────── React hook ─────────────────────────

/**
 * Convenience React hook for components that want a live EMML state snapshot.
 * Not required by tests but used by EMML dashboards / overlays.
 */
export function useEmmlState(options?: {
  intervalMs?: number;
}): {
  state: EmmlStateSnapshot | null;
  loading: boolean;
  error: Error | null;
} {
  const intervalMs = options?.intervalMs ?? 15_000;

  const [state, setState] = useState<EmmlStateSnapshot | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      // cancel previous in-flight request (if any)
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setLoading(true);
        const snapshot = await fetchEmmlState(controller.signal);
        if (!isMounted) return;
        setState(snapshot);
        setError(null);
      } catch (err: unknown) {
        if (!isMounted) return;
        if ((err as any)?.name === "AbortError") return;

        const safeError =
          err instanceof Error ? err : new Error(String(err ?? "Unknown error"));
        setError(safeError);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // initial load
    void load();

    // polling loop (only in browser)
    const id = typeof window !== "undefined"
      ? window.setInterval(load, intervalMs)
      : null;

    return () => {
      isMounted = false;
      abortRef.current?.abort();
      if (id !== null) {
        window.clearInterval(id);
      }
    };
  }, [intervalMs]);

  return { state, loading, error };
}