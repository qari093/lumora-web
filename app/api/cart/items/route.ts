import { addCartItem } from "@/src/core/zendoro/api/store";
import { failJson, okJson, readJson } from "@/src/core/zendoro/api/http";

export async function POST(request: Request) {
  try {
    const body = await readJson<{ userId?: string; productId?: string; quantity?: number }>(request);
    if (!body.productId) return failJson("productId is required", 422);

    const cart = addCartItem(body.userId ?? "anonymous", body.productId, body.quantity ?? 1);
    return okJson(cart, 201);
  } catch (error) {
    return failJson(error instanceof Error ? error.message : "Cart item failed", 400);
  }
}
