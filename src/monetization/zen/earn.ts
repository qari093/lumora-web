export type ZenEarnSignal = {
  type: "hold" | "rewatch" | "completion" | "reward_ad";
  strength: number;
};

export function calculateZenEarn(signal: ZenEarnSignal) {
  const multiplier = {
    hold: 1,
    rewatch: 1.5,
    completion: 2,
    reward_ad: 3,
  }[signal.type];

  return Math.max(0, Math.round(signal.strength * multiplier));
}
