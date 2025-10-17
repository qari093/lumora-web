import { NextRequest, NextResponse } from "next/server";
import { deviceFromHeaders, loadStore, requestAd, saveStore } from "@/lib/ads/core";

export async function GET(req:NextRequest){
  const { searchParams } = new URL(req.url);
  const placement = searchParams.get("placement") || "videos_infeed";
  const lang = searchParams.get("lang") || "en";
  const device = deviceFromHeaders(req.headers);
  const s = loadStore();
  const r = requestAd(s, placement, lang, device);
  saveStore(s);
  if(!r.ad){
    return NextResponse.json({ ok:false, error: "no_fill" }, { status:404 });
  }
  // return ad + impressionId + variant for debugging
  return NextResponse.json({ ok:true, ad: r.ad, impressionId: r.impression!.id, variant: r.impression!.variant });
}
