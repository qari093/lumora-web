import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "app/api/zendoro/products/route.ts",
  "app/api/zendoro/cart/route.ts",
  "app/api/zendoro/checkout/route.ts",
  "app/api/zendoro/orders/route.ts",
  "app/api/zendoro/webhook/route.ts",
  "app/api/stripe/checkout/route.ts",
  "app/api/stripe/webhook/route.ts",
  "app/api/payments/checkout/route.ts",
  "app/api/payments/webhook/route.ts",
  "app/zendoro/page.tsx",
];

function read(file: string) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

describe("Zendoro payments static validation", () => {
  it.each(requiredFiles)("has required payment file %s", (file) => {
    expect(fs.existsSync(path.join(process.cwd(), file))).toBe(true);
  });

  it("checkout routes expose handlers", () => {
    const zendoro = read("app/api/zendoro/checkout/route.ts");
    const stripe = read("app/api/stripe/checkout/route.ts");
    const payments = read("app/api/payments/checkout/route.ts");

    expect(zendoro + stripe + payments).toMatch(/export\s+async\s+function\s+(GET|POST)|export\s+function\s+(GET|POST)/);
  });

  it("webhook routes expose handlers", () => {
    const zendoro = read("app/api/zendoro/webhook/route.ts");
    const stripe = read("app/api/stripe/webhook/route.ts");
    const payments = read("app/api/payments/webhook/route.ts");

    expect(zendoro + stripe + payments).toMatch(/export\s+async\s+function\s+(GET|POST)|export\s+function\s+(GET|POST)/);
  });

  it("has payment safety vocabulary somewhere in payment routes", () => {
    const combined = [
      "app/api/zendoro/checkout/route.ts",
      "app/api/zendoro/webhook/route.ts",
      "app/api/stripe/checkout/route.ts",
      "app/api/stripe/webhook/route.ts",
      "app/api/payments/checkout/route.ts",
      "app/api/payments/webhook/route.ts",
    ].map(read).join("\n");

    expect(combined).toMatch(/checkout|payment|stripe|webhook|order/i);
  });
});
