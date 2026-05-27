import type { RuntimeDomain } from "../domainRegistry";

export type PersistenceMode =
  | "read_only"
  | "write_authorized"
  | "aggregate_only"
  | "mock_only"
  | "demo_only"
  | "blocked";

export type PersistenceOperation =
  | "read"
  | "write"
  | "aggregate"
  | "mock"
  | "demo";

export interface PersistenceBoundaryRule {
  domain: RuntimeDomain;
  mode: PersistenceMode;
  writeOwner: string | null;
  allowedOperations: PersistenceOperation[];
  reason: string;
}

export interface PersistenceBoundaryDecision {
  domain: RuntimeDomain;
  operation: PersistenceOperation;
  allowed: boolean;
  mode: PersistenceMode;
  writeOwner: string | null;
  reason: string;
}
