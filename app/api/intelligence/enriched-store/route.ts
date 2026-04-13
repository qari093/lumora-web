import { guardedJson } from "@/lib/api/guardedJson";
import {
  readEnrichedSignalStore,
  refreshEnrichedSignalStore,
} from "@/lib/intelligence/storage/enrichedStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") || "read").trim();

  if (mode === "refresh") {
    const snapshot = await refreshEnrichedSignalStore();
    return guardedJson("api.intelligence.enriched-store", {
      ok: true,
      mode: "refresh",
      count: snapshot.count,
      updatedAt: snapshot.updatedAt,
      ts: Date.now(),
    });
  }

  const snapshot = await readEnrichedSignalStore();
  return guardedJson("api.intelligence.enriched-store", {
    ok: true,
    mode: "read",
    count: snapshot.count,
    updatedAt: snapshot.updatedAt,
    signals: snapshot.signals,
    ts: Date.now(),
  });
}
