import type {
  LensFrame,
  TwinSpark,
  LumaLensRuntime
} from "../types";

export function validateLensFrame(
  frame: LensFrame
): boolean {
  return Boolean(
    frame.id &&
    frame.aura
  );
}

export function validateTwinSpark(
  spark: TwinSpark
): boolean {
  return Boolean(
    spark.id &&
    typeof spark.linked === "boolean"
  );
}

export function validateLumaLensRuntime(
  runtime: LumaLensRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.lensId
  );
}

export {
  createLensFrame,
  runLumaLensRuntime,
  validateRawLens
} from "@/core/lumaspace/compat/legacyContracts";
