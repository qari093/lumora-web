export type ChallengeQueueJob = {
  id: string;
  challengeId: string;
  submissionId: string;
  creatorId: string;
  status: "queued" | "processing" | "done";
  queuedAt: number;
};

export function enqueueChallengeJob(input: {
  challengeId: string;
  submissionId: string;
  creatorId: string;
}): ChallengeQueueJob {
  return {
    id: `queue_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    challengeId: input.challengeId,
    submissionId: input.submissionId,
    creatorId: input.creatorId,
    status: "queued",
    queuedAt: Date.now(),
  };
}
