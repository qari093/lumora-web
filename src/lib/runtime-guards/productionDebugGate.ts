import { NextResponse } from "next/server";

const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);

export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
}

export function isDebugRouteAllowed(): boolean {
  return TRUE_VALUES.has(String(process.env.LUMORA_ALLOW_PROD_DEBUG_ROUTES || "").toLowerCase());
}

export function productionDebugGate() {
  if (isProductionRuntime() && !isDebugRouteAllowed()) {
    return NextResponse.json(
      {
        ok: false,
        error: "not_found",
        reason: "debug_route_disabled_in_production"
      },
      { status: 404 }
    );
  }

  return null;
}
