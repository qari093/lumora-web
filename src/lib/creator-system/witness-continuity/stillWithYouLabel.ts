export function buildStillWithYouOftenLabel(repeatPresenceCount: number): string | null {
  if (repeatPresenceCount >= 5) return "has been still with you often";
  if (repeatPresenceCount >= 2) return "has returned to your circle";
  return null;
}
