export function updateIdentityHeaderLive(dashboard: any, input: {
  creatorId: string;
  displayName: string;
  presenceState: string;
}) {
  return {
    ...dashboard,
    identityHeader: {
      creatorId: input.creatorId,
      displayName: input.displayName.trim(),
      presenceState: input.presenceState,
      vanityMetricsHidden: true,
    },
  };
}
