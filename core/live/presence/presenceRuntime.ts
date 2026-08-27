export function syncPresence(participantCount: number) {
  const count =
    Number.isFinite(participantCount) && participantCount >= 0
      ? Math.trunc(participantCount)
      : 0;

  return {
    participantCount: count,
    synchronized: true
  };
}
