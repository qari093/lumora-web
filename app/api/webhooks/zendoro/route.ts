import { markOrderPaid } from "@/src/core/zendoro/api/store";
import { failJson, okJson, readJson } from "@/src/core/zendoro/api/http";

export async function POST(request: Request) {
  try {
    const body = await readJson<{ type?: string; orderId?: string }>(request);

    if (body.type === "payment.succeeded" && body.orderId) {
      return okJson(markOrderPaid(body.orderId));
    }

    return okJson({ received: true, ignored: true });
  } catch (error) {
    return failJson(error instanceof Error ? error.message : "Webhook failed", 400);
  }
}
