import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { fraudGuard } from "@/lib/fraud";
import { logErr } from "../_utils/log";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, viewKey, userId, ms, mood, ...rest } = body || {};
    if (!action || typeof action !== "string") {
      return NextResponse.json({ ok: false, error: "INVALID_ACTION" }, { status: 400 });
    }

    const fg = await fraudGuard(req, {
      scope: "event",
      userId: typeof userId === "string" ? userId : null,
      viewKey: typeof viewKey === "string" ? viewKey : null,
      limits: { perIp: { limit: 15, windowSec: 10 } },
    });
    if ((fg as any).blocked) return NextResponse.json((fg as any).body, { status: (fg as any).status });

    let campaignId: string | null = null;
    if (viewKey && typeof viewKey === "string") {
      const v = await prisma.cpvView.findUnique({ where: { idempotencyKey: viewKey } });
      if (v) campaignId = v.campaignId;
    }
    const metaJson = Object.keys(rest).length ? JSON.stringify(rest) : null;

    const saved = await prisma.adEvent.create({
      data: {
        action,
        viewKey: typeof viewKey === "string" ? viewKey : null,
        userId: typeof userId === "string" ? userId : null,
        ms: Number.isFinite(ms) ? Number(ms) : null,
        mood: typeof mood === "string" ? mood : null,
        campaignId,
        metaJson,
      },
    });
    return NextResponse.json({ ok: true, saved });
  } catch (e:any) {
    logErr("event", e);
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status: 500 });
  }
}
