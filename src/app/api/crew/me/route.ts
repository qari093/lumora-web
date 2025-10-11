import { NextResponse } from "next/server";
import { getOrSetUid } from "@/lib/uid";
import { crewOf } from "@/lib/crewStore";

export async function GET(){
  const uid = getOrSetUid();
  const c = crewOf(uid);
  return NextResponse.json({ ok:true, crew: c });
}
