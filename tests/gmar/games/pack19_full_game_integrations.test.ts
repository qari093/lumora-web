import { describe, expect, it } from "vitest";
import { gameRegistryHealthy, gmarGameRegistry } from "../../../src/core/gmar/games/registry";
import { gameIntegrationHealthy } from "../../../src/core/gmar/games/integration";

describe("GMAR Mega Pack 19 — Full Game Integrations", () => {
  it("validates game registry", () => {
    expect(gameRegistryHealthy()).toBe(true);
    expect(gmarGameRegistry).toContain("astro-shooter");
    expect(gmarGameRegistry).toContain("gauntlet-of-mirrors");
  });

  it("validates shared game integration contract", () => {
    const integration = gameIntegrationHealthy();

    expect(integration.echoCompatible).toBe(true);
    expect(integration.crossGameReady).toBe(true);
  });
});
