export type FandomRank =
  | "wire-follower"
  | "spark-loyalist"
  | "blaze-cultist"
  | "volt-elite";

export type FanEngagement = {
  fanId: string;
  creatorId: string;
  secondsWatched: number;
  echoCount: number;
  capsuleSaves: number;
  liveRoomJoins: number;
};

export type FanRankProfile = FanEngagement & {
  rank: FandomRank;
  loyaltyScore: number;
};

export type FandomReward = {
  rewardId: string;
  fanId: string;
  creatorId: string;
  type: "relic" | "room-access" | "recognition";
  unlocked: boolean;
};
