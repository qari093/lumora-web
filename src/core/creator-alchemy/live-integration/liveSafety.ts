export function validateLiveEmotionalSafety(input: {
  moderationEnabled: boolean;
  reportedMessages: number;
  unsafeSignals: number;
  hostSanctuaryMode: boolean;
}): boolean {
  if (!input.moderationEnabled) return false;
  if (input.reportedMessages > 10) return false;
  if (input.unsafeSignals > 0) return false;
  if (input.hostSanctuaryMode) return false;
  return true;
}
