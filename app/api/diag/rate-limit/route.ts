import { guardedJson } from "@/lib/api/guardedJson";

export const dynamic = "force-dynamic";

export async function GET() {
  return guardedJson("api.diag.rate-limit", {
    ok: true,
    scope: "api.diag.rate-limit",
    ts: Date.now(),
  });
}
