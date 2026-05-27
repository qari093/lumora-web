export interface LumoraShadowPolicy {
  publicByDefault: boolean;
  likesVisible: boolean;
  commentsVisible: boolean;
  viralityEligible: boolean;
  creatorCircleOnly: boolean;
}

export const DEFAULT_LUMORA_SHADOW_POLICY: LumoraShadowPolicy = {
  publicByDefault: false,
  likesVisible: false,
  commentsVisible: false,
  viralityEligible: false,
  creatorCircleOnly: true
};

export function canShowcaseShadowWork(input: {
  creatorApproved: boolean;
  emotionalSafetyPassed: boolean;
  publicLabel: string;
}): boolean {
  return (
    input.creatorApproved &&
    input.emotionalSafetyPassed &&
    input.publicLabel === "From the constellation’s quiet circle."
  );
}
