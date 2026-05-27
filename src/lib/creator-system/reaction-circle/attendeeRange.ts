export const MIN_ANCHOR_CIRCLE_ATTENDEES = 3;
export const MAX_ANCHOR_CIRCLE_ATTENDEES = 12;

export type AttendeeRangeDecision = {
  ok: boolean;
  count: number;
  reason: "accepted" | "too_few_attendees" | "too_many_attendees";
};

export function validateAnchorCircleAttendeeRange(attendeeIds: string[]): AttendeeRangeDecision {
  const uniqueCount = new Set(attendeeIds).size;

  if (uniqueCount < MIN_ANCHOR_CIRCLE_ATTENDEES) {
    return { ok: false, count: uniqueCount, reason: "too_few_attendees" };
  }

  if (uniqueCount > MAX_ANCHOR_CIRCLE_ATTENDEES) {
    return { ok: false, count: uniqueCount, reason: "too_many_attendees" };
  }

  return { ok: true, count: uniqueCount, reason: "accepted" };
}

export function addAnchorCircleAttendee(attendeeIds: string[], userId: string): string[] {
  const next = Array.from(new Set([...attendeeIds, userId]));
  return next.slice(0, MAX_ANCHOR_CIRCLE_ATTENDEES);
}
