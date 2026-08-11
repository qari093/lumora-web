import {
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
