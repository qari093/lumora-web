export type WisdomDomain =
  | "starting_over"
  | "creative_block"
  | "discipline"
  | "wellbeing"
  | "leadership"
  | "building"
  | "learning";

export type GuardianProfile = {
  guardianId: string;
  displayName: string;
  domains: WisdomDomain[];
  trustScore: number;
  available: boolean;
  guardianGlowVisible: boolean;
  maxActiveMentorships: number;
  activeMentorships: number;
};

export type MentorshipRequest = {
  id: string;
  seekerId: string;
  guardianId: string;
  domain: WisdomDomain;
  message: string;
  status: "pending" | "accepted" | "declined";
};

export type MentorshipBridge = {
  id: string;
  seekerId: string;
  guardianId: string;
  domain: WisdomDomain;
  status: "active" | "completed" | "archived";
  threadSpaceId: string;
  prompts: string[];
};

export type MentorRecognition = {
  guardianId: string;
  helpedCount: number;
  legacyBloomUnlocked: boolean;
  recognitionMotif: "small_lamp" | "steady_lantern" | "guardian_constellation";
};
