export type CircleContinuityStatus =
  | "host-present"
  | "keeper-took-over"
  | "continuity-risk";

export type CircleContinuityLog = {
  circleId: string;
  status: CircleContinuityStatus;
  hostId?: string;
  keeperId?: string;
  createdAt: string;
};

export function createCircleContinuityLog(input: {
  circleId: string;
  status: CircleContinuityStatus;
  hostId?: string;
  keeperId?: string;
  createdAt?: string;
}): CircleContinuityLog {
  return {
    circleId: input.circleId,
    status: input.status,
    hostId: input.hostId,
    keeperId: input.keeperId,
    createdAt: input.createdAt || new Date().toISOString(),
  };
}
