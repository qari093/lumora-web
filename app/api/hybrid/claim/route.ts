import { NextResponse } from "next/server";
import { ensure, addCredits, getCredits } from "@/app/_modules/hybrid/state";

const lastClaim: Record<string, number> = {};

function envNum(name: string, def: number) {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? v : def;
}

export async function POST(req: Request) {
  try {
    const { user } = await req.json();
    const u = String(user || "demo");

    ensure(u);

    const amount = envNum("HYBRID_CLAIM_AMOUNT", 5);
    const cooldownSec = envNum("HYBRID_CLAIM_COOLDOWN_SEC", 60);

    const now = Date.now();
    const prev = lastClaim[u] || 0;
    const nextAt = prev + cooldownSec * 1000;

    if (now < nextAt) {
      const retrySec = Math.ceil((nextAt - now) / 1000);
      return NextResponse.json(
        { ok: false, error: "Cooldown active", nextAt, retrySec },
        { status: 429, headers: { "Retry-After": String(retrySec) } }
      );
    }

    lastClaim[u] = now;
    addCredits(u, amount);
    const credits = getCredits(u);

    return NextResponse.json({
      ok: true,
      user: u,
      amount,
      credits,
      nextAt: now + cooldownSec * 1000,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
