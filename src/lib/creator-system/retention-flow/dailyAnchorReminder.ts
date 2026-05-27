export type DailyAnchorReminder = {
  creatorId: string;
  nextCircleIso: string;
  message: string;
  softReminder: true;
};

export function buildDailyAnchorCircleReminder(input: {
  creatorId: string;
  nextCircleIso: string;
}): DailyAnchorReminder {
  return {
    creatorId: input.creatorId,
    nextCircleIso: input.nextCircleIso,
    message: "Your next circle is waiting quietly.",
    softReminder: true,
  };
}
