export function injectWitnessedAnchor(dashboard: any, input: {
  lastWitnessedAt?: string;
}) {
  return {
    ...dashboard,
    witnessedAnchor: {
      visible: true,
      text: "You were witnessed",
      lastWitnessedAt: input.lastWitnessedAt || null,
      interpretationText: false,
    },
  };
}
