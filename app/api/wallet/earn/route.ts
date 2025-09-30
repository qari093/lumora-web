import { NextResponse } from "next/server";
import { credit } from "@/lib/ledger";
import { recordEarning } from "@/lib/referrals";
export async function POST(req: Request){
  const { userId, amount, source } = await req.json() as { userId:string; amount:number; source:string };
  if(!userId||!amount) return NextResponse.json({ ok:false, error:"missing userId/amount"},{status:400});
  credit(userId,"ZC",amount,"earn:"+source, undefined);
  const kick=recordEarning(userId,amount,source);
  return NextResponse.json({ ok:true, userId, amount, kick});
}
