import { guardedJson } from "@/lib/api/guardedJson";
import { getFallbackSignals } from "@/lib/signals/fallback/getFallbackSignals";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limitRaw = Number(searchParams.get("limit") || "10");
  const limit = Number.isFinite(limitRaw) ? limitRaw : 10;

  const signals = getFallbackSignals(limit);

  return guardedJson("api.signals.fallback", {
    ok: true,
    provider: "internal_fallback",
    count: signals.length,
    signals,
    ts: Date.now(),
  });
}
