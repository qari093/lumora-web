import type { PhantomCircle } from "./phantomCircleModel";

export type PhantomSignal = {
  userId: string;
  type: "present" | "stillness" | "hold" | "rewatch" | "silent-ovation";
  createdAt: string;
};

export function countUniquePhantomSignals(signals: PhantomSignal[]): number {
  return new Set(signals.map((signal) => `${signal.userId}:${signal.type}`)).size;
}

export function canUnlockPublicCircle(circle: PhantomCircle, signals: PhantomSignal[]): boolean {
  return countUniquePhantomSignals(signals) >= circle.requiredSignalsToUnlock;
}

export function unlockPublicCircle(circle: PhantomCircle, signals: PhantomSignal[]): PhantomCircle {
  if (!canUnlockPublicCircle(circle, signals)) return circle;

  return {
    ...circle,
    status: "unlocked",
  };
}
