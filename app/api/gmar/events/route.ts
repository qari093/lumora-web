export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { listEvents, pushEvent } from "../../../../lib/gmar/state";
import { appendEvent } from "../../../../lib/gmar/store";
export async function GET(){ return NextResponse.json({ ok:true, items: listEvents() }); }
export async function POST(req:Request){
  try{
    const body = await req.json();
    const h = new Headers(req.headers);
    const ip = h.get("x-forwarded-for") || "local";
    const device = "dev-"+ip;
    const item = { id:"e_"+Math.random().toString(36).slice(2,10), at:Date.now(), device, ...body };
    pushEvent(item as any); await appendEvent(item as any);
    return NextResponse.json({ ok:true, item });
  }catch(e:any){ return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:400 }); }
}
