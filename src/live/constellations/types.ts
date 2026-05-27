export type ConstellationRole = "owner" | "guardian" | "member";
export type ConstellationState = "forming" | "active" | "resting";

export type Constellation = {
  id: string;
  name: string;
  symbol: string;
  state: ConstellationState;
  memberCount: number;
  syncScore: number;
  createdAt: string;
};

export type ConstellationMember = {
  userId: string;
  role: ConstellationRole;
  joinedAt: string;
};
