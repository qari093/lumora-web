import { NextResponse } from "next/server";
import { productionDebugGate } from "@/src/lib/runtime-guards/productionDebugGate";

function devOnlyResponse() {
  const blocked = productionDebugGate();
  if (blocked) return blocked;

  return NextResponse.json({
    ok: true,
    devOnly: true,
    message: "Development-only endpoint."
  });
}

export async function GET() {
  return devOnlyResponse();
}

export async function POST() {
  return devOnlyResponse();
}
