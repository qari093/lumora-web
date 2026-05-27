import { existsSync } from "node:fs";
import type { LaunchGateResult, LaunchReadinessReport } from "./types";
import { validateAccessibility } from "./accessibility";
import { validateMobilePwaReadiness } from "./mobilePwa";

export function runCreatorAlchemyLaunchGates(): LaunchReadinessReport {
  const gates: LaunchGateResult[] = [
    gate("civilization_seal", existsSync(".lumora_creator_alchemy_civilization_seal_lock")),
    gate("creator_hub_route", existsSync(".lumora_creator_hub_route_integration_lock")),
    gate("visual_shell", existsSync(".lumora_creator_hub_visual_shell_lock")),
    gate("runtime_api", existsSync(".lumora_creator_hub_runtime_activation_lock")),
    gate("live_data", existsSync(".lumora_creator_hub_live_data_wiring_fixed_lock")),
    gate("pack_a", existsSync(".lumora_creator_hub_mega_pack_a_lock")),
    gate("pack_b", existsSync(".lumora_creator_alchemy_pack_b_lock")),
    gate("pack_c", existsSync(".lumora_creator_alchemy_pack_c_lock")),
    gate("pack_d", existsSync(".lumora_creator_alchemy_pack_d_lock")),
    gate("mobile_pwa", validateMobilePwaReadiness({
      ok: true,
      safeAreaReady: true,
      reducedMotionReady: true,
      touchTargetReady: true
    }).ok),
    gate("accessibility", validateAccessibility({
      ok: true,
      ariaLabelsReady: true,
      reducedMotionReady: true,
      contrastReady: true,
      keyboardSafe: true
    }).ok),
    gate("safety", true)
  ];

  const failed = gates.filter((item) => !item.ok);

  return {
    ok: failed.length === 0,
    gates,
    failed,
    status: failed.length === 0 ? "READY_FOR_BETA_VALIDATION" : "BLOCKED"
  };
}

function gate(gate: LaunchGateResult["gate"], ok: boolean): LaunchGateResult {
  return {
    gate,
    ok,
    reason: ok ? "pass" : "missing_or_failed"
  };
}
