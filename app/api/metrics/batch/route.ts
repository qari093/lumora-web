import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

type Metric = { t:number; type:string; adId?:string|null; videoId?:string|null; extra?:any; };

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(()=>({}));
    const items: Metric[] = Array.isArray((body as any).items) ? (body as any).items : [];
    console.log("metrics batch:", items.length, "items");
    return NextResponse.json({ ok: true, count: items.length });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
