export type KeeperBackup = {
  keeperId: string;
  displayName: string;
  role: "keeper-backup";
  active: boolean;
  assignedCircleId: string;
  assignedAt: string;
};

export function createKeeperBackup(input: {
  keeperId: string;
  displayName: string;
  assignedCircleId: string;
  assignedAt?: string;
}): KeeperBackup {
  return {
    keeperId: input.keeperId,
    displayName: input.displayName.trim(),
    role: "keeper-backup",
    active: true,
    assignedCircleId: input.assignedCircleId,
    assignedAt: input.assignedAt || new Date().toISOString(),
  };
}
