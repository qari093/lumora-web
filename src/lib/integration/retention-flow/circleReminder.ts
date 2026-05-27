export function triggerDailyCircleReminder(input: { creatorId: string; nextCircleIso: string }) {
  return { ...input, enabled: true, message: "Your next circle is waiting quietly." };
}
