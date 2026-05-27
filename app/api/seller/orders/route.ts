import { listOrders } from "@/src/core/zendoro/api/store";
import { okJson } from "@/src/core/zendoro/api/http";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sellerId = url.searchParams.get("sellerId") ?? "zendoro-demo-seller";
  return okJson(listOrders().filter((order) => order.sellerId === sellerId));
}
