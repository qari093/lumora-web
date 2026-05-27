export function validateWebhookReplay(input: { eventId: string; seenIds: string[] }) {
  return {
    allowed: !input.seenIds.includes(input.eventId),
    eventId: input.eventId,
  };
}
