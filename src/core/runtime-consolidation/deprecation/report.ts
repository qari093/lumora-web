import { RUNTIME_DEPRECATIONS } from "./registry";

export interface RuntimeDeprecationReport {
  generatedAt: string;
  total: number;
  soft: number;
  strict: number;
  blocked: number;
  entries: typeof RUNTIME_DEPRECATIONS;
}

export function buildRuntimeDeprecationReport(): RuntimeDeprecationReport {
  return {
    generatedAt: new Date().toISOString(),
    total: RUNTIME_DEPRECATIONS.length,
    soft: RUNTIME_DEPRECATIONS.filter((entry) => entry.severity === "soft").length,
    strict: RUNTIME_DEPRECATIONS.filter((entry) => entry.severity === "strict").length,
    blocked: RUNTIME_DEPRECATIONS.filter((entry) => entry.severity === "blocked").length,
    entries: RUNTIME_DEPRECATIONS
  };
}
