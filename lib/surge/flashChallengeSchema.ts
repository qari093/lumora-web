export type FlashChallengeStatus = "scheduled" | "live" | "ended";

export type FlashChallenge = {
  id: string;
  title: string;
  prompt: string;
  rewardPool: number;
  durationMinutes: number;
  startsAt: number;
  endsAt: number;
  status: FlashChallengeStatus;
};

export function createFlashChallenge(input: {
  title: string;
  prompt: string;
  rewardPool: number;
  durationMinutes: number;
  startsAt?: number;
}): FlashChallenge {
  const startsAt = Number.isFinite(input.startsAt) ? Number(input.startsAt) : Date.now();
  const durationMinutes = Math.max(1, Math.floor(input.durationMinutes || 1));
  const endsAt = startsAt + durationMinutes * 60 * 1000;

  return {
    id: `challenge_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    title: input.title,
    prompt: input.prompt,
    rewardPool: Math.max(0, Math.floor(input.rewardPool || 0)),
    durationMinutes,
    startsAt,
    endsAt,
    status: "scheduled",
  };
}
