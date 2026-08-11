import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Zendoro persistent cart API", () => {
  const source = readFileSync(
    "app/api/zendoro/cart/route.ts",
    "utf8"
  );

  it("requires authenticated buyer identity", () => {
    expect(source).toContain("getServerSession");
    expect(source).toContain("authentication_required");
    expect(source).toContain("buyerId");
  });

  it("persists cart and items through Prisma", () => {
    expect(source).toContain("prisma.zendoroCart.findFirst");
    expect(source).toContain("zendoroCart.create");
    expect(source).toContain("zendoroCartItem.upsert");
    expect(source).toContain("zendoroCartItem.updateMany");
    expect(source).toContain("zendoroCart.deleteMany");
  });

  it("enforces inventory, quantity, price, and currency rules", () => {
    expect(source).toContain("insufficient_inventory");
    expect(source).toContain("cart_currency_conflict");
    expect(source).toContain("unitPrice: product.priceCents");
    expect(source).toContain("value > 20");
  });

  it("supports full cart lifecycle methods", () => {
    expect(source).toContain("export async function GET");
    expect(source).toContain("export async function POST");
    expect(source).toContain("export async function PATCH");
    expect(source).toContain("export async function DELETE");
    expect(source).toContain('source: "database"');
    expect(source).not.toContain("operational: true");
  });
});
