import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS (dev)
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3010");
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });

  const { type, userId, props } = (req.body as any) || {};
  if (!type || !userId)
    return res.status(400).json({ ok: false, error: "Missing type/userId" });

  return res
    .status(200)
    .json({ ok: true, echoed: { type, userId, props: props ?? {} } });
}
