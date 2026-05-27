import { describe, expect, it } from "vitest";
import { routeOnboardingUserToPhantom } from "@/src/lib/integration/phantom-public/routeOnboarding";
import { captureInitialPhantomSignal } from "@/src/lib/integration/phantom-public/initialSignals";
import { unlockPublicCircleAccess } from "@/src/lib/integration/phantom-public/unlockPublicAccess";
import { syncPhantomToPublicState } from "@/src/lib/integration/phantom-public/stateTransition";
import { validatePhantomUnlockFlow } from "@/src/lib/integration/phantom-public/validateUnlock";

describe("Integration Pack06 — Phantom to Public Bridge", () => {
  it("routes onboarding users into phantom", () => {
    const routed = routeOnboardingUserToPhantom({ userId: "u1", witnessName: "Nova" });

    expect(routed.routed).toBe(true);
    expect(routed.destination).toBe("phantom-circle");
  });

  it("captures initial signals", () => {
    const signal = captureInitialPhantomSignal({ userId: "u1", type: "present" });

    expect(signal.type).toBe("present");
    expect(signal.humanOnly).toBe(true);
  });

  it("unlocks public circle access after signal gate", () => {
    expect(unlockPublicCircleAccess({ userId: "u1", signalCount: 3 }).unlocked).toBe(true);
    expect(unlockPublicCircleAccess({ userId: "u1", signalCount: 2 }).unlocked).toBe(false);
  });

  it("syncs state transition", () => {
    expect(syncPhantomToPublicState({ currentState: "phantom-circle", unlocked: true })).toBe("public-circle-unlocked");
    expect(syncPhantomToPublicState({ currentState: "phantom-circle", unlocked: false })).toBe("public-circle-pending");
  });

  it("validates unlock logic", () => {
    expect(validatePhantomUnlockFlow({
      routed: true,
      signalCount: 3,
      state: "public-circle-unlocked",
    }).ok).toBe(true);

    expect(validatePhantomUnlockFlow({
      routed: true,
      signalCount: 2,
      state: "public-circle-pending",
    }).ok).toBe(true);
  });
});
