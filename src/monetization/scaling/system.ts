import { evaluateMonetizationLoad } from "./loadControl";
import { shapeMonetizationTraffic } from "./trafficShaping";
import { calculateMonetizationThrottle } from "./throttle";
import { resolveMonetizationFailSafe } from "./failSafe";

export function validateMonetizationScaling(input: {
  requestsPerMinute: number;
  maxRequestsPerMinute: number;
  queueDepth: number;
  maxQueueDepth: number;
  errorRate: number;
  userState: "green" | "yellow" | "red";
  complianceOk: boolean;
  revenueControlOk: boolean;
}) {
  const load = evaluateMonetizationLoad(input);
  const traffic = shapeMonetizationTraffic({
    mode: load.mode,
    userState: input.userState,
  });
  const throttle = calculateMonetizationThrottle({
    overloaded: load.overloaded,
    errorRate: input.errorRate,
  });
  const failSafe = resolveMonetizationFailSafe({
    throttlePercent: throttle.throttlePercent,
    complianceOk: input.complianceOk,
    revenueControlOk: input.revenueControlOk,
  });

  return {
    ok: true,
    load,
    traffic,
    throttle,
    failSafe,
  };
}
