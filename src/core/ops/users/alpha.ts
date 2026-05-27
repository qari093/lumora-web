export type AlphaUserKind = "creator" | "fan";

export function createAlphaInvite(input: {
  email: string;
  kind: AlphaUserKind;
}) {
  return {
    ...input,
    inviteId: `alpha-${input.kind}-${input.email}`,
    status: "invited",
    createdAt: new Date().toISOString(),
  };
}
