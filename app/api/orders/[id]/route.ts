import { getOrder } from "@/src/core/zendoro/api/store";
import { failJson, okJson } from "@/src/core/zendoro/api/http";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const order = getOrder(id);
  if (!order) return failJson("Order not found", 404);
  return okJson(order);
}
