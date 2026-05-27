export type PhantomCircleStatus = "forming" | "active" | "complete" | "unlocked";

export type PhantomCircleMember = {
  userId: string;
  witnessName: string;
  joinedAt: string;
  anonymous: true;
};

export type PhantomCircle = {
  circleId: string;
  status: PhantomCircleStatus;
  members: PhantomCircleMember[];
  createdAt: string;
  requiredSignalsToUnlock: 3;
};

export function createPhantomCircle(circleId: string, createdAt = new Date().toISOString()): PhantomCircle {
  return {
    circleId,
    status: "forming",
    members: [],
    createdAt,
    requiredSignalsToUnlock: 3,
  };
}
