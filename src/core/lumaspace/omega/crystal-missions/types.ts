export type CrystalMissionKind = "kindness" | "creator" | "gmar" | "wellness" | "learning" | "community";
export type CrystalMissionStatus = "draft" | "active" | "completed" | "archived";

export type CrystalMission = {
  id: string;
  communityId: string;
  title: string;
  kind: CrystalMissionKind;
  target: number;
  progress: number;
  status: CrystalMissionStatus;
  participantIds: string[];
  zencoinPool: number;
  memoryUnlockId?: string;
};

export type MissionContribution = {
  id: string;
  missionId: string;
  citizenId: string;
  amount: number;
  note: string;
};

export type MissionReward = {
  id: string;
  missionId: string;
  citizenId: string;
  zencoinAmount: number;
  memoryUnlocked: boolean;
};
