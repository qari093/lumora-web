export type RuntimeHeartbeat = {
  state: "online" | "degraded";
  tickRate: number;
  memoryPressure: "safe" | "high";
};

export function createRuntimeHeartbeat(input: {
  tickRate: number;
  memoryPressure: number;
}): RuntimeHeartbeat {
  return {
    state: input.tickRate >= 30
      ? "online"
      : "degraded",
    tickRate: input.tickRate,
    memoryPressure:
      input.memoryPressure < 70
        ? "safe"
        : "high"
  };
}
