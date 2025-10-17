import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../lib/prisma";

async function getOrCreateWallet() {
  let w = await prisma.wallet.findFirst();
  if (!w) w = await prisma.wallet.create({ data: { balanceCents: 0, currency: "EUR" }});
  return w;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  try{
    if(req.method!=="GET") return res.status(405).json({ok:false,error:"Method not allowed"});
    const w = await getOrCreateWallet();
    const tx = await prisma.transaction.findMany({ where:{ walletId:w.id }, orderBy:{ createdAt:"desc" }, take:20 });
    return res.status(200).json({
      ok:true,
      balance: (w.balanceCents/100),
      balanceCents: w.balanceCents,
      currency: w.currency,
      tx
    });
  }catch(e:any){
    console.error("[api/wallet] error:", e);
    return res.status(500).json({ ok:false, error:"Server error" });
  }
}
