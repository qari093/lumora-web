import { guardedJson } from "@/lib/api/guardedJson";
import { getLanguage } from "@/lib/format/language/map";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code") || undefined;
  return guardedJson("api.format.language", { ok: true, data: getLanguage(code), ts: Date.now() });
}
