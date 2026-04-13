type FlashChallenge = {
  id: string;
  title: string;
  prompt: string;
  rewardPool: number;
  durationMinutes: number;
  startsAt: number;
  endsAt: number;
  status: "scheduled" | "live" | "ended";
};

export function resolveFlashChallengeState(
  challenge: FlashChallenge,
  now: number
): FlashChallenge {
  let status: FlashChallenge["status"] = "scheduled";

  if (now >= challenge.endsAt) {
    status = "ended";
  } else if (now >= challenge.startsAt) {
    status = "live";
  }

  return {
    ...challenge,
    status,
  };
}
