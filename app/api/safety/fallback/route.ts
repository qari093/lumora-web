import { guardedJson } from "@/lib/api/guardedJson";
import { getSafeFallbackContent } from "@/lib/safety/fallback/safeFallback";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") || 3);

  const data = getSafeFallbackContent(limit);

  return guardedJson("api.safety.fallback", data);
}
