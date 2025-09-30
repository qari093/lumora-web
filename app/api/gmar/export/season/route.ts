import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";
import { isAdmin } from "../../../../../lib/admin";

export const runtime = "nodejs";

export async function GET(req:Request){
  const h = new Headers(req.headers);
  if (!isAdmin(h)) return NextResponse.json({ ok:false, error:"unauthorized" }, { status:401 });

  const { searchParams } = new URL(req.url);
  const seasonId = Number(searchParams.get("seasonId")||0);
  const gameId = searchParams.get("gameId")||"runner_1";
  const rows = await prisma.seasonScore.findMany({ where:{ seasonId, gameId }, orderBy:{ value:"desc" }});
  const lines = ["player,value,createdAt"];
  for(const r of rows) lines.push([JSON.stringify(r.player), r.value, r.createdAt.toISOString()].join(","));
  const body = lines.join("\r\n");
  return new Response(body,{ status:200, headers:{ "Content-Type":"text/csv; charset=utf-8" }});
}
