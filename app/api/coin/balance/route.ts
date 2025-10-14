// app/api/coin/balance/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const runtime = "nodejs";

async function getOrCreate(userId: string) {
  return prisma.coinAccount.upsert({
    where: { userId },
    update: {},
    create: { userId, balance: 0 },
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ ok: false, error: "userId required" }, { status: 400 });
    }
    const acct = await getOrCreate(userId);
    return NextResponse.json({ ok: true, userId, balance: acct.balance });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "unknown" }, { status: 500 });
  }
}