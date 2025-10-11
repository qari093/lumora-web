import { NextResponse } from "next/server";
import { getOrSetUid } from "@/lib/uid";
import { joinCrew } from "@/lib/crewStore";

export async function POST(req: Request){
  const uid = getOrSetUid();
  const body = await req.json();
  const crewId = body?.crewId as string | undefined;
  if(!crewId) return NextResponse.json({ ok:false, error:"bad_request" }, { status:400 });
  const c = joinCrew(uid, crewId);
  return NextResponse.json({ ok:true, crew:{ id:c.id, name:c.name, energy:c.energy, members:c.members.size } });
}
