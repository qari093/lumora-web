import type { LumoraSignal } from "@/types/lumora.signal";

export type NSFWCheckResult = {
  signalId: string;
  nsfwScore: number;
  blocked: boolean;
  reason?: string;
};

const DEFAULT_THRESHOLD = 0.7;

function scoreText(text: string): number {
  const riskyWords = [
    "sex","nude","porn","xxx","onlyfans","leak","nsfw",
    "explicit","adult","naked","18+","fetish","camgirl"
  ];
  const lower = (text || "").toLowerCase();
  let hits = 0;
  for (const w of riskyWords) {
    if (lower.includes(w)) hits++;
  }
  return Math.min(1, hits / 3);
}

export function checkSignalNSFW(
  signal: LumoraSignal,
  threshold = DEFAULT_THRESHOLD
): NSFWCheckResult {
  const textBlob = [
    signal.title,
    signal.summary,
    ...(signal.keywords || []),
    ...(signal.hashtags || []),
  ].join(" ");

  const nsfwScore = scoreText(textBlob);
  const blocked = nsfwScore >= threshold;

  return {
    signalId: signal.id,
    nsfwScore,
    blocked,
    reason: blocked ? "text_policy_violation" : undefined,
  };
}

export function filterSafeSignals(
  signals: LumoraSignal[],
  threshold = DEFAULT_THRESHOLD
) {
  const results: NSFWCheckResult[] = [];
  const safe: LumoraSignal[] = [];

  for (const signal of signals || []) {
    const res = checkSignalNSFW(signal, threshold);
    results.push(res);
    if (!res.blocked) safe.push(signal);
  }

  return {
    safe,
    results,
  };
}
