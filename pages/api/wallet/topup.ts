import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST")
    return res.status(405).json({ ok: false, error: "Method not allowed" });

  try {
    const { amount } = req.body || {};
    if (!amount || typeof amount !== "number" || amount <= 0)
      return res.status(400).json({ ok: false, error: "Invalid amount" });

    let wallet = await prisma.wallet.findFirst();
    if (!wallet) {
      wallet = await prisma.wallet.create({ data: { balanceCents: 0 } });
    }

    const cents = Math.round(amount * 100);
    const newBalance = wallet.balanceCents + cents;

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balanceCents: newBalance },
    });

    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: "topup",
        amountCents: cents,
        description: "Test top-up",
      },
    });

    return res.status(200).json({
      ok: true,
      balanceCents: newBalance,
      balance: newBalance / 100,
    });
  } catch (err: any) {
    console.error("❌ topup error:", err);
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}
