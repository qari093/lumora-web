export type ValidationOut = { ok: boolean; errors: string[] };

function bad(msg: string): ValidationOut {
  return { ok: false, errors: [msg] };
}

export function validateHealth(input: any): ValidationOut {
  if (!input || typeof input !== "object") return bad("health_not_object");
  if (typeof input.ok !== "boolean") return bad("health_ok_required");
  if (typeof input.ts !== "number") return bad("health_ts_required");
  return { ok: true, errors: [] };
}

export function validateMetrics(input: any): ValidationOut {
  if (!input || typeof input !== "object") return bad("metrics_not_object");
  if (input.ok !== true) return bad("metrics_ok_required_true");
  if (typeof input.ts !== "number") return bad("metrics_ts_required");
  if (typeof input.uptimeMs !== "number") return bad("metrics_uptimeMs_required");
  return { ok: true, errors: [] };
}

export function validateDiag(input: any): ValidationOut {
  if (!input || typeof input !== "object") return bad("diag_not_object");
  if (typeof input.ok !== "boolean") return bad("diag_ok_required");
  if (typeof input.ts !== "number") return bad("diag_ts_required");

  // Partial-safe: health/metrics may be missing in some call paths, but if present validate shallowly
  if ("health" in input) {
    const h = validateHealth(input.health);
    if (!h.ok) return bad("diag_health_invalid");
  }
  if ("metrics" in input) {
    const m = validateMetrics(input.metrics);
    if (!m.ok) return bad("diag_metrics_invalid");
  }
  return { ok: true, errors: [] };
}
