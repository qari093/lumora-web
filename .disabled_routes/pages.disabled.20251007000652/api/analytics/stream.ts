import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

type Ev = {
  type: string;
  ts?: string | number;
  userId?: string;
  roomId?: string;
  path?: string;
  meta?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

    const body = req.body;
    const list: Ev[] = Array.isArray(body) ? body : [body];

    // naive cap to avoid abuse
    if (list.length > 1000) return res.status(413).json({ error: "too_many_events" });

    const rows = list
      .filter(e => e && typeof e.type === "string" && e.type.length <= 64)
      .map((e) => ({
        type: e.type,
        ts: e.ts ? new Date(e.ts) : new Date(),
        userId: e.userId ?? null,
        roomId: e.roomId ?? null,
        path: e.path ?? null,
        meta: e.meta ?? null,
      }));

    if (!rows.length) return res.status(400).json({ error: "no_valid_events" });

    await prisma.analyticsEvent.createMany({ data: rows, skipDuplicates: true });
    return res.status(200).json({ ok: true, inserted: rows.length });
  } catch (e:any) {
    console.error(e);
    return res.status(500).json({ error: "internal_error" });
  }
}
