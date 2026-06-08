import { describe, expect, it } from "vitest";
import fs from "node:fs";

const aliasFiles = [
  "app/api/wallet/route.ts",
  "app/api/wallet/balance/route.ts",
  "app/api/wallet/history/route.ts",
  "app/api/wallet/ledger/route.ts",
  "app/api/wallets/route.ts",
  "app/api/wallets/ensure/route.ts"
];

describe("wallet zencoin compatibility wrappers", () => {
  it("converts legacy wallet endpoints to zenwallet wrappers", () => {
    for (const file of aliasFiles) {
      if (!fs.existsSync(file)) continue;
      const src = fs.readFileSync(file, "utf8");
      expect(src).toContain("compatibilityJson");
      expect(src).toContain("/api/zenwallet/");
    }
  });

  it("writes audit and documentation artifacts", () => {
    expect(fs.existsSync(".lumora-audits/wallet-zencoin-compatibility-wrappers.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/wallet-zencoin-compatibility-wrappers.md")).toBe(true);
  });
});
