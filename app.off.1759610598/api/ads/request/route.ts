import { NextRequest, NextResponse } from "next/server";
import { requestAd } from "@/lib/ads/store";

export async function GET(req: NextRequest){
  const { searchParams } = new URL(req.url);
  const placement = searchParams.get("placement") as any;
  const lang = searchParams.get("lang") || "en";
  const device = req.headers.get("x-device-id") || "dev-"+req.headers.get("x-forwarded-for") || "dev-local";
  if(!placement) return NextResponse.json({ ok:false, error:"missing placement" }, { status:400 });
  const r = requestAd(placement, lang, device);
  if(!r || (r as any).reason) return NextResponse.json({ ok:true, ad:null, reason:(r as any).reason||"none" });
  return NextResponse.json({ ok:true, ...r });
}
