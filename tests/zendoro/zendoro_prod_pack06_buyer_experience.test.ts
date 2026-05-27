import { describe, expect, it } from "vitest";
import { validateZendoroBuyerExperience } from "@/src/lib/zendoro/production/buyerExperience";

describe("Zendoro Production Pack 6/10 — Buyer Experience", () => {
  it("validates buyer experience hardening contract", () => {
    const r = validateZendoroBuyerExperience();
    expect(r.persistentCarts).toBe(true);
    expect(r.accessibility).toBe(true);
    expect(r.buyerUxSeal).toBe(true);
  });
});
