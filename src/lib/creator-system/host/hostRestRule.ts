export const HOST_REST_DAYS = 30;

export function canHostAfterRest(lastHostedAt: string | undefined, nowIso: string): boolean {
  if (!lastHostedAt) return true;

  const diff = new Date(nowIso).getTime() - new Date(lastHostedAt).getTime();
  const days = Math.floor(diff / 86_400_000);

  return days >= HOST_REST_DAYS;
}

export function filterRestedHosts(hosts: { hostId: string; lastHostedAt?: string }[], nowIso: string) {
  return hosts.filter((host) => canHostAfterRest(host.lastHostedAt, nowIso));
}
