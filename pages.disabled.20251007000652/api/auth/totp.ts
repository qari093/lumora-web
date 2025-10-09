import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "./[...nextauth]";
import { totpGenerateSecret, totpKeyUri, totpVerify } from "../../../lib/security";
import { getById, put } from "../../../lib/userStore";
import { createHash } from "lib/server/crypto";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const session = await requireAuth(req,res); if(!session) return;
  const uid = (session as any).uid as string;
  const user = getById(uid)!;

  if(req.method==="GET"){
    // Provision
    const secret = totpGenerateSecret();
    const uri = totpKeyUri(user.email, secret, "Lumora");
    // For demo we stash it transiently on user until verified
    (user as any).__pendingTotp = secret; put(user);
    return res.json({ ok:true, secret, otpauth: uri });
  }

  if(req.method==="POST"){
    const { token } = req.body||{};
    const secret = (user as any).__pendingTotp || user.twoFASecret;
    if(!secret) return res.status(400).json({ ok:false, error:"no_secret" });
    const ok = totpVerify(String(token||""), secret);
    if(!ok) return res.status(400).json({ ok:false, error:"bad_token" });
    user.twoFASecret = secret; delete (user as any).__pendingTotp; put(user);
    return res.json({ ok:true, enabled:true });
  }

  if(req.method==="DELETE"){
    user.twoFASecret = undefined; put(user);
    return res.json({ ok:true, enabled:false });
  }

  res.status(405).end();
}
