import { guardedJson } from "@/lib/api/guardedJson";
import { listSignalCacheKeys, getSignalCache, clearSignalCache } from "@/lib/signals/cache/memoryCache";
import { readSignalStore } from "@/lib/signals/store/fileStore";
import { scoreSignals } from "@/lib/signals/core/score";
import { setSignalCache } from "@/lib/signals/cache/memoryCache";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") || "read").trim();
  const key = (searchParams.get("key") || "central_store_top").trim();

  if (mode === "warm") {
    const snapshot = await readSignalStore();
    const scored = scoreSignals(snapshot.signals).slice(0, 25);
    const entry = setSignalCache(key, scored, 60_000);

    return guardedJson("api.signals.cache", {
      ok: true,
      mode: "warm",
      key: entry.key,
      count: entry.signals.length,
      createdAt: entry.createdAt,
      expiresAt: entry.expiresAt,
      ts: Date.now(),
    });
  }

  if (mode === "clear") {
    clearSignalCache(key === "*" ? undefined : key);
    return guardedJson("api.signals.cache", {
      ok: true,
      mode: "clear",
      cleared: key,
      keys: listSignalCacheKeys(),
      ts: Date.now(),
    });
  }

  const entry = getSignalCache(key);
  return guardedJson("api.signals.cache", {
    ok: true,
    mode: "read",
    key,
    hit: !!entry,
    keys: listSignalCacheKeys(),
    count: entry?.signals.length ?? 0,
    expiresAt: entry?.expiresAt ?? null,
    signals: entry?.signals ?? [],
    ts: Date.now(),
  });
}
