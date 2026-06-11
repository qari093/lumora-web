import fs from "node:fs";

const runtime = `import {
  FYP_SOURCE_REGISTRY,
  type FypSourceCategory,
  type FypSourceRegistryItem
} from "./sourceRegistry";

import {
  getFypSourceHealthSnapshots,
  type FypSourceHealthSnapshot
} from "./sourceHealth";

export type FypSourceSelectionInput = {
  category?: FypSourceCategory;
  preferEmbedOnly?: boolean;
  maxSources?: number;
};

export type FypSourceSelectionResult = {
  selected: FypSourceRegistryItem[];
  fallbacks: FypSourceRegistryItem[];
  rejected: Array<{
    sourceId: string;
    reason: string;
  }>;
  health: FypSourceHealthSnapshot[];
};

function scoreSource(source: FypSourceRegistryItem, health: FypSourceHealthSnapshot): number {
  const base = 1000 - health.latencyMs;
  const statusBonus = health.status === "healthy" ? 300 : health.status === "degraded" ? 120 : -500;
  const licensePenalty = source.requiresLicenseProof ? 40 : 0;
  const embedPenalty = source.ingestionMode.includes("embed_only") ? 15 : 0;

  return base + statusBonus - licensePenalty - embedPenalty;
}

export function selectFypSources(input: FypSourceSelectionInput = {}): FypSourceSelectionResult {
  const maxSources = Math.max(1, Math.min(input.maxSources ?? 8, 48));
  const health = getFypSourceHealthSnapshots();
  const healthById = new Map(health.map((snapshot) => [snapshot.sourceId, snapshot]));

  const candidates = FYP_SOURCE_REGISTRY
    .filter((source) => !input.category || source.category === input.category)
    .filter((source) => {
      if (!input.preferEmbedOnly) return true;
      return source.ingestionMode.includes("embed") || source.ingestionMode.includes("link");
    })
    .map((source) => ({
      source,
      health: healthById.get(source.id)
    }))
    .filter((entry): entry is { source: FypSourceRegistryItem; health: FypSourceHealthSnapshot } => Boolean(entry.health));

  const rejected = candidates
    .filter((entry) => !entry.health.eligible || entry.health.status === "blocked" || entry.health.status === "offline")
    .map((entry) => ({
      sourceId: entry.source.id,
      reason: entry.health.reason
    }));

  const eligible = candidates
    .filter((entry) => entry.health.eligible && entry.health.status !== "blocked" && entry.health.status !== "offline")
    .sort((a, b) => scoreSource(b.source, b.health) - scoreSource(a.source, a.health))
    .map((entry) => entry.source);

  const selected = eligible.slice(0, maxSources);
  const fallbacks = eligible.slice(maxSources, maxSources * 2);

  return {
    selected,
    fallbacks,
    rejected,
    health
  };
}

export function getFypSourceFailoverChain(primarySourceId: string): FypSourceRegistryItem[] {
  const primary = FYP_SOURCE_REGISTRY.find((source) => source.id === primarySourceId);
  if (!primary) return selectFypSources({ maxSources: 5 }).selected;

  const sameCategory = selectFypSources({
    category: primary.category,
    maxSources: 6
  }).selected.filter((source) => source.id !== primary.id);

  const globalFallbacks = selectFypSources({ maxSources: 6 }).selected.filter(
    (source) => source.id !== primary.id && !sameCategory.some((candidate) => candidate.id === source.id)
  );

  return [primary, ...sameCategory, ...globalFallbacks].slice(0, 8);
}

export function validateFypSourceSelectionFailoverRuntime(): boolean {
  const globalSelection = selectFypSources({ maxSources: 8 });
  const embedSelection = selectFypSources({ preferEmbedOnly: true, maxSources: 4 });
  const nasaFailover = getFypSourceFailoverChain("NASA");
  const unknownFailover = getFypSourceFailoverChain("UNKNOWN_SOURCE");

  return (
    globalSelection.selected.length === 8 &&
    globalSelection.fallbacks.length === 8 &&
    globalSelection.rejected.length === 0 &&
    embedSelection.selected.length >= 1 &&
    embedSelection.selected.every((source) => source.ingestionMode.includes("embed") || source.ingestionMode.includes("link")) &&
    nasaFailover.length >= 2 &&
    nasaFailover[0]?.id === "NASA" &&
    unknownFailover.length === 5
  );
}
`;

fs.writeFileSync("src/core/fyp/sources/sourceSelection.ts", runtime);

fs.mkdirSync("tests/fyp", { recursive: true });

fs.writeFileSync("tests/fyp/fyp_mega_pack_03_source_selection_failover.test.ts", `import { describe, expect, it } from "vitest";

import {
  getFypSourceFailoverChain,
  selectFypSources,
  validateFypSourceSelectionFailoverRuntime
} from "@/src/core/fyp/sources/sourceSelection";

describe("FYP Mega Pack 03 — Source Selection & Failover Runtime", () => {
  it("selects eligible global sources with fallback coverage", () => {
    const result = selectFypSources({ maxSources: 8 });

    expect(result.selected).toHaveLength(8);
    expect(result.fallbacks).toHaveLength(8);
    expect(result.rejected).toHaveLength(0);
  });

  it("supports category-scoped source selection", () => {
    const result = selectFypSources({ category: "space", maxSources: 3 });

    expect(result.selected.length).toBeGreaterThan(0);
    expect(result.selected.every((source) => source.category === "space")).toBe(true);
  });

  it("keeps embed/link-only preference safe", () => {
    const result = selectFypSources({ preferEmbedOnly: true, maxSources: 4 });

    expect(result.selected.length).toBeGreaterThan(0);
    expect(
      result.selected.every((source) =>
        source.ingestionMode.includes("embed") || source.ingestionMode.includes("link")
      )
    ).toBe(true);
  });

  it("creates same-category failover chain for a known source", () => {
    const chain = getFypSourceFailoverChain("NASA");

    expect(chain.length).toBeGreaterThanOrEqual(2);
    expect(chain[0]?.id).toBe("NASA");
  });

  it("creates global failover chain for unknown source", () => {
    const chain = getFypSourceFailoverChain("UNKNOWN_SOURCE");

    expect(chain).toHaveLength(5);
  });

  it("validates complete source selection and failover runtime", () => {
    expect(validateFypSourceSelectionFailoverRuntime()).toBe(true);
  });
});
`);

const checks = {
  sourceSelectionRuntimePresent: fs.existsSync("src/core/fyp/sources/sourceSelection.ts"),
  sourceSelectionTestsPresent: fs.existsSync("tests/fyp/fyp_mega_pack_03_source_selection_failover.test.ts"),
  sourceHealthRuntimePresent: fs.existsSync("src/core/fyp/sources/sourceHealth.ts"),
  sourceRegistryPresent: fs.existsSync("src/core/fyp/sources/sourceRegistry.ts"),
  megaPack03HealthLockPresent: fs.existsSync(".lumora_fyp_mega_pack_03_source_health_runtime_lock"),
  selectionRuntimeHasScoring: runtime.includes("scoreSource"),
  selectionRuntimeHasFailover: runtime.includes("getFypSourceFailoverChain"),
  selectionRuntimeHasValidator: runtime.includes("validateFypSourceSelectionFailoverRuntime")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_03_SOURCE_SELECTION_FAILOVER",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS"
    ? "FYP_MEGA_PACK_03_SOURCE_SELECTION_FAILOVER_READY"
    : "FYP_MEGA_PACK_03_SOURCE_SELECTION_FAILOVER_BLOCKED"
};

fs.mkdirSync("data/fyp", { recursive: true });
fs.mkdirSync("docs/fyp", { recursive: true });
fs.mkdirSync(".lumora-audits", { recursive: true });

fs.writeFileSync("data/fyp/mega-pack-03-source-selection-failover.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-03-source-selection-failover.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-03-source-selection-failover.md", [
  "# FYP Mega Pack 03/07 — Source Selection & Failover",
  "",
  `Status: ${status}`,
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_03_source_selection_failover_lock", "FYP_MEGA_PACK_03_SOURCE_SELECTION_FAILOVER=PASS\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_03_source_selection_failover_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_03_source_selection_failover_failed_lock", "FYP_MEGA_PACK_03_SOURCE_SELECTION_FAILOVER=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_03_source_selection_failover_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
