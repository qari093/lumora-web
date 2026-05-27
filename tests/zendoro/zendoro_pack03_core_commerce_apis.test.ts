import { describe, expect, it } from "vitest";
import {
  addCartItem,
  createCheckout,
  createReview,
  getAdminZendoroSummary,
  getOrCreateCart,
  getSellerSummary,
  listProducts,
  markOrderPaid,
} from "@/src/core/zendoro/api/store";

describe("Zendoro Pack 3/12 — Core Commerce APIs", () => {
  it("supports products and cart lifecycle", () => {
    const product = listProducts()[0];
    expect(product?.id).toBe("zendoro-demo-product");

    const cart = addCartItem("pack03-user", product.id, 2);
    expect(cart.items.length).toBeGreaterThan(0);
    expect(cart.subtotalCents).toBe(3998);
  });

  it("supports checkout and webhook payment lifecycle", () => {
    const order = createCheckout("pack03-user");
    expect(order.status).toBe("PENDING_PAYMENT");

    const paid = markOrderPaid(order.id);
    expect(paid.status).toBe("PAID");
  });

  it("supports reviews, seller summary, and admin summary", () => {
    const review = createReview({
      productId: "zendoro-demo-product",
      userId: "pack03-user",
      rating: 5,
      comment: "Works",
    });

    expect(review.verifiedPurchase).toBe(true);
    expect(getSellerSummary().products.length).toBeGreaterThan(0);
    expect(getAdminZendoroSummary().operational).toBe(true);
    expect(getOrCreateCart("pack03-user").userId).toBe("pack03-user");
  });
});
