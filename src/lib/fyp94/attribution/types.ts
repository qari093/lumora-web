export type Fyp94AttributionLink = {
  anonymousUserId: string;
  category: string;
  waveId: string;
  contributionLevel: "low" | "medium" | "high";
  createdAt: string;
};

export type Fyp94AttributionMessage = {
  waveId: string;
  message: string;
  display: boolean;
};
