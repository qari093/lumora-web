export function injectWitnessAwareLayer(card: any, witness: any) {
  return {
    ...card,
    witnessLayer: {
      enabled: true,
      witnessName: witness?.witnessName || "Witness",
      anonymous: true,
    },
  };
}
