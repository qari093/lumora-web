import { describe, expect, it } from "vitest";
import {
  creatorEconomy,
  creatorEconomyHealthy
} from "../../src/core/zendoro/creator/creatorEconomy";

describe("Zendoro Pack 07/08 — Creator Economy", () => {
  it("supports creator systems", () => {
    expect(creatorEconomy.liveCommerce).toBe(true);
    expect(creatorEconomyHealthy()).toBe(true);
  });
});
