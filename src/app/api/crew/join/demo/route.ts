import { NextResponse } from "next/server";
import { getOrSetUid } from "@/lib/uid";
import { ensureDemoCrew, joinCrew } from "@/lib/crewStore";

export async function POST(){
  const uid = getOrSetUid();
  ensureDemoCrew();
  const c = joinCrew(uid, "demo");
  return NextResponse.json({ ok:true, crew:{ id:c.id, name:c.name, energy:c.energy, members:c.members.size } });
}
