import type { GmarCreatorMonetizationReport } from "./types";
import { GCM_CAPABILITIES } from "./capabilities";
import { evaluateGcmCapabilities, statusForSystem } from "./evaluate";

export function buildGmarCreatorMonetizationReport(): GmarCreatorMonetizationReport {
  const findings = evaluateGcmCapabilities(GCM_CAPABILITIES);
  const failedFindings = findings.filter((finding) => finding.status === "FAILED").length;
  const warningFindings = findings.filter((finding) => finding.status === "WARNING").length;

  const gmarStatus = statusForSystem(findings, "gmar");
  const creatorStatus = statusForSystem(findings, "creator");
  const monetizationStatus = statusForSystem(findings, "monetization");

  return {
    generatedAt: new Date().toISOString(),
    status: failedFindings > 0 ? "FAILED" : warningFindings > 0 ? "WARNING" : "PASS",
    totalCapabilities: GCM_CAPABILITIES.length,
    failedFindings,
    warningFindings,
    gmarStatus,
    creatorStatus,
    monetizationStatus,
    findings
  };
}
