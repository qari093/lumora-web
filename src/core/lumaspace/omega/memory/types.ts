export type MemoryKind =
  | "first_light"
  | "living_card"
  | "bridge"
  | "mission"
  | "celebration"
  | "wisdom"
  | "community"
  | "chronicle";

export type MemoryVisibility = "private" | "inner_circle" | "community" | "public";

export type MemoryNode = {
  id: string;
  ownerId: string;
  kind: MemoryKind;
  title: string;
  summary: string;
  createdAt: number;
  visibility: MemoryVisibility;
  emotionalWeight: number;
  participantIds: string[];
  sourcePortal?: "lumaspace" | "fyp" | "live" | "gmar" | "cineverse" | "nexa" | "zendoro";
};

export type TreeBloom = {
  id: string;
  ownerId: string;
  sourceMemoryId: string;
  bloomType:
    | "first_memory"
    | "gratitude"
    | "remembrance"
    | "mission"
    | "bridge"
    | "wisdom"
    | "legacy";
  color: string;
  intensity: number;
};

export type TreeOfTime = {
  ownerId: string;
  branches: Array<{
    id: string;
    label: string;
    memoryIds: string[];
    bloomIds: string[];
  }>;
  blooms: TreeBloom[];
};

export type EchoChain = {
  ownerId: string;
  active: boolean;
  currentDays: number;
  restoredByContribution: boolean;
  rewardBloomId?: string;
};

export type MemoryConstellation = {
  id: string;
  participantIds: string[];
  sourceMemoryIds: string[];
  expiresAt: number;
  syncEnabled: boolean;
  echoIds: string[];
};
