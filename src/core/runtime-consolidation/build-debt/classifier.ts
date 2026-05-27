import type { BuildDebtCategory, BuildDebtFinding } from "./types";

export function classifyBuildWarning(message: string): BuildDebtCategory {
  const lower = message.toLowerCase();

  if (lower.includes("react hook") || lower.includes("useeffect") || lower.includes("usecallback")) return "react_hooks";
  if (lower.includes("assigned a value but never used") || lower.includes("defined but never used")) return "unused_symbol";
  if (lower.includes("unused eslint-disable directive")) return "unused_eslint_disable";
  if (lower.includes("prerender") || lower.includes("export encountered an error")) return "prerender";
  if (lower.includes("attempted import error") || lower.includes("is not exported")) return "import_export";
  if (lower.includes("edge runtime") || lower.includes("static generation")) return "runtime_warning";

  return "unknown";
}

export function severityForCategory(category: BuildDebtCategory): BuildDebtFinding["severity"] {
  if (category === "prerender" || category === "import_export") return "critical";
  if (category === "react_hooks") return "high";
  if (category === "runtime_warning") return "medium";
  if (category === "unused_symbol" || category === "unused_eslint_disable") return "low";
  return "medium";
}

export function createBuildDebtFinding(input: {
  file: string;
  message: string;
}): BuildDebtFinding {
  const category = classifyBuildWarning(input.message);

  return {
    file: input.file,
    category,
    message: input.message.slice(0, 500),
    severity: severityForCategory(category)
  };
}
