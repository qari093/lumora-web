export type IdentityOptInControls = {
  userId: string;
  trendParticipationOptIn: boolean;
  liveRoomOptIn: boolean;
  versusOptIn: boolean;
  predictionPickOptIn: boolean;
  streakRewardsOptIn: boolean;
  updatedAt: string;
};

export function buildIdentityOptInControls(
  input: IdentityOptInControls
): IdentityOptInControls {
  return {
    ...input,
    userId: input.userId.trim(),
  };
}

export function isIdentityOptInEnabled(
  controls: IdentityOptInControls,
  key:
    | "trendParticipationOptIn"
    | "liveRoomOptIn"
    | "versusOptIn"
    | "predictionPickOptIn"
    | "streakRewardsOptIn"
): boolean {
  return controls[key] === true;
}
