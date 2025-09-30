import { NextResponse } from "next/server";

export async function POST(req:Request){
  const body = await req.json().catch(()=>null) as { lang?:string }|null;
  const lang = (body?.lang||"").slice(0,5).toLowerCase() || "en";
  const res = NextResponse.json({ ok:true, lang });
  res.headers.set("Set-Cookie", `pulse_lang=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`);
  return res;
}
