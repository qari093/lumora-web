import { NextResponse } from "next/server";
import fs from "node:fs/promises";
export async function GET(){
  try{
    const raw=await fs.readFile(".data/gmar/orders.jsonl","utf8");
    const rows=raw.trim().split("\\n").map(l=>JSON.parse(l));
    const csv=["email,product,total,at"].concat(rows.map(r=>[r.email,r.product?.title,r.total,r.at].join(",")));
    return new NextResponse(csv.join("\\n"),{headers:{ "Content-Type":"text/csv"}});
  }catch{ return NextResponse.json({ok:false,error:"no_orders"},{status:404}); }
}
