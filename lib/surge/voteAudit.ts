export type VoteAuditInput = {
  duelId: string;
  totalVotes: number;
  suspiciousVotes?: number;
  sampleRate?: number;
};

export type VoteAuditResult = {
  shouldAudit: boolean;
  sampledVotes: number;
  sampleRate: number;
  reason: "suspicious_votes" | "random_sample" | "no_audit";
};

export function calculateVoteAudit(input: VoteAuditInput): VoteAuditResult {
  const totalVotes = Math.max(0, input.totalVotes ?? 0);
  const suspiciousVotes = Math.max(0, input.suspiciousVotes ?? 0);
  const sampleRate = Math.max(0.01, Math.min(1, input.sampleRate ?? 0.1));

  if (suspiciousVotes > 0) {
    return {
      shouldAudit: true,
      sampledVotes: Math.min(totalVotes, Math.max(1, suspiciousVotes)),
      sampleRate,
      reason: "suspicious_votes",
    };
  }

  const sampledVotes = Math.min(
    totalVotes,
    totalVotes > 0 ? Math.max(1, Math.round(totalVotes * sampleRate)) : 0
  );

  if (sampledVotes > 0) {
    return {
      shouldAudit: true,
      sampledVotes,
      sampleRate,
      reason: "random_sample",
    };
  }

  return {
    shouldAudit: false,
    sampledVotes: 0,
    sampleRate,
    reason: "no_audit",
  };
}
