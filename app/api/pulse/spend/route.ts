import { NextRequest, NextResponse } from "next/server";
import { spend } from "../../../lib/econ/harmony";

async function getAuth(req:NextRequest){
  const userId = req.headers.get("x-user-id") || "demo-user";
  return { userId };
}

export async function POST(req:NextRequest){
  const { userId } = await getAuth(req);
  const body = await req.json().catch(()=>({}));
  const amount = Math.max(1, body?.amount ?? 1);
  const note = body?.note || "shop_purchase";
  try{
    const r = await spend(userId, amount, { note, meta: body?.meta });
    return NextResponse.json(r);
  }catch(e:any){
    return NextResponse.json({ error: e.message||"ERR" }, { status: 400 });
  }
}
