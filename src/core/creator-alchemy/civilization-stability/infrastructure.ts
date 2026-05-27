import type { InfrastructureSignal } from "./types";

export function evaluateInfrastructureSafety(signal: InfrastructureSignal): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (signal.batchJobLoad > 0.85) reasons.push("batch_job_load_high");
  if (signal.cacheHitRatio < 0.5) reasons.push("cache_hit_ratio_low");
  if (signal.queueDepth > 100) reasons.push("queue_depth_high");
  if (signal.liveRoomLoad > 0.9) reasons.push("live_room_load_high");
  if (signal.runtimeCostPressure > 0.8) reasons.push("runtime_cost_pressure_high");

  return {
    ok: reasons.length === 0,
    reasons
  };
}

export function shouldThrottleRuntime(signal: InfrastructureSignal): boolean {
  return signal.runtimeCostPressure > 0.8 || signal.queueDepth > 100 || signal.batchJobLoad > 0.85;
}
