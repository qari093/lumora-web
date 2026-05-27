export interface FypCreatorSignal {
  creatorId: string;
  contentId: string;
  rewatchRate: number;
  saveRate: number;
  completionRate: number;
  burnoutRisk: number;
  originality: number;
  constellation: string;
}

export interface FypSyncScore {
  creatorId: string;
  contentId: string;
  resonanceScore: number;
  feedBoost: number;
  suppressForBurnout: boolean;
  constellationDiscovery: boolean;
}

export interface EmotionalAnalyticsSnapshot {
  creatorId: string;
  quietMomentum: number;
  emotionalDiversity: number;
  whisperLearningWeight: number;
  healthScore: number;
}
