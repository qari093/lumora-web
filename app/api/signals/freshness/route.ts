import { guardedJson } from "@/lib/api/guardedJson";
import { readSignalStore } from "@/lib/signals/store/fileStore";
import { attachFreshnessBatch, filterFreshSignals } from "@/lib/signals/core/freshness";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") || "fresh").trim();

  const snapshot = await readSignalStore();
  const all = attachFreshnessBatch(snapshot.signals);

  if (mode === "all") {
    return guardedJson("api.signals.freshness", {
      ok: true,
      mode: "all",
      count: all.length,
      signals: all,
      ts: Date.now(),
    });
  }

  const fresh = filterFreshSignals(snapshot.signals);
  return guardedJson("api.signals.freshness", {
    ok: true,
    mode: "fresh",
    totalIn: all.length,
    totalOut: fresh.length,
    signals: fresh,
    ts: Date.now(),
  });
}
