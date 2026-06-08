import { describe, expect, it } from "vitest";
import fs from "node:fs";

const aliasFiles = [
  "app/api/products/route.ts",
  "app/api/payments/checkout/route.ts",
  "app/api/stripe/checkout/route.ts",
  "app/api/stripe/create-checkout-session/route.ts",
  "app/api/payments/webhook/route.ts",
  "app/api/shop/webhook/route.ts"
];

describe("zendoro payment compatibility wrappers", () => {
  it("converts legacy commerce/payment endpoints to zendoro wrappers", () => {
    for (const file of aliasFiles) {
      if (!fs.existsSync(file)) continue;
      const src = fs.readFileSync(file, "utf8");
      expect(src).toContain("compatibilityJson");
      expect(src).toContain("/api/zendoro/");
    }
  });

  it("writes audit and documentation artifacts", () => {
    expect(fs.existsSync(".lumora-audits/zendoro-payment-compatibility-wrappers.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/zendoro-payment-compatibility-wrappers.md")).toBe(true);
  });
});
