export type CeremonialHost = {
  hostId: string;
  displayName: string;
  role: "ceremonial-host";
  active: boolean;
  assignedAt: string;
};

export function createCeremonialHost(input: {
  hostId: string;
  displayName: string;
  assignedAt?: string;
}): CeremonialHost {
  return {
    hostId: input.hostId,
    displayName: input.displayName.trim(),
    role: "ceremonial-host",
    active: true,
    assignedAt: input.assignedAt || new Date().toISOString(),
  };
}
