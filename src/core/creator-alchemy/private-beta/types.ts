export type BetaSignalStatus = "healthy" | "watch" | "blocked";

export interface BetaCreatorSignal {
  creatorId: string;
  retentionDays: number;
  whisperUsefulRate: number;
  emotionalOverloadReports: number;
  quietGiftUsage: number;
  dreamChamberParticipation: number;
  burnoutRecoverySuccess: number;
  trustScore: number;
}

export interface BetaValidationReport {
  status: BetaSignalStatus;
  creatorCount: number;
  averageTrustScore: number;
  averageWhisperUsefulRate: number;
  overloadSafe: boolean;
  readyForExpandedBeta: boolean;
  reasons: string[];
}
