export function runSparkRuntime() {
  return {
    active: true,
    sparkId: "spark_001"
  };
}

export {
  createSparkEcho,
  validateLumaSpark
} from "@/core/lumaspace/compat/legacyContracts";
