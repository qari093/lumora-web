import { readPrecomputedRanking } from "@/lib/intelligence/ranking/precompute";

export type ScoringConsistencyIssue = {
  signalId: string;
  type:
    | "missing_final_rank_score"
    | "invalid_final_rank_score"
    | "invalid_gravity_score"
    | "invalid_weighted_score"
    | "invalid_trailer_priority_score"
    | "rank_order_inconsistency";
  message: string;
};

export type ScoringConsistencyReport = {
  ok: boolean;
  totalSignals: number;
  issueCount: number;
  issues: ScoringConsistencyIssue[];
  checkedAt: number;
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export async function validateScoringConsistency(): Promise<ScoringConsistencyReport> {
  const snapshot = await readPrecomputedRanking();
  const issues: ScoringConsistencyIssue[] = [];
  const signals = Array.isArray(snapshot.signals) ? snapshot.signals : [];

  for (let i = 0; i < signals.length; i++) {
    const current = signals[i] as Record<string, unknown>;
    const id = String(current.id || `unknown_${i}`);

    if (!isFiniteNumber(current.finalRankScore)) {
      issues.push({
        signalId: id,
        type: "missing_final_rank_score",
        message: "finalRankScore missing or non-numeric",
      });
    } else if ((current.finalRankScore as number) < 0 || (current.finalRankScore as number) > 100) {
      issues.push({
        signalId: id,
        type: "invalid_final_rank_score",
        message: "finalRankScore outside expected 0..100 range",
      });
    }

    if (!isFiniteNumber(current.gravityScore)) {
      issues.push({
        signalId: id,
        type: "invalid_gravity_score",
        message: "gravityScore missing or non-numeric",
      });
    }

    if (!isFiniteNumber(current.weightedScore)) {
      issues.push({
        signalId: id,
        type: "invalid_weighted_score",
        message: "weightedScore missing or non-numeric",
      });
    }

    if (!isFiniteNumber(current.trailerPriorityScore)) {
      issues.push({
        signalId: id,
        type: "invalid_trailer_priority_score",
        message: "trailerPriorityScore missing or non-numeric",
      });
    }

    if (i > 0) {
      const prev = signals[i - 1] as Record<string, unknown>;
      if (
        isFiniteNumber(prev.finalRankScore) &&
        isFiniteNumber(current.finalRankScore) &&
        (prev.finalRankScore as number) < (current.finalRankScore as number)
      ) {
        issues.push({
          signalId: id,
          type: "rank_order_inconsistency",
          message: "ranking order is ascending at one position instead of descending",
        });
      }
    }
  }

  return {
    ok: issues.length === 0,
    totalSignals: signals.length,
    issueCount: issues.length,
    issues,
    checkedAt: Date.now(),
  };
}
