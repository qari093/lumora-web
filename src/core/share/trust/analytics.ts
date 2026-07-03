import type { TrustAuditEntry } from "./types";

export function createPrivacyPreservingAnalytics(entries: TrustAuditEntry[]) {
  const summary = entries.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.decision] = (acc[entry.decision] ?? 0) + 1;
    return acc;
  }, {});

  return {
    totalEvents: entries.length,
    decisionCounts: summary,
    actorIdsIncluded: false,
    objectIdsIncluded: false,
  };
}
