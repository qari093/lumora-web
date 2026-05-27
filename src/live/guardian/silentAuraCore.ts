export type SilentAura = {
  userId: string;
  roomId: string;
  visibleTo: "host_and_moderators";
  createdAt: string;
};

export function createSilentAura(userId: string, roomId: string): SilentAura {
  return {
    userId,
    roomId,
    visibleTo: "host_and_moderators",
    createdAt: new Date().toISOString(),
  };
}
