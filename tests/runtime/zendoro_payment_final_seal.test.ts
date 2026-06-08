import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("zendoro payment final seal", () => {
  it("writes final Zendoro payment seal artifacts", () => {
    expect(fs.existsSync(".lumora-audits/zendoro-payment-final-seal.json")).toBe(true);
    expect(fs.existsSync(".lumora_zendoro_payments_validated_lock")).toBe(true);
    expect(fs.existsSync("docs/runtime/zendoro-payment-final-seal.md")).toBe(true);
  });

  it("seals Zendoro payments in safe mode and points to Live + FYP validation", () => {
    const seal = JSON.parse(fs.readFileSync(".lumora-audits/zendoro-payment-final-seal.json", "utf8"));
    expect(seal.status).toBe("ZENDORO_PAYMENTS_VALIDATED_SAFE_MODE");
    expect(seal.checks.routeEnvAudit).toBe("PASS");
    expect(seal.checks.productionEndpointSmoke).toBe("PASS");
    expect(seal.checks.webhookSignatureAudit).toBe("PASS");
    expect(seal.nextCanonicalPhase).toBe("Validate Live + FYP");
  });
});
