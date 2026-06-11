export type LumoraTraceLane = "wonder" | "learn" | "laugh" | "build" | "explore";

export type LumoraTraceEvent = {
  sourceId: string;
  lane: LumoraTraceLane;
  watchRatio: number;
  saved: boolean;
  replayed: boolean;
  deepDiveOpened: boolean;
  timestamp: string;
};

export type LumoraTraceSummary = {
  dominantLane: LumoraTraceLane;
  curiosityScore: number;
  continuationEligible: boolean;
  traceLabel: string;
};

const LANES: LumoraTraceLane[] = ["wonder", "learn", "laugh", "build", "explore"];

export function normalizeTraceLane(value: string): LumoraTraceLane {
  const clean = value.toLowerCase().trim();
  return LANES.includes(clean as LumoraTraceLane) ? (clean as LumoraTraceLane) : "explore";
}

export function scoreCuriosity(event: LumoraTraceEvent): number {
  const watch = Math.max(0, Math.min(1, event.watchRatio)) * 40;
  const save = event.saved ? 20 : 0;
  const replay = event.replayed ? 20 : 0;
  const deepDive = event.deepDiveOpened ? 20 : 0;
  return Math.round(watch + save + replay + deepDive);
}

export function summarizeLumoraTrace(events: LumoraTraceEvent[]): LumoraTraceSummary {
  const safeEvents = events.length > 0 ? events : [{
    sourceId: "empty",
    lane: "explore" as LumoraTraceLane,
    watchRatio: 0,
    saved: false,
    replayed: false,
    deepDiveOpened: false,
    timestamp: new Date(0).toISOString()
  }];

  const laneScores = new Map<LumoraTraceLane, number>();
  for (const lane of LANES) laneScores.set(lane, 0);

  let total = 0;
  for (const event of safeEvents) {
    const score = scoreCuriosity(event);
    total += score;
    laneScores.set(event.lane, (laneScores.get(event.lane) ?? 0) + score);
  }

  const dominantLane = [...laneScores.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "explore";
  const curiosityScore = Math.round(total / safeEvents.length);
  const continuationEligible = curiosityScore >= 55 || safeEvents.some((event) => event.deepDiveOpened);

  return {
    dominantLane,
    curiosityScore,
    continuationEligible,
    traceLabel: `Lumora Trace · ${dominantLane} · ${curiosityScore}`
  };
}

export const LUMORA_TRACE_ATTENTION_MEMORY_READY = true;

export const LUMORA_LANES: LumoraTraceLane[] = ["wonder", "learn", "laugh", "build", "explore"];

export type TraceSignal = {
  sourceId: string;
  lane: LumoraTraceLane;
  curiosityScore: number;
  saved: boolean;
  replayed: boolean;
  deepDiveOpened: boolean;
};

export function normalizeLane(value: string): LumoraTraceLane {
  return normalizeTraceLane(value);
}

export function createTraceSignal(input: {
  sourceId: string;
  lane: string;
  watchRatio?: number;
  saved?: boolean;
  replayed?: boolean;
  deepDiveOpened?: boolean;
}): TraceSignal {
  const event: LumoraTraceEvent = {
    sourceId: input.sourceId,
    lane: normalizeTraceLane(input.lane),
    watchRatio: input.watchRatio ?? 0,
    saved: input.saved ?? false,
    replayed: input.replayed ?? false,
    deepDiveOpened: input.deepDiveOpened ?? false,
    timestamp: new Date().toISOString()
  };

  return {
    sourceId: event.sourceId,
    lane: event.lane,
    curiosityScore: scoreCuriosity(event),
    saved: event.saved,
    replayed: event.replayed,
    deepDiveOpened: event.deepDiveOpened
  };
}

export function summarizeTrace(events: LumoraTraceEvent[]): LumoraTraceSummary {
  return summarizeLumoraTrace(events);
}

export function shouldOfferStoryContinuation(events: LumoraTraceEvent[]): boolean {
  return summarizeLumoraTrace(events).continuationEligible;
}
