import type { FypLiveProductionReport } from "./types";
import { FYP_PRODUCTION_CAPABILITY, LIVE_PRODUCTION_CAPABILITY } from "./fixtures";
import { evaluateFypProduction, evaluateLiveProduction, statusFromFindings } from "./evaluate";

export function buildFypLiveProductionReport(): FypLiveProductionReport {
  const fypFindings = evaluateFypProduction(FYP_PRODUCTION_CAPABILITY);
  const liveFindings = evaluateLiveProduction(LIVE_PRODUCTION_CAPABILITY);
  const findings = [...fypFindings, ...liveFindings];

  const fypStatus = statusFromFindings(fypFindings);
  const liveStatus = statusFromFindings(liveFindings);
  const failedFindings = findings.filter((finding) => finding.status === "FAILED").length;
  const warningFindings = findings.filter((finding) => finding.status === "WARNING").length;

  return {
    generatedAt: new Date().toISOString(),
    status: failedFindings > 0 ? "FAILED" : warningFindings > 0 ? "WARNING" : "PASS",
    fypStatus,
    liveStatus,
    failedFindings,
    warningFindings,
    findings
  };
}
