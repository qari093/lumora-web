import type { NextApiRequest, NextApiResponse } from "next";

type Click = { adId:string; campaignId?:string; ts:number; ua?:string; ip?:string };
type ClickStore = { byAd: Record<string, number>; total:number; recent: Click[] };

const g = globalThis as any;
g.__adClicks = g.__adClicks || { byAd:{}, total:0, recent:[] } as ClickStore;

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method !== "POST") return res.status(405).json({ ok:false, error:"Method not allowed" });
  try{
    const body = typeof req.body==="string" ? JSON.parse(req.body||"{}") : (req.body||{});
    const adId = String(body.adId||"").trim();
    const campaignId = body.campaignId ? String(body.campaignId) : undefined;
    if(!adId) return res.status(400).json({ ok:false, error:"Missing adId" });

    const info:Click = {
      adId, campaignId, ts: Date.now(),
      ua: req.headers["user-agent"] as string|undefined,
      ip: (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || undefined,
    };

    const c: ClickStore = g.__adClicks;
    c.byAd[adId] = (c.byAd[adId]||0) + 1;
    c.total += 1;
    c.recent.push(info);
    if (c.recent.length > 200) c.recent.splice(0, c.recent.length - 200);

    return res.status(200).json({ ok:true, clicks:c.byAd[adId], total:c.total });
  }catch(e:any){
    console.error("[ad:click] error", e);
    return res.status(500).json({ ok:false, error:"Server error" });
  }
}
