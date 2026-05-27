export function requireHost(attendeeIds: string[], hostId?: string): boolean {
  if (hostId) return attendeeIds.includes(hostId);
  return attendeeIds.length > 0;
}
