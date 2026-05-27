export type ExitInteractionUi = {
  visible: boolean;
  label: string;
  rewardText: string;
  dismissible: boolean;
  blocksSwipe: boolean;
};

export function buildExitInteractionUi(input: {
  eligible: boolean;
  rewardZen: number;
}): ExitInteractionUi {
  return {
    visible: input.eligible,
    label: "Optional sponsor pulse",
    rewardText: input.eligible ? `+${input.rewardZen} Zen` : "",
    dismissible: true,
    blocksSwipe: false,
  };
}
