import { describe, expect, it } from "vitest";
import { echoRuntime, echoHealthy } from "../../src/core/nexa/echo/echoRuntime";
import { economyRuntime, economyHealthy } from "../../src/core/nexa/economy/economyRuntime";

describe("NEXA Pack 05/12 — Echo + Economy", () => {
  it("supports Echo integration", () => {
    expect(echoRuntime.echoBridge).toBe(true);
    expect(echoRuntime.resonanceReels).toBe(true);
    expect(echoRuntime.auraMode).toBe(true);
    expect(echoHealthy()).toBe(true);
  });

  it("supports ZenEconomy + Premium", () => {
    expect(economyRuntime.zencoinBridge).toBe(true);
    expect(economyRuntime.nexaEchoBundle).toBe(true);
    expect(economyRuntime.calmSpendingRules).toBe(true);
    expect(economyHealthy()).toBe(true);
  });
});
