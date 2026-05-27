export type HumanTraceMoment = {
  videoId: string;
  timestampMs: number;
  present: number;
  stillness: number;
  hold: number;
  rewatch: number;
  silentOvation: number;
};

export function scoreTraceMoment(moment: HumanTraceMoment): number {
  return (
    moment.present * 1 +
    moment.stillness * 3 +
    moment.hold * 4 +
    moment.rewatch * 5 +
    moment.silentOvation * 6
  );
}

export function detectStrongestTraceMoment(moments: HumanTraceMoment[]): HumanTraceMoment | null {
  if (moments.length === 0) return null;

  return [...moments].sort((a, b) => scoreTraceMoment(b) - scoreTraceMoment(a))[0] || null;
}
