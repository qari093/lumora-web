import { describe, expect, it } from "vitest";
import {
  LIGHT_PRESENCE_DRIFT_MS,
  detectLightPresenceDrift,
  dimSilhouettesInUi,
  enableLightPresenceMode,
  trackPassivePresence,
  validateLightPresenceIntegration,
} from "@/src/lib/integration/light-presence";

describe("Integration Pack15 Light Presence", () => {
  it("passes full light presence flow", () => {
    const mode = enableLightPresenceMode("c1");
    const passive = trackPassivePresence("c1", 1000);
    const silhouettes = dimSilhouettesInUi(["w1", "w1", "w2"]);
    const drift = detectLightPresenceDrift(0, LIGHT_PRESENCE_DRIFT_MS);

    expect(mode.enabled).toBe(true);
    expect(passive.passive).toBe(true);
    expect(silhouettes).toHaveLength(2);
    expect(silhouettes[0].opacity).toBe(0.35);
    expect(drift.drifted).toBe(true);
    expect(validateLightPresenceIntegration({ mode, passive, silhouettes, drift }).ok).toBe(true);
    expect(validateLightPresenceIntegration({}).ok).toBe(false);
  });
});
