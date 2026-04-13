export type GpuOptimizationPlan = {
  avoidLargeBlurs: boolean;
  limitLayerCount: number;
  preferTransforms: boolean;
  useReducedSampling: boolean;
};

export function buildGpuOptimizationPlan(): GpuOptimizationPlan {
  return {
    avoidLargeBlurs: true,
    limitLayerCount: 6,
    preferTransforms: true,
    useReducedSampling: true
  };
}
