import type { LumoraSignal } from "@/types/lumora.signal";

export type AudioModerationResult = {
  signalId: string;
  explicitScore: number;
  blocked: boolean;
  reason?: string;
};

const DEFAULT_THRESHOLD = 0.7;

function scoreExplicitText(text: string): number {
  const riskyTerms = [
    "fuck", "fucking", "bitch", "slut", "whore", "porn", "sex",
    "nude", "naked", "blowjob", "fetish", "cum", "dick", "pussy",
    "rape", "molest", "incest", "onlyfans", "xxx", "18+"
  ];

  const normalized = String(text || "").toLowerCase();
  let hits = 0;
  for (const term of riskyTerms) {
    if (normalized.includes(term)) hits++;
  }

  return Math.min(1, hits / 4);
}

function buildTranscriptCandidate(signal: LumoraSignal): string {
  return [
    signal.title,
    signal.summary,
    ...(signal.keywords || []),
    ...(signal.hashtags || []),
  ].join(" ");
}

export function moderateSignalAudioText(
  signal: LumoraSignal,
  threshold = DEFAULT_THRESHOLD
): AudioModerationResult {
  const transcriptCandidate = buildTranscriptCandidate(signal);
  const explicitScore = scoreExplicitText(transcriptCandidate);
  const blocked = explicitScore >= threshold;

  return {
    signalId: signal.id,
    explicitScore,
    blocked,
    reason: blocked ? "explicit_audio_text_detected" : undefined,
  };
}

export function filterAudioSafeSignals(
  signals: LumoraSignal[],
  threshold = DEFAULT_THRESHOLD
) {
  const results: AudioModerationResult[] = [];
  const safe: LumoraSignal[] = [];

  for (const signal of signals || []) {
    const result = moderateSignalAudioText(signal, threshold);
    results.push(result);
    if (!result.blocked) safe.push(signal);
  }

  return {
    safe,
    results,
  };
}
