import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Zendoro database-backed buyer APIs", () => {
  it("serves eligible products from Prisma", () => {
    const source = readFileSync(
      "app/api/zendoro/products/route.ts",
      "utf8"
    );

    expect(source).toContain("prisma.zendoroProduct.findMany");
    expect(source).toContain('status: "ACTIVE"');
    expect(source).toContain("availableQuantity");
    expect(source).toContain('source: "database"');
    expect(source).not.toContain("operational: true");
  });

  it("serves authenticated buyer order history from Prisma", () => {
    const source = readFileSync(
      "app/api/zendoro/orders/route.ts",
      "utf8"
    );

    expect(source).toContain("getServerSession");
    expect(source).toContain("authentication_required");
    expect(source).toContain("prisma.zendoroOrder.findMany");
    expect(source).toContain("buyerId");
    expect(source).toContain("payments:");
    expect(source).toContain('source: "database"');
    expect(source).not.toContain("operational: true");
  });
});
