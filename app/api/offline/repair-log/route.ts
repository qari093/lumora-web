import { NextResponse } from "next/server";

export async function POST(req: Request){
  try{
    const body = await req.json().catch(()=> ({} as any));
    const event = body?.event ?? body ?? {};
    const safe = {
      ts: typeof event.ts === "number" ? event.ts : Date.now(),
      kind: typeof event.kind === "string" ? event.kind : "manual",
      message: typeof event.message === "string" ? event.message.slice(0, 500) : "",
      healed: Boolean(event.healed),
      attempt: typeof event.attempt === "number" ? event.attempt : 0
    };
    return NextResponse.json({ ok:true, saved: safe });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: String(e?.message || e) }, { status:400 });
  }
}
