import type { NextApiRequest, NextApiResponse } from "next";

type Redemption = { id:string; campaignId:string; code:string; createdAt:string };
type State = {
  byCampaign: Record<string, number>;
  items: Redemption[];
};
const g = globalThis as any;
g.__redemptions = g.__redemptions || { byCampaign:{}, items:[] } as State;

function genCode(){
  const s = Math.random().toString(36).slice(2,8).toUpperCase();
  return "RDM-" + s;
}

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const state: State = g.__redemptions;
  try{
    if(req.method==="POST"){
      const body = typeof req.body==="string" ? JSON.parse(req.body||"{}") : (req.body||{});
      const campaignId = String(body.campaignId||"").trim();
      if(!campaignId) return res.status(400).json({ ok:false, error:"campaignId required" });

      const code = genCode();
      const id = "rdm_" + Math.random().toString(36).slice(2,10);
      const item: Redemption = { id, campaignId, code, createdAt: new Date().toISOString() };
      state.items.push(item);
      state.byCampaign[campaignId] = (state.byCampaign[campaignId]||0) + 1;

      return res.status(200).json({ ok:true, code, redemptionId:id, totalForCampaign: state.byCampaign[campaignId] });
    }

    if(req.method==="GET"){
      const campaignId = String((req.query.campaignId||"")).trim();
      if(campaignId){
        const total = state.byCampaign[campaignId]||0;
        const recent = state.items.filter(x=>x.campaignId===campaignId).slice(-20).reverse();
        return res.status(200).json({ ok:true, total, recent });
      }
      // global snapshot
      return res.status(200).json({ ok:true, totals: state.byCampaign, count: state.items.length });
    }

    return res.status(405).json({ ok:false, error:"Method not allowed" });
  }catch(e:any){
    console.error("[api/redemptions] error:", e);
    return res.status(500).json({ ok:false, error:"Server error" });
  }
}
