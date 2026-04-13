import { guardedJson } from "@/lib/api/guardedJson";
import { getFallbackTemplates } from "@/lib/format/fallback/templates";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = getFallbackTemplates();
  return guardedJson("api.format.fallback", { ok: true, data, ts: Date.now() });
}
