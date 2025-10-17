import { NextResponse } from "next/server";
import { getGuild } from "@/lib/guilds";
export async function GET(req: Request){
  const u=new URL(req.url); const id=u.searchParams.get("guildId")||"";
  const g=getGuild(id); if(!g) return NextResponse.json({ ok:false, error:"not found"},{status:404});
  return NextResponse.json({ ok:true, guild:{ id:g.id,name:g.name, ownerId:g.ownerId, members:[...g.members], stakeZc:g.stakeZc, createdAt:g.createdAt } });
}
