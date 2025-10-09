import type { NextApiRequest, NextApiResponse } from "next";
import { startPlan, today } from "../../../../lib/nexaStore";
export default function handler(req:NextApiRequest, res:NextApiResponse){
  if(req.method!=="POST") return res.status(405).end();
  const device = (req.headers["x-device-id"] as string) || "dev1";
  const planId = (req.body?.planId||"").toString().trim();
  if(!planId) return res.status(400).json({ ok:false, error:"planId درکار ہے" });
  try{ startPlan(device, planId); return res.status(200).json({ ok:true, ...today(device) }); }
  catch(e:any){ return res.status(400).json({ ok:false, error:String(e?.message||e) }); }
}
