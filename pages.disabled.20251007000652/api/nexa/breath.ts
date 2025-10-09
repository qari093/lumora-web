import type { NextApiRequest, NextApiResponse } from "next";
import { logBreath } from "../../lib/nexaStore";
export default function handler(req:NextApiRequest, res:NextApiResponse){
  if(req.method!=="POST") return res.status(405).end();
  const device = (req.headers["x-device-id"] as string) || "dev1";
  const type = String(req.body?.type||"box");
  const seconds = Number(req.body?.seconds||60);
  return res.status(200).json(logBreath(device, type, seconds));
}
