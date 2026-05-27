import { describe, expect, it } from "vitest";
import { enableLightPresence, disableLightPresence } from "@/src/lib/creator-system/light-presence/mode";
import { registerPassivePresence } from "@/src/lib/creator-system/light-presence/passiveState";
import { buildDimmedSilhouette } from "@/src/lib/creator-system/light-presence/silhouette";
import { isLightOnlyDriftExceeded, LIGHT_ONLY_DRIFT_LIMIT_MS } from "@/src/lib/creator-system/light-presence/driftGuard";
import { buildReactivationWhisper } from "@/src/lib/creator-system/light-presence/reactivation";

describe("Pack22 Light Presence", () => {
  it("toggles light presence mode", () => {
    expect(enableLightPresence("c1").enabled).toBe(true);
    expect(disableLightPresence("c1").enabled).toBe(false);
  });

  it("registers passive presence state", () => {
    const state = registerPassivePresence({ creatorId: "c1", nowMs: 1000 });
    expect(state.active).toBe(true);
    expect(state.lastSeenAt).toBe(1000);
  });

  it("dims silhouette", () => {
    const s = buildDimmedSilhouette("w1");
    expect(s.dimmed).toBe(true);
    expect(s.opacity).toBeLessThan(1);
  });

  it("detects 14-day drift", () => {
    expect(isLightOnlyDriftExceeded({
      lastActiveAtMs: 0,
      nowMs: LIGHT_ONLY_DRIFT_LIMIT_MS
    })).toBe(true);
  });

  it("shows gentle reactivation whisper", () => {
    expect(buildReactivationWhisper({ driftExceeded: true }).visible).toBe(true);
    expect(buildReactivationWhisper({ driftExceeded: false }).visible).toBe(false);
  });
});
