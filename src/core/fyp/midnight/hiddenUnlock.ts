import type { AtmosphereMode } from "../core/types";

export type HiddenUnlock = {
  unlockId: string;
  userId: string;
  mode: AtmosphereMode;
  rewardType: "secret_echo" | "midnight_cut" | "phantom_hint";
  unlockedAt: number;
};

export function createHiddenUnlock(input: {
  userId: string;
  mode: AtmosphereMode;
  rewardType: HiddenUnlock["rewardType"];
  now: number;
}): HiddenUnlock {
  if (!input.userId.trim()) {
    throw new Error("Hidden unlock requires userId.");
  }

  return {
    unlockId: `hidden_${input.userId}_${input.mode}_${input.now}`,
    userId: input.userId,
    mode: input.mode,
    rewardType: input.rewardType,
    unlockedAt: input.now
  };
}
