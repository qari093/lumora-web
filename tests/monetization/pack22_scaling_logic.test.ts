import { describe, expect, it } from "vitest";
import { evaluateMonetizationLoad } from "@/src/monetization/scaling/loadControl";
import { shapeMonetizationTraffic } from "@/src/monetization/scaling/trafficShaping";
import { calculateMonetizationThrottle } from "@/src/monetization/scaling/throttle";
import { resolveMonetizationFailSafe } from "@/src/monetization/scaling/failSafe";
import { validateMonetizationScaling } from "@/src/monetization/scaling/system";

describe("Monetization Pack22 — Scaling Logic", () => {
  it("detects overload", () => {
    const load = evaluateMonetizationLoad({
      requestsPerMinute: 1200,
      maxRequestsPerMinute: 1000,
      queueDepth: 10,
      maxQueueDepth: 100,
    });

    expect(load.overloaded).toBe(true);
    expect(load.mode).toBe("protective");
  });

  it("shapes traffic in protective mode", () => {
    const traffic = shapeMonetizationTraffic({
      mode: "protective",
      userState: "green",
    });

    expect(traffic.allowNativeAds).toBe(true);
    expect(traffic.allowRewardAds).toBe(false);
    expect(traffic.allowExitInteraction).toBe(false);
  });

  it("calculates throttling", () => {
    expect(calculateMonetizationThrottle({
      overloaded: true,
      errorRate: 0,
    }).throttlePercent).toBe(50);

    expect(calculateMonetizationThrottle({
      overloaded: false,
      errorRate: 0.06,
    }).throttlePercent).toBe(100);
  });

  it("resolves fail-safe modes", () => {
    expect(resolveMonetizationFailSafe({
      throttlePercent: 0,
      complianceOk: false,
      revenueControlOk: true,
    }).mode).toBe("off");

    expect(resolveMonetizationFailSafe({
      throttlePercent: 50,
      complianceOk: true,
      revenueControlOk: true,
    }).mode).toBe("limited");
  });

  it("validates full scaling system", () => {
    const result = validateMonetizationScaling({
      requestsPerMinute: 100,
      maxRequestsPerMinute: 1000,
      queueDepth: 10,
      maxQueueDepth: 100,
      errorRate: 0,
      userState: "green",
      complianceOk: true,
      revenueControlOk: true,
    });

    expect(result.ok).toBe(true);
    expect(result.failSafe.mode).toBe("active");
    expect(result.traffic.allowRewardAds).toBe(true);
  });
});
