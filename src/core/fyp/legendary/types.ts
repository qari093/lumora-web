export type LegendaryTier =
  | "nova"
  | "eclipse"
  | "mythic";

export type LegendaryCreator = {
  creatorId: string;
  auraTier: LegendaryTier;
  impactQuotient: number;
  eligible: boolean;
};

export type LegendaryRelicContract = {
  contractId: string;
  creatorId: string;
  productionBudget: number;
  revenueSharePercent: number;
  active: boolean;
};

export type MythicRelease = {
  releaseId: string;
  creatorId: string;
  title: string;
  sponsored: boolean;
  relicDrop: boolean;
};

export type LegendaryBroadcast = {
  broadcastId: string;
  creatorId: string;
  reachMultiplier: number;
  globalPlacement: boolean;
};
