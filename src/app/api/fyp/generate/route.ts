import { NextResponse } from "next/server";
import { addGenerated } from "../_store";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function POST() {
  try {
    const clip = addGenerated();
    return NextResponse.json({ ok:true, clip });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message || e) }, { status:500 });
  }
}
