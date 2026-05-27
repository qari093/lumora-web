export type ImpactSignalType =
  | "view"
  | "echo"
  | "capsule_save"
  | "share"
  | "replay"
  | "rush_hold";

export type RealtimeImpactSignal = {
  signalId: string;
  contentId: string;
  creatorId: string;
  type: ImpactSignalType;
  weight: number;
  createdAt: number;
};

export type ImpactWindow = {
  contentId: string;
  creatorId: string;
  windowSeconds: number;
  signals: RealtimeImpactSignal[];
};

export type RealtimeImpactReport = {
  contentId: string;
  creatorId: string;
  impactQuotient: number;
  signalCount: number;
  surge: boolean;
};
