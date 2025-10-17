import { NextRequest, NextResponse } from "next/server";
import { applyTreasurySplit } from "@/lib/econ/harmony";
export async function POST(req:NextRequest){
  const body = await req.json().catch(()=>({}));
  return NextResponse.json(await applyTreasurySplit(Number(body?.amount ?? 0)));
}
