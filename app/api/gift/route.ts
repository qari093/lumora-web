import { NextResponse } from "next/server";
import { addGift } from "@/lib/ledgerStore";

export async function POST(req: Request) {
  const body = await req.json();
  const { roomSlug, giftType, value = 0 } = body || {};
  const ledger = addGift(String(roomSlug || "main-room"), Number(value || 0));
  console.log("Gift received:", { roomSlug, giftType, value, ledger });
  return NextResponse.json({ ok: true, gift: body, ledger });
}
