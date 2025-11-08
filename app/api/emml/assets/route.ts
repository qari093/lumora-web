import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const markets = await prisma.emmlMarket.findMany({
      select: { id:true, slug:true, name:true, status:true }
    });
    const marketIds = markets.map(m => m.id);
    const assets = await prisma.emmlAsset.findMany({
      where: { marketId: { in: marketIds } },
      select: { id:true, marketId:true, symbol:true, name:true, decimals:true, supply:true },
      orderBy: [{ symbol: "asc" }],
    });
    return NextResponse.json({ ok:true, markets, assets });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
