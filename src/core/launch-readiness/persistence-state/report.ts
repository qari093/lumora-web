import type { PersistenceStateIntegrityReport, PersistenceTarget } from "./types";
import { LAUNCH_PERSISTENCE_TARGETS } from "./targets";
import { buildRecoveryCheck, evaluatePersistenceTarget } from "./evaluate";

export function buildPersistenceStateIntegrityReport(
  targets: PersistenceTarget[] = LAUNCH_PERSISTENCE_TARGETS
): PersistenceStateIntegrityReport {
  const findings = targets.map(evaluatePersistenceTarget);
  const recoveryChecks = targets.map(buildRecoveryCheck);

  const failedTargets =
    findings.filter((finding) => finding.status === "FAILED").length +
    recoveryChecks.filter((check) => check.status === "FAILED").length;

  const warningTargets =
    findings.filter((finding) => finding.status === "WARNING").length +
    recoveryChecks.filter((check) => check.status === "WARNING").length;

  return {
    generatedAt: new Date().toISOString(),
    status: failedTargets > 0 ? "FAILED" : warningTargets > 0 ? "WARNING" : "PASS",
    totalTargets: targets.length,
    failedTargets,
    warningTargets,
    recoveryChecks,
    findings
  };
}
