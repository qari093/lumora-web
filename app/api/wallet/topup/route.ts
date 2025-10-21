import { NextResponse } from "next/server";
import { topup, CURRENCY } from "../../../../src/lib/billing";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ownerId = String(body?.ownerId || "");
    const cents = Number(body?.cents ?? 0);
    const currency = String(body?.currency || CURRENCY);
    if (!ownerId || !Number.isFinite(cents)) {
      return NextResponse.json({ ok: false, error: "ownerId and cents required" }, { status: 400 });
    }
    const balanceCents = await topup(ownerId, cents, "manual-topup", currency);
    return NextResponse.json({ ok: true, ownerId, currency, balanceCents }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
