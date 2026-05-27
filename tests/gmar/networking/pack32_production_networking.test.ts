import { describe, expect, it } from "vitest";
import { createProductionNetworkState, productionNetworkingHealthy } from "../../../src/core/gmar/networking/runtime";
import { decideReconnect } from "../../../src/core/gmar/networking/reconnect";
import { selectGmarRegion } from "../../../src/core/gmar/networking/failover";

describe("GMAR Pack 32/40 — Production Networking Stack", () => {
  it("validates production networking state", () => {
    expect(productionNetworkingHealthy(createProductionNetworkState())).toBe(true);
  });

  it("uses bounded reconnect backoff", () => {
    expect(decideReconnect(0).shouldReconnect).toBe(true);
    expect(decideReconnect(4).backoffMs).toBeLessThanOrEqual(15000);
    expect(decideReconnect(5).shouldReconnect).toBe(false);
  });

  it("selects safe region fallback", () => {
    expect(selectGmarRegion(true, true)).toBe("primary");
    expect(selectGmarRegion(false, true)).toBe("fallback");
    expect(selectGmarRegion(false, false)).toBe("offline-safe");
  });
});
