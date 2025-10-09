import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "./[...nextauth]";
import { getById, put } from "../../../lib/userStore";
import { randomBytes, createHash } from "lib/server/crypto";

function hash(x:string){ return createHash("sha256").update(x).digest("hex"); }

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const session = await requireAuth(req,res); if(!session) return;
  const uid = (session as any).uid as string;
  const user = getById(uid)!;

  if(req.method==="POST"){
    // Generate 10 backup codes (display plain once, store hashes)
    const codes = Array.from({length:10},()=>randomBytes(5).toString("base64url"));
    user.backupCodesHash = codes.map(hash);
    put(user);
    return res.json({ ok:true, codes });
  }

  if(req.method==="PUT"){
    // Consume one code
    const { code } = req.body||{};
    const h = hash(String(code||""));
    const idx = user.backupCodesHash?.findIndex(x=>x===h) ?? -1;
    if(idx<0) return res.status(400).json({ ok:false, error:"invalid_code" });
    user.backupCodesHash!.splice(idx,1);
    put(user);
    return res.json({ ok:true, remaining: user.backupCodesHash?.length||0 });
  }

  res.status(405).end();
}
