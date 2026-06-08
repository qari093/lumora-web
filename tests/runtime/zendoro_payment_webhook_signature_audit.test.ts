import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("zendoro payment webhook signature audit", () => {
  it("writes webhook signature audit report", () => {
    expect(fs.existsSync(".lumora-audits/zendoro-payment-webhook-signature-audit.json")).toBe(true);
    const report = JSON.parse(fs.readFileSync(".lumora-audits/zendoro-payment-webhook-signature-audit.json", "utf8"));
    expect(report.status).toBe("PASS");
  });

  it("confirms canonical webhook is safe-gated and legacy Stripe has verification", () => {
    const report = JSON.parse(fs.readFileSync(".lumora-audits/zendoro-payment-webhook-signature-audit.json", "utf8"));
    const canonical = report.routes.find((r: any) => r.file === "app/api/zendoro/webhook/route.ts");
    const legacy = report.routes.find((r: any) => r.file === "app/api/stripe/webhook/route.ts");

    expect(canonical.hasPost).toBe(true);
    expect(canonical.readsStripeSignature).toBe(true);
    expect(canonical.hasWebhookSecretGate).toBe(true);
    expect(legacy.usesConstructEvent).toBe(true);
  });
});
