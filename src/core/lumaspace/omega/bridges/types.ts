export type BridgeGate = "spark" | "purpose" | "wisdom";

export type SoulThreadProfile = {
  citizenId: string;
  contributionTags: string[];
  communityIds: string[];
  wisdomTopics: string[];
  missionDomains: string[];
  openingVerse: string;
  consentGranted: boolean;
};

export type BridgeCandidate = {
  citizenId: string;
  gate: BridgeGate;
  affinityScore: number;
  sharedSignals: string[];
  previewVerse: string;
  identityBlurred: true;
};

export type StarlightPulse = {
  id: string;
  fromCitizenId: string;
  toCitizenId: string;
  gate: BridgeGate;
  senderEchoVisible: boolean;
  expiresAt: number;
};

export type ConstellationBridge = {
  id: string;
  citizenA: string;
  citizenB: string;
  gate: BridgeGate;
  status: "forming" | "active" | "trusted" | "archived";
  threadSpaceId: string;
  formedAt: number;
  trustStage: "spark" | "companion" | "builder" | "guardian" | "legacy";
};

export type ThreadSpace = {
  id: string;
  bridgeId: string;
  participantIds: [string, string];
  exchangeLimit: 1;
  echoes: Array<{
    id: string;
    authorId: string;
    format: "text" | "audio" | "video";
    body: string;
  }>;
};
