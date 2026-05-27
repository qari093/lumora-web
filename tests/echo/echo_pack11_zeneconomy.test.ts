import { describe, expect, it } from "vitest";
import { echoStonesRuntime } from "../../src/echo/economy/echoStones";
import { premiumLayer } from "../../src/echo/economy/premium";
import { artistSupportBoost } from "../../src/echo/economy/supportBoost";
import { revenueShareModel } from "../../src/echo/economy/revenueShare";

describe("Echo Pack 11 — ZenEconomy", () => {
  it("supports Echo Stones", () => {
    expect(echoStonesRuntime().enabled).toBe(true);
  });

  it("supports premium systems", () => {
    expect(premiumLayer().subscriptions).toBe(true);
  });

  it("supports creator economy", () => {
    expect(artistSupportBoost().directSupport).toBe(true);
    expect(revenueShareModel().fair).toBe(true);
  });
});
