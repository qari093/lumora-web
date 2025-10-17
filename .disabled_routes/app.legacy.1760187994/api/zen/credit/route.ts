import { NextRequest, NextResponse } from "next/server";
import { credit } from "@/lib/econ/zen";
export async function POST(req:NextRequest){
  const body = await req.json().catch(()=>({}));
  return NextResponse.json(await credit(Number(body?.amount ?? 0)));
}
