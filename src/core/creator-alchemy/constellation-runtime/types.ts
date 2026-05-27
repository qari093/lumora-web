export type RuntimeConstellation =
  | "Midnight Souls"
  | "Quiet Chaos"
  | "Neon Dreamers"
  | "Healing Humor"
  | "Slow Fire"
  | "Restless Voices";

export interface RuntimeCreatorSignal {
  creatorId: string;
  toneShift: number;
  audienceMutation: number;
  creatorCuriosity: number;
  rewatchDensity: number;
}

export interface RuntimeConstellationState {
  creatorId: string;
  constellation: RuntimeConstellation;
  confidence: number;
  driftExposure: number;
  shadowEligible: boolean;
}

export interface DreamChamberRuntime {
  active: boolean;
  preGlow: boolean;
  constellation: RuntimeConstellation;
  likesHidden: true;
  commentsHidden: true;
  presenceOnly: true;
}

export interface BridgeRuntime {
  active: boolean;
  from: RuntimeConstellation;
  to: RuntimeConstellation;
  anonymous: true;
  labelHidden: true;
}
