import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  try{
    if(req.method==="GET"){
      const b = await prisma.business.findFirst();
      return res.status(200).json({ ok:true, business: b||null });
    }
    if(req.method==="POST"){
      const body = typeof req.body==="string" ? JSON.parse(req.body||"{}") : (req.body||{});
      const { name, phone, whatsapp, addressText } = body;
      if(!name || String(name).trim().length<2) return res.status(400).json({ ok:false, error:"Name required" });
      const first = await prisma.business.findFirst();
      const saved = first
        ? await prisma.business.update({ where:{ id:first.id }, data:{ name, phone, whatsapp, addressText } })
        : await prisma.business.create({ data:{ name, phone, whatsapp, addressText } });
      return res.status(200).json({ ok:true, business: saved });
    }
    return res.status(405).json({ ok:false, error:"Method not allowed" });
  }catch(e:any){
    console.error("[api/business] error:", e);
    return res.status(500).json({ ok:false, error:"Server error" });
  }
}
