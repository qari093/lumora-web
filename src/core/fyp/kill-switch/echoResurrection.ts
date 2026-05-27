import type {
  EchoResurrection
} from "./types";

export function resurrectVaultedContent(input: {
  creatorId: string;
  contentId: string;
  cooldownDays: number;
  resonanceSparkSpent: boolean;
}): EchoResurrection {
  if (
    input.cooldownDays < 14 ||
    !input.resonanceSparkSpent
  ) {
    throw new Error("Echo Resurrection conditions not met.");
  }

  return {
    resurrectionId: `resurrection_${input.creatorId}`,
    creatorId: input.creatorId,
    contentId: input.contentId,
    restored: true,
    visibilityPenalty: 25,
    survivorBadge: true
  };
}
