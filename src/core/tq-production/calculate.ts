export function calculateTQ(input: {
  pledgeFulfillment: number;
  retention: number;
  collaborationReliability: number;
  moderationHealth: number;
  consistency: number;
}) {
  const weighted =
    input.pledgeFulfillment * 0.25 +
    input.retention * 0.2 +
    input.collaborationReliability * 0.2 +
    input.moderationHealth * 0.2 +
    input.consistency * 0.15;

  return Math.max(0, Math.min(100, Math.round(weighted)));
}
