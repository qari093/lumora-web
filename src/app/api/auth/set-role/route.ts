import { NextResponse } from "next/server";
const VALID=new Set(["admin","moderator","creator","advertiser","user","guest"]);
export async function POST(req:Request){
  const b=await req.json().catch(()=>({}));
  const role=(typeof b.role==="string" && VALID.has(b.role))?b.role:"guest";
  const name=(typeof b.name==="string"&&b.name.trim())?b.name.trim():role.toUpperCase()+"_USER";
  const uid =(typeof b.uid ==="string"&&b.uid.trim())?b.uid.trim():Math.random().toString(36).slice(2);
  const res=NextResponse.json({ok:true,role,name,uid});
  const maxAge=60*60*24*30;
  res.headers.append("set-cookie",);
  res.headers.append("set-cookie",);
  res.headers.append("set-cookie",);
  return res;
}
