import type { RuntimeDomain } from "../domainRegistry";

export type OrchestratorStatus = "active" | "stub" | "blocked";

export interface CanonicalOrchestrator {
  domain: RuntimeDomain;
  name: string;
  canonicalPrefix: string;
  status: OrchestratorStatus;
  ownsWrites: boolean;
  ownsEvents: boolean;
  ownsPublicAdapters: boolean;
  responsibilities: string[];
}

export interface OrchestratorDecision {
  ok: boolean;
  domain: RuntimeDomain;
  orchestrator: string;
  route: string;
  allowed: boolean;
  reason: string;
}
