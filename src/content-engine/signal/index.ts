export type ContentEngineSignalType =
  | "content.ingestion.start"
  | "content.ingestion.chunk"
  | "content.ingestion.complete"
  | "content.processing.complete"
  | "content.safety.passed"
  | "content.safety.blocked"
  | "content.feed.impression"
  | "content.feed.signal"
  | "content.playback.error";

export type ContentEngineSource = "client" | "server" | "engine";

export type LumoraEmotionalLayer = {
  presenceDepth: number;
  resonance: number;
  drift: number;
  emotionalMomentum: number;
};

export type ContentEngineSignalEnvelope<TPayload = Record<string, unknown>> = {
  eventId: string;
  eventType: ContentEngineSignalType;
  timestamp: string;
  source: ContentEngineSource;
  payload: TPayload;
  emotional: LumoraEmotionalLayer;
};

export function createContentEngineSignal<TPayload extends Record<string, unknown>>(input: {
  eventType: ContentEngineSignalType;
  source: ContentEngineSource;
  payload: TPayload;
  emotional?: Partial<LumoraEmotionalLayer>;
  nowIso?: string;
  eventId?: string;
}): ContentEngineSignalEnvelope<TPayload> {
  return {
    eventId: input.eventId || `ce_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    eventType: input.eventType,
    timestamp: input.nowIso || new Date().toISOString(),
    source: input.source,
    payload: input.payload,
    emotional: {
      presenceDepth: clamp01(input.emotional?.presenceDepth ?? 0),
      resonance: clamp01(input.emotional?.resonance ?? 0),
      drift: clamp01(input.emotional?.drift ?? 0),
      emotionalMomentum: clamp01(input.emotional?.emotionalMomentum ?? 0),
    },
  };
}

export function mapBehaviorToEmotionalLayer(input: {
  signalType: "present" | "hold" | "rewatch" | "skip";
  watchDurationMs?: number;
  videoDurationMs?: number;
}): LumoraEmotionalLayer {
  const ratio =
    input.watchDurationMs && input.videoDurationMs
      ? clamp01(input.watchDurationMs / input.videoDurationMs)
      : 0;

  if (input.signalType === "hold") {
    return { presenceDepth: ratio, resonance: 0, drift: 0, emotionalMomentum: ratio };
  }

  if (input.signalType === "rewatch") {
    return { presenceDepth: ratio, resonance: 1, drift: 0, emotionalMomentum: 0.85 };
  }

  if (input.signalType === "skip") {
    return { presenceDepth: 0, resonance: 0, drift: 1, emotionalMomentum: 0.1 };
  }

  return { presenceDepth: 0.2, resonance: 0, drift: 0, emotionalMomentum: 0.25 };
}

export function translateMetricLanguage(metric: string): string {
  const map: Record<string, string> = {
    heat_score: "resonance_index",
    hold_rate: "presence_depth",
    skip_rate: "drift",
    engagement_velocity: "emotional_momentum",
  };

  return map[metric] || metric;
}

export function validateContentEngineSignal(signal: ContentEngineSignalEnvelope) {
  const ok = Boolean(
    signal.eventId &&
      signal.eventType &&
      signal.timestamp &&
      signal.source &&
      signal.payload &&
      signal.emotional &&
      signal.emotional.presenceDepth >= 0 &&
      signal.emotional.presenceDepth <= 1 &&
      signal.emotional.resonance >= 0 &&
      signal.emotional.resonance <= 1 &&
      signal.emotional.drift >= 0 &&
      signal.emotional.drift <= 1 &&
      signal.emotional.emotionalMomentum >= 0 &&
      signal.emotional.emotionalMomentum <= 1,
  );

  return {
    ok,
    reason: ok ? "signal_valid" : "signal_invalid",
  };
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}
