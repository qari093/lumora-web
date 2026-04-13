import { guardedJson } from "@/lib/api/guardedJson";
import { queryRelated } from "@/lib/content/query";

export const dynamic = "force-dynamic";

export async function GET() {
  return guardedJson("api.content.query", { ok: true, data: queryRelated("x"), ts: Date.now() });
}
