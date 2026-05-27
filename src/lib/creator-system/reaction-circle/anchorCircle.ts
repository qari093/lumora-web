export type AnchorCircleStatus =
  | "scheduled"
  | "forming"
  | "active"
  | "completed"
  | "dissolved";

export type AnchorCircle = {
  circleId: string;
  dateKey: string;
  launchTimeIso: string;
  durationMinutes: 12;
  status: AnchorCircleStatus;
  attendeeIds: string[];
  assignedUploadIds: string[];
};

export function createDailyAnchorCircle(input: {
  dateKey: string;
  launchTimeIso: string;
  circleId?: string;
}): AnchorCircle {
  return {
    circleId: input.circleId || `anchor-${input.dateKey}`,
    dateKey: input.dateKey,
    launchTimeIso: input.launchTimeIso,
    durationMinutes: 12,
    status: "scheduled",
    attendeeIds: [],
    assignedUploadIds: [],
  };
}
