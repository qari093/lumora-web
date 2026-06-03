import { describe, expect, it } from "vitest";
import {
  createHomeBeaconFinalSeal,
  getHomeBeaconBetaActivation,
  getLumenCoreEvolutionHooks,
} from "@/src/core/home-beacon";

describe("Home Beacon Mega Pack 5/5", () => {
  it("activates private beta Home Beacon stack", () => {
    const beta = getHomeBeaconBetaActivation();

    expect(beta.homeBeaconEnabled).toBe(true);
    expect(beta.portalArcEnabled).toBe(true);
    expect(beta.dashboardEnabled).toBe(true);
    expect(beta.gravityBridgeEnabled).toBe(true);
    expect(beta.interactionBridgeEnabled).toBe(true);
    expect(beta.notificationLayerEnabled).toBe(true);
    expect(beta.economyLayerEnabled).toBe(true);
    expect(beta.privateBetaReady).toBe(true);
  });

  it("prepares Lumen Core future evolution hooks without activating them", () => {
    const hooks = getLumenCoreEvolutionHooks();

    expect(hooks.soulSignatureHooks).toBe(true);
    expect(hooks.whisperArcHooks).toBe(true);
    expect(hooks.soulDialHooks).toBe(true);
    expect(hooks.naviSeedHooks).toBe(true);
    expect(hooks.serendipityPortalHooks).toBe(true);
    expect(hooks.innerWeatherHooks).toBe(true);
    expect(hooks.companionHooks).toBe(true);
    expect(hooks.livingIdentityHooks).toBe(true);
    expect(hooks.activeNow).toBe(false);
  });

  it("creates final Home Beacon seal", () => {
    const seal = createHomeBeaconFinalSeal();

    expect(seal.status).toBe("HOME_BEACON_SEALED");
    expect(seal.betaReady).toBe(true);
    expect(seal.homeBeaconActive).toBe(true);
    expect(seal.portalArcActive).toBe(true);
    expect(seal.gravityBridgeActive).toBe(true);
    expect(seal.interactionBridgeActive).toBe(true);
    expect(seal.lumenCoreEvolutionPrepared).toBe(true);
    expect(seal.lumenCoreActiveNow).toBe(false);
  });
});
