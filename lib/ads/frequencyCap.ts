type FrequencyInput = {
  userId: string;
  adId: string;
  currentCount: number;
  maxPerSession?: number;
};

type FrequencyResult = {
  allowed: boolean;
  remaining: number;
  maxPerSession: number;
};

export function checkAdFrequency(input: FrequencyInput): FrequencyResult {
  const currentCount = Math.max(0, Math.floor(input.currentCount ?? 0));
  const maxPerSession = Math.max(1, Math.floor(input.maxPerSession ?? 3));

  const allowed = currentCount < maxPerSession;

  return {
    allowed,
    remaining: Math.max(0, maxPerSession - currentCount),
    maxPerSession,
  };
}
