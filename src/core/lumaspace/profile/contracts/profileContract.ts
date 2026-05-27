import type {
  HeroSpark,
  TimelineWave,
  ProfileRuntime
} from "../types";

export function validateHeroSpark(
  spark: HeroSpark
): boolean {
  return Boolean(
    spark.id &&
    spark.aura
  );
}

export function validateTimelineWave(
  wave: TimelineWave
): boolean {
  return Boolean(
    wave.id &&
    wave.depth > 0
  );
}

export function validateProfileRuntime(
  runtime: ProfileRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.profileId
  );
}
