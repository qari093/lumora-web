export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { addTx, checkEligibility, stampReward, getLedger } from "../../../../lib/zenStore";

const COOLDOWN_SEC = 30;
const DAILY_CAP = 5;
const DEFAULT_REWARD = 1;

export async function POST(req: NextRequest){
  try{
    const device = req.headers.get("x-device-id") || "dev1";
    const body = await req.json().catch(()=>({}));
    const placement = String(body?.placement || "rewarded_wallet");
    const now = Date.now();

    const elig = checkEligibility(device, placement, now, COOLDOWN_SEC, DAILY_CAP);
    if(!elig.ok){
      return Response.json({ ok:false, reason:elig.reason, nextEligibleAt:elig.nextEligibleAt, remainingToday:elig.remainingToday ?? 0 }, { status: 429 });
    }

    stampReward(device, placement, now);
    const l = addTx(device, { action:"earn", amount:DEFAULT_REWARD, reason: });
    return Response.json({
      ok:true, device, placement,
      granted: DEFAULT_REWARD, balance: l.balance,
      remainingToday: (elig.remainingToday ?? DAILY_CAP) - 1,
      nextEligibleAt: now + COOLDOWN_SEC*1000
    });
  }catch(e:any){
    return Response.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}

export async function GET(req: NextRequest){
  try{
    const device = req.headers.get("x-device-id") || "dev1";
    const url = new URL(req.url);
    const placement = url.searchParams.get("placement") || "rewarded_wallet";
    const now = Date.now();
    const elig = checkEligibility(device, placement, now, COOLDOWN_SEC, DAILY_CAP);
    const l = getLedger(device);
    return Response.json({ ok: elig.ok, reason: elig.reason, nextEligibleAt: elig.nextEligibleAt, remainingToday: elig.remainingToday, balance:l.balance, device, placement, cooldownSec: COOLDOWN_SEC, dailyCap: DAILY_CAP });
  }catch(e:any){
    return Response.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
