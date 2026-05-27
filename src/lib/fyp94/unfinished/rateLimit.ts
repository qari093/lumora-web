export function canSendFyp94UnfinishedReminder(input: {
  lastSentAt?: string;
  now?: Date;
  minHours?: number;
}): boolean {
  if (!input.lastSentAt) return true;

  const now = input.now ?? new Date();
  const minHours = input.minHours ?? 8;

  return now.getTime() - new Date(input.lastSentAt).getTime() >= minHours * 60 * 60_000;
}
