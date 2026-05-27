import { CANONICAL_ORCHESTRATORS } from "./registry";

export interface CanonicalOrchestratorReport {
  generatedAt: string;
  orchestratorCount: number;
  activeCount: number;
  writeOwners: number;
  eventOwners: number;
  publicAdapterOwners: number;
  blockedCount: number;
  orchestrators: typeof CANONICAL_ORCHESTRATORS;
}

export function buildCanonicalOrchestratorReport(): CanonicalOrchestratorReport {
  return {
    generatedAt: new Date().toISOString(),
    orchestratorCount: CANONICAL_ORCHESTRATORS.length,
    activeCount: CANONICAL_ORCHESTRATORS.filter((item) => item.status === "active").length,
    writeOwners: CANONICAL_ORCHESTRATORS.filter((item) => item.ownsWrites).length,
    eventOwners: CANONICAL_ORCHESTRATORS.filter((item) => item.ownsEvents).length,
    publicAdapterOwners: CANONICAL_ORCHESTRATORS.filter((item) => item.ownsPublicAdapters).length,
    blockedCount: CANONICAL_ORCHESTRATORS.filter((item) => item.status === "blocked").length,
    orchestrators: CANONICAL_ORCHESTRATORS
  };
}
