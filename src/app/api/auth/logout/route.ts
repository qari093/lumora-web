import { NextResponse } from "next/server";
export async function POST(){
  const res=NextResponse.json({ok:true});
  const expired="Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax";
  res.headers.append("set-cookie","role=; "+expired);
  res.headers.append("set-cookie","name=; "+expired);
  res.headers.append("set-cookie","uid=; "+expired);
  return res;
}
