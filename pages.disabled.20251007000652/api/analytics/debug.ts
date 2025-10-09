import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const g = globalThis as any;
  const q = (g.__ANALYTICS__ as any[]) || [];
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(JSON.stringify({ ok:true, count: q.length, last: q.slice(-10) }));
}
