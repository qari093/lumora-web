import { NextRequest, NextResponse } from "next/server";
import { loadHarmony } from "../_loader";

function getAuth(req: NextRequest){
  const userId = req.headers.get("x-user-id") || "demo-user";
  return { userId };
}

export async function POST(req: NextRequest){
  const { spend } = await loadHarmony();
  const { userId } = getAuth(req);
  const body = await req.json().catch(()=>({}));
  const amount = Math.max(1, body?.amount ?? 1);
  const note = body?.note || "spend";
  const r = await spend(userId, amount, { note });
  return NextResponse.json(r);
}
