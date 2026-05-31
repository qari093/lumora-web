export type WisdomTopic =
  | "starting_over"
  | "creative_block"
  | "discipline"
  | "grief"
  | "confidence"
  | "building"
  | "wellbeing"
  | "learning";

export type WisdomBeaconFormat = "text" | "audio" | "video";

export type WisdomBeacon = {
  id: string;
  authorId: string;
  topic: WisdomTopic;
  format: WisdomBeaconFormat;
  title: string;
  body: string;
  humanRecorded: boolean;
  trustScore: number;
  appreciationCount: number;
  visibility: "community" | "public";
};

export type GratitudeGem = {
  id: string;
  fromCitizenId: string;
  toAuthorId: string;
  beaconId: string;
  message: string;
  zencoinMicroReward: number;
};

export type WisdomChallenge = {
  id: string;
  topic: WisdomTopic;
  prompt: string;
  active: boolean;
  minimumAppreciations: number;
  rewardCosmetic: "lamp_of_wisdom" | "quiet_lantern" | "mentor_star";
};

export type WisdomReward = {
  id: string;
  citizenId: string;
  beaconId: string;
  rewardKind: "tree_bloom" | "lamp_of_wisdom" | "zencoin_micro_reward";
  unlocked: boolean;
};
