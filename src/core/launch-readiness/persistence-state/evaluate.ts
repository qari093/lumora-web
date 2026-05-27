import type {
  PersistenceIntegrityFinding,
  PersistenceRisk,
  PersistenceTarget,
  RecoveryCheck
} from "./types";
import { getPersistenceCapabilities } from "./adapters";

function riskFromMissing(target: PersistenceTarget, missing: string[]): PersistenceRisk {
  if (missing.length === 0) return "none";
  if (target.domain === "wallet" || target.domain === "commerce") return "critical";
  if (target.requiresRollback && missing.includes("rollback")) return "high";
  if (missing.includes("persistentWrite")) return "high";
  if (missing.includes("recovery")) return "high";
  if (missing.includes("idempotency")) return "medium";
  return "low";
}

export function evaluatePersistenceTarget(target: PersistenceTarget): PersistenceIntegrityFinding {
  const capabilities = getPersistenceCapabilities(target.name);

  if (!capabilities) {
    return {
      target: target.name,
      domain: target.domain,
      risk: "critical",
      status: "FAILED",
      message: "No persistence capability record exists for this launch target.",
      requiredFix: "Add a real persistence adapter capability record and validate it."
    };
  }

  const missing: string[] = [];
  if (target.requiresPersistentWrite && !capabilities.persistentWrite) missing.push("persistentWrite");
  if (target.requiresIdempotency && !capabilities.idempotency) missing.push("idempotency");
  if (target.requiresRollback && !capabilities.rollback) missing.push("rollback");
  if (target.requiresRecovery && !capabilities.recovery) missing.push("recovery");

  const risk = riskFromMissing(target, missing);

  return {
    target: target.name,
    domain: target.domain,
    risk,
    status: risk === "critical" || risk === "high" ? "FAILED" : risk === "medium" || risk === "low" ? "WARNING" : "PASS",
    message: missing.length === 0
      ? "Persistence target satisfies launch integrity requirements."
      : `Missing persistence capabilities: ${missing.join(", ")}.`,
    ...(missing.length > 0
      ? { requiredFix: "Complete persistent write, idempotency, rollback, or recovery capability before launch." }
      : {})
  };
}

export function buildRecoveryCheck(target: PersistenceTarget): RecoveryCheck {
  const capabilities = getPersistenceCapabilities(target.name);

  const supportsSnapshot = Boolean(capabilities?.snapshot);
  const supportsReplay = Boolean(capabilities?.replay);
  const supportsRollback = Boolean(capabilities?.rollback);
  const supportsFallback = Boolean(capabilities?.fallback);

  const status =
    target.requiresRecovery && (!supportsSnapshot || !supportsFallback)
      ? "FAILED"
      : target.requiresRollback && !supportsRollback
        ? "FAILED"
        : !supportsReplay
          ? "WARNING"
          : "PASS";

  return {
    name: target.name,
    domain: target.domain,
    supportsSnapshot,
    supportsReplay,
    supportsRollback,
    supportsFallback,
    status
  };
}
