import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const { id, action, reason } = req.body as { id?: string; action?: "approve" | "reject"; reason?: string };
    if (!id || !action) return res.status(400).json({ error: "Missing id/action" });

    const status = action === "approve" ? "APPROVED" : "REJECTED";
    const item = await prisma.moderationItem.update({
      where: { id },
      data: {
        status: status as any,
        reviewedAt: new Date(),
        reviewer: "admin@mvp",
        reason: reason || null,
      },
    });
    res.status(200).json({ ok: true, item });
  } catch (e:any) {
    console.error(e);
    res.status(500).json({ error: e.message || "internal_error" });
  }
}
