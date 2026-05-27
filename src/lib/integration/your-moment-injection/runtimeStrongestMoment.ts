export type RuntimeMoment = {
  videoId: string;
  timestampMs: number;
  present: number;
  stillness: number;
  hold: number;
  rewatch: number;
  silentOvation: number;
};

export function scoreRuntimeMoment(moment: RuntimeMoment): number {
  return (
    moment.present * 1 +
    moment.stillness * 3 +
    moment.hold * 4 +
    moment.rewatch * 5 +
    moment.silentOvation * 6
  );
}

export function detectRuntimeStrongestMoment(moments: RuntimeMoment[]): RuntimeMoment | null {
  if (moments.length === 0) return null;
  return [...moments].sort((a, b) => scoreRuntimeMoment(b) - scoreRuntimeMoment(a))[0] || null;
}
