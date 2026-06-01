/* Lumora payment safety: idempotency required for checkout/webhook/order mutation flows. */
import { ok } from "@/lib/zendoro/runtime";

export async function GET() {
  return ok({
    route: "checkout",
    operational: true
  });
}
