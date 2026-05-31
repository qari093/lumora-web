export type CommunityRole = "citizen" | "steward" | "guardian" | "council";

export type CommunityDomain =
  | "creator"
  | "wellness"
  | "learning"
  | "gaming"
  | "cineverse"
  | "local"
  | "builder";

export type CommunityIdentity = {
  communityId: string;
  name: string;
  domain: CommunityDomain;
  palette: string;
  soundscape: string;
  foundingStoryVideoId?: string;
  lore: string[];
  traditions: string[];
};

export type CommunityMember = {
  citizenId: string;
  role: CommunityRole;
  trust: number;
  contribution: number;
  joinedAt: number;
};

export type CommunityGovernance = {
  stewardIds: string[];
  guardianIds: string[];
  councilIds: string[];
  constitutionAccepted: boolean;
  transparencyLogEnabled: boolean;
};

export type CommunityCivilization = {
  identity: CommunityIdentity;
  members: CommunityMember[];
  governance: CommunityGovernance;
  vaultMemoryIds: string[];
  treeBloomIds: string[];
  activeMissionIds: string[];
  seed: boolean;
  verified: boolean;
};

export type WisdomBeaconSeed = {
  id: string;
  recordedBy: string;
  topic: string;
  humanRecorded: boolean;
};

export type ConstellationSeed = {
  community: CommunityCivilization;
  ambassadors: string[];
  wisdomBeacons: WisdomBeaconSeed[];
  starterMissionIds: string[];
  starterMemoryIds: string[];
};
