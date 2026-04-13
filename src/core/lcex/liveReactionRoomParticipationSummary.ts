export type LiveReactionRoomParticipationSummaryInput = {
  roomId: string;
  entityId: string;
  uniqueParticipants: number;
  peakConcurrentParticipants: number;
  totalMessages: number;
  totalReactions: number;
  averageSessionMinutes: number;
  endedAt: string;
};

export type LiveReactionRoomParticipationSummary = {
  roomId: string;
  entityId: string;
  engagementScore: number;
  summaryLine: string;
  endedAt: string;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function buildLiveReactionRoomParticipationSummary(
  input: LiveReactionRoomParticipationSummaryInput
): LiveReactionRoomParticipationSummary {
  const engagementScore = clampScore(
    Math.min(input.uniqueParticipants, 5000) * 0.01 +
      Math.min(input.peakConcurrentParticipants, 2000) * 0.02 +
      Math.min(input.totalMessages, 5000) * 0.005 +
      Math.min(input.totalReactions, 10000) * 0.003 +
      input.averageSessionMinutes * 0.5
  );

  return {
    roomId: input.roomId.trim(),
    entityId: input.entityId.trim(),
    engagementScore,
    summaryLine: `${input.uniqueParticipants} participants • peak ${input.peakConcurrentParticipants} • ${input.totalMessages} messages • ${input.totalReactions} reactions`,
    endedAt: input.endedAt,
  };
}

export function hasMeaningfulLiveReactionParticipation(
  summary: LiveReactionRoomParticipationSummary
): boolean {
  return summary.engagementScore >= 25;
}
