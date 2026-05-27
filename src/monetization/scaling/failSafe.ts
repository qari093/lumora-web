export function resolveMonetizationFailSafe(input: {
  throttlePercent: number;
  complianceOk: boolean;
  revenueControlOk: boolean;
}) {
  if (!input.complianceOk) return { mode: "off" as const, reason: "compliance_failed" };
  if (!input.revenueControlOk) return { mode: "shadow" as const, reason: "revenue_control_failed" };
  if (input.throttlePercent >= 100) return { mode: "off" as const, reason: "throttle_full" };
  if (input.throttlePercent > 0) return { mode: "limited" as const, reason: "throttle_partial" };

  return { mode: "active" as const, reason: "stable" };
}
