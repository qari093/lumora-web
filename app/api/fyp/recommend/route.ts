import { NextResponse } from "next/server";
import { page } from "../_store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") || "10");
    const cursorParam = url.searchParams.get("cursor");
    const cursor = cursorParam ? Number(cursorParam) : null;

    const { items, nextCursor } = page({
      limit: isNaN(limit) ? 10 : Math.max(1, limit),
      cursor,
    });

    return NextResponse.json(
      { ok: true, items, hasMore: Boolean(nextCursor), nextCursor, count: items.length },
      { headers: { "Cache-Control": "private, max-age=10, stale-while-revalidate=59" } }
    );
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message || e) }, { status:500 });
  }
}
