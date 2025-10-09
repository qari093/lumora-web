import { NextRequest, NextResponse } from "next/server";
import { loadStore, abBreakdown } from "@/lib/ads/core";

export async function GET(req:NextRequest){
  const s = loadStore();
  const ab = abBreakdown(s);
  return NextResponse.json({ ok:true, ab });
}
