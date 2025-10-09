import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export async function POST(req:Request){
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if(!file) return NextResponse.json({ ok:false, error:"file missing" },{ status:400 });
  const arr = new Uint8Array(await file.arrayBuffer());
  const safe = Date.now()+"-"+(file.name||"track").replace(/[^a-z0-9_.-]/gi,"_");
  const target = path.join(process.cwd(),"public","uploads", safe);
  await fs.writeFile(target, Buffer.from(arr));
  return NextResponse.json({ ok:true, url: "/uploads/"+safe });
}
