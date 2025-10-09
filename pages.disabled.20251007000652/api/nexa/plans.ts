import type { NextApiRequest, NextApiResponse } from "next";
import { listPlans } from "../../../lib/nexaStore";
export default function handler(_req:NextApiRequest, res:NextApiResponse){
  res.status(200).json({ ok:true, plans:listPlans() });
}
