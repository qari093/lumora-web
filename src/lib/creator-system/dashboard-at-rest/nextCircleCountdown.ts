export type NextCircleCountdown = {
  nextCircleIso?: string;
  available: boolean;
  secondsRemaining: number | null;
};

export function buildNextCircleCountdown(input: {
  nextCircleIso?: string;
  nowIso?: string;
}): NextCircleCountdown {
  if (!input.nextCircleIso) {
    return {
      nextCircleIso: undefined,
      available: false,
      secondsRemaining: null,
    };
  }

  const now = new Date(input.nowIso || new Date().toISOString()).getTime();
  const next = new Date(input.nextCircleIso).getTime();

  return {
    nextCircleIso: input.nextCircleIso,
    available: true,
    secondsRemaining: Math.max(0, Math.floor((next - now) / 1000)),
  };
}
