import { detectNotNowGesture } from "./notNowGesture";
import { createNotNowOverride, isNotNowActive } from "./overrideTimer";
import { applyUserControlOverride } from "./stateOverride";
import { buildSilentNotNowUx } from "./silentUx";

export function validateUserControlFlow(input: {
  gesture: "double_tap" | "three_finger_twist" | "back_tap" | "unknown";
  enabled: boolean;
  activatedAtMs: number;
  nowMs: number;
}) {
  const detected = detectNotNowGesture({
    gesture: input.gesture,
    enabled: input.enabled,
  });

  const override = detected.detected
    ? createNotNowOverride({ activatedAtMs: input.activatedAtMs })
    : undefined;

  const active = isNotNowActive({
    nowMs: input.nowMs,
    activeUntilMs: override?.activeUntilMs,
  });

  const state = applyUserControlOverride({
    computedState: "green",
    nowMs: input.nowMs,
    activeUntilMs: override?.activeUntilMs,
  });

  const ux = buildSilentNotNowUx({ active });

  return {
    ok: detected.detected ? active && state === "red" && ux.monetizationSuppressed : state === "green",
    detected,
    active,
    state,
    ux,
  };
}
