export const runtime = "nodejs";
import { NextResponse } from "next/server";
export async function POST(req:Request){
  try{
    const b = await req.json();
    const receipt = { id: "o_"+Math.random().toString(36).slice(2,10), email:String(b.email||""), product:b.product||{}, total:Number(b.total||0) };
    return NextResponse.json({ ok:true, receipt });
  }catch(e:any){
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:400 });
  }
}
