import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";
import { isAdmin } from "../../../../../lib/admin";

export const runtime = "nodejs";

export async function POST(req:Request){
  const h = new Headers(req.headers);
  if (!isAdmin(h)) return NextResponse.json({ ok:false, error:"unauthorized" }, { status:401 });
  const b = await req.json();
  const deviceId = String(b?.deviceId||"");
  const reason = String(b?.reason||"manual");
  if(!deviceId) return NextResponse.json({ok:false,error:"deviceId required"},{status:400});
  await prisma.ban.create({ data:{ deviceId, reason, active:true }});
  await prisma.device.update({ where:{ id:deviceId }, data:{ banned:true, banReason:reason }});
  return NextResponse.json({ ok:true });
}

export async function DELETE(req:Request){
  const h = new Headers(req.headers);
  if (!isAdmin(h)) return NextResponse.json({ ok:false, error:"unauthorized" }, { status:401 });
  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get("deviceId") || "";
  await prisma.ban.updateMany({ where:{ deviceId, active:true }, data:{ active:false }});
  await prisma.device.update({ where:{ id:deviceId }, data:{ banned:false, banReason:null }});
  return NextResponse.json({ ok:true });
}
