import { guardedJson } from "@/lib/api/guardedJson";
import { readSignalStore } from "@/lib/signals/store/fileStore";
import { readPrecomputedRanking, writePrecomputedRanking } from "@/lib/intelligence/ranking/precompute";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") || "read").trim();

  if (mode === "refresh") {
    const snapshot = await readSignalStore();
    const written = await writePrecomputedRanking(snapshot.signals);
    return guardedJson("api.intelligence.ranking-precompute", {
      ok: true,
      mode: "refresh",
      count: written.count,
      updatedAt: written.updatedAt,
      ts: Date.now(),
    });
  }

  const current = await readPrecomputedRanking();
  return guardedJson("api.intelligence.ranking-precompute", {
    ok: true,
    mode: "read",
    count: current.count,
    updatedAt: current.updatedAt,
    signals: current.signals,
    ts: Date.now(),
  });
}
