import { inferRuntimeDomain } from "../domainRegistry";
import { getDeprecatedCanonicalTarget } from "../domainOwnership";
import { getCanonicalOrchestrator } from "./registry";
import type { OrchestratorDecision } from "./types";

export function routeThroughCanonicalOrchestrator(path: string): OrchestratorDecision {
  const domain = inferRuntimeDomain(path);
  const orchestrator = getCanonicalOrchestrator(domain);
  const deprecatedTarget = getDeprecatedCanonicalTarget(path);

  if (domain === "unknown") {
    return {
      ok: false,
      domain,
      orchestrator: orchestrator.name,
      route: path,
      allowed: false,
      reason: "unknown_domain_requires_classification"
    };
  }

  if (deprecatedTarget) {
    return {
      ok: true,
      domain,
      orchestrator: orchestrator.name,
      route: path,
      allowed: true,
      reason: `deprecated_alias_use_canonical:${deprecatedTarget}`
    };
  }

  return {
    ok: true,
    domain,
    orchestrator: orchestrator.name,
    route: path,
    allowed: true,
    reason: "canonical_orchestrator_selected"
  };
}

export function assertRouteUsesOrchestrator(path: string): boolean {
  return routeThroughCanonicalOrchestrator(path).allowed;
}
