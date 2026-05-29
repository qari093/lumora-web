export function createSparkEcho() {
  return {
    id: "echo_001",
    parentSparkId: "spark_001"
  };
}

export {
  runSparkRuntime,
  validateLumaSpark
} from "@/core/lumaspace/compat/legacyContracts";
