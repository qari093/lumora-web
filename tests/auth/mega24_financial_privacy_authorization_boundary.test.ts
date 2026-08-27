import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (p: string) =>
  fs.readFileSync(path.join(process.cwd(), p), "utf8");

const quarantined = [
  "app/api/ledger/credit/route.ts",
  "app/api/ledger/debit/route.ts",
  "app/api/ledger/refund/route.ts",
  "app/api/wallet/credit/route.ts",
  "app/api/wallet/credit-ledger/route.ts",
  "src/app/api/pulse/earn/route.ts",
  "src/app/api/pulse/spend/route.ts",
];

const sessionBound = [
  "app/api/ledger/list/[ownerId]/route.ts",
  "app/api/coin/balance/route.ts",
  "app/api/coin/ledger/route.ts",
  "app/api/coin/transfer/route.ts",
  "src/app/api/privacy/export/route.ts",
  "src/app/api/privacy/consent/route.ts",
  "app/api/billing/checkout/route.ts",
  "app/api/shop/order/route.ts",
  "app/api/kyc/request/route.ts",
  "app/api/kyc/status/route.ts",
];

describe("Mega Step 24 financial/privacy authorization boundary", () => {
  it.each(quarantined)("%s is launch-quarantined", (file) => {
    const src = read(file);
    expect(src).toContain("status: 410");
    expect(src).toContain("x-lumora-launch-quarantine");
    expect(src).not.toMatch(/prisma\./);
  });

  it.each(sessionBound)("%s requires canonical user session", (file) => {
    const src = read(file);
    expect(src).toContain("requireUserSession");
    expect(src).toContain("if (!auth.ok) return auth.response");
  });

  it("coin transfer derives sender from the authenticated identity", () => {
    const src = read("app/api/coin/transfer/route.ts");
    expect(src).toContain("const from = auth.identity.userId");
    expect(src).not.toMatch(/const\s*\{\s*from\s*,/);
  });

  it("privacy export derives export owner from authenticated identity", () => {
    const src = read("src/app/api/privacy/export/route.ts");
    expect(src).toContain("const userId = auth.identity.userId");
  });

  it("billing checkout derives owner from authenticated identity", () => {
    const src = read("app/api/billing/checkout/route.ts");
    expect(src).toContain("const ownerId = auth.identity.userId");
  });

  it("KYC request and status derive owner from authenticated identity", () => {
    expect(read("app/api/kyc/request/route.ts"))
      .toContain("const ownerId = auth.identity.userId");
    expect(read("app/api/kyc/status/route.ts"))
      .toContain("const ownerId = auth.identity.userId");
  });
});
