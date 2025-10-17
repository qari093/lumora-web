import type { NextApiRequest, NextApiResponse } from "next";
import { getProfile, grantXP } from "../../lib/nexaStore";
export default function handler(req:NextApiRequest, res:NextApiResponse){
  if(req.method!=="POST") return res.status(405).end();
  const device = (req.headers["x-device-id"] as string) || "dev1";
  const p = getProfile(device);
  const delta = Number(req.body?.delta||0);
  const reason = String(req.body?.reason||"manual");
  if(delta>0) grantXP(p, delta, reason);
  return res.status(200).json({ ok:true, xp:p.xp, level:p.level });
}
