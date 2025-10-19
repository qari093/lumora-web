import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body||"{}") : (req.body || {});
      const name = String(body.name || "").trim();
      const dailyBudget = Number(body.daily_budget || 0);
      const targetingRadiusMiles = Number(body.targeting_radius_miles || 0);
      if (!name || !Number.isFinite(dailyBudget) || dailyBudget <= 0 || !Number.isInteger(targetingRadiusMiles) || targetingRadiusMiles <= 0) {
        return res.status(400).json({ ok:false, error:"Invalid payload" });
      }
      const campaign = await prisma.campaign.create({
        data: {
          name,
          dailyBudgetCents: Math.round(dailyBudget * 100),
          targetingRadiusMiles,
        },
      });
      return res.status(200).json({ ok:true, id: campaign.id });
    }

    if (req.method === "GET") {
      const items = await prisma.campaign.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { ads: true },
      });
      return res.status(200).json({ ok:true, items });
    }

    return res.status(405).json({ ok:false, error:"Method not allowed" });
  } catch (e:any) {
    console.error("[api/campaigns] error:", e);
    return res.status(500).json({ ok:false, error:"Server error" });
  }
}
