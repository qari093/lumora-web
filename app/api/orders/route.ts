import { listOrders } from "@/src/core/zendoro/api/store";
import { okJson } from "@/src/core/zendoro/api/http";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") ?? undefined;
  return okJson(listOrders(userId));
}
