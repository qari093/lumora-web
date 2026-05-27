export type LiveCircleSession = {
  circleId: string;
  status: "live";
  startedAt: string;
  durationMinutes: 12;
  live: true;
};

export function launchLiveCircleSession(input: {
  circleId: string;
  startedAt?: string;
}): LiveCircleSession {
  return {
    circleId: input.circleId,
    status: "live",
    startedAt: input.startedAt || new Date().toISOString(),
    durationMinutes: 12,
    live: true,
  };
}
