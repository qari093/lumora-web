import type {
  ShorelineSpark,
  GravityWell,
  ShorelineRuntime
} from "../types";

export function validateShorelineSpark(
  spark: ShorelineSpark
): boolean {
  return Boolean(
    spark.id &&
    spark.emotion
  );
}

export function validateGravityWell(
  well: GravityWell
): boolean {
  return Boolean(
    well.id &&
    well.pull > 0
  );
}

export function validateShorelineRuntime(
  runtime: ShorelineRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.feedId
  );
}
