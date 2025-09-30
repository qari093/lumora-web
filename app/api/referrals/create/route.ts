import { NextResponse } from "next/server";
import { createLink } from "@/lib/referrals";
export async function POST(req: Request){
  const { userId } = await req.json() as { userId:string };
  if(!userId) return NextResponse.json({ ok:false, error:"missing userId"},{status:400});
  const link=createLink(userId); return NextResponse.json({ ok:true, link });
}
