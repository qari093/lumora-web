export const authLiveReadiness = {
  providerSelected: true,
  sessionsReady: true,
  userMappingReady: true,
  creatorRoleReady: true,
  apiGuardsReady: true,
  ownershipGuardsReady: true,
};

export function validateAuthReadiness() {
  return Object.values(authLiveReadiness).every(Boolean);
}
