import type { RealitySimulationReport, SimulationRiskFinding } from "./types";
import { buildRealityEnforcementDecisions } from "./enforcement";
import { scanSimulationRisks } from "./scanner";

export function buildRealitySimulationReport(input?: {
  scannedFiles: number;
  findings: SimulationRiskFinding[];
}): RealitySimulationReport {
  const scan = input ?? scanSimulationRisks();
  const criticalFindings = scan.findings.filter((finding) => finding.severity === "critical").length;
  const highFindings = scan.findings.filter((finding) => finding.severity === "high").length;
  const mediumFindings = scan.findings.filter((finding) => finding.severity === "medium").length;
  const lowFindings = scan.findings.filter((finding) => finding.severity === "low").length;

  return {
    generatedAt: new Date().toISOString(),
    status: criticalFindings > 0 ? "FAILED" : highFindings > 0 || mediumFindings > 0 ? "WARNING" : "PASS",
    scannedFiles: scan.scannedFiles,
    totalFindings: scan.findings.length,
    criticalFindings,
    highFindings,
    mediumFindings,
    lowFindings,
    findings: scan.findings,
    enforcement: buildRealityEnforcementDecisions(scan.findings)
  };
}
