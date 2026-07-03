export type ProductionReadinessState = "pass" | "warn" | "fail";

export type ProductionCheck = {
  id: string;
  label: string;
  state: ProductionReadinessState;
  score: number;
  detail: string;
};

export type ProductionCertification = {
  id: string;
  system: "universal_share_layer";
  version: string;
  checks: ProductionCheck[];
  score: number;
  state: ProductionReadinessState;
  lockedAt: string;
};

export type EvolutionHook = {
  id: string;
  target:
    | "future_portal"
    | "sdk"
    | "webhook"
    | "migration"
    | "extension"
    | "monitoring"
    | "disaster_recovery";
  enabled: boolean;
  contractVersion: string;
};
