export type RuntimeAttendee = {
  userId: string;
  witnessName: string;
  present: true;
};

export function syncAttendeesIntoCircle(attendees: { userId: string; witnessName: string }[]): RuntimeAttendee[] {
  return attendees.map((attendee) => ({
    userId: attendee.userId,
    witnessName: attendee.witnessName,
    present: true,
  }));
}
