import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";
import { isAdmin } from "../../../../../lib/admin";

export const runtime = "nodejs";

export async function GET(req:Request){
  const list = await prisma.season.findMany({ orderBy:{ id:"desc" }});
  return NextResponse.json({ ok:true, items:list });
}

export async function POST(req:Request){
  const h=new Headers(req.headers); if(!isAdmin(h)) return NextResponse.json({ok:false,error:"unauthorized"},{status:401});
  const b = await req.json();
  const start = new Date(b?.startAt || Date.now());
  const end   = new Date(b?.endAt || Date.now()+90*24*3600*1000);
  const name  = String(b?.name || "New Season");
  const item = await prisma.season.create({ data:{ name, startAt:start, endAt:end, active:false }});
  return NextResponse.json({ ok:true, item });
}
export async function PATCH(req:Request){
  const h=new Headers(req.headers); if(!isAdmin(h)) return NextResponse.json({ok:false,error:"unauthorized"},{status:401});
  const b = await req.json();
  if (b?.activateId!=null){
    await prisma.season.updateMany({ data:{ active:false }, where:{} });
    await prisma.season.update({ where:{ id:Number(b.activateId) }, data:{ active:true }});
    return NextResponse.json({ ok:true, activated:b.activateId });
  }
  return NextResponse.json({ ok:false,error:"bad request" },{status:400});
}
