import { NextResponse } from "next/server";
import { transfer } from "@/lib/ledger";
export async function POST(req: Request){
  const { from,to,amount,memo } = await req.json() as { from:string; to:string; amount:number; memo?:string };
  if(!from||!to||!amount) return NextResponse.json({ ok:false, error:"missing fields"},{status:400});
  transfer(from,to,"ZC",amount,memo||"");
  return NextResponse.json({ ok:true });
}
