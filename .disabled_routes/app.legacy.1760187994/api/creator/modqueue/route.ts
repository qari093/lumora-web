import { NextResponse } from "next/server";
import { listPending } from "../_lib/db";

export async function GET() {
  try {
    const queue = listPending();
    return NextResponse.json({ ok:true, queue }, { status:200 });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message ?? e) }, { status:500 });
  }
}
