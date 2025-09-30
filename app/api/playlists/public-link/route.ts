import { NextResponse } from "next/server";
export async function GET(req:Request){
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if(!id) return NextResponse.json({ error:"id required" },{ status:400 });
  return NextResponse.json({ ok:true, url:`/pulse/p/${id}` });
}
