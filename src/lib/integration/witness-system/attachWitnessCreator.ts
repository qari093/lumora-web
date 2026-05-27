export function attachWitnessToCreator(input: {
  creatorId: string;
  witnessId: string;
  circleId: string;
}) {
  return {
    creatorId: input.creatorId,
    witnessId: input.witnessId,
    circleId: input.circleId,
    attached: true,
    profileLinkingAllowed: false,
  };
}
