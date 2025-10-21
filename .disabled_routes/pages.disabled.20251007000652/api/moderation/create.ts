import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const { kind, text, objectKey, flags } = req.body as {
      kind: "TEXT" | "IMAGE";
      text?: string;
      objectKey?: string;
      flags?: any;
    };
    if (!kind) return res.status(400).json({ error: "Missing kind" });
    if (kind === "TEXT" && !text) return res.status(400).json({ error: "Missing text" });
    if (kind === "IMAGE" && !objectKey) return res.status(400).json({ error: "Missing objectKey" });

    const item = await prisma.moderationItem.create({
      data: {
        kind,
        text: text || null,
        objectKey: objectKey || null,
        flags: flags ?? null,
      },
    });
    res.status(200).json({ ok: true, item });
  } catch (e:any) {
    console.error(e);
    res.status(500).json({ error: e.message || "internal_error" });
  }
}
