import { NextResponse } from "next/server";
import { searchDocs } from "../../../../lib/search";
import { prisma } from "../../../../lib/db";

export async function GET(req:Request){
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const lang = searchParams.get("lang") || undefined;
  const niche = searchParams.get("niche") || undefined;
  const limit = Math.min(parseInt(searchParams.get("limit")||"50"), 200);

  try{
    const res = await searchDocs(q, { limit, lang, niche });
    return NextResponse.json({ ok:true, items: res.hits || [] });
  }catch{
    const items = await prisma.track.findMany({ take: limit, orderBy:{ createdAt:"desc" } });
    return NextResponse.json({ ok:true, items });
  }
}
