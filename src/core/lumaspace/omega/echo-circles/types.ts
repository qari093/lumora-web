export type EchoCircleTheme =
  | "hope"
  | "grief"
  | "creative_fire"
  | "starting_over"
  | "gratitude"
  | "belonging"
  | "focus";

export type EchoCircleParticipant = {
  citizenId: string;
  joinedAt: number;
  consentAccepted: boolean;
  speakingOrder: number;
};

export type EchoCircle = {
  id: string;
  theme: EchoCircleTheme;
  hostId: string;
  maxParticipants: number;
  durationMinutes: 10;
  participants: EchoCircleParticipant[];
  noLogs: true;
  recordingDisabled: true;
  status: "scheduled" | "active" | "completed" | "cancelled";
};

export type EchoCircleModerationSignal = {
  circleId: string;
  severity: "low" | "medium" | "high";
  reason: string;
  requiresGuardianReview: boolean;
};

export type CircleBloom = {
  id: string;
  citizenId: string;
  circleId: string;
  theme: EchoCircleTheme;
  bloomShape: "spiral" | "leaf" | "orb" | "thread" | "star";
  privateByDefault: true;
};
