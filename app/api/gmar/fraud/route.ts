import { NextResponse } from "next/server";
import fs from "node:fs/promises";
export async function GET(){
  try{ const raw=await fs.readFile(".data/gmar/fraud.jsonl","utf8"); 
       return NextResponse.json({ok:true, items: raw.trim().split("\\n").map(l=>JSON.parse(l))});
  }catch{ return NextResponse.json({ok:true, items:[]}); }
}
