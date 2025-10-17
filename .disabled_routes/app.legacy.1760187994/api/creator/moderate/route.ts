import { NextRequest, NextResponse } from "next/server";
import { moderate } from "../_lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body?.action ?? '').toUpperCase();
    if (action !== 'APPROVE' && action !== 'REJECT') {
      return NextResponse.json({ ok:false, error:"action must be APPROVE or REJECT" }, { status:400 });
    }
    const updated = moderate(action as 'APPROVE'|'REJECT');
    if (!updated) return NextResponse.json({ ok:true, message:"no pending items" }, { status:200 });
    return NextResponse.json({ ok:true, updated }, { status:200 });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message ?? e) }, { status:500 });
  }
}
