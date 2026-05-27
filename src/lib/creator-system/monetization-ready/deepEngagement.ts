export type DeepEngagementEvent = {
  creatorId: string;
  witnessId: string;
  circleId: string;
  eventType: "deep-engagement";
  createdAt: string;
};

export function createDeepEngagementEvent(input: {
  creatorId: string;
  witnessId: string;
  circleId: string;
  createdAt?: string;
}): DeepEngagementEvent {
  return {
    creatorId: input.creatorId,
    witnessId: input.witnessId,
    circleId: input.circleId,
    eventType: "deep-engagement",
    createdAt: input.createdAt || new Date().toISOString(),
  };
}
