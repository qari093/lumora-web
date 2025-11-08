import { NextResponse } from "next/server";

function hashEmail(email: string): number {
  let h = 0 >>> 0;
  for (let i = 0; i < email.length; i++) h = (h * 31 + email.charCodeAt(i)) >>> 0;
  return h >>> 0;
}

export async function GET(req: Request) {
  try {
    const u = new URL(req.url);
    const email = String(u.searchParams.get("email") || "").trim();
    if (!email) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });

    const seed = hashEmail(email) / 0xffffffff;
    const base = Math.round(50 + seed * 50);

    return NextResponse.json({
      ok: true,
      email,
      zen: {
        pulse: Math.round(base),
        zenCoin: Math.round(base * 3),
        multiplier: +(1 + seed * 0.5).toFixed(2),
        blessings: Math.floor((seed * 5) % 7),
        burns: Math.floor((seed * 3) % 5),
        updatedAt: new Date().toISOString()
      }
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
