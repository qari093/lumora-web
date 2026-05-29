import type {
  Spark,
  SparkEcho,
  SparkRuntime
} from "../types";

export function validateSpark(
  spark: Spark
): boolean {
  return Boolean(
    spark.id &&
    spark.emotion &&
    spark.duration > 0
  );
}

export function validateSparkEcho(
  echo: SparkEcho
): boolean {
  return Boolean(
    echo.id &&
    echo.parentSparkId
  );
}

export function validateSparkRuntime(
  runtime: SparkRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.sparkId
  );
}

export {
  createSparkEcho,
  runSparkRuntime,
  validateLumaSpark
} from "@/core/lumaspace/compat/legacyContracts";
