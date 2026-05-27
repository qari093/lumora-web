export type CrossPortalIdentity = {
  userId: string;
  portals: string[];
};

export function syncIdentity(userId: string): CrossPortalIdentity {
  return {
    userId,
    portals: ["GMAR","LUMASPACE","LIVE","FYP"]
  };
}
