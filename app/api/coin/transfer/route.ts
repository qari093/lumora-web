import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { from, to, amount, memo } = await req.json();
    if (!to || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
    }

    // Find or create recipient
    const toAcc = await prisma.coinAccount.upsert({
      where: { userId: to },
      update: {},
      create: { userId: to, balance: 0 },
    });

    // Mint if from = system, otherwise normal transfer
    if (from === "system") {
      const txRow = await prisma.coinTx.create({
        data: { fromId: null, toId: toAcc.id, amount, memo },
      });
      await prisma.coinAccount.update({
        where: { id: toAcc.id },
        data: { balance: { increment: amount } },
      });
      return NextResponse.json({
        ok: true,
        tx: {
          id: txRow.id,
          ts: new Date(txRow.createdAt).getTime(),
          from,
          to,
          amount,
          memo: memo ?? null,
        },
      });
    }

    // For normal transfers
    const fromAcc = await prisma.coinAccount.upsert({
      where: { userId: from },
      update: {},
      create: { userId: from, balance: 0 },
    });

    if (fromAcc.balance < amount) {
      return NextResponse.json({ ok: false, error: "insufficient balance" }, { status: 400 });
    }

    const txRow = await prisma.coinTx.create({
      data: { fromId: fromAcc.id, toId: toAcc.id, amount, memo },
    });

    await prisma.$transaction([
      prisma.coinAccount.update({
        where: { id: fromAcc.id },
        data: { balance: { decrement: amount } },
      }),
      prisma.coinAccount.update({
        where: { id: toAcc.id },
        data: { balance: { increment: amount } },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      tx: {
        id: txRow.id,
        ts: new Date(txRow.createdAt).getTime(),
        from,
        to,
        amount,
        memo: memo ?? null,
      },
    });
  } catch (err: any) {
    console.error("transfer error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
