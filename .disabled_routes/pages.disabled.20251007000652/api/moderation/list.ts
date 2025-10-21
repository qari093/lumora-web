import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const status = (req.query.status as string | undefined)?.toUpperCase() as
      | "PENDING" | "APPROVED" | "REJECTED" | undefined;
    const where = status ? { status } : {};
    const items = await prisma.moderationItem.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      take: 200,
    });
    res.status(200).json({ items });
  } catch (e:any) {
    console.error(e);
    res.status(500).json({ error: e.message || "internal_error" });
  }
}
