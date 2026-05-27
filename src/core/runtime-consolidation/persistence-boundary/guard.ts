import type { RuntimeDomain } from "../domainRegistry";
import type {
  PersistenceBoundaryDecision,
  PersistenceBoundaryRule,
  PersistenceOperation
} from "./types";
import { PERSISTENCE_BOUNDARY_RULES } from "./registry";

export function getPersistenceBoundaryRule(domain: RuntimeDomain): PersistenceBoundaryRule {
  return PERSISTENCE_BOUNDARY_RULES.find((rule) => rule.domain === domain) ??
    PERSISTENCE_BOUNDARY_RULES.find((rule) => rule.domain === "unknown")!;
}

export function evaluatePersistenceOperation(input: {
  domain: RuntimeDomain;
  operation: PersistenceOperation;
  requester?: string;
}): PersistenceBoundaryDecision {
  const rule = getPersistenceBoundaryRule(input.domain);
  const operationAllowed = rule.allowedOperations.includes(input.operation);

  const writeOwnerAllowed =
    input.operation !== "write" ||
    rule.writeOwner === null ||
    input.requester === rule.writeOwner;

  const allowed = operationAllowed && writeOwnerAllowed && rule.mode !== "blocked";

  return {
    domain: input.domain,
    operation: input.operation,
    allowed,
    mode: rule.mode,
    writeOwner: rule.writeOwner,
    reason: allowed
      ? "persistence_operation_allowed"
      : !operationAllowed
        ? "operation_not_allowed_for_domain"
        : !writeOwnerAllowed
          ? "write_requires_canonical_owner"
          : "domain_persistence_blocked"
  };
}

export function assertPersistenceAllowed(input: {
  domain: RuntimeDomain;
  operation: PersistenceOperation;
  requester?: string;
}): void {
  const decision = evaluatePersistenceOperation(input);
  if (!decision.allowed) {
    throw new Error(decision.reason);
  }
}
