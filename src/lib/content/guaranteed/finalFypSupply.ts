import { buildRuntimeFypFeed } from "@/src/lib/content/runtime/buildRuntimeFypFeed";
import { readGuaranteedAudioPool, readGuaranteedPool } from "./guaranteedPool";

export async function buildGuaranteedFypFeed(minItems = 20) {
  const guaranteedAudio = readGuaranteedAudioPool();
  const guaranteedAny = readGuaranteedPool();

  let runtimeItems: any[] = [];

  try {
    const runtime = await buildRuntimeFypFeed([]);
    runtimeItems = Array.isArray(runtime.items) ? runtime.items : [];
  } catch {
    runtimeItems = [];
  }

  const merged = [
    ...guaranteedAudio,
    ...runtimeItems,
    ...guaranteedAny,
  ];

  const seen = new Set<string>();
  const unique = merged.filter((item: any) => {
    const key = item.playbackUrl || item.localUrl || item.id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    ok: true,
    items: unique.slice(0, Math.max(minItems, unique.length)),
    debug: {
      guaranteedAudioCount: guaranteedAudio.length,
      guaranteedTotalCount: guaranteedAny.length,
      runtimeCount: runtimeItems.length,
      finalCount: unique.length,
    },
  };
}
