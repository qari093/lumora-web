export const HOST_ROTATION_DAYS = 7;

export function daysBetweenIso(a: string, b: string): number {
  const diff = new Date(b).getTime() - new Date(a).getTime();
  return Math.floor(diff / 86_400_000);
}

export function shouldRotateHost(assignedAt: string, nowIso: string): boolean {
  return daysBetweenIso(assignedAt, nowIso) >= HOST_ROTATION_DAYS;
}

export function selectNextHost(hostIds: string[], currentHostId: string): string | null {
  if (hostIds.length === 0) return null;
  const currentIndex = hostIds.indexOf(currentHostId);
  return hostIds[(currentIndex + 1) % hostIds.length] || hostIds[0];
}
