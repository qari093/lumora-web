export type ReckoningState =
  | "scheduled"
  | "active"
  | "sealed";

export type ReckoningDay = {
  reckoningId: string;
  year: number;
  state: ReckoningState;
  creatorCount: number;
};

export type AuraRecalibration = {
  creatorId: string;
  previousTier: string;
  nextTier: string;
  ascended: boolean;
  phoenixPhase: boolean;
};

export type PhoenixPhase = {
  creatorId: string;
  title: string;
  discoveryBoostPercent: number;
  durationDays: number;
  active: boolean;
};
