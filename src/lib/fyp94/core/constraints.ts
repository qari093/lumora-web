export const FYP94_EXECUTION_CONSTRAINTS = {
  maxFeedBatchSize: 20,
  maxActiveVideoPlayers: 1,
  maxRenderedVideoCards: 3,
  targetSwipeWindowMs: 200,
  maxFomoStackDepth: 1,
  maxReminderFrequencyHours: 8,
} as const;

export function validateAntiOverengineeringConstraint(input: {
  renderedVideoCards: number;
  activeVideoPlayers: number;
  fomoStackDepth: number;
}): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (input.renderedVideoCards > FYP94_EXECUTION_CONSTRAINTS.maxRenderedVideoCards) {
    reasons.push("too_many_rendered_video_cards");
  }

  if (input.activeVideoPlayers > FYP94_EXECUTION_CONSTRAINTS.maxActiveVideoPlayers) {
    reasons.push("too_many_active_video_players");
  }

  if (input.fomoStackDepth > FYP94_EXECUTION_CONSTRAINTS.maxFomoStackDepth) {
    reasons.push("fomo_overstacked");
  }

  return { ok: reasons.length === 0, reasons };
}
