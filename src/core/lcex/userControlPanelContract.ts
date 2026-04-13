export type UserControlPanelContract = {
  userId: string;
  discoveryIntensity: "low" | "balanced" | "high";
  noveltyOptIn: boolean;
  liveRoomOptIn: boolean;
  versusOptIn: boolean;
  predictionPickOptIn: boolean;
  streakRewardsOptIn: boolean;
  moodBoardsOptIn: boolean;
  fandomBadgesOptIn: boolean;
  updatedAt: string;
};

export function buildUserControlPanelContract(
  input: UserControlPanelContract
): UserControlPanelContract {
  return {
    ...input,
    userId: input.userId.trim(),
  };
}

export function isUserControlPanelContractUsable(
  panel: UserControlPanelContract
): boolean {
  return (
    panel.userId.length > 0 &&
    panel.discoveryIntensity.length > 0 &&
    typeof panel.noveltyOptIn === "boolean"
  );
}
