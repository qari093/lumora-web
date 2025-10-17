import { NextResponse } from "next/server";
import { exchange, type Direction } from "@/lib/zenvault";
export async function POST(req: Request){
  const { userId, direction, amount, complianceToken } = await req.json() as { userId:string; direction:Direction; amount:number; complianceToken:string };
  if(!userId||!direction||!amount||!complianceToken) return NextResponse.json({ ok:false, error:"missing fields"},{status:400});
  try{ const r=exchange(userId,direction,amount,complianceToken); return NextResponse.json({ ok:true, result:r }); }
  catch(e){ const msg = e instanceof Error ? e.message : "error"; return NextResponse.json({ ok:false, error: msg }, { status:400 }); }
}
