export type CreatorIdentityHeader = {
  creatorId: string;
  displayName: string;
  presenceLabel: "At Rest";
  vanityMetricsHidden: true;
};

export function buildCreatorIdentityHeader(input: {
  creatorId: string;
  displayName: string;
}): CreatorIdentityHeader {
  return {
    creatorId: input.creatorId,
    displayName: input.displayName.trim(),
    presenceLabel: "At Rest",
    vanityMetricsHidden: true,
  };
}
