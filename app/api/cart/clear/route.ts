import { clearCart } from "@/src/core/zendoro/api/store";
import { okJson, readJson } from "@/src/core/zendoro/api/http";

export async function POST(request: Request) {
  const body = await readJson<{ userId?: string }>(request);
  return okJson(clearCart(body.userId ?? "anonymous"));
}
