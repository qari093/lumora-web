import { guardedJson } from "@/lib/api/guardedJson";
import { ingestAllSignalProviders } from "@/lib/signals/core/providerRegistry";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limitRaw = Number(searchParams.get("limit") || "2");
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(10, limitRaw)) : 2;

  const providerResults = await ingestAllSignalProviders(limit);
  const signals = providerResults.flatMap((item) => item.signals);

  return guardedJson("api.signals.normalize", {
    ok: true,
    providerCount: providerResults.length,
    signalCount: signals.length,
    providers: providerResults.map((item) => ({
      provider: item.provider,
      source: item.source,
      count: item.count,
      warning: item.warning || null,
    })),
    signals,
    ts: Date.now(),
  });
}
