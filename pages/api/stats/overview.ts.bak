import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  try{
    const campaignId = String(req.query.campaignId||"").trim();
    if(!campaignId) return res.status(400).json({ ok:false, error:"Missing campaignId" });

    // In-memory ad metrics (set by /api/ad-server/view & /click earlier)
    const g:any = globalThis as any;
    const M = g.__adMetrics || {};
    // Support both flat totals and byCampaign nested storage
    const byCamp = (M.byCampaign && M.byCampaign[campaignId]) ? M.byCampaign[campaignId] : null;
    const views  = byCamp?.views  ?? M.views  ?? 0;
    const clicks = byCamp?.clicks ?? M.clicks ?? 0;

    // Redemptions from DB
    const redemptions = await prisma.redemption.count({ where: { campaignId } });

    const ctr = views > 0 ? +( (clicks/views)*100 ).toFixed(2) : 0;

    return res.status(200).json({ ok:true, campaignId, views, clicks, redemptions, ctr });
  }catch(e:any){
    console.error("[api/stats/overview] error:", e);
    return res.status(500).json({ ok:false, error:"Server error" });
  }
}
