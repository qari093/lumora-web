import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/src/core/auth/authOptions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CartMutationBody = {
  productId?: string;
  quantity?: number;
};

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: {
      "cache-control": "no-store"
    }
  });
}

function normalizeQuantity(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    return null;
  }

  if (value < 0 || value > 20) {
    return null;
  }

  return value;
}

async function requireBuyerId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id?.trim() || null;
}

async function serializeCart(buyerId: string) {
  const cart = await prisma.zendoroCart.findFirst({
    where: { buyerId },
    include: {
      items: {
        orderBy: { id: "asc" },
        include: {
          product: {
            include: {
              inventory: true,
              seller: {
                select: {
                  id: true,
                  slug: true,
                  displayName: true,
                  status: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!cart) {
    return {
      id: null,
      buyerId,
      currency: "EUR",
      itemCount: 0,
      subtotalCents: 0,
      items: []
    };
  }

  const items = cart.items.map((item) => {
    const stock = item.product.inventory?.stock ?? 0;
    const reserved = item.product.inventory?.reserved ?? 0;
    const availableQuantity = Math.max(stock - reserved, 0);

    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotalCents: item.unitPrice * item.quantity,
      product: {
        id: item.product.id,
        slug: item.product.slug,
        title: item.product.title,
        description: item.product.description,
        active: item.product.active,
        currency: item.product.currency.toUpperCase(),
        availableQuantity,
        seller: item.product.seller
      }
    };
  });

  return {
    id: cart.id,
    buyerId: cart.buyerId,
    currency: cart.currency.toUpperCase(),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotalCents: items.reduce(
      (sum, item) => sum + item.lineTotalCents,
      0
    ),
    items
  };
}

export async function GET() {
  const buyerId = await requireBuyerId();

  if (!buyerId) {
    return json(401, {
      ok: false,
      route: "/api/zendoro/cart",
      error: "authentication_required"
    });
  }

  try {
    return json(200, {
      ok: true,
      route: "/api/zendoro/cart",
      source: "database",
      cart: await serializeCart(buyerId)
    });
  } catch (error) {
    console.error("ZENDORO_CART_READ_FAILED", { buyerId, error });

    return json(500, {
      ok: false,
      route: "/api/zendoro/cart",
      error: "cart_read_failed"
    });
  }
}

export async function POST(request: Request) {
  const buyerId = await requireBuyerId();

  if (!buyerId) {
    return json(401, {
      ok: false,
      route: "/api/zendoro/cart",
      error: "authentication_required"
    });
  }

  let body: CartMutationBody;

  try {
    body = (await request.json()) as CartMutationBody;
  } catch {
    return json(400, {
      ok: false,
      route: "/api/zendoro/cart",
      error: "invalid_json"
    });
  }

  const productId =
    typeof body.productId === "string" ? body.productId.trim() : "";
  const quantity = normalizeQuantity(body.quantity ?? 1);

  if (!productId || quantity === null || quantity < 1) {
    return json(400, {
      ok: false,
      route: "/api/zendoro/cart",
      error: "invalid_cart_item",
      required: {
        productId: "non-empty string",
        quantity: "integer from 1 to 20"
      }
    });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const product = await tx.zendoroProduct.findFirst({
        where: {
          id: productId,
          active: true,
          seller: {
            status: "ACTIVE"
          }
        },
        include: {
          inventory: true
        }
      });

      if (!product) {
        throw new Error("product_not_available");
      }

      if (!product.inventory) {
        throw new Error("inventory_not_configured");
      }

      const availableQuantity =
        product.inventory.stock - product.inventory.reserved;

      if (availableQuantity < quantity) {
        throw new Error("insufficient_inventory");
      }

      let cart = await tx.zendoroCart.findFirst({
        where: { buyerId }
      });

      if (!cart) {
        cart = await tx.zendoroCart.create({
          data: {
            buyerId,
            currency: product.currency.toUpperCase()
          }
        });
      }

      if (cart.currency.toUpperCase() !== product.currency.toUpperCase()) {
        throw new Error("cart_currency_conflict");
      }

      const existingItem = await tx.zendoroCartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId
          }
        }
      });

      const nextQuantity = (existingItem?.quantity ?? 0) + quantity;

      if (nextQuantity > 20 || nextQuantity > availableQuantity) {
        throw new Error("insufficient_inventory");
      }

      await tx.zendoroCartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId
          }
        },
        update: {
          quantity: nextQuantity,
          unitPrice: product.priceCents
        },
        create: {
          cartId: cart.id,
          productId,
          quantity,
          unitPrice: product.priceCents
        }
      });
    });

    return json(200, {
      ok: true,
      route: "/api/zendoro/cart",
      action: "item_added",
      cart: await serializeCart(buyerId)
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "cart_update_failed";

    const status =
      message === "product_not_available"
        ? 404
        : message === "inventory_not_configured" ||
            message === "insufficient_inventory" ||
            message === "cart_currency_conflict"
          ? 409
          : 500;

    return json(status, {
      ok: false,
      route: "/api/zendoro/cart",
      error: message
    });
  }
}

export async function PATCH(request: Request) {
  const buyerId = await requireBuyerId();

  if (!buyerId) {
    return json(401, {
      ok: false,
      route: "/api/zendoro/cart",
      error: "authentication_required"
    });
  }

  let body: CartMutationBody;

  try {
    body = (await request.json()) as CartMutationBody;
  } catch {
    return json(400, {
      ok: false,
      route: "/api/zendoro/cart",
      error: "invalid_json"
    });
  }

  const productId =
    typeof body.productId === "string" ? body.productId.trim() : "";
  const quantity = normalizeQuantity(body.quantity);

  if (!productId || quantity === null) {
    return json(400, {
      ok: false,
      route: "/api/zendoro/cart",
      error: "invalid_cart_item"
    });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const cart = await tx.zendoroCart.findFirst({
        where: { buyerId }
      });

      if (!cart) {
        throw new Error("cart_not_found");
      }

      if (quantity === 0) {
        await tx.zendoroCartItem.deleteMany({
          where: {
            cartId: cart.id,
            productId
          }
        });
        return;
      }

      const product = await tx.zendoroProduct.findFirst({
        where: {
          id: productId,
          active: true,
          seller: {
            status: "ACTIVE"
          }
        },
        include: {
          inventory: true
        }
      });

      if (!product?.inventory) {
        throw new Error("product_not_available");
      }

      const availableQuantity =
        product.inventory.stock - product.inventory.reserved;

      if (quantity > availableQuantity) {
        throw new Error("insufficient_inventory");
      }

      const updated = await tx.zendoroCartItem.updateMany({
        where: {
          cartId: cart.id,
          productId
        },
        data: {
          quantity,
          unitPrice: product.priceCents
        }
      });

      if (updated.count !== 1) {
        throw new Error("cart_item_not_found");
      }
    });

    return json(200, {
      ok: true,
      route: "/api/zendoro/cart",
      action: quantity === 0 ? "item_removed" : "item_updated",
      cart: await serializeCart(buyerId)
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "cart_update_failed";

    const status =
      message === "cart_not_found" || message === "cart_item_not_found"
        ? 404
        : message === "product_not_available"
          ? 404
          : message === "insufficient_inventory"
            ? 409
            : 500;

    return json(status, {
      ok: false,
      route: "/api/zendoro/cart",
      error: message
    });
  }
}

export async function DELETE() {
  const buyerId = await requireBuyerId();

  if (!buyerId) {
    return json(401, {
      ok: false,
      route: "/api/zendoro/cart",
      error: "authentication_required"
    });
  }

  try {
    const carts = await prisma.zendoroCart.findMany({
      where: { buyerId },
      select: { id: true }
    });

    await prisma.zendoroCart.deleteMany({
      where: { buyerId }
    });

    return json(200, {
      ok: true,
      route: "/api/zendoro/cart",
      action: "cart_cleared",
      deletedCartIds: carts.map((cart) => cart.id),
      cart: await serializeCart(buyerId)
    });
  } catch (error) {
    console.error("ZENDORO_CART_CLEAR_FAILED", { buyerId, error });

    return json(500, {
      ok: false,
      route: "/api/zendoro/cart",
      error: "cart_clear_failed"
    });
  }
}
