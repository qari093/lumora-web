import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Zendoro database-backed buyer pages", () => {
  it("renders marketplace products from Prisma", () => {
    const source = readFileSync(
      "app/zendoro/products/page.tsx",
      "utf8"
    );

    expect(source).toContain("prisma.zendoroProduct.findMany");
    expect(source).toContain('status: "ACTIVE"');
    expect(source).toContain("availableQuantity");
    expect(source).not.toContain("Zendoro Products Operational");
  });

  it("renders database product details and reviews", () => {
    const source = readFileSync(
      "app/zendoro/product/[id]/page.tsx",
      "utf8"
    );

    expect(source).toContain("prisma.zendoroProduct.findFirst");
    expect(source).toContain("reviews:");
    expect(source).toContain("Continue to checkout");
  });

  it("requires authentication and renders buyer order history", () => {
    const source = readFileSync(
      "app/zendoro/orders/page.tsx",
      "utf8"
    );

    expect(source).toContain("getServerSession");
    expect(source).toContain("prisma.zendoroOrder.findMany");
    expect(source).toContain("redirect");
    expect(source).toContain("buyerId");
  });
});
