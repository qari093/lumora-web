import { NextResponse } from "next/server";
import { calculateTQ } from "@/src/core/tq-production/calculate";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ ok: false, error: "INVALID_TQ_REQUEST" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    score: calculateTQ({
      pledgeFulfillment: Number(body.pledgeFulfillment ?? 0),
      retention: Number(body.retention ?? 0),
      collaborationReliability: Number(body.collaborationReliability ?? 0),
      moderationHealth: Number(body.moderationHealth ?? 0),
      consistency: Number(body.consistency ?? 0),
    }),
  });
}
