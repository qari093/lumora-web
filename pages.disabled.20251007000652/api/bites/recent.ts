import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type LogItem = any;

function loadLog(file: string): LogItem[] {
  try {
    if (!fs.existsSync(file)) return [];
    const raw = fs.readFileSync(file, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3010");
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const nParam = Array.isArray(req.query.n) ? req.query.n[0] : req.query.n;
    const n = Math.max(1, Math.min(50, parseInt(String(nParam ?? "10"), 10) || 10));

    const file = path.join(process.cwd(), "db", "bites-log.json");
    const items = loadLog(file).slice(0, n);

    return res.status(200).json({ ok: true, items });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "unknown" });
  }
}
