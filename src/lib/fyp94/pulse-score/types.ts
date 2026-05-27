export type Fyp94PulseScoreState = {
  anonymousUserId: string;
  streakDays: number;
  score: number;
  lastActiveDate: string;
  updatedAt: string;
};

export type Fyp94PulseScoreEvent =
  | { type: "full_watch"; points?: number }
  | { type: "sequence_completed"; points?: number }
  | { type: "daily_active"; date: string };
