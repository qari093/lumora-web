export type ChallengeSubmission = {
  id: string;
  challengeId: string;
  creatorId: string;
  contentId: string;
  submittedAt: number;
  status: "accepted";
};

export function createChallengeSubmission(input: {
  challengeId: string;
  creatorId: string;
  contentId: string;
}): ChallengeSubmission {
  return {
    id: `submission_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    challengeId: input.challengeId,
    creatorId: input.creatorId,
    contentId: input.contentId,
    submittedAt: Date.now(),
    status: "accepted",
  };
}
