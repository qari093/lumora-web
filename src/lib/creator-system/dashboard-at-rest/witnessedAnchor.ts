export type WitnessedAnchor = {
  visible: true;
  text: "You were witnessed";
  lastWitnessedAt?: string;
  interpretationText: false;
};

export function buildWitnessedAnchor(lastWitnessedAt?: string): WitnessedAnchor {
  return {
    visible: true,
    text: "You were witnessed",
    lastWitnessedAt,
    interpretationText: false,
  };
}
