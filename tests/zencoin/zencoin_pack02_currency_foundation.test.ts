import { describe, expect, it } from "vitest";
import {
  zencoinCurrency,
  zencoinBundles,
  currencyFoundationHealthy
} from "@/core/zencoin/currency/currencyFoundation";

describe("Zencoin Pack 02 — Currency Foundation", () => {
  it("supports zc", () => {
    expect(zencoinCurrency.zcEnabled).toBe(true);
  });

  it("supports zen pulse", () => {
    expect(zencoinCurrency.zenPulseEnabled).toBe(true);
  });

  it("supports healthy foundation", () => {
    expect(zencoinBundles.length).toBe(3);
    expect(currencyFoundationHealthy()).toBe(true);
  });
});
