import { NextResponse } from "next/server";
import { acceptLink } from "@/lib/referrals";
export async function POST(req: Request){
  const { code, inviteeId } = await req.json() as { code:string; inviteeId:string };
  if(!code||!inviteeId) return NextResponse.json({ ok:false, error:"missing code/inviteeId"},{status:400});
  const rel=acceptLink(code,inviteeId,0.01); return NextResponse.json({ ok:true, relation:rel });
}
