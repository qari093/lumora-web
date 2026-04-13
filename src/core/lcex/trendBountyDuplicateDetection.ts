export type TrendBountyDuplicateDetectionInput = {
  candidateTitle: string;
  candidateSummary: string;
  candidateEvidenceRefs: string[];
  existingSubmissions: Array<{
    submissionId: string;
    title: string;
    summary: string;
    evidenceRefs: string[];
  }>;
};

export type TrendBountyDuplicateDetectionResult = {
  duplicate: boolean;
  duplicateSubmissionId: string | null;
  similarityScore: number;
  reason: "ok" | "duplicate_title" | "duplicate_evidence" | "high_similarity";
};

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function overlapScore(a: string[], b: string[]): number {
  const sa = new Set(a.map(normalize).filter(Boolean));
  const sb = new Set(b.map(normalize).filter(Boolean));
  if (sa.size === 0 && sb.size === 0) return 0;
  let overlap = 0;
  for (const item of sa) {
    if (sb.has(item)) overlap++;
  }
  return Math.round((overlap / Math.max(sa.size, sb.size, 1)) * 100);
}

export function detectTrendBountyDuplicate(
  input: TrendBountyDuplicateDetectionInput
): TrendBountyDuplicateDetectionResult {
  const candidateTitle = normalize(input.candidateTitle);
  const candidateSummary = normalize(input.candidateSummary);

  for (const existing of input.existingSubmissions) {
    const titleScore = candidateTitle === normalize(existing.title) ? 100 : 0;
    const evidenceScore = overlapScore(
      input.candidateEvidenceRefs,
      existing.evidenceRefs
    );

    const summaryWords = candidateSummary.split(" ").filter(Boolean);
    const existingWords = normalize(existing.summary).split(" ").filter(Boolean);
    const summaryScore = overlapScore(summaryWords, existingWords);

    const similarityScore = Math.round(
      titleScore * 0.45 + evidenceScore * 0.35 + summaryScore * 0.2
    );

    if (titleScore === 100) {
      return {
        duplicate: true,
        duplicateSubmissionId: existing.submissionId,
        similarityScore,
        reason: "duplicate_title",
      };
    }

    if (evidenceScore >= 80) {
      return {
        duplicate: true,
        duplicateSubmissionId: existing.submissionId,
        similarityScore,
        reason: "duplicate_evidence",
      };
    }

    if (similarityScore >= 75) {
      return {
        duplicate: true,
        duplicateSubmissionId: existing.submissionId,
        similarityScore,
        reason: "high_similarity",
      };
    }
  }

  return {
    duplicate: false,
    duplicateSubmissionId: null,
    similarityScore: 0,
    reason: "ok",
  };
}

export function isTrendBountySubmissionUnique(
  input: TrendBountyDuplicateDetectionInput
): boolean {
  return !detectTrendBountyDuplicate(input).duplicate;
}
