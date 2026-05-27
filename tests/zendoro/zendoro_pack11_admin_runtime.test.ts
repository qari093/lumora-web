import { describe, expect, it } from "vitest";
import { getZendoroAdminRuntime } from "@/src/lib/zendoro/admin/adminRuntime";

describe("Zendoro Pack 11/12 — Admin Runtime", () => {
  it("supports admin runtime", () => {
    const runtime = getZendoroAdminRuntime();

    expect(runtime.operational).toBe(true);
    expect(runtime.trust).toBe(true);
  });
});
