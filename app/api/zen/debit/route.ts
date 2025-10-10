import { NextRequest, NextResponse } from "next/server";
import { debit } from "@/lib/econ/zen";
export async function POST(req:NextRequest){
  const body = await req.json().catch(()=>({}));
  return NextResponse.json(await debit(Number(body?.amount ?? 0)));
}
