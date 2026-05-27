import { createBuildDebtFinding } from "./classifier";
import type { BuildDebtFinding } from "./types";

export function parseNextBuildWarnings(log: string): BuildDebtFinding[] {
  const lines = log.split(/\r?\n/);
  const findings: BuildDebtFinding[] = [];
  let currentFile = "unknown";

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("./")) {
      currentFile = trimmed.split(":")[0] || trimmed;
      continue;
    }

    if (
      trimmed.includes("Warning:") ||
      trimmed.includes("Attempted import error") ||
      trimmed.includes("Error occurred prerendering") ||
      trimmed.includes("Export encountered an error")
    ) {
      findings.push(createBuildDebtFinding({
        file: currentFile,
        message: trimmed
      }));
    }
  }

  return findings;
}
