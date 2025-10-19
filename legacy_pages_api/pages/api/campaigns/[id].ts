import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  try{
    if(req.method!=="GET") return res.status(405).json({ok:false,error:"Method not allowed"});
    const id = String(req.query.id||"");
    const campaign = await prisma.campaign.findUnique({
      where:{ id },
      include:{ ads:true },
    });
    if(!campaign) return res.status(404).json({ok:false,error:"Not found"});
    return res.status(200).json({ ok:true, campaign });
  }catch(e:any){
    console.error("[api/campaigns/[id]]", e);
    return res.status(500).json({ok:false,error:"Server error"});
  }
}
