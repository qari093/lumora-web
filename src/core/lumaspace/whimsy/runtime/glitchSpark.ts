import type {
  GlitchSparkPlan
} from "../types";

export function createGlitchSparkPlan(
  sparkId: string,
  seed = 1
): GlitchSparkPlan {
  if (!sparkId || seed < 1) {
    throw new Error("invalid_glitch_spark_plan");
  }

  return {
    sparkId,
    variant: `glitch_variant_${seed}`,
    repeatable: false
  };
}
