import { GENESIS_TRACES, validateGenesisRegistry } from "../genesis/genesisRegistry";

export function getProductionFypFeed() {
  const validation = validateGenesisRegistry();

  if (!validation.ok) {
    return {
      ok: false,
      source: "lumora_genesis_fyp_v1",
      count: 0,
      feed: [],
      error: "genesis_registry_invalid",
      ts: Date.now()
    };
  }

  return {
    ok: true,
    source: "lumora_genesis_fyp_v1",
    mode: "genesis",
    count: GENESIS_TRACES.length,
    feed: GENESIS_TRACES.map((trace, index) => ({
      id: trace.id,
      kind: "genesis",
      title: trace.title,
      text: "Lumora Genesis Trace",
      category: trace.lane.toUpperCase(),
      lane: trace.lane,
      score: 1 - index * 0.01,
      protected: trace.protected,
      priority: trace.priority,
      retirable: trace.retirable,
      attribution: trace.attribution,
      license: trace.license,
      aspectRatio: trace.aspectRatio,
      media: {
        mediaId: trace.id,
        videoUrl: trace.video,
        posterUrl: trace.poster,
        source: "genesis",
        platform: "lumora",
        region: "global",
        freshnessScore: 1,
        velocityScore: 1
      }
    })),
    ts: Date.now()
  };
}
