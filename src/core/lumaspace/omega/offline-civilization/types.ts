export type OfflineEntity = "orbit" | "vault" | "living_card" | "community" | "bridge" | "chronicle";
export type OfflineQueuedActionKind = "send_light" | "add_resonance" | "weave_memory" | "mission_progress" | "save_beacon";

export type OfflineCapsule = {
  citizenId: string;
  cachedEntities: OfflineEntity[];
  version: number;
  integrityHash: string;
  ready: boolean;
};

export type OfflineQueuedAction = {
  id: string;
  citizenId: string;
  kind: OfflineQueuedActionKind;
  payload: Record<string, string | number | boolean>;
  createdAt: number;
  synced: boolean;
};

export type OfflineSyncReport = {
  citizenId: string;
  attempted: number;
  synced: number;
  failed: number;
  conflictMode: "last_write_wins";
};
