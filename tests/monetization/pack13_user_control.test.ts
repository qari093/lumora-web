import { describe, expect, it } from "vitest";
import { detectNotNowGesture } from "@/src/monetization/user-control/notNowGesture";
import { createNotNowOverride, isNotNowActive } from "@/src/monetization/user-control/overrideTimer";
import { applyUserControlOverride } from "@/src/monetization/user-control/stateOverride";
import { buildSilentNotNowUx } from "@/src/monetization/user-control/silentUx";
import { validateUserControlFlow } from "@/src/monetization/user-control/validate";

describe("Monetization Pack13 — User Control", () => {
  it("detects supported Not Now gesture", () => {
    expect(detectNotNowGesture({ gesture: "double_tap", enabled: true }).detected).toBe(true);
    expect(detectNotNowGesture({ gesture: "unknown", enabled: true }).detected).toBe(false);
    expect(detectNotNowGesture({ gesture: "back_tap", enabled: false }).detected).toBe(false);
  });

  it("creates 60 second override timer", () => {
    const override = createNotNowOverride({ activatedAtMs: 1000 });

    expect(override.durationMs).toBe(60000);
    expect(override.activeUntilMs).toBe(61000);
    expect(isNotNowActive({ nowMs: 2000, activeUntilMs: override.activeUntilMs })).toBe(true);
    expect(isNotNowActive({ nowMs: 62000, activeUntilMs: override.activeUntilMs })).toBe(false);
  });

  it("forces monetization state to red while active", () => {
    const state = applyUserControlOverride({
      computedState: "green",
      nowMs: 1000,
      activeUntilMs: 2000,
    });

    expect(state).toBe("red");
  });

  it("uses silent UX without blocking flow", () => {
    const ux = buildSilentNotNowUx({ active: true });

    expect(ux.visible).toBe(false);
    expect(ux.blocksFlow).toBe(false);
    expect(ux.monetizationSuppressed).toBe(true);
  });

  it("validates complete user control flow", () => {
    const result = validateUserControlFlow({
      gesture: "three_finger_twist",
      enabled: true,
      activatedAtMs: 0,
      nowMs: 1000,
    });

    expect(result.ok).toBe(true);
    expect(result.state).toBe("red");
    expect(result.ux.monetizationSuppressed).toBe(true);
  });
});
