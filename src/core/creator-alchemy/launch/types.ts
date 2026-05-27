export type LaunchGate =
  | "civilization_seal"
  | "creator_hub_route"
  | "visual_shell"
  | "runtime_api"
  | "live_data"
  | "pack_a"
  | "pack_b"
  | "pack_c"
  | "pack_d"
  | "mobile_pwa"
  | "accessibility"
  | "safety";

export interface LaunchGateResult {
  gate: LaunchGate;
  ok: boolean;
  reason: string;
}

export interface LaunchReadinessReport {
  ok: boolean;
  gates: LaunchGateResult[];
  failed: LaunchGateResult[];
  status: "READY_FOR_BETA_VALIDATION" | "BLOCKED";
}
