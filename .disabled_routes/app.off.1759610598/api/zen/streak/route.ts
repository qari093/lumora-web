import { NextResponse } from "next/server";
import { getDevice, streakClaim } from "../../../../lib/zen/core";

export async function POST(req:Request){
  const device = await getDevice(req);
  const r = await streakClaim(device);
  return NextResponse.json(r);
}
