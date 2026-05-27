import type {
  FypProductionCapability,
  LiveProductionCapability,
  ProductionFinding,
  ProductionValidationStatus
} from "./types";

export function statusFromFindings(findings: ProductionFinding[]): ProductionValidationStatus {
  if (findings.some((finding) => finding.status === "FAILED")) return "FAILED";
  if (findings.some((finding) => finding.status === "WARNING")) return "WARNING";
  return "PASS";
}

export function evaluateFypProduction(capability: FypProductionCapability): ProductionFinding[] {
  const findings: ProductionFinding[] = [];

  const checks: Array<[keyof FypProductionCapability, string]> = [
    ["feedAssembly", "FYP feed assembly runtime is not ready."],
    ["rankingRuntime", "FYP ranking runtime is not ready."],
    ["personalizationRuntime", "FYP personalization runtime is not ready."],
    ["diversityRuntime", "FYP diversity runtime is not ready."],
    ["dedupeRuntime", "FYP dedupe runtime is not ready."],
    ["preloadSafe", "FYP preload safety is not ready."],
    ["fallbackReady", "FYP fallback behavior is not ready."],
    ["observabilityReady", "FYP observability is not ready."]
  ];

  for (const [key, message] of checks) {
    if (!capability[key]) {
      findings.push({
        system: "fyp",
        capability: String(key),
        status: "FAILED",
        message,
        requiredFix: "Wire the missing FYP runtime capability before launch."
      });
    }
  }

  if (capability.latencyCeilingMs > 300) {
    findings.push({
      system: "fyp",
      capability: "latencyCeilingMs",
      status: "FAILED",
      message: "FYP latency ceiling exceeds production threshold.",
      requiredFix: "Reduce feed assembly/runtime latency below 300ms."
    });
  } else if (capability.latencyCeilingMs > 180) {
    findings.push({
      system: "fyp",
      capability: "latencyCeilingMs",
      status: "WARNING",
      message: "FYP latency is acceptable but should be optimized."
    });
  }

  if (findings.length === 0) {
    findings.push({
      system: "fyp",
      capability: "production_runtime",
      status: "PASS",
      message: "FYP production runtime satisfies launch readiness requirements."
    });
  }

  return findings;
}

export function evaluateLiveProduction(capability: LiveProductionCapability): ProductionFinding[] {
  const findings: ProductionFinding[] = [];

  const checks: Array<[keyof LiveProductionCapability, string]> = [
    ["roomLifecycle", "Live room lifecycle is not ready."],
    ["eventIngestion", "Live event ingestion is not ready."],
    ["presenceRuntime", "Live presence runtime is not ready."],
    ["moderationFlow", "Live moderation flow is not ready."],
    ["replaySafety", "Live replay safety is not ready."],
    ["observabilityReady", "Live observability is not ready."],
    ["telemetryReady", "Live telemetry is not ready."],
    ["recoveryReady", "Live recovery is not ready."],
    ["edgeCaseCoverage", "Live edge-case coverage is not ready."]
  ];

  for (const [key, message] of checks) {
    if (!capability[key]) {
      findings.push({
        system: "live",
        capability: String(key),
        status: key === "recoveryReady" ? "WARNING" : "FAILED",
        message,
        requiredFix: "Complete the missing Live runtime capability before public launch."
      });
    }
  }

  if (findings.length === 0) {
    findings.push({
      system: "live",
      capability: "production_runtime",
      status: "PASS",
      message: "Live production runtime satisfies launch readiness requirements."
    });
  }

  return findings;
}
