export interface HumanRealityObservation {
  creatorId: string;
  daysActive: number;
  returnedAfterRest: boolean;
  whisperOpened: boolean;
  whisperUseful: boolean;
  quietGiftSentOrReceived: boolean;
  dreamChamberJoined: boolean;
  overloadReported: boolean;
  trustScore: number;
}

export interface HumanRealityReport {
  creatorCount: number;
  retentionRate: number;
  whisperUsefulnessRate: number;
  quietGiftAdoptionRate: number;
  dreamChamberAdoptionRate: number;
  overloadRate: number;
  averageTrustScore: number;
  readyForTuning: boolean;
  readyForExpansion: boolean;
}
