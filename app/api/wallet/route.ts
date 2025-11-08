import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // relative import (no alias)

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "";
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Missing userId" }, { status: 400 });
    }

    // Ensure the account exists
    const account = await prisma.account.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId }, // default balance = 0 from schema
    });

    // Recent transactions
    const transactions = await prisma.creditTransaction.findMany({
      where: { accountId: userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json(
      { ok: true, userId, credits: account.balance, transactions },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[wallet-api]", err);
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
