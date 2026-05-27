export function syncNextCircleCountdown(input: {
  nextCircleIso?: string;
  nowIso?: string;
}) {
  if (!input.nextCircleIso) {
    return {
      visible: false,
      secondsRemaining: null,
      nextCircleIso: null,
    };
  }

  const now = new Date(input.nowIso || new Date().toISOString()).getTime();
  const next = new Date(input.nextCircleIso).getTime();

  return {
    visible: true,
    secondsRemaining: Math.max(0, Math.floor((next - now) / 1000)),
    nextCircleIso: input.nextCircleIso,
  };
}
