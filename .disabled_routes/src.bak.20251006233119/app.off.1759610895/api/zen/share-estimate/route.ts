export const runtime = "nodejs";
import { NextRequest } from "next/server";

const CPM_EUR: Record<string, number> = { videos_infeed: 2.0, rewarded_wallet: 4.0, game_overlay: 3.0 };
const REV_SHARE: Record<string, number> = { videos_infeed: 0.4, rewarded_wallet: 0.5, game_overlay: 0.45 };
const EUR_PER_ZEN = 0.01;

export async function GET(req: NextRequest){
  try{
    const url = new URL(req.url);
    const placement = url.searchParams.get("placement") || "videos_infeed";
    const views = Number(url.searchParams.get("views") || 1);
    const cpm = CPM_EUR[placement] ?? 2.0;
    const share = REV_SHARE[placement] ?? 0.4;
    const gross = (views/1000) * cpm;
    const userShare = gross * share;
    const zenEstimate = Math.floor(userShare / EUR_PER_ZEN);
    return Response.json({ ok:true, placement, views, cpm_eur:cpm, rev_share:share, eur_per_zen:EUR_PER_ZEN, user_share_eur:Number(userShare.toFixed(4)), estimate_zen: zenEstimate });
  }catch(e:any){
    return Response.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
