export function buildPreCircleIndicator(input: {
  assigned: boolean;
  circleId?: string;
  launchTimeIso?: string;
}) {
  return {
    visible: input.assigned,
    circleId: input.circleId || null,
    launchTimeIso: input.launchTimeIso || null,
    label: input.assigned ? "Queued for next circle" : "",
  };
}
