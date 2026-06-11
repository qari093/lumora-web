export type LumoraLane = "wonder" | "learn" | "laugh" | "build" | "explore";

export type TraceSignal = {
  videoId: string;
  lane: LumoraLane;
  watchedMs: number;
  completed: boolean;
  sparked: boolean;
  saved: boolean;
  deepDive: boolean;
  replayed: boolean;
  at: string;
};

export type TraceSummary = {
  curiosityScore: number;
  dominantLane: LumoraLane;
  laneCounts: Record<LumoraLane, number>;
  completedCount: number;
  sparkCount: number;
  savedCount: number;
  deepDiveCount: number;
};

export const LUMORA_LANES: Array<{ key: LumoraLane; label: string; intent: string }> = [
  { key: "wonder", label: "Wonder", intent: "Awe, mystery, beauty" },
  { key: "learn", label: "Learn", intent: "Knowledge, clarity, insight" },
  { key: "laugh", label: "Laugh", intent: "Lightness, humor, relief" },
  { key: "build", label: "Build", intent: "Creation, skill, momentum" },
  { key: "explore", label: "Explore", intent: "Discovery, culture, motion" }
];

export function normalizeLane(value: string | undefined): LumoraLane {
  const raw = String(value || "").toLowerCase();
  if (raw.includes("science") || raw.includes("learn") || raw.includes("news")) return "learn";
  if (raw.includes("stock") || raw.includes("build") || raw.includes("owned")) return "build";
  if (raw.includes("culture") || raw.includes("film") || raw.includes("archive")) return "explore";
  if (raw.includes("laugh") || raw.includes("fun")) return "laugh";
  return "wonder";
}

export function createTraceSignal(input: {
  videoId: string;
  lane?: string;
  watchedMs?: number;
  completed?: boolean;
  sparked?: boolean;
  saved?: boolean;
  deepDive?: boolean;
  replayed?: boolean;
}): TraceSignal {
  return {
    videoId: input.videoId,
    lane: normalizeLane(input.lane),
    watchedMs: Math.max(0, Math.floor(input.watchedMs || 0)),
    completed: Boolean(input.completed),
    sparked: Boolean(input.sparked),
    saved: Boolean(input.saved),
    deepDive: Boolean(input.deepDive),
    replayed: Boolean(input.replayed),
    at: new Date().toISOString()
  };
}

export function summarizeTrace(signals: TraceSignal[]): TraceSummary {
  const laneCounts: Record<LumoraLane, number> = {
    wonder: 0,
    learn: 0,
    laugh: 0,
    build: 0,
    explore: 0
  };

  let completedCount = 0;
  let sparkCount = 0;
  let savedCount = 0;
  let deepDiveCount = 0;
  let replayCount = 0;

  for (const signal of signals) {
    laneCounts[signal.lane] += 1;
    if (signal.completed) completedCount += 1;
    if (signal.sparked) sparkCount += 1;
    if (signal.saved) savedCount += 1;
    if (signal.deepDive) deepDiveCount += 1;
    if (signal.replayed) replayCount += 1;
  }

  const dominantLane = (Object.entries(laneCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "wonder") as LumoraLane;
  const curiosityScore = Math.min(
    100,
    completedCount * 8 + sparkCount * 6 + savedCount * 12 + deepDiveCount * 18 + replayCount * 10
  );

  return {
    curiosityScore,
    dominantLane,
    laneCounts,
    completedCount,
    sparkCount,
    savedCount,
    deepDiveCount
  };
}

export function shouldOfferStoryContinuation(signals: TraceSignal[], currentLane: LumoraLane): boolean {
  const recent = signals.slice(-5);
  return recent.filter((signal) => signal.lane === currentLane && (signal.completed || signal.deepDive)).length >= 2;
}
