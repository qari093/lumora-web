import type { RuntimeDeprecationDecision } from "./types";
import { RUNTIME_DEPRECATIONS } from "./registry";

export function evaluateRouteDeprecation(path: string): RuntimeDeprecationDecision {
  const entry = RUNTIME_DEPRECATIONS.find((item) => path === item.deprecatedPrefix || path.startsWith(`${item.deprecatedPrefix}/`));

  if (!entry) {
    return {
      deprecated: false,
      allowed: true,
      severity: "none",
      canonicalRoute: null,
      migrationNote: null
    };
  }

  return {
    deprecated: true,
    allowed: entry.severity !== "blocked",
    severity: entry.severity,
    canonicalRoute: entry.canonicalPrefix,
    migrationNote: entry.migrationNote
  };
}

export function buildDeprecationHeaders(path: string): Record<string, string> {
  const decision = evaluateRouteDeprecation(path);

  if (!decision.deprecated) return {};

  return {
    "x-lumora-deprecated": "true",
    "x-lumora-deprecation-severity": decision.severity,
    "x-lumora-canonical-route": decision.canonicalRoute ?? "",
    "x-lumora-migration-note": decision.migrationNote ?? ""
  };
}
