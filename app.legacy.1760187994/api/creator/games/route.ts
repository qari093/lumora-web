import { NextRequest, NextResponse } from "next/server";
import { listGames } from "../_lib/db";

export async function GET(req: NextRequest) {
  try {
    const ownerId = new URL(req.url).searchParams.get("ownerId") ?? undefined;
    const games = listGames(ownerId || undefined);
    return NextResponse.json({ ok:true, games }, { status:200 });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message ?? e) }, { status:500 });
  }
}
