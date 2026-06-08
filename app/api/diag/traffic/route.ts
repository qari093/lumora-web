import { productionDebugGate } from "@/src/lib/runtime-guards/productionDebugGate";
import { NextRequest, NextResponse } from "next/server";
import { dumpStats } from "@/src/lib/trust/engine";
import { reqId } from "@/src/lib/reqid";

export async function GET(_req: NextRequest) {
  const blocked = productionDebugGate();
  if (blocked) return blocked;
  const id = reqId();
  const stats = dumpStats();
  return NextResponse.json({ ok:true, stats, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
