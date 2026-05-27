export function createRewardExpansionHook(input: {
  hookId: string;
  rewardType: "zen" | "attention_credit" | "creator_support";
  enabled: boolean;
}) {
  return {
    ...input,
    futureReady: true,
  };
}
