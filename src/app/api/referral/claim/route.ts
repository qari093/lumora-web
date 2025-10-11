import { NextResponse } from "next/server";
import { claimReferral } from "@/lib/referral";
import { award } from "@/lib/energyStore";
export async function POST(req: Request){
  const { code } = await req.json();
  const res = await claimReferral(String(code||"").toUpperCase());
  if(!res.ok) return NextResponse.json(res, { status:400 });
  for(let i=0;i<res.addedJoiner;i++) await award("LIKE");
  for(let i=0;i<res.addedOwner;i++) await award("LIKE");
  return NextResponse.json({ ok:true, ...res });
}
