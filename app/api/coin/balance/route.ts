import { requireUserSession, userPrivateNoStoreHeaders } from "@/src/lib/auth/requireUserSession";
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
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (userId && userId !== auth.identity.userId) {
      return NextResponse.json(
        { ok: false, error: "forbidden_user_scope" },
        { status: 403, headers: userPrivateNoStoreHeaders() },
      );
    }
    const scopedUserId = auth.identity.userId;
    if (!userId) {
      return NextResponse.json({ ok: false, error: "userId required" }, { status: 400 });
    }
    const acct = await getOrCreate(scopedUserId);
    return NextResponse.json({ ok: true, userId: scopedUserId, balance: acct.balance }, { headers: userPrivateNoStoreHeaders() });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "unknown" }, { status: 500 });
  }
}