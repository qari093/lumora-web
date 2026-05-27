import { describe, expect, it } from "vitest";
import {
  subscriptionSystem,
  subscriptionStatus,
  subscriptionSystemHealthy
} from "@/core/zencoin/subscriptions/subscriptionSystem";

describe("Zencoin Pack 13 — Subscription System", () => {
  it("supports Echo Premium linkage", () => {
    expect(subscriptionSystem.echoPremiumLinked).toBe(true);
  });

  it("resolves subscription status", () => {
    expect(subscriptionStatus({ active: true, gracePeriod: false })).toBe("active");
    expect(subscriptionStatus({ active: false, gracePeriod: true })).toBe("grace");
    expect(subscriptionStatus({ active: false, gracePeriod: false })).toBe("expired");
  });

  it("supports subscription health", () => {
    expect(subscriptionSystemHealthy()).toBe(true);
  });
});
