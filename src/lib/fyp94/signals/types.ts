export type Fyp94SwerveSignalType = "more_like_this" | "different" | "switch_category";

export type Fyp94SwerveSignal = {
  signalId: string;
  type: Fyp94SwerveSignalType;
  clipId: string;
  category: string;
  tags: string[];
  anonymousSessionId: string;
  createdAt: string;
};

export type Fyp94SignalWeight = {
  category: string;
  weight: number;
  tags: Record<string, number>;
};
