export type Fyp94IngestionSchedule = {
  everyHours: number;
  clipsPerCycle: number;
  queriesPerCycle: number;
};

export const FYP94_DEFAULT_INGESTION_SCHEDULE: Fyp94IngestionSchedule = {
  everyHours: 4,
  clipsPerCycle: 60,
  queriesPerCycle: 6,
};

export function validateFyp94IngestionSchedule(schedule: Fyp94IngestionSchedule): boolean {
  return (
    Number.isInteger(schedule.everyHours) &&
    schedule.everyHours >= 2 &&
    schedule.everyHours <= 12 &&
    Number.isInteger(schedule.clipsPerCycle) &&
    schedule.clipsPerCycle >= 10 &&
    schedule.clipsPerCycle <= 200 &&
    Number.isInteger(schedule.queriesPerCycle) &&
    schedule.queriesPerCycle >= 1 &&
    schedule.queriesPerCycle <= 20
  );
}
