import { NextResponse } from "next/server";
import { ensure, spendCredit, addCredits } from "@/app/_modules/hybrid/state";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { type, text, provider, user } = await req.json();
    const u = String(user || "demo");
    ensure(u);

    // Spend one credit; if insufficient, auto-grant a courtesy +1
    try {
      spendCredit(u);
    } catch (e: any) {
      if (/Insufficient/i.test(String(e?.message))) {
        addCredits(u, 1);
        spendCredit(u);
      } else {
        throw e;
      }
    }

    const q = encodeURIComponent(String(text ?? ""));
    const url =
      type === "emoji"
        ? `/api/hybrid/placeholder/emoji?t=${q}`
        : `/api/hybrid/placeholder/avatar?t=${q}`;

    return NextResponse.json({ ok: true, type, provider, url });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
