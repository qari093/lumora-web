export type RewardAdOptInState = {
  visible: boolean;
  userInitiated: boolean;
  label: string;
};

export function buildRewardAdOptIn(input: {
  eligible: boolean;
  userState: "green" | "yellow" | "red";
}): RewardAdOptInState {
  const allowed = input.eligible && input.userState === "green";

  return {
    visible: allowed,
    userInitiated: true,
    label: allowed ? "Watch & earn Zen" : "",
  };
}
