import { NextRequest, NextResponse } from "next/server";
import { addZen } from "@/lib/zen/server";
import { loadProfile, saveProfile } from "@/lib/user/profile";

export async function POST(req: NextRequest) {
  const { type, meta } = await req.json();
  const dev = req.headers.get("x-device-id") || "dev-local";
  const p = loadProfile(dev);
  let reward = 0;

  if (type === "referral" && meta?.inviter) {
    addZen(dev,10,"Referral Joined");
    addZen(meta.inviter,10,"Referral Invited");
    reward = 10;
  }
  if (type === "engagement") {
    const today = new Date().toDateString();
    p.questComments = p.questComments||{};
    p.questComments[today] = (p.questComments[today]||0)+1;
    if (p.questComments[today]===3){ addZen(dev,3,"Daily Comment Quest"); reward=3; }
  }
  if (type === "creator") {
    p.uploads=(p.uploads||0)+1;
    if (p.uploads===5){ addZen(dev,15,"5 Upload Creator Quest"); reward=15; }
  }
  saveProfile(dev,p);
  return NextResponse.json({ok:true,reward});
}
