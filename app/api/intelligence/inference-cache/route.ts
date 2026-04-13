import { guardedJson } from "@/lib/api/guardedJson";
import {
  clearInferenceCache,
  getInferenceCache,
  listInferenceCacheKeys,
  setInferenceCache,
} from "@/lib/intelligence/cache/inferenceCache";
import { readEnrichedSignalStore } from "@/lib/intelligence/storage/enrichedStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") || "read").trim();
  const key = (searchParams.get("key") || "enriched_top_signals").trim();

  if (mode === "warm") {
    const snapshot = await readEnrichedSignalStore();
    const payload = Array.isArray(snapshot.signals) ? snapshot.signals.slice(0, 25) : [];
    const entry = setInferenceCache(key, payload, 5 * 60 * 1000);

    return guardedJson("api.intelligence.inference-cache", {
      ok: true,
      mode: "warm",
      key: entry.key,
      count: Array.isArray(payload) ? payload.length : 0,
      createdAt: entry.createdAt,
      expiresAt: entry.expiresAt,
      ts: Date.now(),
    });
  }

  if (mode === "clear") {
    clearInferenceCache(key === "*" ? undefined : key);
    return guardedJson("api.intelligence.inference-cache", {
      ok: true,
      mode: "clear",
      cleared: key,
      keys: listInferenceCacheKeys(),
      ts: Date.now(),
    });
  }

  const entry = getInferenceCache(key);
  const payload = entry?.payload;

  return guardedJson("api.intelligence.inference-cache", {
    ok: true,
    mode: "read",
    key,
    hit: !!entry,
    keys: listInferenceCacheKeys(),
    count: Array.isArray(payload) ? payload.length : 0,
    expiresAt: entry?.expiresAt ?? null,
    payload: payload ?? [],
    ts: Date.now(),
  });
}
