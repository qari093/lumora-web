import { describe, expect, it } from "vitest";
import { validateZendoroAdminPlatform } from "@/src/lib/zendoro/production/adminPlatform";

describe("Zendoro Production Pack 8/10 — Admin + Platform", () => {
  it("validates admin/platform operations contract", () => {
    const r = validateZendoroAdminPlatform();
    expect(r.auditExplorer).toBe(true);
    expect(r.recoveryTooling).toBe(true);
    expect(r.operationsSeal).toBe(true);
  });
});
