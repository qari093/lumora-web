export type TrendBountySubmissionCategory =
  | "movie"
  | "series"
  | "music"
  | "gaming"
  | "cross-media";

export type TrendBountySubmissionContract = {
  submissionId: string;
  bountyId: string;
  userId: string;
  title: string;
  summary: string;
  evidenceRefs: string[];
  category: TrendBountySubmissionCategory;
  region?: string;
  language?: string;
  createdAt: string;
};

export function buildTrendBountySubmissionContract(
  input: TrendBountySubmissionContract
): TrendBountySubmissionContract {
  return {
    ...input,
    submissionId: input.submissionId.trim(),
    bountyId: input.bountyId.trim(),
    userId: input.userId.trim(),
    title: input.title.trim(),
    summary: input.summary.trim(),
    evidenceRefs: input.evidenceRefs.map((ref) => ref.trim()).filter(Boolean),
    region: input.region?.trim().toLowerCase(),
    language: input.language?.trim().toLowerCase(),
  };
}

export function isTrendBountySubmissionContractUsable(
  submission: TrendBountySubmissionContract
): boolean {
  return (
    submission.submissionId.length > 0 &&
    submission.bountyId.length > 0 &&
    submission.userId.length > 0 &&
    submission.title.length > 0 &&
    submission.summary.length > 0 &&
    submission.evidenceRefs.length > 0
  );
}
