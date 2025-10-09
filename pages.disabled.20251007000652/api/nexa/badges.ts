import type { NextApiRequest, NextApiResponse } from "next";
import { getBadges } from "../../lib/nexaStore";
export default function handler(req:NextApiRequest, res:NextApiResponse){
  const device = (req.headers["x-device-id"] as string) || "dev1";
  return res.status(200).json({ ok:true, badges:getBadges(device) });
}
