import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { SimulationRiskFinding } from "./types";
import { createSimulationFinding } from "./classifier";

const SCAN_ROOTS = ["app", "src", "lib", "components"];

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];

  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (["node_modules", ".next", ".git"].includes(entry)) return [];
      return walk(full);
    }
    return [full];
  });
}

export function scanSimulationRiskFiles(): string[] {
  return SCAN_ROOTS.flatMap(walk)
    .map((file) => file.replace(/\\/g, "/"))
    .filter((file) => /\.(ts|tsx|js|jsx)$/.test(file))
    .filter((file) => !file.includes(".test."))
    .filter((file) => !file.includes("/tests/"));
}

export function scanSimulationRisks(limit = 5000): {
  scannedFiles: number;
  findings: SimulationRiskFinding[];
} {
  const files = scanSimulationRiskFiles().slice(0, limit);
  const findings: SimulationRiskFinding[] = [];

  for (const file of files) {
    try {
      const content = readFileSync(file, "utf8");
      const normalized = content.toLowerCase();

      if (
        normalized.includes("mock") ||
        normalized.includes("demo") ||
        normalized.includes("placeholder") ||
        normalized.includes("todo") ||
        normalized.includes("stub") ||
        normalized.includes("not implemented") ||
        normalized.includes("coming soon") ||
        normalized.includes("new map(") ||
        normalized.includes("inmemorystore") ||
        normalized.includes("simulated") ||
        normalized.includes("fake")
      ) {
        const finding = createSimulationFinding(file, content);
        if (finding) findings.push(finding);
      }
    } catch {}
  }

  return {
    scannedFiles: files.length,
    findings
  };
}
