import { NextRequest, NextResponse } from "next/server";
import { loadStore } from "@/lib/ads/core";

export async function GET(req:NextRequest){
  const s = loadStore();
  const last = s.impressions.slice(-40).reverse();
  return NextResponse.json({ ok:true, ads: s.ads, totals: s.totals, impressions: last });
}
