import { NextResponse } from "next/server";
import { joinGuild } from "@/lib/guilds";
export async function POST(req: Request){
  const { userId,guildId,stakeZc } = await req.json() as { userId:string; guildId:string; stakeZc:number };
  try{ const g=joinGuild(userId,guildId,stakeZc); return NextResponse.json({ ok:true, guild:g }); }
  catch(e){ const msg=(e instanceof Error)? e.message : "error"; return NextResponse.json({ ok:false, error:msg },{status:400}); }
}
