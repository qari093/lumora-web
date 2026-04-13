import { guardedJson } from "@/lib/api/guardedJson";
import { ingestAllSignalProviders } from "@/lib/signals/core/providerRegistry";
import { dedupeSignals } from "@/lib/signals/core/dedupe";
import { scoreSignals } from "@/lib/signals/core/score";
import { upsertSignalStore, readSignalStore } from "@/lib/signals/store/fileStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") || "read").trim();

  if (mode === "refresh") {
    const providerResults = await ingestAllSignalProviders(3);
    const rawSignals = providerResults.flatMap((p) => p.signals);
    const deduped = dedupeSignals(rawSignals);
    const scored = scoreSignals(deduped.signals);
    const written = await upsertSignalStore(scored);

    return guardedJson("api.signals.store", {
      ok: true,
      mode: "refresh",
      providerCount: providerResults.length,
      count: written.count,
      updatedAt: written.updatedAt,
      ts: Date.now(),
    });
  }

  const snapshot = await readSignalStore();
  return guardedJson("api.signals.store", {
    ok: true,
    mode: "read",
    count: snapshot.count,
    updatedAt: snapshot.updatedAt,
    signals: snapshot.signals,
    ts: Date.now(),
  });
}
