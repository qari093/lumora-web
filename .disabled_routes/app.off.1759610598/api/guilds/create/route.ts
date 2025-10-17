import { NextResponse } from "next/server";
import { createGuild } from "@/lib/guilds";
export async function POST(req: Request){
  const { ownerId,name,stakeZc } = await req.json() as { ownerId:string; name:string; stakeZc:number };
  try{ const g=createGuild(ownerId,name,stakeZc); return NextResponse.json({ ok:true, guild:g }); }
  catch(e){ const msg=(e instanceof Error)? e.message : "error"; return NextResponse.json({ ok:false, error:msg },{status:400}); }
}
