import { NextResponse } from "next/server";
import { getWalletHistory } from "@/lib/wallet";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = (url.searchParams.get("userId") || "").trim();
    if (!userId) return NextResponse.json({ ok: false, error: "userId_required" }, { status: 400 });

    const limitStr = url.searchParams.get("limit");
    const cursor = (url.searchParams.get("cursor") || "").trim() || null;

    const limit = limitStr ? Number(limitStr) : undefined;
    const out = await getWalletHistory({ userId, limit, cursor });
    return NextResponse.json(out, { status: 200 });
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return NextResponse.json({ ok: false, error: msg, ts: Date.now() }, { status: 500 });
  }
}
