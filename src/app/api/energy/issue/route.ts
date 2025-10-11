import { NextResponse } from "next/server";
import { currentUid } from "@/lib/security";
import { issueToken } from "@/lib/security";

export async function GET(){
  const uid = currentUid();
  const token = issueToken(uid);
  return NextResponse.json({ ok:true, token, ttlMs: 60000 });
}
