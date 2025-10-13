import { NextResponse } from "next/server";
import { page } from "../_store";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") || 10);
    const cursorParam = searchParams.get("cursor");
    const cursor = cursorParam ? Number(cursorParam) : null;
    const { items, nextCursor } = page({ limit: isNaN(limit) ? 10 : Math.max(1, limit), cursor });
    return NextResponse.json({ ok:true, items, hasMore:Boolean(nextCursor), nextCursor, count: items.length });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message || e) }, { status:500 });
  }
}
