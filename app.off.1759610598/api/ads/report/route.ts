import { NextResponse } from "next/server";
import { report } from "@/lib/ads/store";

export async function GET(){
  const r = report();
  return NextResponse.json({ ok:true, ...r });
}
