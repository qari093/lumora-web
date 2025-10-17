import type { NextApiRequest, NextApiResponse } from "next";
import { summary } from "../../../lib/nexaStore";
export default function handler(req:NextApiRequest, res:NextApiResponse){
  if(req.method!=="GET") return res.status(405).end();
  const device = (req.headers["x-device-id"] as string) || "dev1";
  return res.status(200).json({ ok:true, ...summary(device) });
}
