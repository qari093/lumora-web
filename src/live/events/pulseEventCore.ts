export type PulseEventKind =
  | "flash_arena"
  | "countdown_storm"
  | "creator_duel"
  | "trivia_rush"
  | "chaos_drop";

export type PulseEvent = {
  id: string;
  kind: PulseEventKind;
  roomId: string;
  startsAt: string;
  endsAt: string;
  intensity: number;
};

export function isPulseEventLive(event: PulseEvent, now = new Date()): boolean {
  return now >= new Date(event.startsAt) && now <= new Date(event.endsAt);
}

export function clampIntensity(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}
