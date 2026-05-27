import { createCheckout } from "@/src/core/zendoro/api/store";
import { failJson, okJson, readJson } from "@/src/core/zendoro/api/http";

export async function POST(request: Request) {
  try {
    const body = await readJson<{ userId?: string }>(request);
    return okJson(createCheckout(body.userId ?? "anonymous"), 201);
  } catch (error) {
    return failJson(error instanceof Error ? error.message : "Checkout failed", 400);
  }
}
