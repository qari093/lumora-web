import type {
  LumaSpark,
  SparkRenderPlan
} from "../types";

import {
  validateLumaSpark
} from "../contracts/sparkContract";

export function createSparkRenderPlan(
  spark: LumaSpark,
  lowPower = false
): SparkRenderPlan {
  if (!validateLumaSpark(spark)) {
    throw new Error("invalid_luma_spark");
  }

  return {
    sparkId: spark.id,
    playable: true,
    loop: true,
    mode: lowPower ? "poetic" : "cinematic"
  };
}
