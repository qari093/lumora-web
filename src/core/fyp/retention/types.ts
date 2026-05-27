export type RetentionSignalType =
  | "watch"
  | "return"
  | "share"
  | "favorite";

export type RetentionSignal = {
  userId: string;
  type: RetentionSignalType;
  weight: number;
  ts: number;
};

export type RetentionProfile = {
  userId: string;
  score: number;
  streak: number;
  level: "cold" | "warm" | "hot";
};
