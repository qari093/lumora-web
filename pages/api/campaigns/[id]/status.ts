import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== "PATCH") return res.status(405).json({ ok:false, error:"Method not allowed" });
  try{
    const { id } = req.query as { id:string };
    const body = typeof req.body==="string" ? JSON.parse(req.body||"{}") : (req.body||{});
    const status = body.status as ("active"|"paused"|"ended");

    if(!id) return res.status(400).json({ ok:false, error:"Missing id" });
    if(!["active","paused","ended"].includes(String(status))) {
      return res.status(400).json({ ok:false, error:"Invalid status" });
    }

    const upd = await prisma.campaign.update({
      where: { id },
      data: { status },
      select: { id: true, name: true, status: true, updatedAt: true },
    });
    return res.status(200).json({ ok:true, campaign: upd });
  }catch(e:any){
    console.error("[api/campaigns/:id/status] error:", e);
    return res.status(500).json({ ok:false, error:"Server error" });
  }
}
