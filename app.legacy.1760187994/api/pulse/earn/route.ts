import { NextRequest, NextResponse } from "next/server";
import { earn } from "../../../lib/econ/harmony";

async function getAuth(req:NextRequest){
  const userId = req.headers.get("x-user-id") || "demo-user";
  const days = parseInt(req.headers.get("x-days-since-signup")||"0",10);
  return { userId, days };
}

export async function POST(req:NextRequest){
  const { userId, days } = await getAuth(req);
  const body = await req.json().catch(()=>({}));
  const base = Math.max(1, Math.min(5, body?.baseAmount ?? 1));
  const note = body?.note || "watch_ad";
  const r = await earn(userId, base, { note, meta: body?.meta, daysSinceSignup: days });
  return NextResponse.json(r);
}
