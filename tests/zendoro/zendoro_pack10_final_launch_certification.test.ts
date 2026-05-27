import { describe, expect, it } from "vitest";
import {
  getZendoroFinalCertificationGates,
  validateZendoroFinalLaunchCertification
} from "@/core/zendoro/certification/finalLaunchCertification";

describe("Zendoro Pack 10/10 — Final Launch Certification", () => {
  it("validates final Zendoro certification gates", () => {
    const r = validateZendoroFinalLaunchCertification();

    expect(r.ok).toBe(true);
    expect(r.buyerReady).toBe(true);
    expect(r.sellerReady).toBe(true);
    expect(r.adminReady).toBe(true);
    expect(r.paymentReady).toBe(true);
    expect(r.rollbackReady).toBe(true);
    expect(r.seal).toBe("ZENDORO_FINAL_LAUNCH_CERTIFICATION_READY");
  });

  it("tracks all required final launch gates", () => {
    const gates = getZendoroFinalCertificationGates();

    expect(gates.length).toBe(10);
    expect(gates).toContain("next_build");
    expect(gates).toContain("typecheck");
    expect(gates).toContain("prisma_validate");
    expect(gates).toContain("zendoro_tests");
    expect(gates).toContain("stripe_sandbox");
    expect(gates).toContain("webhook_replay");
    expect(gates).toContain("rollback_ready");
  });
});
