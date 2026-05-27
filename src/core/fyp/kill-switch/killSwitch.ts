import type {
  KillSwitchAttempt,
  KillSwitchState
} from "./types";

export function armKillSwitch(input: {
  creatorId: string;
  contentId: string;
  baselineImpact: number;
  now: number;
}): KillSwitchAttempt {
  if (
    !input.creatorId.trim() ||
    !input.contentId.trim()
  ) {
    throw new Error("Kill Switch requires creator and content.");
  }

  return {
    attemptId: `kill_${input.creatorId}_${input.now}`,
    creatorId: input.creatorId,
    contentId: input.contentId,
    baselineImpact: input.baselineImpact,
    activatedAt: input.now,
    expiresAt: input.now + 6 * 60 * 60 * 1000,
    state: "armed"
  };
}

export function resolveKillSwitch(input: {
  attempt: KillSwitchAttempt;
  currentImpact: number;
}): KillSwitchState {
  return input.currentImpact >= input.attempt.baselineImpact
    ? "survived"
    : "vaulted";
}
