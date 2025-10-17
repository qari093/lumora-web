import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

const CPV_CENTS = 2; // cost per view

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "application/json");

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const { adId } = req.body || {};
    if (!adId) return res.status(400).json({ ok: false, error: "Missing adId" });

    // get or create wallet
    let wallet = await prisma.wallet.findFirst();
    if (!wallet) {
      wallet = await prisma.wallet.create({ data: { balanceCents: 0 } });
    }

    if (wallet.balanceCents < CPV_CENTS) {
      return res.status(400).json({ ok: false, error: "Insufficient balance" });
    }

    const newBalance = wallet.balanceCents - CPV_CENTS;
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balanceCents: newBalance },
    });

    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: "spend",
        amountCents: CPV_CENTS,
        description: `CPV view for ${adId}`,
      },
    });

    return res.status(200).json({
      ok: true,
      views: 1,
      chargedCents: CPV_CENTS,
      balanceCents: newBalance,
    });
  } catch (err: any) {
    console.error("❌ view error:", err);
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}
