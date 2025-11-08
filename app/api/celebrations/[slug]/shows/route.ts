import { NextResponse } from "next/server";
import { PrismaClient, ShowVisibility } from "@prisma/client";
const db = new PrismaClient();

function bad(status: number, error: string, message?: string) {
  return NextResponse.json({ ok:false, error, message: message ?? error }, { status });
}

async function getSlug(ctx: { params: any }): Promise<string|null> {
  const rawParams = (ctx as any)?.params && typeof (ctx as any).params.then === "function"
    ? await (ctx as any).params
    : (ctx as any).params;
  const raw = rawParams?.slug;
  const slug = Array.isArray(raw) ? raw[0] : raw;
  return (typeof slug === "string" && slug) ? slug : null;
}

export async function GET(_req: Request, ctx: { params: any }) {
  try {
    const slug = await getSlug(ctx);
    if (!slug) return bad(400, "missing_slug");
    const cel = await db.celebration.findUnique({ where:{ slug }, select:{ id:true }});
    if (!cel) return bad(404, "celebration_not_found");
    const shows = await db.celebrationShow.findMany({
      where:{ celebrationId: cel.id },
      orderBy:{ startAt: "asc" },
      include:{ guests: true }
    });
    return NextResponse.json({ ok:true, shows }, { status:200 });
  } catch (e:any) {
    console.error("[shows GET] fatal:", e?.message || e);
    return bad(500, "internal_error");
  }
}

export async function POST(req: Request, ctx: { params: any }) {
  try {
    const slug = await getSlug(ctx);
    if (!slug) return bad(400, "missing_slug");

    let body:any; try { body = await req.json(); } catch { return bad(400, "invalid_json"); }

    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) return bad(400, "missing_title");

    const startsAtIso = body.startsAt;
    if (typeof startsAtIso !== "string") return bad(400, "invalid_startsAt");
    const startAt = new Date(startsAtIso);
    if (isNaN(startAt.getTime())) return bad(400, "invalid_startsAt");
    if (startAt.getTime() < Date.now()) return bad(400, "startsAt_in_past");

    const durationMin =
      Number.isFinite(body?.durationMin) && Number(body.durationMin) > 0
        ? Math.floor(Number(body.durationMin))
        : 45;
    const endAt = new Date(startAt.getTime() + durationMin * 60 * 1000);

    const visRaw = String(body.visibility || "PUBLIC").toUpperCase();
    const visibility: ShowVisibility =
      visRaw === "UNLISTED" ? ShowVisibility.UNLISTED :
      visRaw === "PRIVATE"  ? ShowVisibility.PRIVATE  :
                              ShowVisibility.PUBLIC;

    const cel = await db.celebration.findUnique({ where:{ slug }, select:{ id:true }});
    if (!cel) return bad(404, "celebration_not_found");

    const lo = new Date(startAt.getTime() - 30*60*1000);
    const hi = new Date(startAt.getTime() + 30*60*1000);
    const conflict = await db.celebrationShow.findFirst({
      where:{ celebrationId: cel.id, startAt: { gte: lo, lte: hi } },
      select:{ id:true }
    });
    if (conflict) return bad(409, "overlap_conflict", "Another show exists within ±30 minutes.");

    const guestsInput = Array.isArray(body.guests)
      ? body.guests
          .filter((g:any)=>g && typeof g.name==="string" && g.name.trim())
          .map((g:any)=>({
            name: g.name.trim(),
            avatarUrl: typeof g.avatarUrl==="string" ? g.avatarUrl : null,
            role: typeof g.role==="string" ? g.role : null,
          }))
      : [];

    const show = await db.celebrationShow.create({
      data:{
        celebrationId: cel.id,
        title,
        description: typeof body.description==="string" ? body.description : null,
        startAt,
        endAt,
        visibility,
        guests: guestsInput.length ? { create: guestsInput } : undefined,
      },
      include:{ guests: true }
    });

    return NextResponse.json({ ok:true, show }, { status:200 });
  } catch (e:any) {
    console.error("[shows POST] fatal:", e?.message || e);
    return bad(500, "internal_error");
  }
}
