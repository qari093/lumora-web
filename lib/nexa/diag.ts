import * as runtime from "./runtime";
import * as metrics from "./metrics";

type AnyObj = Record<string, any>;

function safeHealth(): AnyObj {
  const fn = (runtime as any)?.getNexaRuntimeHealth;
  if (typeof fn !== "function") {
    return { ok: false, error: "missing_export:getNexaRuntimeHealth", ts: Date.now() };
  }
  try {
    return fn();
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "health_error";
    return { ok: false, error: msg, ts: Date.now() };
  }
}

function safeMetrics(): AnyObj {
  const fn = (metrics as any)?.getNexaRuntimeMetrics;
  if (typeof fn !== "function") {
    return { ok: false, error: "missing_export:getNexaRuntimeMetrics", ts: Date.now() };
  }
  try {
    return fn();
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "metrics_error";
    return { ok: false, error: msg, ts: Date.now() };
  }
}

export type NexaDiag = {
  ok: true;
  ts: number;
  health: AnyObj;
  metrics: AnyObj;
};

export function getNexaDiag(): NexaDiag {
  return {
    ok: true,
    ts: Date.now(),
    health: safeHealth(),
    metrics: safeMetrics(),
  };
}
