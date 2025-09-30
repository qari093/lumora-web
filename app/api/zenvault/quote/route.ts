import { NextResponse } from "next/server";
import { getQuote, type Direction } from "@/lib/zenvault";
export async function GET(req: Request){
  const u=new URL(req.url); const dir=(u.searchParams.get("direction") as Direction)||"BUY_ZC_WITH_ZCPLUS";
  return NextResponse.json({ ok:true, quote:getQuote(dir) });
}
