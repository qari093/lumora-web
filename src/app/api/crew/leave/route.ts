import { NextResponse } from "next/server";
import { getOrSetUid } from "@/lib/uid";
import { leaveCrew } from "@/lib/crewStore";

export async function POST(){
  const uid = getOrSetUid();
  leaveCrew(uid);
  return NextResponse.json({ ok:true });
}
