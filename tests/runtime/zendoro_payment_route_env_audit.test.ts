import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("zendoro payment route env audit", () => {
  it("writes payment route env audit report", () => {
    expect(fs.existsSync(".lumora-audits/zendoro-payment-route-env-audit.json")).toBe(true);
    const report = JSON.parse(fs.readFileSync(".lumora-audits/zendoro-payment-route-env-audit.json", "utf8"));
    expect(report.status).toBe("PASS");
  });

  it("verifies canonical Zendoro payment routes exist", () => {
    const report = JSON.parse(fs.readFileSync(".lumora-audits/zendoro-payment-route-env-audit.json", "utf8"));
    const checkout = report.routes.find((r: any) => r.file === "app/api/zendoro/checkout/route.ts");
    const webhook = report.routes.find((r: any) => r.file === "app/api/zendoro/webhook/route.ts");
    expect(checkout.exists).toBe(true);
    expect(webhook.exists).toBe(true);
    expect(checkout.methods).toContain("POST");
    expect(webhook.methods).toContain("POST");
  });
});
