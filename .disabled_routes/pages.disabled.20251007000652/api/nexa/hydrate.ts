import type { NextApiRequest, NextApiResponse } from "next";
import { addWater } from "../../lib/nexaStore";
export default function handler(req:NextApiRequest, res:NextApiResponse){
  if(req.method!=="POST") return res.status(405).end();
  const device = (req.headers["x-device-id"] as string) || "dev1";
  const ml = Number(req.body?.ml||0);
  return res.status(200).json(addWater(device, ml));
}
