import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if (req.method !== "POST") return res.status(405).json({ error:"method_not_allowed" });
  const input = req.body?.input ?? { kind:"demo", prompt:"Hello Lumora" };
  const job = await prisma.renderJob.create({ data:{ input, status:"QUEUED", progress:0 }});
  // Nudge server to ensure IO/worker alive
  await fetch(new URL("/api/lumalink", `${req.headers["x-forwarded-proto"]||"http"}://${req.headers.host}`)).catch(()=>{});
  return res.status(200).json({ ok:true, id: job.id });
}
