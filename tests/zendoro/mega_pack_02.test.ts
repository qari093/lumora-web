import { describe, expect, it } from "vitest";

describe("Zendoro Mega Pack 02", () => {
  it("validates products route", async () => {
    const mod = await import("@/app/zendoro/products/page");
    expect(mod.default).toBeTypeOf("function");
  });

  it("validates seller route", async () => {
    const mod = await import("@/app/zendoro/seller/page");
    expect(mod.default).toBeTypeOf("function");
  });

  it("validates admin route", async () => {
    const mod = await import("@/app/zendoro/admin/page");
    expect(mod.default).toBeTypeOf("function");
  });
});
