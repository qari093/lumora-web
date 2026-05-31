export type SharedWorldType =
  | "family"
  | "creator"
  | "team"
  | "learning"
  | "wellness";

export type SharedWorldRole = "member" | "builder" | "steward" | "guardian";

export type SharedWorldMember = {
  citizenId: string;
  role: SharedWorldRole;
  joinedAt: number;
  canInvite: boolean;
};

export type SharedWorld = {
  id: string;
  type: SharedWorldType;
  title: string;
  ownerId: string;
  members: SharedWorldMember[];
  memoryIds: string[];
  treeBloomIds: string[];
  rituals: string[];
  privateByDefault: true;
  active: boolean;
};

export type SharedWorldInvite = {
  id: string;
  worldId: string;
  invitedBy: string;
  invitedCitizenId: string;
  status: "pending" | "accepted" | "declined";
};

export type SharedWorldHealth = {
  worldId: string;
  memberCount: number;
  memoryCount: number;
  ritualCount: number;
  healthScore: number;
};
