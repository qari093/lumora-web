import type { EventIntegrityStatus, RealtimeEventIntegrityReport } from "./types";
import { REALTIME_EVENT_CONTRACTS } from "./contracts";
import { evaluateRealtimeEventContract, buildRealtimeSynchronizationChecks } from "./evaluate";

export function buildRealtimeEventIntegrityReport(): RealtimeEventIntegrityReport {
  const findings = REALTIME_EVENT_CONTRACTS.map(evaluateRealtimeEventContract);
  const synchronization = buildRealtimeSynchronizationChecks();

  const failedContracts =
    findings.filter((finding) => finding.status === "FAILED").length +
    synchronization.filter((item) => item.status === "FAILED").length;

  const warningContracts =
    findings.filter((finding) => finding.status === "WARNING").length +
    synchronization.filter((item) => item.status === "WARNING").length;

  let status: EventIntegrityStatus = "PASS";

  if (failedContracts > 0) {
    status = "FAILED";
  } else if (warningContracts > 0) {
    status = "WARNING";
  }

  return {
    generatedAt: new Date().toISOString(),
    status,
    totalContracts: REALTIME_EVENT_CONTRACTS.length,
    failedContracts,
    warningContracts,
    findings,
    synchronization
  };
}
