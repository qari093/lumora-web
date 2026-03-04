import { NextResponse } from "next/server";
import { buildSmartMix, MixItem } from "@/lib/feed/smartMix";

export const runtime = "edge";

function json(data: any, status = 200) {
  return NextResponse.json(data, { status, headers: { "cache-control": "no-store" } });
}

export async function GET() {
  return json(
    { ok: true, ping: "/api/feed/mix", usage: "POST {items:[{id,contentType,baseScore,engagement?,tags?,createdAtMs?}], limit?, tookBudgetMs?}" },
    200
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const items = Array.isArray(body?.items) ? (body.items as MixItem[]) : [];
    const limit = typeof body?.limit === "number" ? body.limit : undefined;
    const tookBudgetMs = typeof body?.tookBudgetMs === "number" ? body.tookBudgetMs : undefined;

    const res = buildSmartMix(items, { limit, tookBudgetMs });
    return json(res, res.ok ? 200 : 400);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return json({ ok: false, error: msg, ts: Date.now() }, 500);
  }
}
