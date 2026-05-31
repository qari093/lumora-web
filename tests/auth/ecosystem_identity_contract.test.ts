import { describe, expect, it } from "vitest";
import fs from "node:fs";

const ownershipRoutes = [
  "app/api/wallet/balance/route.ts",
  "app/api/wallet/ledger/route.ts",
  "app/api/zencoin/wallet/route.ts",
  "app/api/zencoin/balance/route.ts",
  "app/api/lumaspace/runtime/route.ts",
  "app/api/lumaspace/state/route.ts",
  "app/api/gmar/player/init/route.ts",
  "app/api/gmar/creator/profile/route.ts",
  "app/api/creator/profile/route.ts",
  "app/api/zendoro/orders/route.ts",
];

const profileRoutes = [
  "app/api/user/profile/route.ts",
  "app/api/profile/summary/route.ts",
  "app/api/account/route.ts",
];

function exists(file: string) {
  return fs.existsSync(file);
}

function read(file: string) {
  return exists(file) ? fs.readFileSync(file, "utf8") : "";
}

describe("Lumora ecosystem identity contract", () => {
  it.each(ownershipRoutes)("has ownership route %s", (file) => {
    expect(exists(file)).toBe(true);
    expect(fs.statSync(file).size).toBeGreaterThan(0);
  });

  it.each(profileRoutes)("has profile/account identity route %s", (file) => {
    expect(exists(file)).toBe(true);
    expect(fs.statSync(file).size).toBeGreaterThan(0);
  });

  it("ownership routes contain user/owner identity vocabulary", () => {
    const combined = ownershipRoutes.map(read).join("\n");
    expect(combined).toMatch(/userId|ownerId|profile|account|creator|wallet|player|identity/i);
  });

  it("profile routes expose identity vocabulary", () => {
    const combined = profileRoutes.map(read).join("\n");
    expect(combined).toMatch(/user|profile|account|identity|owner/i);
  });

  it("role or permission logic exists somewhere in auth/core", () => {
    const candidates = [
      "src/lib/auth/requireRole.ts",
      "src/core/identity/types.ts",
      "app/_lib/admin/adminAuth.ts",
      "lib/adminAuth.ts",
      "lib/auth.ts",
      "src/lib/auth.ts",
    ];

    const combined = candidates.map(read).join("\n");
    expect(combined).toMatch(/role|permission|admin|creator|user|guardian|steward/i);
  });
});
