import { NextResponse } from "next/server";
import { PrismaClient, ShowVisibility } from "@prisma/client";
const db = new PrismaClient();

function bad(status:number, error:string, message?:string){
  return NextResponse.json({ ok:false, error, message: message ?? error }, { status });
}

async function getParams(ctx: { params: any }): Promise<{slug:string,id:string}|null> {
  const P = (ctx as any)?.params;
  const params = P && typeof P.then === "function" ? await P : P;
  const rawSlug = params?.slug; const rawId = params?.id;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const id   = Array.isArray(rawId)   ? rawId[0]   : rawId;
  if (!slug || !id) return null;
  return { slug, id };
}

export async function PATCH(req: Request, ctx: { params:any }) {
  try {
    const p = await getParams(ctx);
    if (!p) return bad(400,"missing_params");
    const cel = await db.celebration.findUnique({ where:{ slug: p.slug }, select:{ id:true }});
    if (!cel) return bad(404,"celebration_not_found");

    let body:any; try { body = await req.json(); } catch { return bad(400,"invalid_json"); }

    // Optional fields
    const data:any = {};
    if (typeof body.title === "string") {
      const t = body.title.trim(); if(!t) return bad(400,"invalid_title"); data.title = t;
    }
    let startAt: Date | undefined;
    if (typeof body.startsAt === "string") {
      const d = new Date(body.startsAt); if (isNaN(d.getTime())) return bad(400,"invalid_startsAt");
      if (d.getTime() < Date.now()) return bad(400,"startsAt_in_past");
      startAt = d; data.startAt = d;
    }
    let durationMin: number | undefined;
    if (body.durationMin != null) {
      const n = Math.floor(Number(body.durationMin));
      if (!(n > 0)) return bad(400,"invalid_duration");
      durationMin = n;
    }
    // If startAt or durationMin provided, recompute endAt (default 45 if not given)
    if (startAt || durationMin != null) {
      let baseStart = startAt;
      if (!baseStart) {
        const current = await db.celebrationShow.findUnique({ where:{ id: p.id }, select:{ startAt:true }});
        if (!current) return bad(404,"show_not_found");
        baseStart = current.startAt;
      }
      let dur = durationMin;
      if (dur == null) {
        const current = await db.celebrationShow.findUnique({ where:{ id: p.id }, select:{ startAt:true,endAt:true }});
        if (!current) return bad(404,"show_not_found");
        dur = Math.max(1, Math.round((current.endAt.getTime()-current.startAt.getTime())/60000)) || 45;
      }
      const endAt = new Date(baseStart.getTime() + dur*60*1000);
      data.endAt = endAt;

      // Overlap guard ±30m from new startAt
      const lo = new Date(baseStart.getTime() - 30*60*1000);
      const hi = new Date(baseStart.getTime() + 30*60*1000);
      const conflict = await db.celebrationShow.findFirst({
        where:{ celebrationId: cel.id, id: { not: p.id }, startAt: { gte: lo, lte: hi } },
        select:{ id:true }
      });
      if (conflict) return bad(409,"overlap_conflict","Another show exists within ±30 minutes.");
    }

    if (typeof body.visibility === "string") {
      const v = body.visibility.toUpperCase();
      data.visibility =
        v === "UNLISTED" ? ShowVisibility.UNLISTED :
        v === "PRIVATE"  ? ShowVisibility.PRIVATE  :
                           ShowVisibility.PUBLIC;
    }

    const updated = await db.celebrationShow.update({
      where:{ id: p.id }, data, include:{ guests:true }
    });
    return NextResponse.json({ ok:true, show: updated }, { status:200 });
  } catch (e:any) {
    console.error("[shows PATCH] fatal:", e?.message || e);
    return bad(500,"internal_error");
  }
}

export async function DELETE(_req: Request, ctx: { params:any }) {
  try {
    const p = await getParams(ctx);
    if (!p) return bad(400,"missing_params");
    // Best-effort: ensure belongs to celebration
    const show = await db.celebrationShow.findUnique({ where:{ id: p.id }, select:{ id:true, celebrationId:true }});
    if (!show) return bad(404,"show_not_found");
    await db.celebrationShowGuest.deleteMany({ where:{ showId: p.id }});
    await db.celebrationShow.delete({ where:{ id: p.id }});
    return NextResponse.json({ ok:true, deletedId: p.id }, { status:200 });
  } catch (e:any) {
    console.error("[shows DELETE] fatal:", e?.message || e);
    return bad(500,"internal_error");
  }
}
