import type { FinalLaunchSealReport } from "./types";
import {
  FINAL_INFRASTRUCTURE_CAPABILITIES,
  FINAL_LAUNCH_REQUIRED_LOCKS
} from "./capabilities";
import { evaluateInfrastructure, evaluateRequiredLocks } from "./evaluate";

export function buildFinalLaunchSealReport(): FinalLaunchSealReport {
  const lockEvaluation = evaluateRequiredLocks(FINAL_LAUNCH_REQUIRED_LOCKS);
  const infraFindings = evaluateInfrastructure(FINAL_INFRASTRUCTURE_CAPABILITIES);
  const findings = [...lockEvaluation.findings, ...infraFindings];

  const failedFindings = findings.filter((finding) => finding.status === "FAILED").length;
  const warningFindings = findings.filter((finding) => finding.status === "WARNING").length;

  const status = failedFindings > 0 ? "FAILED" : warningFindings > 0 ? "WARNING" : "PASS";
  const sealed = status !== "FAILED";

  return {
    generatedAt: new Date().toISOString(),
    status,
    missingLocks: lockEvaluation.missingLocks,
    totalInfrastructureChecks: FINAL_INFRASTRUCTURE_CAPABILITIES.length,
    failedFindings,
    warningFindings,
    findings,
    certification: {
      sealed,
      launchReady: sealed && status === "PASS",
      mode: sealed ? "private_beta" : "blocked"
    }
  };
}
