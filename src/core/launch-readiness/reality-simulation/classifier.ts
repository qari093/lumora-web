import type {
  SimulationRiskFinding,
  SimulationRiskKind,
  SimulationRiskSeverity
} from "./types";

export function classifySimulationRisk(content: string): SimulationRiskKind {
  const text = content.toLowerCase();

  if (text.includes("wallet") && (text.includes("memory") || text.includes("mock"))) return "non_persistent_wallet";
  if ((text.includes("checkout") || text.includes("payment") || text.includes("order")) && (text.includes("mock") || text.includes("simulated"))) return "non_persistent_commerce";
  if ((text.includes("media") || text.includes("video")) && (text.includes("placeholder") || text.includes("mock"))) return "non_persistent_media";
  if (text.includes("ok: true") && (text.includes("fake") || text.includes("simulated"))) return "fake_success";
  if (text.includes("new map(") || text.includes("const store = new map") || text.includes("memory store") || text.includes("inmemorystore")) return "memory_only_state";
  if (text.includes("not implemented") || text.includes("coming soon")) return "stubbed_integration";
  if (text.includes("orchestrator") && (text.includes("noop") || text.includes("return null"))) return "dead_orchestration";
  if (text.includes("placeholder") || text.includes("todo") || text.includes("stub")) return "placeholder_runtime";
  if (text.includes("mock") || text.includes("mock_")) return "mock_runtime";
  if (text.includes("demo") || text.includes("demo_")) return "demo_only_runtime";

  return "unknown";
}

export function severityForSimulationRisk(kind: SimulationRiskKind): SimulationRiskSeverity {
  if (kind === "non_persistent_wallet" || kind === "non_persistent_commerce" || kind === "fake_success") return "critical";
  if (kind === "memory_only_state" || kind === "stubbed_integration" || kind === "dead_orchestration") return "high";
  if (kind === "mock_runtime" || kind === "demo_only_runtime" || kind === "placeholder_runtime" || kind === "non_persistent_media") return "medium";
  return "low";
}

export function recommendationForSimulationRisk(kind: SimulationRiskKind): string {
  switch (kind) {
    case "memory_only_state":
      return "Move state behind a persistence adapter with explicit owner and recovery path.";
    case "mock_runtime":
      return "Gate mock runtime behind non-production feature flag and provide real adapter.";
    case "demo_only_runtime":
      return "Separate demo mode from production runtime and block demo-only success in launch gates.";
    case "placeholder_runtime":
      return "Replace placeholder with real implementation or classify route as inactive.";
    case "fake_success":
      return "Remove fake success and return explicit unavailable/error contract until real runtime exists.";
    case "stubbed_integration":
      return "Wire real integration or block the feature from launch readiness.";
    case "non_persistent_wallet":
      return "Centralize wallet writes through canonical persistent ledger.";
    case "non_persistent_commerce":
      return "Use real transactional order/payment state with idempotency.";
    case "non_persistent_media":
      return "Use real media catalog/storage adapter or classify as internal demo.";
    case "dead_orchestration":
      return "Connect orchestrator to real domain runtime and add contract tests.";
    default:
      return "Classify runtime ownership and remove ambiguous launch behavior.";
  }
}

export function createSimulationFinding(file: string, content: string): SimulationRiskFinding | null {
  const kind = classifySimulationRisk(content);
  if (kind === "unknown") return null;

  return {
    file,
    kind,
    severity: severityForSimulationRisk(kind),
    evidence: content.slice(0, 320),
    recommendation: recommendationForSimulationRisk(kind)
  };
}
