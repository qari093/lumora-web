import { createContentBoost } from "./boost";
import { createAiSpendAction } from "./aiActions";
import { unlockPremiumFeature } from "./premium";
import { spendZenForAdSkip } from "./adSkip";

export function validateZencoinSpendLayer(input: {
  userId: string;
  contentId: string;
  balance: number;
}) {
  const boost = createContentBoost({
    userId: input.userId,
    contentId: input.contentId,
    zenCost: 20,
    durationHours: 24,
  });

  const ai = createAiSpendAction({
    action: "caption_polish",
    balance: input.balance,
  });

  const premium = unlockPremiumFeature({
    feature: "memory_replay",
    balance: input.balance,
  });

  const skip = spendZenForAdSkip({
    balance: input.balance,
    userState: "yellow",
  });

  return {
    ok: boost.boostActive && ai.allowed && premium.unlocked && skip.allowed,
    boost,
    ai,
    premium,
    skip,
  };
}
