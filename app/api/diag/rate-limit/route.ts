import { productionDebugGate } from "@/src/lib/runtime-guards/productionDebugGate";
import { guardedJson } from "@/lib/api/guardedJson";

export const dynamic = "force-dynamic";

export async function GET() {
  const blocked = productionDebugGate();
  if (blocked) return blocked;
  return guardedJson("api.diag.rate-limit", {
    ok: true,
    scope: "api.diag.rate-limit",
    ts: Date.now(),
  });
}
