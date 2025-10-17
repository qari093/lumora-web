// pages/api/wallet/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

type ApiResp =
  | {
      ok: true;
      balance: number;           // euros
      balanceCents: number;      // cents
      currency: string;
      tx: {
        id: string;
        type: "topup" | "spend" | "refund";
        amount: number;          // euros (back-compat with your old API)
        amountCents: number;     // cents
        desc?: string;
        created_at: string;      // ISO
      }[];
    }
  | { ok: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResp>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // No caching for dynamic wallet state
  res.setHeader("Cache-Control", "no-store");

  try {
    // 1) Ensure a wallet exists (single-wallet demo)
    let w = await prisma.wallet.findFirst();
    if (!w) {
      w = await prisma.wallet.create({
        data: { balanceCents: 0, currency: "EUR" },
      });
    }

    // 2) Recent transactions (default 20, overridable: ?limit=50)
    const limit = Math.max(
      1,
      Math.min(100, Number(req.query.limit ?? 20) || 20)
    );

    const tx = await prisma.transaction.findMany({
      where: { walletId: w.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        type: true,              // "topup" | "spend" | "refund"
        amountCents: true,
        description: true,
        createdAt: true,
      },
    });

    // 3) Shape response (keep your old field names for compatibility)
    return res.status(200).json({
      ok: true,
      balance: (w.balanceCents ?? 0) / 100,
      balanceCents: w.balanceCents ?? 0,
      currency: w.currency ?? "EUR",
      tx: tx.map((t) => ({
        id: t.id,
        type: t.type as "topup" | "spend" | "refund",
        amount: (t.amountCents ?? 0) / 100,          // euros (back-compat)
        amountCents: t.amountCents ?? 0,             // cents (precise)
        desc: t.description ?? undefined,
        created_at: t.createdAt.toISOString(),
      })),
    });
  } catch (err: any) {
    console.error("GET /api/wallet error:", err);
    return res
      .status(500)
      .json({ ok: false, error: err?.message ?? "unknown_error" });
  }
}