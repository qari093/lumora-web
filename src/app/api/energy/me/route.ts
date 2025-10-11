import { NextResponse } from "next/server";
import { getOrSetUid } from "@/lib/uid";
import { snapshotMe } from "@/lib/energyStore";

export async function GET(){
  const uid = getOrSetUid();
  const res = snapshotMe(uid);
  return NextResponse.json({ ok:true, me: res.wallet });
}
