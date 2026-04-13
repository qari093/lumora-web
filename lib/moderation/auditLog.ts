export type ModerationAuditEvent = {
  id: string;
  action: string;
  contentId: string;
  actor: string;
  outcome: "allow" | "review" | "block";
  reason?: string;
  ts: number;
};

export function createModerationAuditEvent(input: {
  action: string;
  contentId: string;
  actor: string;
  outcome: "allow" | "review" | "block";
  reason?: string;
}): ModerationAuditEvent {
  return {
    id: `mod_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    action: input.action,
    contentId: input.contentId,
    actor: input.actor,
    outcome: input.outcome,
    reason: input.reason,
    ts: Date.now(),
  };
}
