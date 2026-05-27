import { getOrCreateCart } from "@/src/core/zendoro/api/store";
import { okJson } from "@/src/core/zendoro/api/http";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") ?? "anonymous";
  return okJson(getOrCreateCart(userId));
}
